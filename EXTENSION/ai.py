import sys
import socketio
import google.generativeai as genai
import os
import json
import re
import requests # ⬅️ For GitHub token verification
import firebase_admin # ⬅️ For Firebase Admin SDK
from firebase_admin import credentials, auth # ⬅️ For Firebase Auth

from pygments.lexers import guess_lexer
from pygments.util import ClassNotFound
from dotenv import load_dotenv

# Ensure stdout supports Unicode (Windows fix)
try:
    sys.stdout.reconfigure(encoding="utf-8")
except AttributeError:
    pass

sio = socketio.Client(reconnection=True, reconnection_attempts=0)

# --- Configure Gemini (API key via .env) ---
env_path = os.path.join(os.path.dirname(__file__),'..',"BACKEND",".env")
load_dotenv(env_path)
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env")

genai.configure(api_key=API_KEY)
# Use a currently supported stable model
model = genai.GenerativeModel("gemini-2.5-flash")

# --- Configure Firebase Admin SDK --- 
try:
    # ⚠️ IMPORTANT: Replace 'path/to/your/serviceAccountKey.json' with your actual file path 
    # or ensure FIREBASE_SERVICE_ACCOUNT_PATH is set in your .env
    FIREBASE_SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")
    cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    print("[Py] ✅ Firebase Admin SDK initialized")
except Exception as e:
    print(f"[Py] ❌ Firebase Admin SDK initialization failed. Make sure you have the service account JSON key: {e}")
# ------------------------------------

# --- Authentication Logic ---
def verify_github_token_and_get_uid(github_token: str) -> str | None:
    """
    Verifies the GitHub token and returns a unique, stable user ID.
    This user ID is used to mint a Firebase Custom Token.
    """
    try:
        # 1. Verify the token with GitHub API and get user data
        headers = {'Authorization': f'token {github_token}'}
        response = requests.get('https://api.github.com/user', headers=headers)
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        github_user_data = response.json()
        
        github_id = str(github_user_data.get('id')) # GitHub ID is stable and unique
        
        # 2. Mint the Firebase Custom Token (optional for this specific use, but good practice)
        custom_token = auth.create_custom_token(github_id, { 'provider': 'github' })
        
        # NOTE: The Python backend doesn't need the custom token, just the stable UID.
        return github_id
        
    except requests.exceptions.HTTPError as he:
        print(f"[Py] ❌ GitHub Token Verification Failed (HTTP Error): {he}")
        return None
    except Exception as e:
        print(f"[Py] ❌ Authentication Error: {e}")
        return None

# --- Language detection with keyword overrides (existing code) ---
def detect_language(code: str) -> str:
    try:
        lang = guess_lexer(code).name.lower()
    except ClassNotFound:
        lang = "unknown"

    js_keywords = ["console.log", "function", "let ", "const ", "=>"]
    py_keywords = ["def ", "print(", "import "]
    cpp_keywords = ["#include", "std::", "cout <<"]

    if any(k in code for k in js_keywords):
        return "javascript"
    if any(k in code for k in py_keywords):
        return "python"
    if any(k in code for k in cpp_keywords):
        return "cpp"

    return lang

# --- Helpers to handle code fences / language names (existing code) ---
def unwrap_code_block(s: str) -> str:
    """
    If s contains a fenced code block like ```lang\n...\n```, return the inner code.
    Otherwise return s unchanged.
    """
    if not s:
        return s
    # Regex to find any fenced code block (```optional_lang_tag\ncontent\n```)
    # The (.*?) is a non-greedy match for the content inside
    m = re.search(r"```[a-zA-Z0-9+\-]*\n(.*?)```", s, re.DOTALL)
    
    # If a code block is found, return its inner content
    if m:
        # Check if the extracted content itself is a JSON object by looking for surrounding braces
        content = m.group(1).strip()
        if content.startswith('{') and content.endswith('}'):
            return content
    
    # Otherwise return the original string, stripped of leading/trailing whitespace
    return s.strip()

def normalize_lang_tag(lang: str) -> str:
    if not lang:
        return "text"
    l = lang.lower()
    if "js" in l or "javascript" in l:
        return "javascript"
    if "py" in l or "python" in l:
        return "python"
    if "cpp" in l or "c++" in l:
        return "cpp"
    return "text"


# --- Expand short/unclear analysis into a clearer explanation (existing code) ---
def polish_analysis(raw: str) -> str:
    text = (raw or "").strip()

    # Strip leakage of other fields
    for key in ["fix:", "type_of_error", "programming_language_used"]:
        if key in text.lower():
            text = text.split(key)[0].strip()

    # Auto-expand if too short
    if len(text.split()) < 5:
        tl = text.lower()
        if "const" in tl and "reassign" in tl or ("const" in tl and "assign" in tl):
            return (
                "The code declares a constant variable using 'const' and then attempts to reassign it. "
                "In JavaScript, variables declared with 'const' cannot be reassigned; use 'let' instead if reassignment is needed."
            )
        if "semicolon" in tl:
            return (
                "The code contains an unnecessary extra semicolon (e.g., ';;'). This is a minor style issue and can be removed."
            )
        return (
            "The code contains issues, but the explanation from the AI was brief. "
            "Please check variable declarations, reassignment rules, and general syntax."
        )

    return text


# --- Validate and patch the AI-provided fix (best-effort) (existing code) ---
def validate_and_patch_fix(ai_fix: str, original_code: str, lang: str, analysis: str) -> str:
    """
    Post-process Gemini's fix:
    - Unwrap code blocks (the fix content might be wrapped in a code block inside the JSON 'fix' field)
    - Fix common JS issues (const reassignment, extra semicolons)
    - Default to commenting out reassignment if const is used
    """
    # Use unwrap_code_block here too, in case the 'fix' field content is wrapped
    code = unwrap_code_block(ai_fix or original_code).strip() or original_code.strip()

    # Normalize multiple semicolons
    code = re.sub(r";{2,}", ";", code)

    if normalize_lang_tag(lang) == "javascript":
        # If analysis says const reassignment → comment out reassignments
        if "const" in analysis.lower() and "reassign" in analysis.lower():
            # Find lines that reassign variables declared as const
            const_vars = re.findall(r"\bconst\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=", code)
            for var in const_vars:
                code = re.sub(
                    rf"^\s*{re.escape(var)}\s*=",
                    f"// {var} =",
                    code,
                    flags=re.MULTILINE,
                )

        # Cleanup trailing semicolons
        code = re.sub(r";+\s*$", ";", code, flags=re.MULTILINE)

    return code.strip()


# --- Wrap fix in fenced code block for syntax highlighting (existing code) ---
def format_fix(code: str, lang: str) -> str:
    tag = normalize_lang_tag(lang)
    return f"```{tag}\n{code.strip()}\n```"


@sio.event
def connect():
    print("[Py] ✅ Connected to Node server")


@sio.on("message_from_node")
def on_message_from_node(data):
    print("[Py] 📩 Received code for analysis & fix")

    # ⬅️ Handle incoming dictionary data
    code = data.get("code")
    github_token = data.get("githubToken")
    
    # 1. Authenticate the user
    user_id = verify_github_token_and_get_uid(github_token)
    
    if not user_id:
        error_result = {
            "analyze": "Authentication Failed: Please ensure your GitHub login session is active in VS Code.",
            "fix": format_fix(code, detect_language(code) if code else "text"),
            "type_of_error": "authentication_failed",
            "programming_language_used": detect_language(code) if code else "text",
            "userId": "unauthenticated"
        }
        sio.emit("ai_result", error_result)
        return
        
    detected_lang = detect_language(code)

    prompt = f"""
You are an AI code assistant. Analyze the following code and return ONLY a single JSON object. DO NOT include any explanatory text, markdown outside the JSON, or comments.
The JSON must have these keys:
- analyze: a clear, detailed explanation of issues found in plain English. Do NOT include fix, type_of_error, or language in this text.
- fix: the corrected version of the code
- type_of_error: one-word category (syntax, logic, style, performance, etc.)
- programming_language_used: detected programming language in one word
Code:
{code}
"""

    try:
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        print("[DEBUG] Raw Gemini output:", text)

        try:
            # FIX: Apply unwrap_code_block to remove markdown fences around the JSON
            clean_text = unwrap_code_block(text)
            
            # Fallback if unwrapping found no code block but the text might be clean JSON
            if not clean_text or not clean_text.strip():
                clean_text = text.strip()
                
            print("[DEBUG] Cleaned JSON candidate:", clean_text)

            resultfrom_ai = json.loads(clean_text)

            # normalize language: prefer local detection on obvious mismatches
            ai_lang = (resultfrom_ai.get("programming_language_used") or "").lower()
            lang_used = ai_lang
            if ai_lang in ["gdscript", "unknown", "none", ""]:
                lang_used = detected_lang

            analysis_text = polish_analysis(resultfrom_ai.get("analyze", ""))
            raw_fix = resultfrom_ai.get("fix", code)

            patched_fix = validate_and_patch_fix(raw_fix, code, lang_used, analysis_text)

            result = {
                "analyze": analysis_text,
                # final fix is the patched version, wrapped as a fenced code block
                "fix": format_fix(patched_fix, lang_used),
                "type_of_error": resultfrom_ai.get("type_of_error", "unknown"),
                "programming_language_used": lang_used,
                "userId": user_id # ⬅️ Pass the authenticated user ID back
            }

            # Debug logs
            print("[DEBUG] AI language:", ai_lang, "-> final language:", lang_used)
            print("[DEBUG] Original AI fix snippet:", (unwrap_code_block(raw_fix)[:300] + "...") if raw_fix else "<none>")
            print("[DEBUG] Patched fix snippet:", (patched_fix[:300] + "...") if patched_fix else "<none>")

        except json.JSONDecodeError as jde:
            # If AI didn't return clean JSON, try to salvage a code block and analysis
            print(f"[ERROR] JSONDecodeError: {jde}. Raw text causing error: {text}")
            analysis_text = polish_analysis(text)
            
            # Try to extract code block from the raw text for the 'fix' field
            candidate_fix = unwrap_code_block(text) or code
            patched_fix = validate_and_patch_fix(candidate_fix, code, detected_lang, analysis_text)

            result = {
                "analyze": f"AI response parse error (JSONDecodeError). Please check the AI's raw output in the logs. Salvaged analysis: {analysis_text}",
                "fix": format_fix(patched_fix, detected_lang),
                "type_of_error": "json_format",
                "programming_language_used": detected_lang,
                "userId": user_id
            }

        except Exception as e:
            result = {
                "analyze": f"Internal Python Error (non-JSONDecode): {e}",
                "fix": format_fix(code, detected_lang),
                "type_of_error": "error",
                "programming_language_used": detected_lang,
                "userId": user_id
            }

    except Exception as e:
        result = {
            "analyze": f"Gemini API Error: {e}",
            "fix": format_fix(code, detected_lang),
            "type_of_error": "api_error",
            "programming_language_used": detected_lang,
            "userId": user_id
        }

    sio.emit("ai_result", result)


@sio.event
def disconnect():
    print("[Py] ❌ Disconnected from Node server")


if __name__ == "__main__":
    try:
        sio.connect("http://localhost:5000")
        sio.wait()
    except Exception as e:
        print(f"[Py] Connect error: {e}")
# 📁 extension/ai.py
import sys, os, json, re, requests, socketio
from dotenv import load_dotenv
from pygments.lexers import guess_lexer
from pygments.util import ClassNotFound
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, auth

# Ensure UTF-8 output (Windows fix)
try:
    sys.stdout.reconfigure(encoding="utf-8")
except AttributeError:
    pass

# --- Load Environment Variables ---
env_path = os.path.join(os.path.dirname(__file__), '..', 'BACKEND', '.env')
load_dotenv(env_path)
API_KEY = os.getenv("GEMINI_API_KEY")
FIREBASE_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

# --- Configure Gemini ---
if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# --- Configure Firebase ---
try:
    cred = credentials.Certificate(FIREBASE_PATH)
    firebase_admin.initialize_app(cred)
    print("[Py] ✅ Firebase initialized")
except Exception as e:
    print(f"[Py] ⚠️ Firebase init failed: {e}")

# --- Socket.IO Client ---
sio = socketio.Client(reconnection=True)

def verify_github_token(github_token: str):
    """Verify GitHub token; return user_id or None"""
    if not github_token:
        print("[Py] ⚠️ Missing GitHub token")
        return None

    try:
        headers = {'Authorization': f'token {github_token}'}
        response = requests.get('https://api.github.com/user', headers=headers)
        response.raise_for_status()
        github_user = response.json()
        user_id = str(github_user.get('id'))
        auth.create_custom_token(user_id, {'provider': 'github'})
        print(f"[Py] ✅ GitHub token verified for user {user_id}")
        return user_id
    except requests.exceptions.RequestException as e:
        print(f"[Py] ❌ GitHub verification error: {e}")
        return None


def detect_language(code: str) -> str:
    try:
        lang = guess_lexer(code).name.lower()
    except ClassNotFound:
        lang = "unknown"
    if any(k in code for k in ["console.log", "function", "let ", "const ", "=>"]):
        return "javascript"
    if any(k in code for k in ["def ", "print(", "import "]):
        return "python"
    if any(k in code for k in ["#include", "std::", "cout <<"]):
        return "cpp"
    return lang

def unwrap_code_block(s: str) -> str:
    if not s: return s
    m = re.search(r"```[a-zA-Z0-9+\-]*\n(.*?)```", s, re.DOTALL)
    return m.group(1).strip() if m else s.strip()

def normalize_lang_tag(lang: str) -> str:
    l = (lang or "text").lower()
    if "js" in l: return "javascript"
    if "py" in l: return "python"
    if "cpp" in l or "c++" in l: return "cpp"
    return "text"

def polish_analysis(raw: str) -> str:
    text = (raw or "").strip()
    if len(text.split()) < 5:
        return "The analysis was too brief. Check syntax and variable usage."
    return text

def format_fix(code: str, lang: str) -> str:
    return f"```{normalize_lang_tag(lang)}\n{code.strip()}\n```"

# --- Socket.IO Events ---

@sio.event
def connect():
    print("[Py] ✅ Connected to Node server")

@sio.event
def disconnect():
    print("[Py] ❌ Disconnected from Node server")

@sio.on("analyze:request")
def on_message(data):
    print("[Py] 📩 Received message from VSCode")

    code = data.get("code", "")
    github_token = data.get("githubToken", "")
    # user_id = verify_github_token(github_token)

    # if not user_id:
    #     print("[Py] ❌ Authentication failed — sending back error result")
    #     sio.emit("analyze:response", {
    #         "analyze": "Authentication Failed: Please ensure your GitHub login session is active in VS Code.",
    #         "fix": format_fix(code, detect_language(code)),
    #         "type_of_error": "auth_error",
    #         "programming_language_used": detect_language(code),
    #         "userId": "unauthenticated"
    #     })
    #     return

    user_id = data.get("userId") or "anonymous"


    detected_lang = detect_language(code)
    prompt = f"""
You are a helpful code analysis assistant. Analyze this code and return JSON only:
{{
  "analyze": "...",
  "fix": "...",
  "type_of_error": "...",
  "programming_language_used": "..."
}}
Code:
{code}
"""

    try:
        response = model.generate_content(prompt)
        result_text = unwrap_code_block(response.text.strip())
        result_json = json.loads(result_text)
        print("[Py] ✅ AI response parsed successfully")

        sio.emit("analyze:response", {
            "analyze": polish_analysis(result_json.get("analyze", "")),
            "fix": format_fix(result_json.get("fix", code), detected_lang),
            "type_of_error": result_json.get("type_of_error", "unknown"),
            "programming_language_used": result_json.get("programming_language_used", detected_lang),
            "userId": user_id
        })
    except Exception as e:
        print(f"[Py] ❌ AI processing error: {e}")
        sio.emit("analyze:response", {
            "analyze": f"AI or processing error: {e}",
            "fix": format_fix(code, detected_lang),
            "type_of_error": "internal_error",
            "programming_language_used": detected_lang,
            "userId": user_id
        })


if __name__ == "__main__":
    try:
        sio.connect("http://localhost:5000")
        sio.wait()
    except Exception as e:
        print(f"[Py] ❌ Connection error: {e}")

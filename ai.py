# ai.py
import sys
import socketio
import google.generativeai as genai
import os
import json
import re
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
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


# --- Language detection with keyword overrides ---
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


# --- Helpers to handle code fences / language names ---
def unwrap_code_block(s: str) -> str:
    """
    If s contains a fenced code block like ```lang\n...\n```, return the inner code.
    Otherwise return s unchanged.
    """
    if not s:
        return s
    m = re.search(r"```[a-zA-Z0-9+\-]*\n(.*?)```", s, re.DOTALL)
    return m.group(1) if m else s


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


# --- Expand short/unclear analysis into a clearer explanation ---
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


# --- Validate and patch the AI-provided fix (best-effort) ---
def validate_and_patch_fix(ai_fix: str, original_code: str, lang: str, analysis: str) -> str:
    """
    Post-process Gemini's fix:
    - Unwrap code blocks
    - Fix common JS issues (const reassignment, extra semicolons)
    - Default to commenting out reassignment if const is used
    """
    code = unwrap_code_block(ai_fix or "").strip() or original_code.strip()

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


# --- Wrap fix in fenced code block for syntax highlighting ---
def format_fix(code: str, lang: str) -> str:
    tag = normalize_lang_tag(lang)
    return f"```{tag}\n{code.strip()}\n```"


@sio.event
def connect():
    print("[Py] ✅ Connected to Node server")


@sio.on("message_from_node")
def on_message_from_node(data):
    print("[Py] 📩 Received code for analysis & fix")

    detected_lang = detect_language(data)

    prompt = f"""
You are an AI code assistant. Analyze the following code and return ONLY a JSON object.
The JSON must have these keys:
- analyze: a clear, detailed explanation of issues found in plain English. Do NOT include fix, type_of_error, or language in this text.
- fix: the corrected version of the code
- type_of_error: one-word category (syntax, logic, style, performance, etc.)
- programming_language_used: detected programming language in one word

Code:
{data}
"""

    try:
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        print("[DEBUG] Raw Gemini output:", text)

        try:
            resultfrom_ai = json.loads(text)

            # normalize language: prefer local detection on obvious mismatches
            ai_lang = (resultfrom_ai.get("programming_language_used") or "").lower()
            lang_used = ai_lang
            if ai_lang in ["gdscript", "unknown", "none", ""]:
                lang_used = detected_lang

            analysis_text = polish_analysis(resultfrom_ai.get("analyze", ""))
            raw_fix = resultfrom_ai.get("fix", data)

            patched_fix = validate_and_patch_fix(raw_fix, data, lang_used, analysis_text)

            result = {
                "analyze": analysis_text,
                # final fix is the patched version, wrapped as a fenced code block
                "fix": format_fix(patched_fix, lang_used),
                "type_of_error": resultfrom_ai.get("type_of_error", "unknown"),
                "programming_language_used": lang_used,
            }

            # Debug logs
            print("[DEBUG] AI language:", ai_lang, "-> final language:", lang_used)
            print("[DEBUG] Original AI fix snippet:", (unwrap_code_block(raw_fix)[:300] + "...") if raw_fix else "<none>")
            print("[DEBUG] Patched fix snippet:", (patched_fix[:300] + "...") if patched_fix else "<none>")

        except json.JSONDecodeError:
            # If AI didn't return JSON, try to salvage a code block and analysis
            analysis_text = polish_analysis(text)
            # try to extract code block from the raw text
            candidate_fix = unwrap_code_block(text) or data
            patched_fix = validate_and_patch_fix(candidate_fix, data, detected_lang, analysis_text)

            result = {
                "analyze": analysis_text,
                "fix": format_fix(patched_fix, detected_lang),
                "type_of_error": "error",
                "programming_language_used": detected_lang,
            }

    except Exception as e:
        result = {
            "analyze": f"Gemini error: {e}",
            "fix": format_fix(data, detected_lang),
            "type_of_error": "error",
            "programming_language_used": detected_lang,
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


# import sys
# import socketio
# import google.generativeai as genai
# import os
# import json
# from pygments.lexers import guess_lexer
# from pygments.util import ClassNotFound
# from dotenv import load_dotenv

# # Ensure stdout supports Unicode (Windows fix)
# try:
#     sys.stdout.reconfigure(encoding="utf-8")
# except AttributeError:
#     pass

# sio = socketio.Client(reconnection=True, reconnection_attempts=0)

# # --- Configure Gemini (API key via .env) ---
# load_dotenv()
# API_KEY = os.getenv("GEMINI_API_KEY")
# if not API_KEY:
#     raise ValueError("❌ Missing GEMINI_API_KEY in .env")

# genai.configure(api_key=API_KEY)
# model = genai.GenerativeModel("gemini-1.5-flash")


# # --- Language detection with keyword overrides ---
# def detect_language(code: str) -> str:
#     try:
#         lang = guess_lexer(code).name.lower()
#     except ClassNotFound:
#         lang = "unknown"

#     js_keywords = ["console.log", "function", "let ", "const ", "=>"]
#     py_keywords = ["def ", "print(", "import "]
#     cpp_keywords = ["#include", "std::", "cout <<"]

#     if any(k in code for k in js_keywords):
#         return "javascript"
#     if any(k in code for k in py_keywords):
#         return "python"
#     if any(k in code for k in cpp_keywords):
#         return "cpp"

#     return lang


# # --- Expand short/unclear analysis into a clearer explanation ---
# def polish_analysis(raw: str) -> str:
#     text = raw.strip()

#     # Strip leakage of other fields
#     for key in ["fix:", "type_of_error", "programming_language_used"]:
#         if key in text.lower():
#             text = text.split(key)[0].strip()

#     # Auto-expand if too short
#     if len(text.split()) < 5:  # e.g., "const error"
#         if "const" in text.lower() and "reassign" in text.lower():
#             return ("The code declares a constant variable with 'const' and "
#                     "then attempts to reassign it, which is not allowed in JavaScript.")
#         if "semicolon" in text.lower():
#             return ("The code contains an unnecessary extra semicolon, "
#                     "which is redundant and should be removed.")
#         return ("The code contains issues, but the explanation from AI was too brief. "
#                 "Check syntax, variable usage, and reassignment rules carefully.")

#     return text


# # --- Wrap fix in fenced code block for syntax highlighting ---
# def format_fix(code: str, lang: str) -> str:
#     lang = lang.lower()
#     return f"```{lang}\n{code.strip()}\n```"


# @sio.event
# def connect():
#     print("[Py] ✅ Connected to Node server")


# @sio.on("message_from_node")
# def on_message_from_node(data):
#     print("[Py] 📩 Received code for analysis & fix")

#     detected_lang = detect_language(data)

#     prompt = f"""
#     You are an AI code assistant. Analyze the following code and return ONLY a JSON object.
#     The JSON must have these keys:
#     - analyze: a clear, detailed explanation of issues found in plain English. 
#       Do NOT include fix, type_of_error, or language in this text.
#     - fix: the corrected version of the code
#     - type_of_error: one-word category (syntax, logic, style, performance, etc.)
#     - programming_language_used: detected programming language in one word

#     Code:
#     {data}
#     """

#     try:
#         resp = model.generate_content(prompt)
#         text = resp.text.strip()
#         print("[DEBUG] Raw Gemini output:", text)

#         try:
#             resultfrom_ai = json.loads(text)

#             lang_used = resultfrom_ai.get("programming_language_used", detected_lang)
#             if lang_used in ["gdscript", "unknown"]:
#                 lang_used = detected_lang

#             result = {
#                 "analyze": polish_analysis(resultfrom_ai.get("analyze", "")),
#                 "fix": format_fix(resultfrom_ai.get("fix", data), lang_used),
#                 "type_of_error": resultfrom_ai.get("type_of_error", "unknown"),
#                 "programming_language_used": lang_used,
#             }

#         except json.JSONDecodeError:
#             result = {
#                 "analyze": polish_analysis(text),
#                 "fix": format_fix(data, detected_lang),
#                 "type_of_error": "error",
#                 "programming_language_used": detected_lang,
#             }

#     except Exception as e:
#         result = {
#             "analyze": f"Gemini error: {e}",
#             "fix": format_fix(data, detected_lang),
#             "type_of_error": "error",
#             "programming_language_used": detected_lang,
#         }

#     sio.emit("ai_result", result)


# @sio.event
# def disconnect():
#     print("[Py] ❌ Disconnected from Node server")


# if __name__ == "__main__":
#     try:
#         sio.connect("http://localhost:5000")
#         sio.wait()
#     except Exception as e:
#         print(f"[Py] Connect error: {e}")



# import sys
# import socketio
# import google.generativeai as genai
# import os
# import json
# from pygments.lexers import guess_lexer
# from pygments.util import ClassNotFound
# from dotenv import load_dotenv

# # Ensure stdout can print Unicode on Windows
# try:
#     sys.stdout.reconfigure(encoding='utf-8')
# except AttributeError:
#     pass

# sio = socketio.Client(reconnection=True, reconnection_attempts=0)

# # --- Configure Gemini (API key via environment variable) ---
# load_dotenv()
# # genai.configure(api_key=os.getenv("API_KEY"))
# API_KEY = os.getenv("GEMINI_API_KEY")
# if not API_KEY:
#     raise ValueError("❌ Missing GEMINI_API_KEY in .env")

# genai.configure(api_key=API_KEY)
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Auto language detection
# def detect_language(code: str) -> str:
#     try:
#         lexer = guess_lexer(code)
#         return lexer.name.lower()
#     except ClassNotFound:
#         return "unknown"

# @sio.event
# def connect():
#     print("[Py] ✅ Connected to Node server")


# #<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

# # --- Auto language detection with fallback map ---
# def detect_language(code: str) -> str:
#     try:
#         lexer = guess_lexer(code)
#         lang = lexer.name.lower()
#     except ClassNotFound:
#         lang = "unknown"

#     # Manual keyword-based overrides
#     js_keywords = ["console.log", "function", "let ", "const ", "=>"]
#     py_keywords = ["def ", "print(", "import "]
#     cpp_keywords = ["#include", "std::", "cout <<"]

#     if any(k in code for k in js_keywords):
#         return "javascript"
#     elif any(k in code for k in py_keywords):
#         return "python"
#     elif any(k in code for k in cpp_keywords):
#         return "cpp"

#     return lang


# @sio.on("message_from_node")
# def on_message_from_node(data):
#     print("[Py] 📩 Received code for analysis & fix")

#     detected_lang = detect_language(data)

#     prompt = f"""
#     You are an AI code assistant. Analyze the following code and return ONLY a JSON object.
#     The JSON must have these keys:
#     - analyze: a clear, detailed explanation of issues found in plain English. Do NOT include fix, type_of_error, or language here.
#     - fix: the corrected version of the code
#     - type_of_error: one-word category (syntax, logic, style, performance, etc.)
#     - programming_language_used: detected programming language in one word

#     Code:
#     {data}
#     """

#     try:
#         resp = model.generate_content(prompt)
#         text = resp.text.strip()
#         print("[DEBUG] Raw Gemini output:", text)

#         try:
#             resultfrom_ai = json.loads(text)

#             # Ensure analysis is descriptive only
#             analysis_text = resultfrom_ai.get("analyze", "").strip()
#             if any(word in analysis_text.lower() for word in ["fix:", "type_of_error", "programming_language_used"]):
#                 # Remove accidental leakage
#                 analysis_text = analysis_text.split("fix:")[0].strip()

#             result = {
#                 "analyze": analysis_text or "No detailed analysis provided.",
#                 "fix": resultfrom_ai.get("fix", data),
#                 "type_of_error": resultfrom_ai.get("type_of_error", "unknown"),
#                 "programming_language_used": resultfrom_ai.get("programming_language_used", detected_lang)
#             }

#             # Override wrong AI language with local detection
#             if result["programming_language_used"] == "gdscript" or result["programming_language_used"] == "unknown":
#                 result["programming_language_used"] = detected_lang

#         except json.JSONDecodeError:
#             result = {
#                 "analyze": text,
#                 "fix": data,
#                 "type_of_error": "error",
#                 "programming_language_used": detected_lang
#             }

#     except Exception as e:
#         result = {
#             "analyze": f"Gemini error: {e}",
#             "fix": data,
#             "type_of_error": "error",
#             "programming_language_used": detected_lang
#         }

#     sio.emit("ai_result", result)


# # @sio.on("message_from_node")
# # def on_message_from_node(data):
# #     print("[Py] 📩 Received code for analysis & fix")

# #     # Detect language locally
# #     detected_lang = detect_language(data)

# #     prompt = f"""
# #     You are an AI code assistant. Analyze the following code and return ONLY a JSON object.
# #     The JSON must have these keys:
# #     - analyze: short explanation of issues found
# #     - fix: the corrected version of the code
# #     - type_of_error: one-word category (syntax, logic, style, performance, etc.)
# #     - programming_language_used: detected programming language in one word

# #     Code:
# #     {data}
# #     """

# #     try:
# #         resp = model.generate_content(prompt)
# #         text = resp.text.strip()

# #         print("[DEBUG] Raw Gemini output:", text)

# #         resultfrom_ai = {}  # define upfront


# #         try:
# #             resultfrom_ai = json.loads(text)
# #             result = {
# #                 "analyze": resultfrom_ai.get("analyze","could not parse AI response."),
# #                 "fix": resultfrom_ai.get("fix",data),
# #                 "type_of_error": resultfrom_ai.get("type_of_error","unknown"),
# #                 "programming_language_used": resultfrom_ai.get("programming_language_used", detected_lang)
# #             }

# #             if not result["programming_lang_used"] or result["programming_language_used"] == "unknown":
# #                 result["programming_language_used"] = detected_lang
# #         except json.JSONDecodeError:
# #             result = {
# #                 "analyze": text,
# #                 "fix": data,
# #                 "type_of_error": "error",
# #                 "programming_language_used": detected_lang
# #             }
        
# #     except Exception as e:
# #         result = {
# #             "analyze": f"Gemini error: {e}",
# #             "fix": data,
# #             "type_of_error": "error",
# #             "programming_language_used": detected_lang
# #         }

# #     sio.emit("ai_result", result)

# @sio.event
# def disconnect():
#     print("[Py] ❌ Disconnected from Node server")

# if __name__ == "__main__":
#     try:
#         sio.connect("http://localhost:5000")
#         sio.wait()
#     except Exception as e:
#         print(f"[Py] Connect error: {e}")

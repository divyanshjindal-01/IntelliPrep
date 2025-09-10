import sys
import socketio
import google.generativeai as genai
import os
import json
from pygments.lexers import guess_lexer
from pygments.util import ClassNotFound

# Ensure stdout can print Unicode on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

sio = socketio.Client(reconnection=True, reconnection_attempts=0)

# --- Configure Gemini (API key via environment variable) ---
genai.configure(api_key=os.getenv("************"))
model = genai.GenerativeModel("gemini-1.5-flash")

# Auto language detection
def detect_language(code: str) -> str:
    try:
        lexer = guess_lexer(code)
        return lexer.name.lower()
    except ClassNotFound:
        return "unknown"

@sio.event
def connect():
    print("[Py] ✅ Connected to Node server")

@sio.on("message_from_node")
def on_message_from_node(data):
    print("[Py] 📩 Received code for analysis & fix")

    # Detect language locally
    detected_lang = detect_language(data)

    prompt = f"""
    You are an AI code assistant. Analyze the following code and return ONLY a JSON object.
    The JSON must have these keys:
    - analyze: short explanation of issues found
    - fix: the corrected version of the code
    - type_of_error: one-word category (syntax, logic, style, performance, etc.)
    - programming_language_used: detected programming language in one word

    Code:
    {data}
    """

    try:
        resp = model.generate_content(prompt)
        text = resp.text.strip()

        try:
            result = json.loads(text)
        except json.JSONDecodeError:
            result = {
                "analyze": text,
                "fix": data,
                "type_of_error": "unknown",
                "programming_language_used": detected_lang
            }
        else:
            # Ensure programming_language_used is filled
            if not result.get("programming_language_used") or result["programming_language_used"] == "unknown":
                result["programming_language_used"] = detected_lang

    except Exception as e:
        result = {
            "analyze": f"Gemini error: {e}",
            "fix": data,
            "type_of_error": "error",
            "programming_language_used": detected_lang
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

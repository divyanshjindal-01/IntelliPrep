import sys
import socketio
import google.generativeai as genai

# Ensure stdout can print Unicode on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

sio = socketio.Client(reconnection=True, reconnection_attempts=0)

# --- Optional: configure Gemini ---
genai.configure(api_key="AIzaSyAsqOIQ2_qZT3wnI8UTsNJUbBI3_5Vu3P4")
model = genai.GenerativeModel("gemini-1.5-flash")

@sio.event
def connect():
    print("[Py] ✅ Connected to Node server")

@sio.on("message_from_node")
def on_message_from_node(data):
    print("[Py] 📩 Received code (len=", len(data), ")")
    # --- If using Gemini ---
    try:
        resp = model.generate_content(f"Summarize this document:\n\n{data}")
        text = resp.text if resp and getattr(resp, 'text', None) else "No response"
    except Exception as e:
        text = f"Gemini error: {e}"
    # For demo without Gemini:
    # text = f"Summary: {data[:120]}... (truncated)"
    # sio.emit("ai_response", text)

@sio.on("fix_code_request")
def on_fix_code_request(data):
    print("[Py] 🛠️ Fix code request received")
    # Placeholder fixer
    # fixed = data.replace("var ", "let ")  # trivial example
   
    try:
        resp = model.generate_content(f"fix this document:\n\n{data}")
        text = resp.text if resp and getattr(resp, 'text', None) else "No response"
    except Exception as e:
        text = f"Gemini error: {e}"

    sio.emit("fixed_code_response", text)

@sio.event
def disconnect():
    print("[Py] ❌ Disconnected from Node server")

if __name__ == "__main__":
    # Register handlers BEFORE connecting
    try:
        sio.connect("http://localhost:5000")
        sio.wait()
    except Exception as e:
        print(f"[Py] Connect error: {e}")

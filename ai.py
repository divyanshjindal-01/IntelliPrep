import sys
import socketio
import google.generativeai as genai  # uncomment if you use Gemini

# Ensure stdout can print Unicode on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
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

### Notes

# * **Do not** register `io.on('connection', ...)` inside `startPythonBackend` —
#   that caused duplicated listeners and race conditions. The version above keeps a **single** handler at top-level.
# * We removed the accidental `socket.emit("message_from_node", text)` during connect (you were emitting before any command ran, and `text` could be undefined). Now emits only when the **user runs a command**.
# * We export both `activate` and `deactivate` correctly via `module.exports = { activate, deactivate }`.
# * Python prints are forced to UTF‑8 to avoid `UnicodeEncodeError` on Windows.
# * Auto‑restart logic will relaunch Python if it exits.
# * If port **5000** is already used, change it in **both files**.












# import sys
# import socketio
# import google.generativeai as genai
# import time

# # Set stdout encoding to UTF-8 to handle emojis and special characters
# sys.stdout.reconfigure(encoding='utf-8')

# # Create a Socket.IO client
# sio = socketio.Client()

# # Configure Gemini
# genai.configure(api_key="AIzaSyAsqOIQ2_qZT3wnI8UTsNJUbBI3_5Vu3P4")  # 🔒 Replace this with your actual key
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Track connection state
# processed_messages = set()
# message_processing_flag = False

# # Attempt to connect to Node server
# def setup_connection():
#     retry_count = 0
#     max_retries = 10  # Limit retries to 10 times
#     while retry_count < max_retries:
#         try:
#             print("🔌 Attempting to connect to http://localhost:5000")
#             sio.connect("http://localhost:5000")
#             break  # Exit loop once connected
#         except Exception as e:
#             print(f"❌ Connection failed: {e}")
#             retry_count += 1
#             time.sleep(5)
#     else:
#         print("❌ Max retries reached. Exiting.")
#         sys.exit(1)  # Exit the script after max retries

# @sio.event
# def connect():
#     print("\u2705 Connected to Node server")  # ✅ emoji

# @sio.event
# def disconnect():
#     print("❌ Disconnected from server")  # Indicates disconnection from Node

# @sio.event
# def message_from_node(data):
#     global message_processing_flag

#     print(f"📩 Received message from Node")

#     if data in processed_messages:
#         print("🔁 Duplicate message detected. Skipping...")
#         return

#     processed_messages.add(data)

#     if message_processing_flag:
#         print("⚠️ Already processing a message. Try again later.")
#         return

#     try:
#         message_processing_flag = True
#         print("🤖 Generating AI response...")

#         # Modify prompt to ask for a summarized response in points
#         prompt = f"Summarize the following document in bullet points:\n\n{data}"

#         response = model.generate_content(prompt)
        
#         # Check response validity
#         ai_text = response.text if response and response.text else "⚠️ No response from AI."

#         # Ensure the AI response is in a list format
#         if ai_text:
#             ai_text = ai_text.strip().replace('\n', '\n• ')  # Adding bullet points
#             ai_text = f"• {ai_text}"  # Ensure the first bullet point is correctly formatted

#         print(f"🧠 AI response generated:\n{ai_text}")
#     except Exception as e:
#         ai_text = f"⚠️ Error generating response: {e}"
#         print(ai_text)
#     finally:
#         message_processing_flag = False

#     if ai_text:
#         sio.emit("ai_response", ai_text)
#         print("📤 Sent AI response back to Node")

# # Ensure the script doesn't exit immediately and keeps the connection alive
# if __name__ == "__main__":
#     setup_connection()
#     sio.wait()  # Keeps the socket open and waits for incoming events

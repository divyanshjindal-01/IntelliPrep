import sys
import socketio
import google.generativeai as genai
import time

# Set stdout encoding to UTF-8 to handle emojis and special characters
sys.stdout.reconfigure(encoding='utf-8')

# Create a Socket.IO client
sio = socketio.Client()

# Configure Gemini
genai.configure(api_key="AIzaSyAsqOIQ2_qZT3wnI8UTsNJUbBI3_5Vu3P4")  # 🔒 Replace this with your actual key
model = genai.GenerativeModel("gemini-1.5-flash")

# Track connection state
processed_messages = set()
message_processing_flag = False

# Attempt to connect to Node server
def setup_connection():
    retry_count = 0
    max_retries = 10  # Limit retries to 10 times
    while retry_count < max_retries:
        try:
            print("🔌 Attempting to connect to http://localhost:5000")
            sio.connect("http://localhost:5000")
            break  # Exit loop once connected
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            retry_count += 1
            time.sleep(5)
    else:
        print("❌ Max retries reached. Exiting.")
        sys.exit(1)  # Exit the script after max retries

@sio.event
def connect():
    print("\u2705 Connected to Node server")  # ✅ emoji

@sio.event
def disconnect():
    print("❌ Disconnected from server")  # Indicates disconnection from Node

@sio.event
def message_from_node(data):
    global message_processing_flag

    print(f"📩 Received message from Node")

    if data in processed_messages:
        print("🔁 Duplicate message detected. Skipping...")
        return

    processed_messages.add(data)

    if message_processing_flag:
        print("⚠️ Already processing a message. Try again later.")
        return

    try:
        message_processing_flag = True
        print("🤖 Generating AI response...")

        # Modify prompt to ask for a summarized response in points
        prompt = f"Summarize the following document in bullet points:\n\n{data}"

        response = model.generate_content(prompt)
        
        # Check response validity
        ai_text = response.text if response and response.text else "⚠️ No response from AI."

        # Ensure the AI response is in a list format
        if ai_text:
            ai_text = ai_text.strip().replace('\n', '\n• ')  # Adding bullet points
            ai_text = f"• {ai_text}"  # Ensure the first bullet point is correctly formatted

        print(f"🧠 AI response generated:\n{ai_text}")
    except Exception as e:
        ai_text = f"⚠️ Error generating response: {e}"
        print(ai_text)
    finally:
        message_processing_flag = False

    if ai_text:
        sio.emit("ai_response", ai_text)
        print("📤 Sent AI response back to Node")

# Ensure the script doesn't exit immediately and keeps the connection alive
if __name__ == "__main__":
    setup_connection()
    sio.wait()  # Keeps the socket open and waits for incoming events

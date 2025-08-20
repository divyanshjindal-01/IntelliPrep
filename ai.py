import socketio
import google.generativeai as genai

# Create a Socket.IO client
sio = socketio.Client()

# Configure Gemini
genai.configure(api_key="AIzaSyC2HASYqbKFJbxZhYlmgfFAx0q_3Lz6Uqc")
model = genai.GenerativeModel("gemini-1.5-flash")

@sio.event
def connect():
    print(" Connected to Node server")

@sio.event
def message_from_node(data):
    print(" Got code from VSCode")
    try:
        response = model.generate_content(f"Summarize this document:\n\n{data}")
        ai_text = response.text if response and response.text else "⚠️ No response"
    except Exception as e:
        ai_text = f"Error: {e}"

    # Send back to Node
    sio.emit("ai_response", ai_text)

# Connect and wait
sio.connect("http://localhost:5000")
sio.wait()

# import google.generativeai as genai

# # Configure with your Gemini API key
# genai.configure(api_key="AIzaSyC2HASYqbKFJbxZhYlmgfFAx0q_3Lz6Uqc")

# model = genai.GenerativeModel("gemini-1.5-flash")

# # Read from a text file
# with open("gobar.c", "r", encoding="utf-8") as f:
#     file_content = f.read()

# # Ask Gemini to analyze the file
# response = model.generate_content(f"Summarize this document:\n\n{file_content}")

# # print("AI Response:\n", response.text)
# ans = (response.text)

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

@app.route("/")
def home():
    return "Flask server is running!"

@app.route("/send", methods=["POST"])
def receive():
    data = request.get_json()
    js_value = data.get("value")
    print("Got from JS:", js_value)
    return jsonify({"status": "ok", "received": js_value})

if __name__ == "__main__":
    app.run()

import json
import os
import google.generativeai as genai

# Safe default text
file_content = "No input text provided."

# ✅ Try reading data.json
if os.path.exists("data.json"):
    try:
        with open("data.json", "r") as f:
            data = json.load(f)
        if "value" in data and data["value"].strip():
            file_content = data["value"]
        else:
            print("⚠️ Warning: 'value' missing or empty in data.json, using fallback text.")
    except Exception as e:
        print(f"⚠️ Could not read data.json: {e}")
else:
    print("⚠️ data.json not found, using fallback text.")

# Configure with your Gemini API key
genai.configure(api_key="AIzaSyC2HASYqbKFJbxZhYlmgfFAx0q_3Lz6Uqc")

model = genai.GenerativeModel("gemini-1.5-flash")

# Ask Gemini to analyze the file
response = model.generate_content(f"Summarize this document:\n\n{file_content}")

# ✅ Print AI response safely
print("AI Response:\n", response.text if response and response.text else "⚠️ No response")

# Also save to result.json
try:
    with open("result.json", "w") as f:
        json.dump({"ai_response": response.text if response and response.text else ""}, f)
except Exception as e:
    print(f"⚠️ Could not save result.json: {e}")

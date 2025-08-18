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

import json

with open("shared.json", "r") as f:
    data = json.load(f)
    print("Received from JS:", data["value"])

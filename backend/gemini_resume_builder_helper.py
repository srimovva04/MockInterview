import google.generativeai as genai
import os

# Set your API key here (or use env vars)
api_key = os.getenv("GEMINI_API_KEY") 
genai.configure(api_key=api_key)

# model = genai.GenerativeModel('gemini-pro')
model = genai.GenerativeModel('gemini-1.5-pro')
def refine_bullet_points(raw_bullets, section_name):
    if not raw_bullets:
        return []
    prompt = f"""
You are a resume writing assistant.

Rewrite the given input for the section **{section_name}** into professional resume bullet points. 
Ensure all grammar and spelling issues are fixed.

Formatting Rules:
- For Experience and Education: Give exactly 2 bullet points.
- For Projects: Give exactly 3 bullet points (short sentences).
- Write each bullet point as a full sentence or phrase suitable for a resume.
- Remove symbols like "-", "•", or "*".
- Do not use placeholders like [Month], [Percent].
- No extra formatting or markdown.

Input: {', '.join(raw_bullets)}

Output:
"""

    try:
        response = model.generate_content(prompt)
        output = response.text.strip()

        # Convert plain text to list
        lines = [line.strip("-• ") for line in output.split("\n") if line.strip()]
        return lines[:3]
    except Exception as e:
        print("[Gemini Error]:", e)
        return raw_bullets[:3]  # fallback




def refine_text_field(text: str, field_name: str) -> str:
    if not text.strip():
        return text  # Skip empty

    prompt = f"""
You are a resume proofreading assistant.

Correct any spelling or grammatical errors in the following {field_name} input. 
Do not change the meaning or style. Return a clean, corrected version.

Input: {text}

Output:
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[Gemini Error - field {field_name}]:", e)
        return text
import google.generativeai as genai
import os
import ast


# Set your API key here (or use env vars)
api_key = os.getenv("GEMINI_API_KEY") 
genai.configure(api_key=api_key)

# model = genai.GenerativeModel('gemini-pro')
model = genai.GenerativeModel('gemini-2.5-pro')


def refine_all_bullets(data):
    """
    Enhances the entire resume:
    - Spellchecks and grammatically improves all fields
    - Formats bullets (2 for experience, 1 for education, 3 for projects)
    - Keeps structure intact
    """


    prompt = f"""
You are a resume enhancement assistant.

You will be given a resume in structured JSON format. Your tasks:
1. Correct all spelling and grammar errors across **all fields** (personal info, titles, dates, etc.).
2. Rewrite all bullets in a professional, resume-ready format.
    - Experience: exactly 2 strong bullet points each
    -  Education: exactly 1 strong bullet point
    - Projects: exactly 3 strong bullet points each
3. Preserve structure. Keep fields like 'technologies' and 'skills' as strings.
4. Do not use markdown or triple quotes. Output should be a valid Python dictionary.
5. Do NOT include any explanations—just return the corrected Python dictionary.

Resume data:
{data}

Return only the corrected Python dictionary:
"""

    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()

        # Strip markdown if Gemini wraps it in ```python blocks
        if cleaned_text.startswith("```"):
            cleaned_text = cleaned_text.strip("` \n")
            # Handle things like ```python\n{ ... }\n```
            if cleaned_text.lower().startswith("python"):
                cleaned_text = cleaned_text[len("python"):].strip()

        # Convert output string back to dict safely
        refined_data = ast.literal_eval(cleaned_text)
        return refined_data

    except Exception as e:
        print("[Gemini Error - full enhancement]:", e)
        return data  # fallback to original if Gemini fails
    

import google.generativeai as genai
import os

# Set your API key here (or use env vars)
api_key = os.getenv("GEMINI_API_KEY") 
genai.configure(api_key=api_key)

# model = genai.GenerativeModel('gemini-pro')
model = genai.GenerativeModel('gemini-1.5-pro')

def refine_all_bullets(data):
    prompt_parts = []

    for section in ['experience', 'education', 'projects']:
        for i, entry in enumerate(data[section]):
            bullets = entry.get('bullets' if section != 'education' else 'details', [])
            if bullets:
                content = ' '.join(bullets)
                prompt_parts.append(f"\nSection: {section.capitalize()}, Index: {i}\nBullets: {content}")

    prompt = f"""
You are a resume bullet point refiner.

You will be given different resume sections with lists of bullet points. 
For each section:
- Rewrite the bullets in professional, grammatically correct, resume-ready format.
- Correct spelling and grammar errors.
- If input is in paragraph form, break it into bullet points.
- For 'Experience' and 'Education': Return exactly 2 bullet points.
- For 'Projects': Return exactly 3 bullet points.
- Remove symbols like -, •, *.
- Do not use placeholders like [Month], [Percent].

Return output section-wise and index-wise clearly.

Input:
{''.join(prompt_parts)}

Output format:
Section: Experience, Index: 0
- Bullet 1
- Bullet 2

Section: Projects, Index: 1
- Bullet 1
- Bullet 2
- Bullet 3
"""

    try:
        response = model.generate_content(prompt)
        output = response.text.strip()

        section_blocks = output.split("Section:")
        for block in section_blocks:
            if not block.strip():
                continue
            header, *lines = block.strip().split("\n")
            section, idx = header.strip().split(", Index: ")
            section = section.lower()
            idx = int(idx)
            refined = [line.strip("-•* ") for line in lines if line.strip()]
            if section == "education":
                data[section][idx]['details'] = refined[:2]
            else:
                data[section][idx]['bullets'] = refined[:3] if section == "projects" else refined[:2]

    except Exception as e:
        print("[Gemini Error - combined refinement]:", e)

    return data


# def refine_all_bullets(data):
#     """
#     Enhanced version:
#     - Accepts paragraph or bullet-style user input
#     - Fixes grammar/spelling
#     - Converts paragraph text into bullet points
#     - Groups input per section/index to stay within Gemini quota
#     """

#     prompt_parts = []
#     section_map = []

#     # Gather bullet data
#     for section in ['experience', 'education', 'projects']:
#         for i, entry in enumerate(data[section]):
#             bullets = entry.get('bullets' if section != 'education' else 'details', [])
#             if bullets:
#                 prompt_parts.append(f"\nSection: {section.capitalize()}, Index: {i}\nBullets: {', '.join(bullets)}")
#                 section_map.append((section, i))

#     prompt = f"""
# You are a resume bullet point refiner.

# You will be given different resume sections with lists of bullet points. 
# For each section:
# - Rewrite the bullets in professional, grammatically correct, resume-ready format.
# - For 'Experience' and 'Education': Return exactly 2 bullet points.
# - For 'Projects': Return exactly 3 bullet points.
# - Remove symbols like -, •, *.
# - Do not use placeholders like [Month], [Percent].

# Return output section-wise and index-wise clearly.

# Input:
# {''.join(prompt_parts)}

# Output format:
# Section: Experience, Index: 0
# - Bullet 1
# - Bullet 2

# Section: Projects, Index: 1
# - Bullet 1
# - Bullet 2
# - Bullet 3
# """

#     try:
#         response = model.generate_content(prompt)
#         output = response.text.strip()

#         # Parse output
#         section_blocks = output.split("Section:")
#         for block in section_blocks:
#             if not block.strip():
#                 continue
#             header, *lines = block.strip().split("\n")
#             section, idx = header.strip().split(", Index: ")
#             section = section.strip().lower()
#             idx = int(idx.strip())
#             refined = [line.strip("-•* ") for line in lines if line.strip()]
#             if section == "education":
#                 data[section][idx]['details'] = refined[:2]
#             else:
#                 data[section][idx]['bullets'] = refined[:3] if section == "projects" else refined[:2]

#     except Exception as e:
#         print("[Gemini Error - combined refinement]:", e)

#     return data

















# def refine_bullet_points(raw_bullets, section_name):
#     if not raw_bullets:
#         return []
#     prompt = f"""
# You are a resume writing assistant.

# Rewrite the given input for the section **{section_name}** into professional resume bullet points. 
# Ensure all grammar and spelling issues are fixed.

# Formatting Rules:
# - For Experience and Education: Give exactly 2 bullet points.
# - For Projects: Give exactly 3 bullet points (short sentences).
# - Write each bullet point as a full sentence or phrase suitable for a resume.
# - Remove symbols like "-", "•", or "*".
# - Do not use placeholders like [Month], [Percent].
# - No extra formatting or markdown.

# Input: {', '.join(raw_bullets)}

# Output:
# """

#     try:
#         response = model.generate_content(prompt)
#         output = response.text.strip()

#         # Convert plain text to list
#         lines = [line.strip("-• ") for line in output.split("\n") if line.strip()]
#         return lines[:3]
#     except Exception as e:
#         print("[Gemini Error]:", e)
#         return raw_bullets[:3]  # fallback




# def refine_text_field(text: str, field_name: str) -> str:
#     if not text.strip():
#         return text  # Skip empty

#     prompt = f"""
# You are a resume proofreading assistant.

# Correct any spelling or grammatical errors in the following {field_name} input. 
# Do not change the meaning or style. Return a clean, corrected version.

# Input: {text}

# Output:
# """

#     try:
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         print(f"[Gemini Error - field {field_name}]:", e)
#         return text
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Locate and load the .env (it walks up parent dirs, so you can keep .env in the repo root)
load_dotenv()

# The client will now pick it up automatically, *or* you can pass it explicitly
api_key = os.getenv("GEMINI_API_KEY")          # returns None if not found
genai.configure(api_key=api_key)

def match_skills(resume_text, job_description):
    prompt = f"""
You are an ATS scoring system. Given a resume and a job description, identify matching skills and give a score (out of 100).

Resume:
{resume_text}

Job Description:
{job_description}

Respond in this format:
Score: <score>
Skills Matched: <list of skills>
    """

    # model = genai.GenerativeModel('gemini-pro')
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)

    # Parse response
    text = response.text
    try:
        score_line = [line for line in text.split('\n') if "Score:" in line][0]
        matched_line = [line for line in text.split('\n') if "Skills Matched:" in line][0]
        score = int(score_line.split(":")[1].strip())
        matched_skills = matched_line.split(":")[1].strip()
        return score, matched_skills
    except:
        return 0, "Parsing error in Gemini response"
    


# from dotenv import load_dotenv
# load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

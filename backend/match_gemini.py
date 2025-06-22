import google.generativeai as genai
import os
# AIzaSyCC6fOTV4VbSsKeb3oAnojXHgFTqK8a-vo
# Set your Gemini API key
# genai.configure(api_key="AIzaSyB3gn3C1op14AqdTdzj4mne2UAbM2Pq_uA")
genai.configure(api_key="AIzaSyCC6fOTV4VbSsKeb3oAnojXHgFTqK8a-vo")

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
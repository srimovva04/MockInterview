from flask import Flask, request, jsonify
from flask_cors import CORS
import os, uuid
import pdfplumber
import google.generativeai as genai
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import json

app = Flask(__name__)
app.config.update(
    SESSION_COOKIE_SECURE=True,      # ✅ Only sent over HTTPS
    SESSION_COOKIE_HTTPONLY=True,    # ✅ Not accessible via JavaScript
    SESSION_COOKIE_SAMESITE='Lax'    # ✅ Prevents CSRF for most cases
)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]
)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # Limit uploads to 5 MB
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
api_key = os.getenv("GEMINI_API_KEY")   
# Gemini setup
genai.configure(api_key=api_key)  # Replace securely in prod

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def call_gemini_resume_parser(text):
    prompt = f"""
You are an expert resume parser and editor for ATS (Applicant Tracking Systems).

From the resume text provided below, extract and **rephrase** the content to be:
- Professional and concise
- Optimized for keyword scanning
- Enhanced with action verbs and measurable impact where possible
- Free of redundancy or vague phrases

Return the output in the following structured JSON format (no explanations):

{{
  "personalInfo": {{
    "name": string,
    "email": string,
    "phone": string,
    "city": string,
    "country": string
  }},
  "education": [
    {{
      "degree": string,
      "gpa": string,
      "school": string,
      "location": string,
      "duration": string,
      "coursework": [string]
    }}
  ],
  "skills": {{
    "languages": [string],
    "tools": [string]
  }},
  "employment": [
    {{
      "title": string,
      "company": string,
      "duration": string,
      "bullets": [string]
    }}
  ],
  "projects": [
    {{
      "name": string,
      "duration": string,
      "description": "Tech Stack: <comma-separated list of technologies>",
      "bullets": [string]
    }}
  ],
  "additionalExperience": [string]
}}

Instructions:
- For the "education" field, extract **all education entries** found in the resume and return them as an array of objects, not just one.
- For the "projects" section, return the tech stack as the only content inside "description" in the format: "Tech Stack: X, Y, Z".
- For the "projects" section, only include 2 points of description for each project.
- For the "experience section, include only 2 experience entries that are latest and explain each in 1 bullet point for 20-25 words.
- For the "additionalExperience" section,describe each in 15 or less words such that it fits within 1 line of A4 Page
- Don't include location if not present in the resume.
Only return the JSON object — do not include ```json or explanation.

Resume text:
{text}
"""

    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    if hasattr(response, 'text'):
        return response.text.strip()
    elif hasattr(response, 'parts'):
        return response.parts[0].text.strip()
    else:
        return ""
    
ALLOWED_EXTENSIONS = {'pdf','docx','doc'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@limiter.limit("10 per minute")
@app.route("/api/parse-resume", methods=["POST"])
def parse_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format. Only PDF,DOCX,DOC files allowed."}), 400

    try:
        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        text = extract_text_from_pdf(filepath)
        gemini_json = call_gemini_resume_parser(text)

        # Clean markdown wrapping
        cleaned = gemini_json.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned.replace("```", "").strip()

        parsed = json.loads(cleaned)
        return jsonify(parsed)

    except Exception as e:
        print("Error during resume parsing:", e)
        return jsonify({"error": str(e)}), 500
    
@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    return jsonify({"error": "File is too large. Maximum allowed size is 5 MB."}), 413
if __name__ == '__main__':
    app.run(debug=True)


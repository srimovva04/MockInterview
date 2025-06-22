from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from resume_parser import extract_text_from_pdf, detect_sections, extract_contact_info, check_date_format
from match_gemini import match_skills

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    job_description = request.form.get('job_description', '')

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)

    # Section Detection
    sections = detect_sections(resume_text)
    contact_info = extract_contact_info(resume_text)
    date_format_valid = check_date_format(resume_text)
    word_count = len(resume_text.split())

    # Job title match
    job_title = "intern"
    job_title_match = job_title.lower() in resume_text.lower()

    # Gemini Score
    score, matched_skills = match_skills(resume_text, job_description)

    return jsonify({
        "score": score,
        "matched_skills": matched_skills,
        "sections": sections,
        "contact_info": contact_info,
        "date_format_valid": date_format_valid,
        "word_count": word_count,
        "job_title_match": job_title_match
    })

@app.route('/')
def index():
    return "<h2>Recruitix ATS Scanner Backend</h2>"

if __name__ == '__main__':
    app.run(port=5000, debug=True)

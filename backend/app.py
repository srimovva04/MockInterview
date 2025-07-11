# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# from resume_parser import extract_text_from_pdf
# from match_gemini import match_skills

# app = Flask(__name__)
# CORS(app,origins="http://localhost:5173")
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.route('/upload_resume', methods=['POST'])
# def upload_resume():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file uploaded'}), 400

#     file = request.files['file']
#     job_description = request.form.get('job_description')

#     filepath = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(filepath)

#     # Parse resume text
#     resume_text = extract_text_from_pdf(filepath)

#     # Match with Gemini
#     score, matched_skills = match_skills(resume_text, job_description)

#     return jsonify({
#         'resume_text': resume_text,
#         'score': score,
#         'matched_skills': matched_skills
#     })

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)


from flask import Flask, request, jsonify
import os
from resume_parser import extract_text_from_pdf
from match_gemini import match_skills
from werkzeug.utils import secure_filename 
import secrets
from flask_cors import CORS

app = Flask(__name__)
# 🔐 Secret key for sessions (required even if you don't use sessions yet)
app.secret_key = secrets.token_hex(16)

# 🔐 Secure session cookie settings
app.config.update(
    SESSION_COOKIE_SECURE=True,       # Only send cookies over HTTPS
    SESSION_COOKIE_HTTPONLY=True,     # JS can’t access cookies
    SESSION_COOKIE_SAMESITE='Lax'     # Avoid CSRF in most common cases
)

# CORS(app, supports_credentials=True, origins="*")
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    job_description = request.form.get('job_description', 'Software Developer')

    filename = secure_filename(file.filename)  # ✅ this sanitizes the name
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)
    # If no job description is passed from frontend, use a default for now
    if not job_description:
        job_description = "Looking for a frontend developer skilled in React, JavaScript, and UI/UX design."
    score, matched_skills = match_skills(resume_text, job_description)

    return jsonify({
        # 'resume_text': resume_text,
        'score': score,
        'matched_skills': matched_skills
    })

@app.route('/')
def index():
    return '''
    <h2>Welcome to the ATS Backend</h2>
    <p>This is the backend server. Use POST /upload_resume to upload resumes.</p>
    '''

if __name__ == '__main__':
    app.run(port=5000, debug=True)

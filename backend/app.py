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
from flask_cors import CORS
import os
from resume_parser import extract_text_from_pdf
from match_gemini import match_skills

app = Flask(__name__)
# CORS(app, origins="http://localhost:5174")  # ✅ Allow Vite
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    job_description = request.form.get('job_description', 'Software Developer')

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
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

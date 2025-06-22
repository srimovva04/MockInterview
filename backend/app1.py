from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import spacy
from rapidfuzz import fuzz

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

def extract_text(file_storage):
    filename = file_storage.filename.lower()
    if filename.endswith(".pdf"):
        with pdfplumber.open(file_storage) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    elif filename.endswith(".docx"):
        doc = docx.Document(file_storage)
        return "\n".join([para.text for para in doc.paragraphs])
    return ""

def extract_keywords(text):
    doc = nlp(text)
    return list(set(chunk.text.strip().lower() for chunk in doc.noun_chunks if len(chunk.text.strip()) > 1))

def compute_match_score(resume_keywords, jd_keywords):
    matched_keywords = []
    missing_keywords = []

    for keyword in jd_keywords:
        if any(fuzz.partial_ratio(keyword, rkw) > 85 for rkw in resume_keywords):
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)

    total = len(jd_keywords)
    score = round((len(matched_keywords) / total) * 100, 2) if total else 0
    return score, matched_keywords, missing_keywords

@app.route("/upload_resume", methods=["POST"])
def scan_resume():
    resume_file = request.files.get("file")
    job_description = request.form.get("job_description")

    if not resume_file or not job_description:
        return jsonify({"error": "Missing resume or job description"}), 400

    resume_text = extract_text(resume_file)
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    score, matched, missing = compute_match_score(resume_keywords, jd_keywords)

    return jsonify({
        "score": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "total_jd_keywords": len(jd_keywords),
        "total_resume_keywords": len(resume_keywords)
    })

if __name__ == "__main__":
    app.run(debug=True)

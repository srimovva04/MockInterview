import PyPDF2
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text()
    return text

def detect_sections(text):
    lower = text.lower()
    return {
        "has_summary": "summary" in lower,
        "has_experience": "experience" in lower,
        "has_education": "education" in lower,
    }

def extract_contact_info(text):
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"\b\d{10,13}\b", text)
    return {
        "has_email": bool(email_match),
        "has_phone": bool(phone_match),
    }

def check_date_format(text):
    # MM/YYYY or MM/YY or Month YYYY
    patterns = [r"\b(0[1-9]|1[0-2])/(\d{2}|\d{4})\b", r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b"]
    return any(re.search(p, text) for p in patterns)

import os
import shutil
import subprocess
import tempfile
from gemini_resume_builder_helper import refine_all_bullets
from textblob import TextBlob


def generate_latex(data):
    def itemize(items):
        return "\\begin{itemize}\n" + "\n".join(f"\\item {i}" for i in items) + "\n\\end{itemize}"

    experience_tex = ""
    for exp in data['experience']:
        experience_tex += f"""
\\begin{{cvsubsection}}{{{exp['title']}}}{{{exp['company']}}}{{{exp['dates']}}}
{itemize(exp.get('bullets', []))}
\\end{{cvsubsection}}"""

    education_tex = ""
    for edu in data['education']:
        education_tex += f"""
\\begin{{cvsubsection}}{{{edu['location']}}}{{{edu['institution']}}}{{{edu['dates']}}}
{itemize(edu.get('details', []))}
\\end{{cvsubsection}}"""

    projects_tex = ""
    for proj in data['projects']:
        projects_tex += f"""
\\begin{{cvsubsection}}{{{proj['name']}}}{{}}{{{proj['year']}}}
{itemize(proj.get('bullets', []))}
\\end{{cvsubsection}}"""

    technologies_tex = data['technologies']
    skills_tex = data['skills']

    template_path = os.path.join(os.path.dirname(__file__), "template.tex")
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    template = template.replace("<<NAME>>", data['personal']['name'])
    template = template.replace("<<ADDRESS>>", data['personal']['address'])
    template = template.replace("<<CITYZIP>>", data['personal']['city_state_zip'])
    template = template.replace("<<PHONE>>", data['personal']['phone'])
    template = template.replace("<<EMAIL>>", data['personal']['email'])
    template = template.replace("<<EXPERIENCE>>", experience_tex)
    template = template.replace("<<EDUCATION>>", education_tex)
    template = template.replace("<<PROJECTS>>", projects_tex)
    template = template.replace("<<TECHNOLOGIES>>", technologies_tex)
    template = template.replace("<<SKILLS>>", skills_tex)

    return template

def compile_latex_to_pdf(latex_str):
    with tempfile.TemporaryDirectory() as temp_dir:
        tex_file_path = os.path.join(temp_dir, "resume.tex")

        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(latex_str)

        current_dir = os.path.dirname(__file__)
        shutil.copy(os.path.join(current_dir, "mcdowellcv.cls"), temp_dir)

        try:
            result = subprocess.run(
                ['xelatex', '-interaction=nonstopmode', 'resume.tex'],
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=50
            )

            pdf_path = os.path.join(temp_dir, "resume.pdf")
            if os.path.exists(pdf_path):
                with open(pdf_path, "rb") as f:
                    return f.read()
        except Exception as e:
            print("[LaTeX ERROR]:", e)

        return None
    

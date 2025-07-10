"use client";

import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { PersonalInfoForm, EducationForm, EmploymentForm, ProjectsForm, SkillsForm } from "./forms.jsx";
import { useEffect } from "react";

const ResumeBuilder = () => {
  const location = useLocation();
  const parsed = location.state?.parsedData;
  const [tab, setTab] = useState("Personal");
  const [resumeData, setResumeData] = useState({
    personalInfo: {
  name: "",
  city: "",
  country: "",
  phone: "",
  email: "",
},
    education: {
      degree: "",
      gpa: "",
      school: "",
      location: "",
      duration: "",
      coursework: [],
    },
    employment: [],
    additionalExperience: [],
    projects: [],
    skills: {
      languages: [],
      tools: [],
    },
  });
useEffect(() => {
  if (parsed) {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...parsed.personalInfo },
      education: { ...prev.education, ...parsed.education },
      skills: { ...prev.skills, ...parsed.skills },
      employment: parsed.employment || [],
      projects: parsed.projects || [],
      additionalExperience: parsed.additionalExperience || [],
    }));
  }
}, [parsed]);
  const resumeRef = useRef();
  const tabs = ["Personal", "Education", "Work", "Projects", "Skills"];

  const handleDownloadPDF = () => {
    if (resumeRef.current) {
      html2pdf()
        .set({
          // margin: 0.5,
          filename: `${resumeData.personalInfo.name || 'resume'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .from(resumeRef.current)
        .save();
    }
  };

  // Add this handler inside ResumeBuilder component
  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('resume', file);

  try {
    const res = await fetch('http://localhost:5000/api/parse-resume', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to parse resume');
    const parsed = await res.json();

    // Merge safely with defaults
    setResumeData((prev) => ({
  ...prev,
  personalInfo: { ...prev.personalInfo, ...parsed.personalInfo },
  education: { ...prev.education, ...parsed.education },
  skills: { ...prev.skills, ...parsed.skills },
  employment: parsed.employment || [],
  projects: parsed.projects || [],
  additionalExperience: parsed.additionalExperience || [],
}));

  } catch (err) {
    alert('Resume parsing failed.');
  }
};

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-[#f9fafb] min-h-screen">
      <div className="lg:w-1/2 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Resume Builder</h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Download PDF
          </button>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm p-1">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === t
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[#4b5563] hover:text-[#1f2937] hover:bg-[#f3f4f6]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {tab === "Personal" && (
            <PersonalInfoForm
              data={resumeData.personalInfo}
              onChange={(d) =>
                setResumeData((prev) => ({ ...prev, personalInfo: d }))
              }
            />
          )}
          {tab === "Education" && (
            <EducationForm
              data={resumeData.education}
              onChange={(d) =>
                setResumeData((prev) => ({ ...prev, education: d }))
              }
            />
          )}
          {tab === "Work" && (
            <EmploymentForm
              data={resumeData.employment}
              additionalExperience={resumeData.additionalExperience}
              onChange={(d) =>
                setResumeData((prev) => ({ ...prev, employment: d }))
              }
              onAdditionalExperienceChange={(d) =>
                setResumeData((prev) => ({
                  ...prev,
                  additionalExperience: d,
                }))
              }
            />
          )}
          {tab === "Projects" && (
            <ProjectsForm
              data={resumeData.projects}
              onChange={(d) =>
                setResumeData((prev) => ({ ...prev, projects: d }))
              }
            />
          )}
          {tab === "Skills" && (
            <SkillsForm
              data={resumeData.skills}
              onChange={(d) =>
                setResumeData((prev) => ({ ...prev, skills: d }))
              }
            />
          )}
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="bg-white rounded-lg shadow-sm p-2">
          <div
            ref={resumeRef}
            className="bg-white text-black p-4 border border-[#e5e7eb] rounded-lg text-sm font-serif leading-tight max-w-full mx-auto"
            style={{ minHeight: '11in', width: '8.5in', maxWidth: '100%' }}
          >
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
                {resumeData.personalInfo.name || "Your Name"}
              </h1>
              <div className="text-xs mt-1 text-[#374151]">
                {(resumeData.personalInfo.city || resumeData.personalInfo.country) && (
  <p>
    {[resumeData.personalInfo.city, resumeData.personalInfo.country].filter(Boolean).join(", ")}
  </p>
)}

                {(resumeData.personalInfo.phone || resumeData.personalInfo.email) && (
                  <p>
                    {resumeData.personalInfo.phone}
                    {resumeData.personalInfo.email &&
                      ` | ${resumeData.personalInfo.email}`}
                  </p>
                )}
              </div>
            </div>

            {/* Other sections (Employment, Education, etc.) remain unchanged but should also use safe hex values if styled */}

            {/* Employment Section */}
            {resumeData.employment.length > 0 && (
              <Section title="Employment">
                {resumeData.employment.map((emp) => (
                  <div key={emp.id} className="mb-3">
                    <div className="flex justify-between font-bold text-[#374151]">
                      <span>{emp.title}{emp.company && `, ${emp.company}`}</span>
                      <span>{emp.duration}</span>
                    </div>
                    {emp.bullets.filter(b => b.trim()).length > 0 && (
                      <ul className="list-disc ml-5 mt-1">
                        {emp.bullets.filter(b => b.trim()).map((b, i) => (
                          <li key={i} className="text-[#374151]">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {/* Education Section */}
            {(resumeData.education.school || resumeData.education.degree) && (
              <Section title="Education">
                <div className="flex justify-between font-bold text-[#374151]">
                  <span>{resumeData.education.school || "University Name"}</span>
                  <span>{resumeData.education.duration}</span>
                </div>
                {resumeData.education.degree && (
                  <p className="text-[#374151]">
                    {resumeData.education.degree}
                    {resumeData.education.gpa && ` | GPA: ${resumeData.education.gpa}`}
                  </p>
                )}
                {resumeData.education.location && (
                  <p className="italic text-[#374151]">{resumeData.education.location}</p>
                )}
                {resumeData.education.coursework.length > 0 && (
                  <div className="mt-1">
                    <span className="font-medium">Relevant Coursework: </span>
                    <span className="text-[#374151]">{resumeData.education.coursework.join(", ")}</span>
                  </div>
                )}
              </Section>
            )}

            {/* Projects Section */}
            {resumeData.projects.length > 0 && (
              <Section title="Technical Experience">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="mb-3">
                    <div className="flex justify-between font-semibold text-[#374151]">
                      <span>{proj.name}</span>
                      <span>{proj.duration}</span>
                    </div>
                    {proj.description && (
                      <p className="italic text-[#374151] mt-1">{proj.description}</p>
                    )}
                    {proj.bullets.filter(b => b.trim()).length > 0 && (
                      <ul className="list-disc ml-5 mt-1">
                        {proj.bullets.filter(b => b.trim()).map((b, i) => (
                          <li key={i} className="text-[#374151]">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {/* Additional Experience Section */}
            {resumeData.additionalExperience.filter(exp => exp.trim()).length > 0 && (
              <Section title="Additional Experience & Awards">
                {resumeData.additionalExperience.filter(exp => exp.trim()).map((exp, i) => (
                  <p key={i} className="text-[#374151] mb-1">• {exp}</p>
                ))}
              </Section>
            )}

            {/* Skills Section */}
            {(resumeData.skills.languages.length > 0 || resumeData.skills.tools.length > 0) && (
              <Section title="Languages and Technologies">
                {resumeData.skills.languages.length > 0 && (
                  <p className="text-[#374151] mb-1">
                    <strong>Languages:</strong> {resumeData.skills.languages.join(", ")}
                  </p>
                )}
                {resumeData.skills.tools.length > 0 && (
                  <p className="text-[#374151]">
                    <strong>Tools & Technologies:</strong> {resumeData.skills.tools.join(", ")}
                  </p>
                )}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Section Helper Component
const Section = ({ title, children }) => (
  <div className="mb-3">
    <h3 className="text-md font-bold uppercase tracking-wide border-b border-[#374151] pb-1 mb-1 text-[#374151]">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

export default ResumeBuilder;



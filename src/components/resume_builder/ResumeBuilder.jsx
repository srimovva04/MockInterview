"use client";

import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { PersonalInfoForm, EducationForm, EmploymentForm, ProjectsForm, SkillsForm } from "./forms.jsx";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ClassicTemplate,ResumePreview } from "./Template.jsx";

const templates = {
  classic: {
    name: "Classic",
    description: "Traditional layout",
    component: ClassicTemplate
  },
  preview: {
    name: "Modern",
    description: "Modern layout",
    component: ResumePreview
  },

};

const ResumeBuilder = () => {
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  
  // const [template, setTemplate] = useState("classic"); // NEW
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
    education: [],
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
  education: normalizeArray(parsed.education, {
    degree: "", gpa: "", school: "", location: "", duration: "", coursework: [],
  }).map(e => ({ ...e, coursework: Array.isArray(e.coursework) ? e.coursework : [] })),
  employment: normalizeArray(parsed.employment, {
    title: "", company: "", duration: "", bullets: [""],
  }).map(e => ({ ...e, bullets: Array.isArray(e.bullets) ? e.bullets : [""] })),
  projects: normalizeArray(parsed.projects, {
    name: "", duration: "", description: "", bullets: [""],
  }).map(p => ({ ...p, bullets: Array.isArray(p.bullets) ? p.bullets : [""] })),
  skills: {
    languages: Array.isArray(parsed.skills?.languages) ? parsed.skills.languages : [],
    tools: Array.isArray(parsed.skills?.tools) ? parsed.skills.tools : [],
  },
  additionalExperience: Array.isArray(parsed.additionalExperience)
    ? parsed.additionalExperience
    : [],
}));

  }
}, [parsed]);
  const resumeRef = useRef();
  const tabs = ["Personal", "Education", "Work", "Projects", "Skills"];


  const handleDownloadViaPuppeteer = async () => {
  if (!resumeRef.current) return;

  const resumeHtml = resumeRef.current.innerHTML; // Use only inner content

  const response = await fetch("http://localhost:4000/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resumeHtml,
      fileName: resumeData.personalInfo.name || "resume",
    }),
  });

  if (!response.ok) {
    alert("PDF generation failed.");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${resumeData.personalInfo.name || "resume"}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
};


  const normalizeArray = (arr, fallback = {}) =>
  Array.isArray(arr)
    ? arr.map((entry) => ({
        ...fallback,
        ...entry,
        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      }))
    : [];


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
      education: Array.isArray(parsed.education) ? parsed.education : [],
      skills: { ...prev.skills, ...parsed.skills },
      employment: parsed.employment || [],
      projects: parsed.projects || [],
      additionalExperience: parsed.additionalExperience || [],
    }));

  } catch (err) {
    alert('Resume parsing failed.');
  }
};


  const TemplateComponent = templates[selectedTemplate].component;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-[#f9fafb] min-h-screen">
      <div className="lg:w-1/2 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Resume Builder</h2>
          
          <button
      onClick={handleDownloadViaPuppeteer}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Download PDF
    </button>
        </div>
                  {/* Template Selector */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Choose Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-3 rounded-md border text-sm transition-colors ${
                    selectedTemplate === key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]"
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs opacity-75 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
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

      
      {/* Resume Preview */}
      <div>
        <div className="">
          <div className="mb-4 flex justify-between items-center px-2">
            <h3 className="text-sm font-medium text-[#6b7280]">Preview</h3>
            <div className="text-xs text-[#6b7280]">
              Template: {templates[selectedTemplate].name}
            </div>
          </div>
          
          <div ref={resumeRef}>
            <TemplateComponent resumeData={resumeData} />
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



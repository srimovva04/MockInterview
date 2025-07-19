import React from 'react';

export const ClassicTemplate = ({ resumeData }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg text-sm font-serif leading-tight max-w-full mx-auto"
         style={{ minHeight: '11in', width: '8.5in', maxWidth: '100%' }}>
      {/* Header */}
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
              {resumeData.personalInfo.email && ` | ${resumeData.personalInfo.email}`}
            </p>
          )}
        </div>
      </div>

      {/* Employment Section */}
      {resumeData.employment?.length > 0 && (
        <Section title="Employment">
          {resumeData.employment.map((emp) => (
            <div key={emp.id} className="mb-3">
              <div className="flex justify-between font-bold text-[#374151]">
                <span>{emp.title}{emp.company && `, ${emp.company}`}</span>
                <span>{emp.duration}</span>
              </div>
              {emp.bullets?.filter(b => b.trim()).length > 0 && (
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
      {resumeData.education?.length > 0 && (
        <Section title="Education">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between font-bold text-[#374151]">
                <span>{edu.school || "University Name"}</span>
                <span>{edu.duration}</span>
              </div>
              {edu.degree && (
                <p className="text-[#374151]">
                  {edu.degree}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
              )}
              {edu.location && (
                <p className="italic text-[#374151]">{edu.location}</p>
              )}
              {edu.coursework?.length > 0 && (
                <div className="mt-1">
                  <span className="font-medium">Relevant Coursework: </span>
                  <span className="text-[#374151]">{edu.coursework.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Projects Section */}
      {resumeData.projects?.length > 0 && (
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
              {proj.bullets?.filter(b => b.trim()).length > 0 && (
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
      {resumeData.additionalExperience?.filter(exp => exp.trim()).length > 0 && (
        <Section title="Additional Experience & Awards">
          {resumeData.additionalExperience.filter(exp => exp.trim()).map((exp, i) => (
            <p key={i} className="text-[#374151] mb-1">• {exp}</p>
          ))}
        </Section>
      )}

      {/* Skills Section */}
      {(resumeData.skills?.languages?.length > 0 || resumeData.skills?.tools?.length > 0) && (
        <Section title="Languages and Technologies">
          {resumeData.skills.languages?.length > 0 && (
            <p className="text-[#374151] mb-1">
              <strong>Languages:</strong> {resumeData.skills.languages.join(", ")}
            </p>
          )}
          {resumeData.skills.tools?.length > 0 && (
            <p className="text-[#374151]">
              <strong>Tools & Technologies:</strong> {resumeData.skills.tools.join(", ")}
            </p>
          )}
        </Section>
      )}
    </div>
  );
};

export const ResumePreview = ({ resumeData }) => {
  return (
    <div 
      className="bg-white text-[#374151] p-4  rounded-lg text-sm font-sans leading-relaxed max-w-full mx-auto"
      style={{ 
        minHeight: '11in',
        width: '8.5in',
        maxWidth: '100%',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.4'
      }}
    >
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {resumeData.personalInfo.name || 'First Last'}
        </h1>
      
        <div className="text-sm">
          {[resumeData.personalInfo.city, resumeData.personalInfo.country].filter(Boolean).join(", ")}
          {resumeData.personalInfo.phone && ` • ${resumeData.personalInfo.phone}`}
          {resumeData.personalInfo.email && ` • ${resumeData.personalInfo.email}`}
        </div>
      </div>

      {/* Work Experience */}
      {resumeData.employment.length > 0 && (
        <Section title="Work Experience">
          {resumeData.employment.map((job, index) => (
            <div key={job.id || index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold">{job.title}</h4>
                <span className="text-sm">{job.duration}</span>
              </div>
              <div className="text-sm italic">{job.company}</div>
              {job.bullets?.filter(b => b.trim()).length > 0 && (
                <ul className="list-disc ml-5 mt-1">
                  {job.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <Section title="Education">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between font-bold text-[#374151]">
                <span>{edu.school || "University Name"}</span>
                <span>{edu.duration}</span>
              </div>
              {edu.degree && (
                <p className="text-[#374151]">
                  {edu.degree}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
              )}
              {edu.location && (
                <p className="italic text-[#374151]">{edu.location}</p>
              )}
              {edu.coursework?.length > 0 && (
                <div className="mt-1">
                  <span className="font-medium">Relevant Coursework: </span>
                  <span className="text-[#374151]">{edu.coursework.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
        </Section>
      )}
      
      {/* Technical Experience / Projects */}
      {resumeData.projects.length > 0 && (
        <Section title="Technical Experience">
          {resumeData.projects.map((project, index) => (
            <div key={project.id || index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold">{project.name}</h4>
                <span className="text-sm">{project.duration}</span>
              </div>
              {project.description && (
                <p className="italic">{project.description}</p>
              )}
              {project.bullets?.filter(b => b.trim()).length > 0 && (
                <ul className="list-disc ml-5 mt-1">
                  {project.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Additional Experience */}
      {resumeData.additionalExperience.filter(exp => exp.trim()).length > 0 && (
        <Section title="Additional Experience & Awards">
          {resumeData.additionalExperience.filter(exp => exp.trim()).map((exp, i) => (
            <p key={i} className="mb-1">• {exp}</p>
          ))}
        </Section>
      )}

      {/* Skills */}
      {(resumeData.skills.languages.length > 0 || resumeData.skills.tools.length > 0) && (
        <Section title="Skills & Technologies">
          {resumeData.skills.languages.length > 0 && (
            <p className="mb-1">
              <strong>Languages:</strong> {resumeData.skills.languages.join(", ")}
            </p>
          )}
          {resumeData.skills.tools.length > 0 && (
            <p>
              <strong>Tools & Frameworks:</strong> {resumeData.skills.tools.join(", ")}
            </p>
          )}
        </Section>
      )}
    </div>
  );
};




const Section = ({ title, children }) => (
  <div className="mb-4 text-[#374151]">
    <h3 className="text-sm font-bold uppercase tracking-wide border-b border-[#374151] pb-1 mb-2">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);


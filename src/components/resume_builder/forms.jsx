import { Plus, Trash2 } from 'lucide-react';

export const PersonalInfoForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#374151]-700 mb-1">Full Name</label>
        <input
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">City</label>
        <input
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Mumbai"
        />
      </div>

<div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Country</label>
        <input
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.country}
          onChange={(e) => handleChange('country', e.target.value)}
          placeholder="India"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Phone Number</label>
        <input
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(555) 555-1212"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Email Address</label>
        <input
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>
    </div>
  );
};

export const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    const newEntry = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      degree: "",
      gpa: "",
      school: "",
      location: "",
      duration: "",
      coursework: [],
    };
    onChange([...data, newEntry]);
  };

  const removeEducation = (id) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id, field, value) => {
    const updated = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  const updateCoursework = (id, value) => {
    const list = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    updateEducation(id, "coursework", list);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#374151]">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add School
        </button>
      </div>

      {data.map((edu) => (
        <div key={edu.id} className="border border-[#374151] p-4 rounded-lg bg-white space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-[#374151]">School Details</h4>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
            />
            <input
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GPA"
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
            />
          </div>

          <input
            className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="School Name"
            value={edu.school}
            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Location"
              value={edu.location}
              onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
            />
            <input
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Duration (e.g., 2020 - 2024)"
              value={edu.duration}
              onChange={(e) => updateEducation(edu.id, "duration", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Coursework (one per line)
            </label>
            <textarea
              rows={3}
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Data Structures&#10;Algorithms&#10;Database Systems"
              value={edu.coursework.join("\n")}
              onChange={(e) => updateCoursework(edu.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkillsForm = ({ data, onChange }) => {
  const handleListChange = (field, value) => {
    const list = value.split(',').map(item => item.trim()).filter(item => item !== '');
    onChange({ ...data, [field]: list });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Languages (comma separated)</label>
        <textarea
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.languages.join(', ')}
          onChange={(e) => handleListChange('languages', e.target.value)}
          rows={3}
          placeholder="JavaScript, Python, Java, C++"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Tools/Technologies (comma separated)</label>
        <textarea
          className="w-full p-3 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={data.tools.join(', ')}
          onChange={(e) => handleListChange('tools', e.target.value)}
          rows={3}
          placeholder="React, Node.js, Git, Docker, AWS"
        />
      </div>
    </div>
  );
};

export const EmploymentForm = ({ data, onChange, additionalExperience, onAdditionalExperienceChange }) => {
  const addEmployment = () => {
    const newEmployment = { id: Date.now().toString(), title: '', company: '', duration: '', bullets: [''] };
    onChange([...data, newEmployment]);
  };

  const removeEmployment = (id) => onChange(data.filter((emp) => emp.id !== id));

  const updateEmployment = (id, field, value) => onChange(data.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));

  const updateBullets = (id, bullets) => updateEmployment(id, 'bullets', bullets);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#374151]">Employment History</h3>
        <button 
          onClick={addEmployment} 
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Position
        </button>
      </div>

      {data.map((emp) => (
        <div key={emp.id} className="border border-[#374151] p-4 rounded-lg bg-white space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-[#374151]">Position Details</h4>
            <button 
              onClick={() => removeEmployment(emp.id)} 
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Job Title" 
              value={emp.title} 
              onChange={(e) => updateEmployment(emp.id, 'title', e.target.value)} 
            />
            <input 
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Company" 
              value={emp.company} 
              onChange={(e) => updateEmployment(emp.id, 'company', e.target.value)} 
            />
          </div>
          
          <input 
            className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Duration (e.g., Jan 2023 - Present)" 
            value={emp.duration} 
            onChange={(e) => updateEmployment(emp.id, 'duration', e.target.value)} 
          />

          <div>
            <h5 className="font-medium text-[#374151] mb-2">Achievements/Responsibilities</h5>
            {emp.bullets.map((b, i) => (
              <div key={i} className="flex items-start space-x-2 mb-2">
                <textarea 
                  className="flex-1 p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={b} 
                  onChange={(e) => {
                    const updated = [...emp.bullets]; 
                    updated[i] = e.target.value; 
                    updateBullets(emp.id, updated);
                  }} 
                  rows={2}
                  placeholder="Describe your achievement or responsibility..."
                />
                <button 
                  onClick={() => updateBullets(emp.id, emp.bullets.filter((_, j) => j !== i))}
                  className="text-red-600 hover:text-red-800 transition-colors mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => updateBullets(emp.id, [...emp.bullets, ''])} 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              + Add bullet point
            </button>
          </div>
        </div>
      ))}

      <div className="mt-8 border-t border-[#374151] pt-6">
        <h3 className="text-lg font-semibold text-[#374151] mb-4">Additional Experience & Awards</h3>
        {additionalExperience.map((exp, i) => (
          <div key={i} className="flex items-start gap-2 mb-3">
            <textarea
              className="flex-1 p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              value={exp}
              onChange={(e) => {
                const updated = [...additionalExperience]; 
                updated[i] = e.target.value; 
                onAdditionalExperienceChange(updated);
              }}
              placeholder="Additional experience, award, or achievement..."
            />
            <button 
              onClick={() => onAdditionalExperienceChange(additionalExperience.filter((_, j) => j !== i))}
              className="text-red-600 hover:text-red-800 transition-colors mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button 
          onClick={() => onAdditionalExperienceChange([...additionalExperience, ''])} 
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          + Add Experience
        </button>
      </div>
    </div>
  );
};

export const ProjectsForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = { id: Date.now().toString(), name: '', duration: '', description: '', bullets: [''] };
    onChange([...data, newProject]);
  };

  const removeProject = (id) => onChange(data.filter((p) => p.id !== id));

  const updateProject = (id, field, value) => onChange(data.map(p => p.id === id ? { ...p, [field]: value } : p));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#374151]">Projects</h3>
        <button 
          onClick={addProject} 
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </button>
      </div>

      {data.map((proj) => (
        <div key={proj.id} className="border border-[#374151] p-4 rounded-lg bg-white space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-[#374151]">Project Details</h4>
            <button 
              onClick={() => removeProject(proj.id)} 
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Project Name" 
              value={proj.name} 
              onChange={(e) => updateProject(proj.id, 'name', e.target.value)} 
            />
            <input 
              className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Duration" 
              value={proj.duration} 
              onChange={(e) => updateProject(proj.id, 'duration', e.target.value)} 
            />
          </div>
          
          <textarea 
            className="w-full p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Brief project description" 
            rows={2} 
            value={proj.description} 
            onChange={(e) => updateProject(proj.id, 'description', e.target.value)} 
          />

          <div>
            <h5 className="font-medium text-[#374151] mb-2">Technologies/Key Features</h5>
            {proj.bullets.map((b, i) => (
              <div key={i} className="flex items-start space-x-2 mb-2">
                <textarea 
                  className="flex-1 p-2 border border-[#374151] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={b} 
                  onChange={(e) => {
                    const updated = [...proj.bullets]; 
                    updated[i] = e.target.value; 
                    updateProject(proj.id, 'bullets', updated);
                  }} 
                  rows={2}
                  placeholder="Technology used or key feature implemented..."
                />
                <button 
                  onClick={() => updateProject(proj.id, 'bullets', proj.bullets.filter((_, j) => j !== i))}
                  className="text-red-600 hover:text-red-800 transition-colors mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => updateProject(proj.id, 'bullets', [...proj.bullets, ''])} 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              + Add bullet point
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
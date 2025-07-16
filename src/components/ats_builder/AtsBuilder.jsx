import React, { useState } from "react";
import axios from "axios";

const ResumeForm = () => {
  const [resumeType, setResumeType] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  const [formData, setFormData] = useState({
    personal: {
      name: "",
      address: "",
      city_state_zip: "",
      phone: "",
      email: "",
      about: "",
    },
    experience: [{ title: "", company: "", dates: "", bullets: [""] }],
    education: [{ location: "", institution: "", dates: "", details: [""] }],
    projects: [{ name: "", year: "", bullets: [""] }],
    technologies: "",
    skills: "",
  });

  // const addProject = () => {
  //   if (formData.projects.length >= 4) {
  //     window.alert("You can only add a maximum of 4 projects.");
  //     return;
  //   }
  //   setFormData({
  //     ...formData,
  //     projects: [...formData.projects, { name: "", year: "", bullets: [""] }],
  //   });
  // };

  const addProject = () => {
    if (resumeType === "one" && formData.projects.length >= 4) {
    alert("You can only add up to 4 projects for a one-page resume.");
    return;
  }
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", year: "", bullets: [""] }],
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { title: "", company: "", dates: "", bullets: [""] },
      ],
    });
  };

  const addEducation = () => {
    if (resumeType === "one" && formData.education.length >= 2) {
      alert(
        "You can only add up to 2 education entries for a one-page resume."
      );
      return;
    }
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { location: "", institution: "", dates: "", details: [""] },
      ],
    });
  };
  // const addEducation = () => {
  //   if (formData.education.length >= 2) {
  //     window.alert("You can only add 2 education entries.");
  //     return;
  //   }
  //   setFormData({
  //     ...formData,
  //     education: [
  //       ...formData.education,
  //       { location: "", institution: "", dates: "", details: [""] },
  //     ],
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/compile", { ...formData, resumeType }, {
        responseType: "blob",
        // withCredentials: true,
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "resume.pdf");
        document.body.appendChild(link);
        link.click();
      });
  };

  if (showPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Choose Resume Type</h2>
          <p className="text-gray-600">Do you want to generate a one-page or two-page resume?</p>
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => {
                setResumeType("one");
                setShowPopup(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              One Page
            </button>
            <button
              onClick={() => {
                setResumeType("two");
                setShowPopup(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Two Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-4xl mx-auto p-6 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-gray-800">Personal Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-3 border border-gray-300 rounded-md"
          placeholder="Full Name"
          onChange={(e) =>
            setFormData({
              ...formData,
              personal: { ...formData.personal, name: e.target.value },
            })
          }
        />
        <input
          className="p-3 border border-gray-300 rounded-md"
          placeholder="Email"
          onChange={(e) =>
            setFormData({
              ...formData,
              personal: { ...formData.personal, email: e.target.value },
            })
          }
        />
        <input
          className="p-3 border border-gray-300 rounded-md"
          placeholder="Phone"
          onChange={(e) =>
            setFormData({
              ...formData,
              personal: { ...formData.personal, phone: e.target.value },
            })
          }
        />
        <input
          className="p-3 border border-gray-300 rounded-md"
          placeholder="Address"
          onChange={(e) =>
            setFormData({
              ...formData,
              personal: { ...formData.personal, address: e.target.value },
            })
          }
        />
        <input
          className="p-3 border border-gray-300 rounded-md"
          placeholder="City, State"
          onChange={(e) =>
            setFormData({
              ...formData,
              personal: {
                ...formData.personal,
                city_state_zip: e.target.value,
              },
            })
          }
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800">Technologies</h2>
      <input
        className="w-full p-3 border border-gray-300 rounded-md"
        placeholder="Technologies"
        onChange={(e) =>
          setFormData({
            ...formData,
            technologies: e.target.value,
          })
        }
      />

      <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
      <input
        className="w-full p-3 border border-gray-300 rounded-md"
        placeholder="e.g. Problem Solving, Time Management"
        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
      />

      <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
      {formData.experience.map((exp, idx) => (
        <div
          key={idx}
          className="space-y-3 border border-gray-300 p-4 rounded-md"
        >
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Title"
            onChange={(e) => {
              const updated = [...formData.experience];
              updated[idx].title = e.target.value;
              setFormData({ ...formData, experience: updated });
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Company"
            onChange={(e) => {
              const updated = [...formData.experience];
              updated[idx].company = e.target.value;
              setFormData({ ...formData, experience: updated });
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Dates"
            onChange={(e) => {
              const updated = [...formData.experience];
              updated[idx].dates = e.target.value;
              setFormData({ ...formData, experience: updated });
            }}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="What you did/what you learn"
            onChange={(e) => {
              const updated = [...formData.experience];
              updated[idx].bullets = e.target.value
                .split(",")
                .map((b) => b.trim());
              setFormData({ ...formData, experience: updated });
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-blue-600 hover:underline"
        onClick={addExperience}
      >
        + Add Experience
      </button>

      <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
      {formData.education.map((edu, idx) => (
        <div
          key={idx}
          className="space-y-3 border border-gray-300 p-4 rounded-md"
        >
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Institution"
            onChange={(e) => {
              const updated = [...formData.education];
              updated[idx].institution = e.target.value;
              setFormData({ ...formData, education: updated });
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Location"
            onChange={(e) => {
              const updated = [...formData.education];
              updated[idx].location = e.target.value;
              setFormData({ ...formData, education: updated });
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Dates"
            onChange={(e) => {
              const updated = [...formData.education];
              updated[idx].dates = e.target.value;
              setFormData({ ...formData, education: updated });
            }}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Details- borad/percentage"
            onChange={(e) => {
              const updated = [...formData.education];
              updated[idx].details = e.target.value
                .split(",")
                .map((d) => d.trim());
              setFormData({ ...formData, education: updated });
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-blue-600 hover:underline"
        onClick={addEducation}
      >
        + Add Education
      </button>

      <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
      {formData.projects.map((proj, idx) => (
        <div
          key={idx}
          className="space-y-3 border border-gray-300 p-4 rounded-md"
        >
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Project Name"
            onChange={(e) => {
              const updated = [...formData.projects];
              updated[idx].name = e.target.value;
              setFormData({ ...formData, projects: updated });
            }}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Year"
            onChange={(e) => {
              const updated = [...formData.projects];
              updated[idx].year = e.target.value;
              setFormData({ ...formData, projects: updated });
            }}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Brief about project"
            onChange={(e) => {
              const updated = [...formData.projects];
              updated[idx].bullets = e.target.value
                .split(",")
                .map((p) => p.trim());
              setFormData({ ...formData, projects: updated });
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-blue-600 hover:underline"
        onClick={addProject}
      >
        + Add Project
      </button>
      <div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Resume
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;

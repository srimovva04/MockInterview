import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, UploadCloud, Loader2 } from "lucide-react";
import Sidebar from "../Sidebar";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Parsing failed");
      const parsed = await res.json();
      navigate("/resume", { state: { parsedData: parsed } });
    } catch (err) {
      alert("Resume parsing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-screen-md w-full space-y-8 text-center">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Resume Builder</h1>
        <p className="text-gray-500">Choose an option to get started</p>
      </div>

      {loading ? (
        <div className="flex items-center text-blue-600 space-x-2">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Parsing your resume...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => navigate("/resume")}
            className="cursor-pointer border border-gray-300 bg-white p-6 rounded-xl hover:shadow-xl hover:border-blue-500 transition group"
          >
            <FilePlus className="mx-auto h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Start from Scratch</h2>
            <p className="text-gray-500 text-sm mt-1">
              Build your resume step-by-step with our guided editor
            </p>
          </div>

          {/* Card 2 */}
          <label className="cursor-pointer border border-gray-300 bg-white p-6 rounded-xl hover:shadow-xl hover:border-blue-500 transition group">
            <UploadCloud className="mx-auto h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Upload Resume</h2>
            <p className="text-gray-500 text-sm mt-1">
              Let us extract your details from a PDF or DOCX resume
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6">
        Your data is processed locally and never stored.
      </p>
        </div>
      </div>
    </div>

  );
};

export default LandingPage;

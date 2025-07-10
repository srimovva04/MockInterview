import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        body: formData
      });

      if (!res.ok) throw new Error("Parsing failed");
      const parsed = await res.json();

      navigate("/resume", { state: { parsedData: parsed } });
    } catch (err) {
      alert("Resume parsing failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Resume Builder</h1>

      {loading ? (
        <p className="text-blue-600 text-lg">🔍 Parsing your resume... Please wait.</p>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate("/resume")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Generate New Resume
          </button>

          <label className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Upload Existing Resume
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleResumeUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

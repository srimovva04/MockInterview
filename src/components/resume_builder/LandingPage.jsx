import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, UploadCloud, Loader2 } from "lucide-react";
import Sidebar from "../Sidebar";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const isValidType = allowedTypes.some(ext => file.name && file.name.toLowerCase().endsWith(ext));
    if (!isValidType || file.size > 5 * 1024 * 1024) {
      alert("Only PDF, DOCX or DOC files under 5MB are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/parse-resume`, {
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
  <LoadingAnimation />
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

const LoadingAnimation = () => {
  const steps = [
    "Uploading your resume...",
    "Parsing content intelligently...",
    "Extracting contact details...",
    "Identifying your education...",
    "Analyzing your work experience...",
    "Highlighting your top skills...",
    "Structuring everything beautifully...",
    "Almost done. Hang tight..."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 5000); // show each step every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  const percentage = ((index + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center space-y-6">
      <CircularProgress progress={percentage} />
      <p className="text-blue-700 text-lg font-medium transition-opacity duration-1000 ease-in-out">
        {steps[index]}
      </p>
    </div>
  );
};

const CircularProgress = ({ progress }) => {
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3B82F6"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fill="#1E3A8A"
        className="font-semibold"
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

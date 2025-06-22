import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ScanResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.score || !state.matched_skills) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
        <p className="text-xl text-red-600 font-semibold mb-4">
          ❌ Scan data not available or incomplete.
        </p>
        <button
          onClick={() => navigate("/ats-scanner")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back to Scanner
        </button>
      </div>
    );
  }

  const { score, matched_skills } = state;

  return (
    <div className="max-w-3xl mx-auto p-8 mt-12 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">
          ATS Scan Results
        </h1>
      </div>

      <div className="text-center">
        <p className="text-xl text-gray-700 mb-6">
          ✅ Your resume has been analyzed successfully.
        </p>

        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Match Score
          </h2>
          <p className="text-4xl font-bold text-blue-700">{score}%</p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Matched Skills
          </h2>
          <p className="text-gray-700 text-lg">{matched_skills}</p>
        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate("/ats-scanner")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            🔁 Scan Another Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;

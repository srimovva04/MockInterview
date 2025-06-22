import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const ScanResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg text-gray-600">No scan data found. Please upload a resume first.</p>
        <button
          onClick={() => navigate("/ats-scanner")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    score,
    matched_skills,
    contact_info,
    sections,
    word_count,
    job_title_match,
    date_format_valid,
  } = state;

  const renderStatus = (status) =>
    status ? (
      <CheckCircle className="w-5 h-5 text-green-600 inline" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600 inline" />
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Scan Results
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold">Score:</p>
          <p className="text-2xl text-green-600 font-bold">{score}%</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Matched Skills:</p>
          <p className="text-gray-700">{matched_skills}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Resume Word Count:</p>
          <p className="text-gray-700">{word_count}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Job Title Match ("Intern"):</p>
          <p>{renderStatus(job_title_match)}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Valid Date Format:</p>
          <p>{renderStatus(date_format_valid)}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Contact Info:</p>
          <ul className="ml-4">
            <li>Email: {renderStatus(contact_info.has_email)}</li>
            <li>Phone: {renderStatus(contact_info.has_phone)}</li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-semibold">Detected Sections:</p>
          <ul className="ml-4">
            <li>Summary: {renderStatus(sections.has_summary)}</li>
            <li>Experience: {renderStatus(sections.has_experience)}</li>
            <li>Education: {renderStatus(sections.has_education)}</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/ats-checker")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Scan Another Resume
        </button>
      </div>
    </div>
  );
};

export default ScanResults;

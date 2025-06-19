import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { uploadResume } from "../utils/uploadResume";
import JobReadinessGoalSelector from "./JobReadinessGoalSelector";

const JobReadinessAssessmentForm = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [fileError, setFileError] = useState("");
  const [form, setForm] = useState({
    position: "",
    roleLevel: "",
    company: "",
    jobDescription: "",
    companyDetails: "",
  });
  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [showGoalSelector, setShowGoalSelector] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && showGoalSelector === false && selectedGoal) {
      setStep(3); // Ensure step remains at 3 when a goal is selected
    } else if (open && showGoalSelector === false && !selectedGoal) {
      setStep(1);
      setErrors({});
      setForm({
        position: "",
        roleLevel: "",
        company: "",
        jobDescription: "",
        companyDetails: "",
      });
      setResumeFile(null);
    }
  }, [open, showGoalSelector, selectedGoal]);

  const handleFileUpload = async () => {
    console.log("Upload button clicked"); // ✅ DEBUG LINE

    if (!resumeFile) return alert("Please select a file before uploading.");

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return alert("User not authenticated.");
      const filePath = await uploadResume(resumeFile, user.id);
      const role_level_id = await getOrCreate("role_levels", form.roleLevel);
      const company_id = await getOrCreate("companies", form.company);

      const { error: insertError } = await supabase
        .from("job_readiness_assessments")
        .insert({
          user_id: user.id,
          position: form.position,
          role_level_id,
          company_id,
          job_description: form.jobDescription,
          company_details: form.companyDetails,
          resume_url: filePath,
        });

      if (insertError) {
        console.error(insertError);
        return alert("Error saving data");
      }

      alert("Data saved successfully!");
      setStep(3);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Unexpected error occurred");
    }
  };

  const handleResumeSelection = (file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      setFileError("File size should not exceed 5 MB.");
      setResumeFile(null);
    } else {
      setFileError("");
      setResumeFile(file);
    }
  };

  const getOrCreate = async (table, name) => {
    if (!name || name.trim() === "") {
      console.error(`[getOrCreate] Empty name passed for table: ${table}`);
      return null;
    }

    console.log(`[getOrCreate] Looking up '${name}' in ${table}`);

    const { data: existing, error: selectError } = await supabase
      .from(table)
      .select("id")
      .eq("name", name)
      .maybeSingle(); // ✅ instead of .single()

    if (selectError) {
      console.warn(`[getOrCreate] Select error:`, selectError.message);
    }

    if (existing?.id) return existing.id;

    const { data: inserted, error: insertError } = await supabase
      .from(table)
      .insert({ name })
      .select()
      .single(); // this is fine for insert

    if (insertError) {
      console.error(`[getOrCreate] Insert error:`, insertError.message);
      return null;
    }

    return inserted.id;
  };

  if (!open) return null;

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.position) newErrors.position = "Position is required.";
    if (!form.roleLevel) newErrors.roleLevel = "Role level is required.";
    if (!form.company) newErrors.company = "Company name is required.";
    if (!form.jobDescription)
      newErrors.jobDescription = "Job description is required.";
    if (!form.companyDetails)
      newErrors.companyDetails = "Company details are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectExistingGoal = (goal) => {
    console.log("Selected existing goal:", goal);
    setSelectedGoal(goal); // ✅ store the selected goal
    setShowGoalSelector(false);
    setStep(3); // ✅ skip directly to step 3
  };

  const handleCreateNewGoal = () => {
    setShowGoalSelector(false);
    setStep(1); // Start step 1 for creating a new goal
  };

  if (showGoalSelector) {
    return (
      <JobReadinessGoalSelector
        onSelectExisting={handleSelectExistingGoal}
        onCreateNew={handleCreateNewGoal}
      />
    );
  }

  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] p-6 pointer-events-auto overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Job Readiness Assessment
          </h2>
          <hr className="mb-6" />
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 overflow-auto">
            <span className="block text-xl font-semibold text-gray-900 mb-4">
              Step 1 of 3: Job Details
            </span>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1"
              placeholder="Enter the job title you're targeting, e.g. Senior Software Engineer"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              required
            />
            {errors.position && (
              <p className="text-red-600 text-sm mb-2">{errors.position}</p>
            )}

            <label className="block text-base font-medium text-gray-900 mb-2">
              Role level <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1"
              value={form.roleLevel}
              onChange={(e) => setForm({ ...form, roleLevel: e.target.value })}
              required
            >
              <option value="">Select your role level</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior-Level">Senior-Level</option>
              <option value="Lead/Principal-Level">Lead/Principal-Level</option>
              <option value="Manager-Level">Manager-Level</option>
              <option value="Executive-Level">Executive-Level</option>
            </select>
            {errors.roleLevel && (
              <p className="text-red-600 text-sm mb-2">{errors.roleLevel}</p>
            )}

            <label className="block text-base font-medium text-gray-900 mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1"
              placeholder="Enter the company name you're interested in"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            {errors.company && (
              <p className="text-red-600 text-sm mb-2">{errors.company}</p>
            )}

            <label className="block text-base font-medium text-gray-900 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1"
              placeholder="Copy and paste the job description here"
              value={form.jobDescription}
              onChange={(e) =>
                setForm({ ...form, jobDescription: e.target.value })
              }
              maxLength={3000}
              required
            />
            {errors.jobDescription && (
              <p className="text-red-600 text-sm mb-2">
                {errors.jobDescription}
              </p>
            )}
            <div className="text-xs text-gray-500 mb-4">
              3000 characters left
            </div>

            <label className="block text-base font-medium text-gray-900 mb-2">
              Company Details<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1"
              placeholder="Copy and paste the company description here"
              value={form.companyDetails}
              onChange={(e) =>
                setForm({ ...form, companyDetails: e.target.value })
              }
              maxLength={3000}
              required
            />
            {errors.companyDetails && (
              <p className="text-red-600 text-sm mb-2">
                {errors.companyDetails}
              </p>
            )}
            <div className="text-xs text-gray-500 mb-4">
              3000 characters left
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                className="button button-s"
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
              >
                Next
              </button>
              <button
                className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] p-6 pointer-events-auto overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Job Readiness Assessment
          </h2>
          <hr className="mb-6" />
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 overflow-auto">
            <span className="block text-xl font-semibold text-gray-900 mb-4">
              Select your Resume
            </span>
            <div className="flex items-center space-x-4 mt-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleResumeSelection(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                className="flex items-center border border-gray-300 rounded-lg px-6 py-2 font-medium text-gray-700 hover:bg-gray-100"
                onClick={handleFileUpload}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Upload
              </button>
            </div>
            {resumeFile && (
              <p className="text-sm text-gray-700 mt-2">
                Selected file: {resumeFile.name}
              </p>
            )}
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
      console.log("✅ Step 3 rendered with goal:", selectedGoal);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] p-6 pointer-events-auto overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Job Readiness Assessment
          </h2>
          <hr className="mb-6" />
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 overflow-auto">
            <span className="block text-xl font-semibold text-gray-900 mb-4">
  Your {selectedGoal?.position || "target role"} Readiness Assessment
</span>

            <ul className="list-disc pl-5 text-gray-700">
              <li>Discover your current job market readiness</li>
              <li>Identify skill gaps and improvement areas</li>
              <li>Quick 20 minute personalized assessment</li>
            </ul>
            <button
              className="button button-m mt-5"
              onClick={() => navigate("/job-readiness-assessment")}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default JobReadinessAssessmentForm;

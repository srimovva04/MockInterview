import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const JobReadinessGoalSelector = ({ onSelectExisting, onCreateNew }) => {
  const [existingGoals, setExistingGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");

  useEffect(() => {
  const fetchExistingGoals = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Authenticated user:", user); // ✅ Debug

    if (authError || !user) {
      console.error("Auth error or no user", authError);
      return;
    }

    const { data, error } = await supabase
      .from("job_readiness_assessments")
      .select("id, position, companies(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("Goals fetched:", data); // ✅ Debug

    if (!error) {
      setExistingGoals(data);
    } else {
      console.error("Error fetching past goals:", error);
    }
  };

  fetchExistingGoals();
}, []);

  const handleSelect = () => {
    if (selectedGoalId) {

const goal = existingGoals.find((g) => g.id.toString() === selectedGoalId);
        onSelectExisting(goal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onCreateNew}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Job Readiness Assessment</h2>
        <hr className="mb-6" />

        <div className="mb-6">
          <label className="block text-base font-medium text-gray-900 mb-2">
            Select existing information <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
          >
            <option value="">Select your information</option>
            {existingGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                 {goal.position} @ {goal.companies?.name || "Unknown Company"}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            onClick={handleSelect}
            disabled={!selectedGoalId}
          >
            Continue
          </button>
        </div>

        <div className="text-center">
          <span className="text-gray-600 mr-2">or</span>
          <button
            onClick={onCreateNew}
            className="inline-block mt-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
          >
            Create New Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobReadinessGoalSelector;

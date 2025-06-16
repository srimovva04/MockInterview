import React, { useState } from "react";
import { FileText, Target, HelpCircle } from "lucide-react";
import ActionCard from "./ActionCard";
import InterviewTable from "./InterviewTable";
import { useNavigate } from "react-router-dom";
import OnboardingBanner from "./OnboardingBanner";
import JobReadinessAssessmentForm from "./job_readiness/Forms";
import JobReadinessGoalSelector from "./job_readiness/JobReadinessGoalSelector";
import { MockInterviewForm } from "./mock/MockInterviewForm";
import InterviewReminder from "./mock/InterviewReminder";

const MockInterviewDashboard = () => {
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showMockInterviewForm, setMockInterviewForm] = useState(false);
  const navigate = useNavigate();

  const handleSelectExisting = (goal) => {
  setSelectedGoal(goal);
  setShowGoalSelector(false);
  setShowAssessmentForm(true); // ✅ FIX: Show form modal
  console.log("Selected existing goal:", goal);
};


  const handleCreateNew = () => {
    setShowGoalSelector(false);
    setShowAssessmentForm(true);
  };

  const handleCardClick = (cardType) => {
    if (cardType === "Job Readiness Assessment") {
      setShowGoalSelector(true); // ← Show selector instead of form
    } else if (cardType === "Mock Interview") {
      setMockInterviewForm(true);
    } else if (cardType === "Practicing Questions") {
      navigate("/practicing-questions");
    } else {
      console.log(`Clicked on ${cardType}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <InterviewReminder />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Mock Interview</h1>
          <p className="text-black/80 text-lg leading-relaxed max-w">
            Sharpen your interview skills with AI Mock Interview—your personal,
            on-demand interview coach. Get realistic practice sessions, instant
            feedback, and tailored questions based on your target role. Practice
            anytime, anywhere—no scheduling, no pressure. Walk into your next
            interview confident, prepared, and ready to impress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={FileText}
            title="Start Job Readiness Assessment"
            onClick={() => handleCardClick("Job Readiness Assessment")}
          />
          <ActionCard
            icon={Target}
            title="Start Mock Interview"
            onClick={() => handleCardClick("Mock Interview")}
          />
          <ActionCard
            icon={HelpCircle}
            title="Start Practicing Questions"
            onClick={() => handleCardClick("Practicing Questions")}
          />
        </div>

        <InterviewTable />
      </div>

      {/* GOAL SELECTOR MODAL */}
      {showGoalSelector && (
        <JobReadinessGoalSelector
          onSelectExisting={handleSelectExisting}
          onCreateNew={handleCreateNew}
        />
      )}

      {/* FORM MODAL */}
      <JobReadinessAssessmentForm
        open={showAssessmentForm}
        onClose={() => setShowAssessmentForm(false)}
        selectedGoal={selectedGoal} // ✅ New prop

      />

      <MockInterviewForm
        open={showMockInterviewForm}
        onClose={() => setMockInterviewForm(false)}
      />
    </div>
  );
};

export default MockInterviewDashboard;

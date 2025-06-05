import React, { useState } from 'react';
import { FileText, Target, HelpCircle } from 'lucide-react';
import ActionCard from './ActionCard';
import InterviewTable from './InterviewTable';
import OnboardingBanner from './OnboardingBanner';
import JobReadinessAssessmentForm from './JobReadinessAssessmentForm';

const MockInterviewDashboard = () => {
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);

  const handleCardClick = (cardType) => {
    if (cardType === 'Job Readiness Assessment') {
      setShowAssessmentForm(true);
    } else {
      console.log(`Clicked on ${cardType}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mock Interview</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-4xl">
            Sharpen your interview skills with AI Mock Interview—your personal, on-demand interview coach. 
            Get realistic practice sessions, instant feedback, and tailored questions based on your target role. 
            Practice anytime, anywhere—no scheduling, no pressure. Walk into your next interview confident, prepared, and ready to impress.
          </p>
        </div>
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={FileText}
            title="Start Job Readiness Assessment"
            onClick={() => handleCardClick('Job Readiness Assessment')}
          />
          <ActionCard
            icon={Target}
            title="Start Mock Interview"
            onClick={() => handleCardClick('Mock Interview')}
          />
          <ActionCard
            icon={HelpCircle}
            title="Start Practicing Questions"
            onClick={() => handleCardClick('Practicing Questions')}
          />
        </div>
        {/* Interview Table */}
        <InterviewTable />
      </div>
      <JobReadinessAssessmentForm open={showAssessmentForm} onClose={() => setShowAssessmentForm(false)} />
    </div>
  );
};

export default MockInterviewDashboard;
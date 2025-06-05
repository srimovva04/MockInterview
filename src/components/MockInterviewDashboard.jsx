
import React from 'react';
import { FileText, Target, HelpCircle } from 'lucide-react';
import ActionCard from './ActionCard';
import InterviewTable from './InterviewTable';
import OnboardingBanner from './OnboardingBanner';

const MockInterviewDashboard = () => {
  const handleCardClick = (cardType) => {
    console.log(`Clicked on ${cardType}`);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interview</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
            Elevate your interview skills with AI Mock Interview that offers realistic practice sessions, 
            instant feedback, and job-specific questions to transform your weaknesses into strengths. 
            Practice anytime, anywhere—no scheduling or stress required—and walk into your real interview 
            fully prepared and confident.
          </p>
        </div>

        {/* Onboarding Banner */}
        <OnboardingBanner />

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
            badge="Beta"
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
    </div>
  );
};

export default MockInterviewDashboard;

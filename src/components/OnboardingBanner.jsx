
import React from 'react';
import { ChevronDown } from 'lucide-react';

const OnboardingBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-800 font-medium">
          Complete onboarding tutorial and receive a reward
        </span>
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;
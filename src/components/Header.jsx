import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 px-6 py-3">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            Connect your Interview Copilot™ with your interview rooms.
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-sm">
            <span className="text-white/80">Candidate in </span>
            <span className="font-semibold">USA</span>
            <span className="text-white/80"> Subscribed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

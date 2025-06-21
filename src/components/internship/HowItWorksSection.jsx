import React from 'react';
import { Target } from 'lucide-react';

const staticHowItWorks = [
  {
    step: 1,
    title: "Complete tasks guided by pre-recorded videos and example answers from our team at Tata Group. No live sessions, all self-paced.",
    icon: "▶"
  },
  {
    step: 2,
    title: "Earn a certificate and add it to your resume and LinkedIn as an extracurricular activity.",
    icon: "🎓"
  },
  {
    step: 3,
    title: "Stand out in applications. Confidently answer interview questions and explain why you're a good fit for our team.",
    icon: "⭐"
  }
];

const HowItWorksSection = () => (
  <section className="scroll-mt-24">
    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <Target className="h-4 w-4 text-purple-600" />
      </div>
      How It Works
    </h2>
    <div className="space-y-6">
      {staticHowItWorks.map((step, index) => (
        <div key={index} className="rounded-lg border bg-white text-gray-900 shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {step.step}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed text-lg">
                {step.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorksSection;

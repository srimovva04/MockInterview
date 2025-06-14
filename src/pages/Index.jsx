import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MockInterviewDashboard from "../components/MockInterviewDashboard";
import OnboardingBanner from "../components/OnboardingBanner";
import Signin from "../components/signin";
import Signup from "../components/signup";
import AdminDashboard from "../components/AdminDashboard";

const Index = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #1e3a8a 0%, #111827 60%, #0f172a 100%)",
      }}
    >
      <div className="flex h-full">
        {/* Fixed width for sidebar to avoid it getting hidden */}
        <div className="w-64 bg-gray-900 text-white">
          <Sidebar />
        </div>

        {/* Main content takes up remaining space */}
        <div className="flex-1 overflow-y-auto p-6">
          <MockInterviewDashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;

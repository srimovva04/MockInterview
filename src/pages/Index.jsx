import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MockInterviewDashboard from '../components/MockInterviewDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-60px)]">
        <Sidebar />
        <MockInterviewDashboard />
      </div>
    </div>
  );
};

export default Index;
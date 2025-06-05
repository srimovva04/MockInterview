import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MockInterviewDashboard from '../components/MockInterviewDashboard';

const Index = () => {
  return (
    <div className="min-h-screen"
    style={{
    background: 'radial-gradient(circle at center, #1e3a8a 0%, #111827 60%, #0f172a 100%)'
  }}>

      <div className="flex h-[calc(100vh-60px)]">
        <Sidebar />
        <MockInterviewDashboard />
      </div>
    </div>
  );
};

export default Index;
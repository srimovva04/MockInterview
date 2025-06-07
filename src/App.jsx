import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import VideoCallContent from './components/mock/VideoCallContent';
import PracticingQuestions from './components/practicing_questions/PracticingQuestions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/mockInterview" element={<VideoCallContent />} />
      <Route path="/practicing-questions" element={<PracticingQuestions />} /> 
    </Routes>
  );
}

export default App;

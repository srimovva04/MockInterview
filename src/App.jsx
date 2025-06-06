import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MockInterview from './components/MockInterview';
import PracticingQuestions from './components/practicing_questions/PracticingQuestions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/mockInterview" element={<MockInterview />} />
      <Route path="/practicing-questions" element={<PracticingQuestions />} /> 
    </Routes>
  );
}

export default App;

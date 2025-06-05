import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MockInterview from './components/MockInterview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/mockInterview" element={<MockInterview />} />
    </Routes>
  );
}

export default App;

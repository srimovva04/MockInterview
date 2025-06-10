import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import VideoCallContent from './components/mock/VideoCallContent';
import PracticingQuestions from './components/practicing_questions/PracticingQuestions';
import JobReadinessAssessment from './components/job_readiness/JobReadinessAssessment';
import Feedback from "./components/job_readiness/Feedback"; // 👈 Correct one!

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/mockInterview" element={<VideoCallContent />} />
      <Route path="/practicing-questions" element={<PracticingQuestions />} />
      <Route path="/job-readiness-assessment" element={<JobReadinessAssessment />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}

export default App;

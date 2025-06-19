// import { Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import VideoCallContent from "./components/mock/VideoCallContent";
// import PracticingQuestions from "./components/practicing_questions/PracticingQuestions";
// import JobReadinessAssessment from "./components/job_readiness/JobReadinessAssessment";
// import Feedback from "./components/job_readiness/Feedback";
// import Signin from "./components/signin";
// import Signup from "./components/signup";

// function App() {
//   return (
//     <>
//       <p style={{ color: "white" }}>App Loaded</p>
//       <Routes>
//         <Route path="/" element={<Index />} />
//         <Route path="/signin" element={<Signin />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/mockInterview" element={<VideoCallContent />} />
//         <Route path="/practicing-questions" element={<PracticingQuestions />} />
//         <Route
//           path="/job-readiness-assessment"
//           element={<JobReadinessAssessment />}
//         />
//         <Route path="/feedback" element={<Feedback />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import VideoCallContent from "./components/mock/VideoCallContent";
import PracticingQuestions from "./components/practicing_questions/PracticingQuestions";
import JobReadinessAssessment from "./components/job_readiness/JobReadinessAssessment";
import Feedback from "./components/job_readiness/Feedback";
import Signin from "./components/signin";
import Signup from "./components/signup";
import ProtectedRoute from "./components/protectedRoute";
import { UserAuth } from "./components/AuthContext";
import AdminDashboard from "./components/AdminDashboard";
import InterviewReminder from "./components/mock/InterviewReminder";
import PreparationHub from "./pages/PreparationHub";

function App() {
  const { session } = UserAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <InterviewReminder />
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mockInterview"
        element={
          <ProtectedRoute>
            <VideoCallContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practicing-questions"
        element={
          <ProtectedRoute>
            <PracticingQuestions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-readiness-assessment"
        element={
          <ProtectedRoute>
            <JobReadinessAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preparation-hub"
        element={
          <ProtectedRoute>
            <PreparationHub />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

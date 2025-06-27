import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MockInterviewDashboard from "../components/MockInterviewDashboard";
import OnboardingBanner from "../components/OnboardingBanner";
import Signin from "../components/Auth/signin";
import Signup from "../components/Auth/signup";
import AdminDashboard from "../components/AdminDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-radial-blue">
      <div className="flex h-full">
        {/* Fixed width for sidebar to avoid it getting hidden */}
        <div className="fixed top-0 left-0 h-screen w-64 z-10">
          <Sidebar />
        </div>

        {/* Main content takes up remaining space */}
        <div className="pl-64 h-screen overflow-y-auto p-6">
          <MockInterviewDashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;

// import React from "react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import MockInterviewDashboard from "../components/MockInterviewDashboard";
// import OnboardingBanner from "../components/OnboardingBanner";
// import Signin from "../components/signin";
// import Signup from "../components/signup";
// import AdminDashboard from "../components/AdminDashboard";

// const Index = () => {
//   return (
//     <div
//       className="min-h-screen bg-radial-blue"
//     >
//       <div className="flex h-full">
//         {/* Fixed width for sidebar to avoid it getting hidden */}
//         <div className="fixed top-0 left-0 h-screen w-64 z-10">
//           <Sidebar />
//         </div>

//         {/* Main content takes up remaining space */}
//         <div className="pl-64 h-screen overflow-y-auto p-6">
//           <MockInterviewDashboard />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

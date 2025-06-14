// import React from "react";
// import Sidebar from "./Sidebar"; // adjust path if needed

// const AdminDashboard = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-800 text-white">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-4">Hello There I m admin</h1>
//         {/* Add admin-specific dashboard content here */}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddQuestionBank from "./admin/AddQuestionBank"; // new
// import other admin pages here as needed...

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Add Question Bank");

  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-1 p-6">
        {activeTab === "Add Question Bank" && <AddQuestionBank />}
        {/* add more tab conditions here if needed */}
        {/* {activeTab === "Add Entries" && <AddEntries />} */}
      </div>
    </div>
  );
};

export default AdminDashboard;

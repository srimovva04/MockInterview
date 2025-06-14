import React from "react";
import Sidebar from "./Sidebar"; // adjust path if needed

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
        {/* Add admin-specific dashboard content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;

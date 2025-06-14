import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  FileText,
  BookOpen,
  Cpu,
  Zap,
  User,
  BarChart3,
  PlusCircle,
  ClipboardList,
  Settings,
} from "lucide-react";
import { supabase } from "./utils/supabaseClient";

const Sidebar = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return setRole("user"); // fallback

      // Set full name
      setFullName(user.user_metadata?.display_name || "User");

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError || !roleData) {
        setRole("user");
      } else {
        setRole(roleData.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return null; // or show a spinner

  const userMenuItems = [
    { icon: Users, label: "Live Interview", active: false },
    { icon: Target, label: "Mock Interview", active: true },
    { icon: BookOpen, label: "Preparation Hub", active: false },
    { icon: FileText, label: "Document Center", active: false },
  ];

  const adminMenuItems = [
    { icon: PlusCircle, label: "Add Question Bank", active: true },
    { icon: ClipboardList, label: "Add Entries", active: false },
    { icon: Settings, label: "Manage App", active: false },
  ];

  const tools = [
    { icon: Cpu, label: "AI Material Generator", active: false },
    { icon: Zap, label: "Auto Apply", badge: "Beta", active: false },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-950 text-white px-2 py-1 rounded text-sm font-bold">
            Final Round
          </div>
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
            AI
          </span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-white mb-3">
          {role === "admin" ? "Admin Panel" : "Interview"}
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                item.active
                  ? "bg-gray-100 text-gray-900"
                  : "text-white hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-4 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <User className="w-5 h-5" />
          <span className="text-sm text-white font-medium hover:text-gray-900">
            {fullName}
          </span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm text-white font-medium hover:text-gray-900">
            Plan Usage & Other
          </span>
        </button>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          {role === "admin" ? "Admin Plan" : "Interview Plan"}
        </button>
        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors">
          Auto Apply Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

// import React from 'react';
// import { Users, Target, FileText, BookOpen, Cpu, Zap, User, BarChart3 } from 'lucide-react';

// const Sidebar = () => {
//   const menuItems = [
//     { icon: Users, label: 'Live Interview', active: false },
//     { icon: Target, label: 'Mock Interview', active: true },
//     { icon: BookOpen, label: 'Preparation Hub', active: false },
//     { icon: FileText, label: 'Document Center', active: false },
//   ];

//   const tools = [
//     { icon: Cpu, label: 'AI Material Generator', active: false },
//     { icon: Zap, label: 'Auto Apply', badge: 'Beta', active: false },
//   ];

//   return (
//     <div className="w-64 h-screen flex flex-col">
//       {/* Logo */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center space-x-2">
//           <div className="bg-blue-950 text-white px-2 py-1 rounded text-sm font-bold">
//             Final Round
//           </div>
//            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
//             AI
//           </span>
//         </div>
//       </div>

//       {/* Interview Section */}
//       <div className="p-4">
//         <h3 className="text-sm font-medium text-white mb-3">Interview</h3>
//         <nav className="space-y-1">
//           {menuItems.map((item, index) => (
//             <button
//               key={index}
//               className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                 item.active
//                   ? 'bg-gray-100 text-gray-900'
//                   : 'text-white hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="text-sm font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-auto p-4 space-y-2">
//         <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
//           <User className="w-5 h-5" />
//           <span className="text-sm text-white font-medium hover:text-gray-900">aava chen</span>
//         </button>
//         <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
//           <BarChart3 className="w-5 h-5" />
//           <span className="text-sm text-white font-medium hover:text-gray-900">Plan Usage & Other</span>
//         </button>

//         <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
//           Interview Plan
//         </button>
//          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors">
//           Auto Apply Plan
//         </button>
//       </div>
//     </div>

//   );
// };

// export default Sidebar;

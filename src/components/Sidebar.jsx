import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Check,
  Scan,
  GraduationCap,
} from "lucide-react";
import { supabase } from "./utils/supabaseClient";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("User");
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return setRole("user");

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

  if (loading) return null;

  const userMenuItems = [
    // {
    //   icon: Users,
    //   label: "Live Interview",
    //   active: false,
    //   path: "/live-interview",
    // },
    { icon: Target, label: "Mock Interview", active: true, path: "/home" },
    {
      icon: BookOpen,
      label: "Preparation Hub",
      active: false,
      path: "/preparation-hub",
    },
    // { icon: BookOpen, label: "Preparation Hub", route: "/preparation-hub" },
    {
      icon: FileText,
      label: "Document Center",
      active: false,
      path: "/document-center",
    },
    {
      icon: Scan,
      label: "ATS Score Checker",
      active: false,
      path: "/ats-checker",
    },
    {
      icon: GraduationCap,
      label: "Virtual Internship",
      active: false,
      path: "/internship",
    },
  ];

  const adminMenuItems = [
    {
      icon: PlusCircle,
      label: "Add Question Bank",
      active: true,
      path: "/add-question-bank",
    },
    {
      icon: ClipboardList,
      label: "Add Entries",
      active: false,
      path: "/add-entries",
    },
    { icon: Settings, label: "Manage App", active: false, path: "/manage-app" },
  ];
  const tools = [
    { icon: Cpu, label: "AI Material Generator", active: false },
    { icon: Zap, label: "Auto Apply", badge: "Beta", active: false },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 h-screen bg-white shadow-md fixed left-0 top-0 z-10 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
              Final Round
            </div>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
              AI
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">
            {role === "admin" ? "Admin Panel" : "Interview"}
          </h3>

          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-200 text-blue-900 font-semibold"
                    : "hover:bg-blue-100 hover:text-blue-900 text-gray-700"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-blue-100 hover:text-blue-900 text-gray-700">
          <User className="w-5 h-5" />
          <span className="text-sm">{fullName}</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-blue-100 hover:text-blue-900 text-gray-700">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm">Plan Usage & Other</span>
        </button>

        <button className="button button-md w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
          {role === "admin" ? "Admin Plan" : "Interview Plan"}
        </button>
        <button className="button button-md w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
          Auto Apply Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

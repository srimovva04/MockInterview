
import React from 'react';
import { Users, Target, FileText, BookOpen, Cpu, Zap, User, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Users, label: 'Live Interview', active: false },
    { icon: Target, label: 'Mock Interview', active: true },
    { icon: BookOpen, label: 'Preparation Hub', active: false },
    { icon: FileText, label: 'Document Center', active: false },
  ];

  const tools = [
    { icon: Cpu, label: 'AI Material Generator', active: false },
    { icon: Zap, label: 'Auto Apply', badge: 'Beta', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">
            Final Round
          </div>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-medium">
            AI
          </span>
        </div>
      </div>

      {/* Interview Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Interview</h3>
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                item.active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Stealth Mode */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">NEW</span>
            <span className="text-sm font-medium text-gray-900">Stealth Mode is now available</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Access the Stealth Desktop App to keep Interview Copilot invisible in any screen share.
          </p>
          <button className="text-orange-600 text-xs font-medium hover:text-orange-700">
            📥 Access Now
          </button>
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Tools</h3>
        <nav className="space-y-1">
          {tools.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-4 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">aava chen</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm font-medium">Plan Usage & Other</span>
        </button>
        
        <button className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          Interview Plan
        </button>
        <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors">
          Auto Apply Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

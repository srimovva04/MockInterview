import React, { useState, useEffect } from "react";
import {
  Video,
  VideoOff,
  Sun,
  Moon,
  Settings,
  Mic,
  MicOff,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobReadinessAssessment = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const [hasVideoPermission, setHasVideoPermission] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const navigate = useNavigate();

  const commonButtonStyles =
    "h-8 w-8 flex items-center justify-center rounded transition-all duration-200 hover:scale-105";

  // Microphone and Video permission
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setHasMicPermission(true);
        setHasVideoPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        if (err.name === "NotAllowedError") {
          setHasMicPermission(false);
          setHasVideoPermission(false);
        }
      });
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (hasMicPermission === false || hasVideoPermission === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-red-600">
            Audio & Video Access Required
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Please enable microphone and camera access in your browser settings
            to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (hasMicPermission === null || hasVideoPermission === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>Requesting audio and video access...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b shadow-sm">
        <div>
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Job Readiness Assessment
          </h2>
          <span className="text-sm text-gray-500">
            {formatTime(secondsElapsed)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`${commonButtonStyles} ${
              isVideoOn
                ? isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200"
                : "bg-red-600 text-white"
            }`}
          >
            {isVideoOn ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${commonButtonStyles} ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            className={`${commonButtonStyles} ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200"
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`${commonButtonStyles} ${
              isMicOn
                ? isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200"
                : "bg-red-600 text-white"
            }`}
          >
            {isMicOn ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => navigate("/Feedback")}
            className="h-8 px-3 flex items-center justify-center rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Leave
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
        {/* Video Section */}
        <div className="rounded-xl overflow-hidden bg-black relative h-[400px] flex items-center justify-center">
          {isVideoOn ? (
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              src="/path-to-video.mp4"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center border-4 border-white">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Message Section */}
        <div
          className={`rounded-xl p-6 shadow ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="text-sm text-gray-500 mb-1">0:01</div>
          <div
            className={`p-4 border rounded-lg ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <strong>Welcome to your Job Readiness Assessment!</strong> We’ll
            begin with questions about your experience and assess your readiness
            for the next step in your career. Ready to begin?
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            All services are online
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobReadinessAssessment;

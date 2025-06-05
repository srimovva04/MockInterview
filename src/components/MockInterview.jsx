import React from "react";
import { useLocation } from "react-router-dom";

function MockInterview() {
  const location = useLocation();
  const formData = location.state;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Mock Interview</h2>
      {formData ? (
        <pre className="bg-gray-100 p-4 rounded text-left w-full max-w-xl">
          {JSON.stringify(formData, null, 2)}
        </pre>
      ) : (
        <p>No form data received.</p>
      )}
    </div>
  );
}

export default MockInterview;

// src/components/QuestionCard.jsx
import React from "react";

export default function QuestionCard({ q }) {
  return (
    <div className="border p-4 mb-4 rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold">{q.title}</h2>
      <div className="text-sm text-gray-600 mt-1">
        {q.category} | Asked at {q.company} | Difficulty: {q.difficulty}
      </div>
      <button className="mt-3 px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600">
        Practice with This Question
      </button>
    </div>
  );
}

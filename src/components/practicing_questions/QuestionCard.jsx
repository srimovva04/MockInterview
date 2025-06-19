// src/components/QuestionCard.jsx
import React from "react";

export default function QuestionCard({ q }) {
  return (
    <div className="border p-4 mb-4 rounded-md shadow-md bg-white bg-fixed">
      <h2 className="text-lg font-semibold">{q.title}</h2>
      <div className="text-sm text-gray-600 mt-1">
        {q.category} | Asked at {q.company} | Difficulty: {q.difficulty}
      </div>
      <button className="button button-m mt-5">
        Practice with This Question
      </button>
    </div>
  );
}

// src/components/admin/AddQuestionBank.jsx
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AddQuestionBank = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    company: "",
    difficulty: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { id, ...cleanData } = formData;

    const { error } = await supabase.from("questions").insert([cleanData]);

    if (error) {
      setMessage("Error adding question: " + error.message);
    } else {
      setMessage("Question added successfully!");
      setFormData({ title: "", category: "", company: "", difficulty: "" });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., SQL, Behavioral)"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
          required
        />
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
          required
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Add Question"}
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default AddQuestionBank;

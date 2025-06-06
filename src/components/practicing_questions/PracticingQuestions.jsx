// src/pages/PreparationHub.jsx
import React, { useState } from "react";
import questions from "../../data/questions";
import FilterBar from "./FilterBar";
import QuestionCard from "./QuestionCard";

export default function PreparationHub() {
  const [filters, setFilters] = useState({
    category: "",
    company: "",
    difficulty: "",
    search: "",
  });

  const filtered = questions.filter((q) => {
    const searchText = filters.search.toLowerCase();
    const matchesCategory =
      !filters.category || q.category === filters.category;
    const matchesCompany = !filters.company || q.company === filters.company;
    const matchesDifficulty =
      !filters.difficulty || q.difficulty === filters.difficulty;
    const matchesSearch =
      q.question?.toLowerCase().includes(searchText) ||
      q.company?.toLowerCase().includes(searchText) ||
      q.difficulty?.toLowerCase().includes(searchText) ||
      q.category?.toLowerCase().includes(searchText);
    return (
      matchesCategory && matchesCompany && matchesDifficulty && matchesSearch
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Question Bank</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div>
        {filtered.length ? (
          filtered.map((q) => <QuestionCard key={q.id} q={q} />)
        ) : (
          <p>No questions found.</p>
        )}
      </div>
    </div>
  );
}

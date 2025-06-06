// // src/components/FilterBar.jsx
// import React from "react";

// export default function FilterBar({ filters, setFilters }) {
//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="flex flex-wrap gap-3 mb-6 items-center">
//       <select
//         name="category"
//         onChange={handleChange}
//         value={filters.category}
//         className="p-2 border rounded "
//       >
//         <option value="">Category</option>
//         {[
//           "Product Strategy",
//           "Algorithms",
//           "Behavioral",
//           "Analytical",
//           "Coding",
//           "Execution",
//           "System Design",
//           "Estimation",
//           "Technical",
//           "Statistics",
//           "Concept",
//           "Sql",
//           "Datastructure",
//         ].map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>

//       <select
//         name="company"
//         onChange={handleChange}
//         value={filters.company}
//         className="p-2 border rounded"
//       >
//         <option value="">Company</option>
//         {[
//           "Google",
//           "Namura",
//           "Facebook",
//           "Snapchat",
//           "ISS",
//           "JPMC",
//           "Amazon",
//           "Flipkart",
//         ].map((comp) => (
//           <option key={comp} value={comp}>
//             {comp}
//           </option>
//         ))}
//       </select>

//       <select
//         name="difficulty"
//         onChange={handleChange}
//         value={filters.difficulty}
//         className="p-2 border rounded"
//       >
//         <option value="">Difficulty Level</option>
//         {["Easy", "Medium", "Hard"].map((diff) => (
//           <option key={diff} value={diff}>
//             {diff}
//           </option>
//         ))}
//       </select>

//       <input
//         name="search"
//         type="text"
//         placeholder="Search"
//         value={filters.search}
//         onChange={handleChange}
//         className="p-2 border rounded w-64"
//       />
//     </div>
//   );
// }

import React from "react";

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Custom arrow SVG component for reuse
  const ArrowIcon = () => (
    <svg
      className="w-4 h-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );

  // Wrapper to add relative positioning + arrow icon
  const SelectWithArrow = ({ name, value, children }) => (
    <div className="relative inline-block">
      <select
        name={name}
        onChange={handleChange}
        value={value}
        className="p-2 pr-10 border rounded appearance-none"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ArrowIcon />
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      <SelectWithArrow name="category" value={filters.category}>
        <option value="">Category</option>
        {[
          "Product Strategy",
          "Algorithms",
          "Behavioral",
          "Analytical",
          "Coding",
          "Execution",
          "System Design",
          "Estimation",
          "Technical",
          "Statistics",
          "Concept",
          "Sql",
          "Datastructure",
        ].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </SelectWithArrow>

      <SelectWithArrow name="company" value={filters.company}>
        <option value="">Company</option>
        {[
          "Google",
          "Namura",
          "Facebook",
          "Snapchat",
          "ISS",
          "JPMC",
          "Amazon",
          "Flipkart",
        ].map((comp) => (
          <option key={comp} value={comp}>
            {comp}
          </option>
        ))}
      </SelectWithArrow>

      <SelectWithArrow name="difficulty" value={filters.difficulty}>
        <option value="">Difficulty Level</option>
        {["Easy", "Medium", "Hard"].map((diff) => (
          <option key={diff} value={diff}>
            {diff}
          </option>
        ))}
      </SelectWithArrow>

      <input
        name="search"
        type="text"
        placeholder="Search"
        value={filters.search}
        onChange={handleChange}
        className="p-2 border rounded w-64"
      />
    </div>
  );
}

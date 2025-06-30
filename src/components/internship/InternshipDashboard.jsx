import React, { useState, useEffect } from 'react';
import SimulationCard from './SimulationCard'; 
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { fetchSimulations } from '../utils/simulations';

const InternshipDashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [careerFilter, setCareerFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const loadSimulations = async () => {
      setLoading(true);
      const data = await fetchSimulations();
      setSimulations(data);
      setLoading(false);
    };

    loadSimulations();
  }, []);



  const uniqueCategories = ['All', ...new Set(simulations.map(sim => sim.category))];

  const filteredSimulations = simulations.filter((sim) => {
    const matchesCareer = careerFilter === 'All' || sim.category === careerFilter;
    return matchesCareer;
  });



  // const filteredSimulations = simulations.filter((sim) => {
  //   const matchesCareer = careerFilter === 'All' || sim.category === careerFilter;
  //   return matchesCareer;
  // });

  return (
    <div className="flex h-screen overflow-hidden bg-radial-blue">
      <Sidebar />

      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-900 text-white px-6 py-3 rounded-full shadow-lg z-50"
        onClick={() => navigate('/progress')}
      >
       Track Progress
      </button>

      <div className="flex-1 ml-64 overflow-y-auto p-8">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Explore Job Simulations
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover hands-on job simulations and short courses to <span className="text-blue-800 font-medium">build real-world skills</span>, boost your resume, and get noticed by top recruiters.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 px-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Career Filter */}
            <div className="w-full sm:w-[300px]">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Career Interest
              </label>
              <div className="relative">
                <select
                  value={careerFilter}
                  onChange={(e) => setCareerFilter(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-150 ease-in-out hover:border-gray-400"
                >
                  {uniqueCategories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulations Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading simulations...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimulations.length > 0 ? (
              filteredSimulations.map((simulation) => (
                <SimulationCard key={simulation.id} simulation={simulation} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No simulations match your filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDashboard;



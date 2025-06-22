import React, { useState, useEffect } from 'react';
import SimulationCard from './SimulationCard'; 
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { fetchSimulations } from '../utils/simulations';

const InternshipDashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [careerFilter, setCareerFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
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

  const filteredSimulations = simulations.filter((sim) => {
    const matchesCareer = careerFilter === 'All' || sim.category === careerFilter;
    const matchesCompany = companyFilter === 'All' || sim.company === companyFilter;
    return matchesCareer && matchesCompany;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-radial-blue">
      <Sidebar />

      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-900 text-white px-6 py-3 rounded-full shadow-lg z-50"
        onClick={() => navigate('/progress')}
      >
        📈 Track Progress
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
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Career Interest</label>
              <select
                value={careerFilter}
                onChange={(e) => setCareerFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                {['All', 'Data', 'Consulting', 'Technology', 'Finance'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                {['All', 'Tata Group', 'Microsoft', 'Google', 'Amazon'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
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




// import React, { useState } from 'react';
// import SimulationCard from './SimulationCard'; 
// import Sidebar from '../Sidebar';

// const InternshipDashboard = () => {
//   const [careerFilter, setCareerFilter] = useState('All');
//   const [companyFilter, setCompanyFilter] = useState('All');

//   // const simulations = [
//   //   {
//   //     id: 1,
//   //     company: 'Tata Group',
//   //     category: 'Data',
//   //     title: 'Data Science: Unlocking Business Insights with Advanced Analytics',
//   //     difficulty: 'Intermediate',
//   //     duration: '3-4 hours',
//   //     image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
//   //     isNew: false,
//   //   },
//   //   {
//   //     id: 2,
//   //     company: 'Tata Group',
//   //     category: 'Data',
//   //     title: 'GenAI: Revolutionizing Data Analytics and Intelligent Automation',
//   //     difficulty: 'Intermediate',
//   //     duration: '3-4 hours',
//   //     image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
//   //     isNew: true,
//   //   },
//   //   {
//   //     id: 3,
//   //     company: 'Tata Group',
//   //     category: 'Technology',
//   //     title: 'Web Development: Building Responsive and Dynamic Applications',
//   //     difficulty: 'Beginner',
//   //     duration: '4-5 hours',
//   //     image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop',
//   //     isNew: false,
//   //   },
//   //   {
//   //     id: 4,
//   //     company: 'Tata Group',
//   //     category: 'Technology',
//   //     title: 'App Development: Designing User-Centric Mobile Experiences',
//   //     difficulty: 'Beginner',
//   //     duration: '3-5 hours',
//   //     image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
//   //     isNew: true,
//   //   },
//   //   {
//   //     id: 5,
//   //     company: 'Tata Group',
//   //     category: 'Data',
//   //     title: 'Data Analytics: Transforming Data into Strategic Decisions',
//   //     difficulty: 'Intermediate',
//   //     duration: '3-4 hours',
//   //     image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400&h=250&fit=crop',
//   //     isNew: false,
//   //   },
//   // ];

//   const filteredSimulations = simulations.filter((sim) => {
//     const matchesCareer = careerFilter === 'All' || sim.category === careerFilter;
//     const matchesCompany = companyFilter === 'All' || sim.company === companyFilter;
//     return matchesCareer && matchesCompany;
//   });

//   return (
//     <div className="flex h-screen overflow-hidden bg-radial-blue">
//       <Sidebar />
//       <div className="flex-1 ml-64 overflow-y-auto p-8">
//         {/* Header */}
//         <div className="text-center mb-12 px-4">
//           <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
//             Explore Job Simulations
//           </h1>
//           <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
//             Discover hands-on job simulations and short courses to <span className="text-blue-800 font-medium">build real-world skills</span>, boost your resume, and get noticed by top recruiters.
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="mb-12 px-4">
//           <div className="flex flex-col sm:flex-row sm:items-end gap-6">
//             {/* Career Filter */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Career Interest</label>
//               <select
//                 value={careerFilter}
//                 onChange={(e) => setCareerFilter(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//               >
//                 {['All', 'Data', 'Consulting', 'Technology', 'Finance'].map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Company Filter */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//               <select
//                 value={companyFilter}
//                 onChange={(e) => setCompanyFilter(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//               >
//                 {['All', 'Tata Group', 'Microsoft', 'Google', 'Amazon'].map((option) => (
//                   <option key={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>


//         {/* Simulations Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredSimulations.length > 0 ? (
//             filteredSimulations.map((simulation) => (
//               <SimulationCard key={simulation.id} simulation={simulation} />
//             ))
//           ) : (
//             <p className="text-gray-500 col-span-full text-center">
//               No simulations match your filters.
//             </p>
//           )}
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default InternshipDashboard;

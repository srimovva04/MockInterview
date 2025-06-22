import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  CheckCircle,
  BookOpen,
  Target,
  Star
} from 'lucide-react';

import { fetchSimulations, fetchTasksForSimulation } from '../utils/simulations';
import HowItWorksSection from './HowItWorksSection';

const SimulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const allSimulations = await fetchSimulations();
      const sim = allSimulations.find((s) => s.id === parseInt(id));
      setSimulation(sim);

      if (sim) {
        const simTasks = await fetchTasksForSimulation(sim.id);
        setTasks(simTasks);
      }
    };

    loadData();
  }, [id]);

  const currentTask = tasks.find((task) => task.id === selectedTask);

  const handleStartProgram = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/internship/${id}/task/1`);
    }, 1500);
  };

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading simulation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-white transition-all duration-700 ease-in-out">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate('/internship')}
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to simulations
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {simulation.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
                {simulation.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">{simulation.category}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Clock className="h-4 w-4" />
                  <span>{simulation.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{simulation.rating || '4.5'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white/95 text-gray-900 shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Get Career Ready
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <span className="text-sm text-gray-700">
                      Complete work that simulates real job scenarios. Self-paced learning in just 3-4 hours.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <span className="text-sm text-gray-700">
                      Stand out in your applications and show employers you're committed to learning.
                    </span>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-lg"
                  onClick={handleStartProgram}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Start Free Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            {['Overview', 'Tasks', 'Reviews'].map((tab) => (
              <a
                key={tab}
                href={`#${tab.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 pb-1"
              >
                {tab}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-16">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                Why Complete This Job Simulation
              </h2>
              <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {simulation.overview}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {simulation.features?.split(',').map((feature, index) => (
                    <div key={index} className="border border-gray-300 text-gray-600 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {feature.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works */}
            <HowItWorksSection />

            {/* Tasks */}
            <section id="tasks" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                </div>
                Tasks in This Program
              </h2>

              {/* Task Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {tasks.map((task, index) => {
                  const taskNumber = index + 1;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={`text-left p-6 rounded-xl border-2 transition-all ${
                        selectedTask === task.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            selectedTask === task.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {taskNumber}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.duration} • {task.difficulty}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>


              {/* Task Detail */}
              {currentTask && (
                <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8">
                  <h3 className="text-2xl font-bold mb-4">{currentTask.fullTitle}</h3>
                  <div className="flex items-center gap-4 text-sm text-blue-600 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentTask.duration}
                    </span>
                    <span>•</span>
                    <div className="border border-gray-300 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {currentTask.difficulty}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {currentTask.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* What you'll learn */}
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        What you'll learn
                      </h4>
                      <ul className="space-y-3">
                        {currentTask.what_youll_learn?.split(',').map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What you'll do */}
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-blue-600" />
                        What you'll do
                      </h4>
                      <ul className="space-y-3">
                        {currentTask.what_youll_do?.split(',').map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Reviews */}
            <section id="reviews" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                Reviews
              </h2>
              <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to complete this simulation and leave a review!</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 min-w-[25rem]">
            <div className="sticky top-32 space-y-6">
            
              {/* Skills You'll Practice Block */}
              <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8 space-y-4">
                <div className="p-0">
                  <h3 className="text-xl font-semibold leading-none tracking-tight">Skills You'll Practice</h3>
                </div>
                <div className="p-0">
                  <div className="flex flex-wrap gap-4">
                    {(simulation.skills || '')
                      .split(',')
                      .map((skill, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 inline-flex items-center rounded-full px-3 py-1 text-base font-semibold transition-colors"
                        >
                          {skill.trim()}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Earn a Certificate Block */}
              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 shadow-sm p-8 space-y-4">
                <div className="p-0 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn a Certificate</h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    Complete all tasks to earn your certificate and showcase your skills to potential employers.
                  </p>
                  <button 
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-300 bg-transparent text-blue-700 hover:bg-blue-100 w-full h-11 px-5 py-2.5"
                    onClick={handleStartProgram}
                  >
                    Get Started
                  </button>
                </div>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SimulationDetail;

// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, 
//   Clock, 
//   Users, 
//   Award, 
//   CheckCircle, 
//   BookOpen, 
//   Target, 
//   Star,
//   PlayCircle,
//   Trophy,
//   Zap
// } from 'lucide-react';
// import { simulations } from '../utils/simulations'; 
// import HowItWorksSection from './HowItWorksSection';

// const SimulationDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [selectedTask, setSelectedTask] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const simulation = simulations.find(sim => sim.id === parseInt(id));
//   const currentTask = simulation.tasks.find(task => task.id === selectedTask);

//   const handleStartProgram = () => {
//     setIsLoading(true); // trigger loading before routing
//     setTimeout(() => {
//       navigate(`/internship/${id}/task/1`);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-white transition-all duration-700 ease-in-out">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden transition-all duration-700 ease-in-out">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <button
//             onClick={() => navigate('/internship')}
//             className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors group"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
//             Back to simulations
//           </button>
          
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
//             <div className="lg:col-span-2">
//               {/* <div className="inline-flex items-center rounded-full border border-white/20 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold transition-colors mb-4">
//                 {simulation.company}
//               </div> */}
//               <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//                 {simulation.title}
//               </h1>
//               <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
//                 {simulation.description}
//               </p>
//               <div className="flex flex-wrap items-center gap-6 text-sm">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
//                   <span className="text-blue-100">{simulation.category}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-blue-100">
//                   <Clock className="h-4 w-4" />
//                   <span>{simulation.duration}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-blue-100">
//                   <Star className="h-4 w-4 fill-current" />
//                   <span>{simulation.rating}</span>
//                 </div>
//                 <div className="border border-blue-300 text-blue-100 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors">
//                   {simulation.isFree ? 'Free' : 'Paid'}
//                 </div>
//               </div>
//             </div>
            
//             {/* Action Card */}
//             <div className="rounded-lg border bg-white/95 text-gray-900 shadow-2xl backdrop-blur-sm">
//               <div className="flex flex-col space-y-1.5 p-6">
//                 <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 flex items-center gap-2">
//                   <Award className="h-5 w-5 text-blue-600" />
//                   Get Career Ready
//                 </h3>
//               </div>
//               <div className="p-6 pt-0 space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">
//                       Complete work that simulates real job scenarios. Self-paced learning in just 3-4 hours.
//                     </span>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">
//                       Stand out in your applications and show employers you're committed to learning.
//                     </span>
//                   </div>
//                 </div>
//                 <button 
//                   className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all h-10 px-4"
//                   onClick={handleStartProgram}
//                     disabled={isLoading}
//                 >
//                  {isLoading ? 'Loading...' : 'Start Free Program'}

//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <nav className="flex space-x-8 py-4">
//             {['Overview', 'Tasks', 'Reviews'].map((tab) => (
//               <a
//                 key={tab}
//                 href={`#${tab.toLowerCase().replace(' ', '')}`}
//                 className="text-gray-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
//               >
//                 {tab}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-16">
//             {/* Overview Section */}
//             <section id="overview" className="scroll-mt-24">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <BookOpen className="h-4 w-4 text-blue-600" />
//                 </div>
//                 Why Complete This Job Simulation
//               </h2>
//               <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8">
//                 <p className="text-lg text-gray-700 leading-relaxed mb-6">
//                   {simulation.overview}
//                 </p>
//                 <div className="flex flex-wrap gap-3 mb-6">
//                   {simulation.features.map((feature, index) => (
//                     <div key={index} className="border border-gray-300 text-gray-600 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors">
//                       {feature}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
 

//             {/* How It Works Section */}
//               <HowItWorksSection />

//             {/* Tasks Section */}
//             <section id="tasks" className="scroll-mt-24">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
//                 <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <CheckCircle className="h-4 w-4 text-orange-600" />
//                 </div>
//                 Tasks in This Program
//               </h2>

//               {/* Task Navigation */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 {simulation.tasks.map((task) => (
//                   <button
//                     key={task.id}
//                     onClick={() => setSelectedTask(task.id)}
//                     className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
//                       selectedTask === task.id
//                         ? 'border-blue-500 bg-blue-50 shadow-lg'
//                         : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                         selectedTask === task.id
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gray-100 text-gray-600'
//                       }`}>
//                         {task.id}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{task.title}</h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                           {task.duration} • {task.difficulty}
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               {/* Selected Task Details */}
//               {currentTask && (
//                 <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8">
//                   <div className="mb-8">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                       {currentTask.fullTitle}
//                     </h3>
//                     <div className="flex items-center gap-4 text-sm text-blue-600 mb-6">
//                       <span className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         {currentTask.duration}
//                       </span>
//                       <span>•</span>
//                       <div className="border border-gray-300 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors">
//                         {currentTask.difficulty}
//                       </div>
//                     </div>
//                     <p className="text-gray-700 leading-relaxed text-lg">
//                       {currentTask.description}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* What you'll learn */}
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <BookOpen className="h-5 w-5 text-green-600" />
//                         <h4 className="font-semibold text-gray-900 text-lg">What you'll learn</h4>
//                       </div>
//                       <ul className="space-y-3">
//                         {currentTask.whatYoullLearn.map((item, index) => (
//                           <li key={index} className="text-gray-700 flex items-start gap-3">
//                             <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                             <span>{item}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* What you'll do */}
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <Target className="h-5 w-5 text-blue-600" />
//                         <h4 className="font-semibold text-gray-900 text-lg">What you'll do</h4>
//                       </div>
//                       <ul className="space-y-3">
//                         {currentTask.whatYoullDo.map((item, index) => (
//                           <li key={index} className="text-gray-700 flex items-start gap-3">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                             <span>{item}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </section>

//             {/* Reviews Section */}
//             <section id="reviews" className="scroll-mt-24">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
//                 <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
//                   <Star className="h-4 w-4 text-yellow-600" />
//                 </div>
//                 Reviews
//               </h2>
//               <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-8 text-center">
//                 <div className="max-w-md mx-auto">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Star className="h-8 w-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
//                   <p className="text-gray-600">Be the first to complete this simulation and leave a review!</p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-32 space-y-6">
//               <div className="rounded-lg border bg-white text-gray-900 shadow-sm p-6">
//                 <div className="p-0 mb-4">
//                   <h3 className="text-lg font-semibold leading-none tracking-tight">Skills You'll Practice</h3>
//                 </div>
//                 <div className="p-0">
//                   <div className="flex flex-wrap gap-2">
//                     {simulation.skills.map((skill, index) => (
//                       <div key={index} className="border border-gray-300 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors">
//                         {skill}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 shadow-sm p-6">
//                 <div className="p-0 text-center">
//                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <Award className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Earn a Certificate</h3>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Complete all tasks to earn your certificate and showcase your skills.
//                   </p>
//                   <button 
//                     className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-300 bg-transparent text-blue-700 hover:bg-blue-50 w-full h-10 px-4 py-2"
//                     onClick={handleStartProgram}
//                   >
//                     Get Started
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimulationDetail;
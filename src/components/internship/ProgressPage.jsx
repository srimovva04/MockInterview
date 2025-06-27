import React, { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  Trophy,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  fetchSimulations,
  fetchTasksForSimulation,
} from "../utils/simulations";
import { UserAuth } from "../Auth/AuthContext"; // adjust path if needed
import { supabase } from "../utils/supabaseClient";

const TaskItem = ({ task, number }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <Check className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return (
          <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse" />
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full opacity-50" />
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-4 px-4 transition-all duration-200 ${
        task.status !== "locked"
          ? "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer"
          : "opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-gray-800">
              Task {number}: {task.title}
            </p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(
                task.difficulty
              )}`}
            >
              {task.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{task.duration}</p>
          {task.updated_at && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {new Date(task.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {task.status === "in_progress" && (
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <span className="text-sm">Continue</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      )}
    </div>
  );
};

const ProgressPage = () => {
  const [simulations, setSimulations] = useState([]);
  const [openSimIds, setOpenSimIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { session } = UserAuth();
  const user = session?.user;

  const toggleAccordion = (id) => {
    setOpenSimIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Function to get user's task progress directly from user_task_progress table
  const getUserTaskProgress = async (userId) => {
    try {
      const { data: progressData, error } = await supabase
        .from("user_task_progress")
        .select(
          `
          simulation_id,
          task_id,
          status,
          updated_at
        `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user task progress:", error);
        throw error;
      }

      return progressData || [];
    } catch (error) {
      console.error("Error in getUserTaskProgress:", error);
      throw error;
    }
  };

  // Function to merge task data with user progress
  const mergeTasksWithProgress = (tasks, progressData, simulationId) => {
    return tasks.map((task) => {
      const progress = progressData.find(
        (p) => p.task_id === task.id && p.simulation_id === simulationId
      );

      return {
        ...task,
        status: progress?.status || "not_started",
        updated_at: progress?.updated_at || null,
      };
    });
  };

  useEffect(() => {
    const loadSimulationsWithProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all simulations
        const simData = await fetchSimulations();
        console.log("Fetched simulations:", simData);

        // Get all user task progress at once
        const allUserProgress = await getUserTaskProgress(user.id);
        console.log("User task progress:", allUserProgress);

        // Get unique simulation IDs from user progress
        const userSimulationIds = [
          ...new Set(allUserProgress.map((p) => p.simulation_id)),
        ];
        console.log("User has progress in simulations:", userSimulationIds);

        // Filter simulations to only show those the user has started
        const userSimulations = simData.filter((sim) =>
          userSimulationIds.includes(sim.id)
        );
        console.log("Filtered user simulations:", userSimulations);

        // Process each simulation with user progress
        const simulationsWithProgress = await Promise.all(
          userSimulations.map(async (sim) => {
            try {
              // Get all tasks for this simulation
              const allTasks = await fetchTasksForSimulation(sim.id);

              // Filter progress data for this simulation
              const simProgressData = allUserProgress.filter(
                (p) => p.simulation_id === sim.id
              );

              // Only include tasks that the user has progress on
              const userTasks = allTasks.filter((task) =>
                simProgressData.some((p) => p.task_id === task.id)
              );

              // Merge tasks with progress
              const tasksWithProgress = mergeTasksWithProgress(
                userTasks,
                simProgressData,
                sim.id
              );

              // Calculate progress statistics
              const completedTasks = tasksWithProgress.filter(
                (t) => t.status === "completed"
              ).length;
              const inProgressTasks = tasksWithProgress.filter(
                (t) => t.status === "in_progress"
              ).length;
              const totalTasks = tasksWithProgress.length;
              const progress = totalTasks
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

              // Determine overall simulation status
              let status = "not_started";
              if (completedTasks === totalTasks && totalTasks > 0) {
                status = "completed";
              } else if (completedTasks > 0 || inProgressTasks > 0) {
                status = "in_progress";
              }

              return {
                ...sim,
                tasks: tasksWithProgress,
                completedTasks,
                totalTasks,
                progress,
                status,
              };
            } catch (error) {
              console.error(`Error processing simulation ${sim.id}:`, error);
              return {
                ...sim,
                tasks: [],
                completedTasks: 0,
                totalTasks: 0,
                progress: 0,
                status: "error",
              };
            }
          })
        );

        // Sort simulations by progress (in progress first, then completed, then not started)
        const sortedSimulations = simulationsWithProgress.sort((a, b) => {
          if (a.status === "in_progress" && b.status !== "in_progress")
            return -1;
          if (b.status === "in_progress" && a.status !== "in_progress")
            return 1;
          if (a.status === "completed" && b.status === "not_started") return -1;
          if (b.status === "completed" && a.status === "not_started") return 1;
          return 0;
        });

        console.log("Final simulations with progress:", sortedSimulations);
        setSimulations(sortedSimulations);
      } catch (error) {
        console.error("Error loading simulations with progress:", error);
        setError("Failed to load your progress. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadSimulationsWithProgress();
  }, [user]);

  // Show message if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600">
            Please sign in to view your simulation progress.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Your Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your journey through professional simulations and unlock your
            potential
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your progress...</p>
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Progress Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't started any simulations yet. Begin your first
              simulation to see your progress here.
            </p>
            <button
              onClick={() => (window.location.href = "/simulations")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
            >
              Browse Simulations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {simulations.map((sim) => {
              const isOpen = openSimIds.includes(sim.id);
              return (
                <div
                  key={sim.id}
                  className="border-none bg-white rounded-2xl shadow-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(sim.id)}
                    className="w-full text-left px-8 py-6 hover:bg-gray-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner text-2xl">
                      💼
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {sim.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{sim.company}</span>
                        <span>•</span>
                        <span>{sim.level}</span>
                        <span>•</span>
                        <span>{sim.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {sim.completedTasks}/{sim.totalTasks} Tasks
                        </p>
                        <p className="text-xs text-gray-500">
                          {sim.progress}% Complete
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sim.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : sim.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : sim.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sim.status === "not_started"
                          ? "Not Started"
                          : sim.status === "in_progress"
                          ? "In Progress"
                          : sim.status === "error"
                          ? "Error"
                          : "Completed"}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-8 pb-8">
                      {sim.status !== "error" ? (
                        <>
                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <Check className="w-5 h-5 text-yellow-500" />
                              Your Tasks ({sim.tasks.length} started)
                            </h4>
                            {sim.tasks.length > 0 ? (
                              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                {sim.tasks.map((task, index) => (
                                  <TaskItem
                                    key={`${sim.id}-${task.id}`}
                                    task={task}
                                    number={index + 1}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">
                                No tasks started yet
                              </p>
                            )}
                          </div>

                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-purple-500" />
                              Achievements
                            </h4>
                            <div
                              className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                                sim.status === "completed"
                                  ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <Trophy
                                  className={`w-8 h-8 ${
                                    sim.status === "completed"
                                      ? "text-yellow-500"
                                      : "text-gray-400"
                                  }`}
                                />
                                <div>
                                  {sim.status === "completed" ? (
                                    <div>
                                      <p className="font-bold text-green-700 text-lg">
                                        🎉 Certificate Earned!
                                      </p>
                                      <p className="text-green-600">
                                        Congratulations on completing this
                                        simulation
                                      </p>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="font-semibold text-gray-700">
                                        Certificate Available
                                      </p>
                                      <p className="text-gray-500">
                                        Complete all tasks to unlock your
                                        certificate
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                // Find the first incomplete task or the first task if all are complete
                                const inProgressTask = sim.tasks.find(
                                  (t) => t.status === "in_progress"
                                );
                                const firstIncompleteTask = sim.tasks.find(
                                  (t) => t.status !== "completed"
                                );
                                const targetTask =
                                  inProgressTask ||
                                  firstIncompleteTask ||
                                  sim.tasks[0];

                                if (targetTask) {
                                  const taskIndex =
                                    sim.tasks.findIndex(
                                      (t) => t.id === targetTask.id
                                    ) + 1;
                                  window.location.href = `/internship/${sim.id}/task/${taskIndex}`;
                                }
                              }}
                              className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                                sim.status === "completed"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : sim.status === "in_progress"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                                  : "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
                              }`}
                            >
                              {sim.status === "completed"
                                ? "View Completed Tasks"
                                : sim.status === "in_progress"
                                ? "Continue Simulation"
                                : "Start Simulation"}
                            </button>
                            {sim.status === "completed" && (
                              <button className="px-6 py-4 border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors">
                                View Certificate
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <p className="text-red-600 font-medium">
                            Error loading simulation data
                          </p>
                          <p className="text-gray-500 text-sm">
                            Please refresh the page to try again
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

// import React, { useState, useEffect } from 'react';
// import { Check, ArrowRight, Trophy, ChevronDown } from 'lucide-react';
// import { fetchSimulations, fetchTasksForSimulation } from '../utils/simulations';
// import { getTasksWithUserProgress } from '../utils/simulations';
// import { useUser } from '@supabase/auth-helpers-react';

// const TaskItem = ({ task, number }) => {
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'Easy': return 'bg-green-100 text-green-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Hard': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = () => {
//     switch (task.status) {
//       case 'completed':
//         return <Check className="w-5 h-5 text-green-500" />;
//       case 'in_progress':
//         return <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse" />;
//       default:
//         return <div className="w-5 h-5 border-2 border-gray-300 rounded-full opacity-50" />;
//     }
//   };

//   return (
//     <div className={`flex items-center justify-between py-4 px-4 transition-all duration-200 ${
//       task.status !== 'locked' ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer' : 'opacity-60'
//     }`}>
//       <div className="flex items-center gap-4">
//         {getStatusIcon()}
//         <div className="flex-1">
//           <div className="flex items-center gap-3">
//             <p className="font-semibold text-gray-800">Task {number}: {task.title}</p>
//             <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(task.difficulty)}`}>
//               {task.difficulty}
//             </span>
//           </div>
//           <p className="text-sm text-gray-500 mt-1">30–60 mins</p>
//         </div>
//       </div>
//       {task.status === 'in_progress' && (
//         <div className="flex items-center gap-2 text-blue-600 font-medium">
//           <span className="text-sm">Continue</span>
//           <ArrowRight className="w-4 h-4 animate-pulse" />
//         </div>
//       )}
//     </div>
//   );
// };

// const ProgressPage = () => {
//   const [simulations, setSimulations] = useState([]);
//   const [openSimIds, setOpenSimIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const toggleAccordion = (id) => {
//     setOpenSimIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

// const user = useUser();

// useEffect(() => {
//   const loadSimulationsWithProgress = async () => {
//     setLoading(true);
//     const simData = await fetchSimulations();

//     const simulationsWithProgress = await Promise.all(
//       simData.map(async (sim) => {
//         const tasks = await getTasksWithUserProgress(sim.id, user.id);
//         const completed = tasks.filter(t => t.status === 'completed').length;
//         const inProgress = tasks.filter(t => t.status === 'in_progress').length;
//         const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

//         let status = 'not_started';
//         if (completed === tasks.length && tasks.length > 0) status = 'completed';
//         else if (completed > 0 || inProgress > 0) status = 'in_progress';

//         return {
//           ...sim,
//           tasks,
//           completedTasks: completed,
//           totalTasks: tasks.length,
//           progress,
//           status
//         };
//       })
//     );

//     setSimulations(simulationsWithProgress);
//     setLoading(false);
//   };

//   if (user) loadSimulationsWithProgress();
// }, [user]);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       const simData = await fetchSimulations();

//       const simulationsWithTasks = await Promise.all(
//         simData.map(async (sim) => {
//           const tasks = await fetchTasksForSimulation(sim.id);
//           const completedTasks = tasks.filter(task => task.status === 'completed').length;
//           const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

//           return {
//             ...sim,
//             tasks,
//             completedTasks,
//             totalTasks: tasks.length,
//             progress
//           };
//         })
//       );

//       setSimulations(simulationsWithTasks);
//       setLoading(false);
//     };

//     loadData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
//             Your Progress
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Track your journey through professional simulations and unlock your potential
//           </p>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading simulations...</p>
//         ) : (
//           <div className="space-y-6 ">
//             {simulations.map(sim => {
//               const isOpen = openSimIds.includes(sim.id);
//               return (
//                 <div key={sim.id} className="border-none bg-white rounded-2xl shadow-lg overflow-hidden transition-all">
//                   <button
//                     onClick={() => toggleAccordion(sim.id)}
//                     className="w-full text-left px-8 py-6 hover:bg-gray-50 flex items-center gap-4"
//                   >
//                     <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner text-2xl">
//                         💼
//                     </div>

//                     <div className="flex-1">
//                       <h3 className="text-lg font-bold text-gray-900">{sim.title}</h3>
//                       <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
//                         <span>{sim.company}</span>
//                         <span>•</span>
//                         <span>{sim.level}</span>
//                         <span>•</span>
//                         <span>{sim.duration}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-right">
//                         <p className="text-sm font-semibold text-gray-900">{sim.completedTasks}/{sim.totalTasks} Tasks</p>
//                         <p className="text-xs text-gray-500">{sim.progress}% Complete</p>
//                       </div>
//                       <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         sim.status === 'completed' ? 'bg-green-100 text-green-800' :
//                         sim.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//                         'bg-gray-100 text-gray-600'
//                       }`}>
//                         {sim.status === 'not_started' ? 'Not Started' : sim.status === 'in_progress' ? 'In Progress' : 'Completed'}
//                       </div>
//                       <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                     </div>
//                   </button>

//                   {isOpen && (
//                     <div className="px-8 pb-8">
//                       <div className="mb-6">
//                         <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                           <Check className="w-5 h-5 text-yellow-500" />
//                           Tasks
//                         </h4>
//                         <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
//                           {sim.tasks.map((task, index) => (
//                             <TaskItem key={`${sim.id}-${index}`} task={task} number={index + 1} />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="mb-6">
//                         <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                           <Trophy className="w-5 h-5 text-purple-500" />
//                           Achievements
//                         </h4>
//                         <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${
//                           sim.status === 'completed'
//                             ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
//                             : 'border-gray-200 bg-gray-50'
//                         }`}>
//                           <div className="flex items-center gap-4">
//                             <Trophy className={`w-8 h-8 ${sim.status === 'completed' ? 'text-yellow-500' : 'text-gray-400'}`} />
//                             <div>
//                               {sim.status === 'completed' ? (
//                                 <div>
//                                   <p className="font-bold text-green-700 text-lg">🎉 Certificate Earned!</p>
//                                   <p className="text-green-600">Congratulations on completing this simulation</p>
//                                 </div>
//                               ) : (
//                                 <div>
//                                   <p className="font-semibold text-gray-700">Certificate Available</p>
//                                   <p className="text-gray-500">Complete all tasks to unlock your certificate</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex gap-3">
//                         <button
//                           className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
//                             sim.status === 'completed'
//                               ? 'bg-green-500 hover:bg-green-600 text-white'
//                               : sim.status === 'in_progress'
//                               ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
//                               : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white'
//                           }`}
//                         >
//                           {sim.status === 'completed' ? '✓ Completed' :
//                             sim.status === 'in_progress' ? 'Continue Simulation' : 'Start Simulation'}
//                         </button>
//                         {sim.status === 'completed' && (
//                           <button className="px-6 py-4 border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors">
//                             View Certificate
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProgressPage;

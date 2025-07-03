
import React, { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  Trophy,
  ChevronDown,
  AlertCircle,
  Rows,
  ArrowLeft,
} from "lucide-react";
import {
  fetchSimulations,
  fetchTasksForSimulation,
} from "../utils/simulations";
import { UserAuth } from "../Auth/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";


const TaskItem = ({ task, number, onClick, simulationId  }) => {

    const navigate = useNavigate();

  const getConfirmationStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
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
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray-800">
                Task {number}: {task.title}
              </p>

              <div className="flex gap-4 text-sm text-gray-600">
                {task.status && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Submission:</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                )}

                {task.confirmation_status && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Confirmation:</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getConfirmationStatusColor(
                        task.confirmation_status
                      )}`}
                    >
                      {task.confirmation_status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1 flex-wrap">
              {task.updated_at && (
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(task.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {(task.status === "in_progress" || task.confirmation_status === "rejected") && (
          <div
            className="flex items-center gap-2 text-blue-600 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/internship/${simulationId}/task/${number}`);
            }}
          >
            <span className="text-sm">
              {task.confirmation_status === "rejected" ? "Redo" : "Continue"}
            </span>
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
    const navigate = useNavigate();
  

  const { session } = UserAuth();
  const user = session?.user;

  const toggleAccordion = (id) => {
    setOpenSimIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getUserTaskProgress = async (userId) => {
    try {
      const { data: progressData, error } = await supabase
        .from("user_task_progress")
        .select(`simulation_id, task_id, status, updated_at, confirmation_status`)
        .eq("user_id", userId);

      if (error) throw error;
      return progressData || [];
    } catch (error) {
      console.error("Error in getUserTaskProgress:", error);
      throw error;
    }
  };

  const mergeTasksWithProgress = (tasks, progressData, simulationId) => {
    return tasks.map((task) => {
      const progress = progressData.find(
        (p) => p.task_id === task.id && p.simulation_id === simulationId
      );
      return {
        ...task,
        status: progress?.status || "not_started",
        updated_at: progress?.updated_at || null,
        confirmation_status: progress?.confirmation_status || null,
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

        const simData = await fetchSimulations();
        const allUserProgress = await getUserTaskProgress(user.id);

        const userSimulationIds = [
          ...new Set(allUserProgress.map((p) => p.simulation_id)),
        ];

        const userSimulations = simData.filter((sim) =>
          userSimulationIds.includes(sim.id)
        );

        const simulationsWithProgress = await Promise.all(
          userSimulations.map(async (sim) => {
            const allTasks = await fetchTasksForSimulation(sim.id);
            const simProgressData = allUserProgress.filter(
              (p) => p.simulation_id === sim.id
            );

            const userTasks = allTasks.filter((task) =>
              simProgressData.some((p) => p.task_id === task.id)
            );

            const tasksWithProgress = mergeTasksWithProgress(
              userTasks,
              simProgressData,
              sim.id
            );

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
          })
        );

        const sortedSimulations = simulationsWithProgress.sort((a, b) => {
          const statusOrder = {
            in_progress: 0,
            completed: 1,
            not_started: 2,
            error: 3,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        });

        setSimulations(sortedSimulations);
      } catch (error) {
        setError("Failed to load your progress. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadSimulationsWithProgress();
  }, [user]);

  const handleNavigateToTask = (sim) => {
    const inProgressTask = sim.tasks.find((t) => t.status === "in_progress");
    const firstIncompleteTask = sim.tasks.find((t) => t.status !== "completed");
    const targetTask = inProgressTask || firstIncompleteTask || sim.tasks[0];

    if (targetTask) {
      const taskIndex = sim.tasks.findIndex((t) => t.id === targetTask.id) + 1;
      window.location.href = `/internship/${sim.id}/task/${taskIndex}`;
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "not_started":
        return "Not Started";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getButtonClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "in_progress":
        return "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white";
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case "completed":
        return "View Completed Tasks";
      case "in_progress":
        return "Continue Simulation";
      default:
        return "Start Simulation";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-blue-500" />
        <p>Please sign in to view your progress.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
            onClick={() => navigate('/internship')}
            className="inline-flex items-center text-blue-950 hover:text-blue-500 mb-8 transition-colors group text-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to simulations
          </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Your Progress
        </h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : simulations.length === 0 ? (
          <div className="text-center">
            <p className="text-lg">You haven't started any simulations yet.</p>
            <button
              onClick={() => (window.location.href = "/internship")}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Browse Simulations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {simulations.map((sim) => {
              const isOpen = openSimIds.includes(sim.id);
              return (
                <div key={sim.id} className="bg-white rounded-2xl shadow-lg">
                  <button
                    onClick={() => toggleAccordion(sim.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold py-2">{sim.title}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      {sim.tasks.some((t) => t.confirmation_status === "pending")
                     
                  }
                      <div className="border border-gray-200 rounded-xl divide-y">
                        {sim.tasks.map((task, index) => (
                          <TaskItem
                            key={`${sim.id}-${task.id}`}
                            task={task}
                            number={index + 1}
                            simulationId={sim.id}

                            onClick={() =>
                              (window.location.href = `/internship/${sim.id}/task/${index + 1}`)
                            }
                          />
                        ))}
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => handleNavigateToTask(sim)}
                          className={`flex-1 py-3 rounded-lg font-semibold ${getButtonClasses(sim.status)}`}
                        >
                          {getButtonText(sim.status)}
                        </button>
                        {sim.status === "completed" && (
                          <button className="px-6 py-3 border-2 border-green-500 text-green-600 font-bold rounded-lg hover:bg-green-50">
                            View Certificate
                          </button>
                        )}
                      </div>
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
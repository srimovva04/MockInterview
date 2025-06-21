import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Trophy, ChevronDown } from 'lucide-react';
import { fetchSimulations, fetchTasksForSimulation } from '../utils/simulations';

const TaskItem = ({ task, number }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full opacity-50" />;
    }
  };

  return (
    <div className={`flex items-center justify-between py-4 px-4 transition-all duration-200 ${
      task.status !== 'locked' ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer' : 'opacity-60'
    }`}>
      <div className="flex items-center gap-4">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-gray-800">Task {number}: {task.title}</p>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">30–60 mins</p>
        </div>
      </div>
      {task.status === 'in_progress' && (
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

  const toggleAccordion = (id) => {
    setOpenSimIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const simData = await fetchSimulations();

      const simulationsWithTasks = await Promise.all(
        simData.map(async (sim) => {
          const tasks = await fetchTasksForSimulation(sim.id);
          const completedTasks = tasks.filter(task => task.status === 'completed').length;
          const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

          return {
            ...sim,
            tasks,
            completedTasks,
            totalTasks: tasks.length,
            progress
          };
        })
      );

      setSimulations(simulationsWithTasks);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your journey through professional simulations and unlock your potential
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading simulations...</p>
        ) : (
          <div className="space-y-6 ">
            {simulations.map(sim => {
              const isOpen = openSimIds.includes(sim.id);
              return (
                <div key={sim.id} className="border-none bg-white rounded-2xl shadow-lg overflow-hidden transition-all">
                  <button
                    onClick={() => toggleAccordion(sim.id)}
                    className="w-full text-left px-8 py-6 hover:bg-gray-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner text-2xl">
                        💼
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{sim.title}</h3>
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
                        <p className="text-sm font-semibold text-gray-900">{sim.completedTasks}/{sim.totalTasks} Tasks</p>
                        <p className="text-xs text-gray-500">{sim.progress}% Complete</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sim.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sim.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {sim.status === 'not_started' ? 'Not Started' : sim.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </div>
                      <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-8 pb-8">
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Check className="w-5 h-5 text-yellow-500" />
                          Tasks
                        </h4>
                        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                          {sim.tasks.map((task, index) => (
                            <TaskItem key={`${sim.id}-${index}`} task={task} number={index + 1} />
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-purple-500" />
                          Achievements
                        </h4>
                        <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                          sim.status === 'completed' 
                            ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <Trophy className={`w-8 h-8 ${sim.status === 'completed' ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <div>
                              {sim.status === 'completed' ? (
                                <div>
                                  <p className="font-bold text-green-700 text-lg">🎉 Certificate Earned!</p>
                                  <p className="text-green-600">Congratulations on completing this simulation</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-semibold text-gray-700">Certificate Available</p>
                                  <p className="text-gray-500">Complete all tasks to unlock your certificate</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                            sim.status === 'completed'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : sim.status === 'in_progress'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                              : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white'
                          }`}
                        >
                          {sim.status === 'completed' ? '✓ Completed' :
                            sim.status === 'in_progress' ? 'Continue Simulation' : 'Start Simulation'}
                        </button>
                        {sim.status === 'completed' && (
                          <button className="px-6 py-4 border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors">
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


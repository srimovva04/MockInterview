import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchSimulations, 
  fetchTasksForSimulation, 
  updateTaskProgress, 
  getTasksWithUserProgress 
} from '../utils/simulations';
import { CheckCircle, PlayCircle, Briefcase, Check, AlertCircle } from 'lucide-react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';

const TaskStepper = ({ tasks, currentTaskIndex, simulationId }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6 shadow-md hidden md:block">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="text-blue-600 w-5 h-5" />
        <span className="text-lg font-semibold text-gray-800">Career Simulation</span>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => {
          const isCompleted = task.status === 'completed';
          const isCurrent = index === currentTaskIndex;
          const isInProgress = task.status === 'in_progress';

          return (
            <button
              key={task.id}
              onClick={() => navigate(`/internship/${simulationId}/task/${index + 1}`)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-150 flex items-start space-x-3 ${
                isCurrent
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                  : isCompleted
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div
                className={`w-6 h-6 text-sm rounded-full flex items-center justify-center border ${
                  isCompleted
                    ? 'bg-green-600 text-white border-green-600'
                    : isCurrent || isInProgress
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-400 text-gray-500'
                }`}
              >
                {isCompleted ? <Check size={14} /> : index + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.duration} • {task.difficulty}
                </p>
                {isCompleted && (
                  <p className="text-xs text-green-600 font-medium">✓ Completed</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const TaskOverview = ({ task }) => {
  // Normalize learn points: handle comma-separated string or array
  const learnPoints = typeof task.what_youll_learn === 'string'
    ? task.what_youll_learn.split(',').map((p) => p.trim()).filter(Boolean)
    : Array.isArray(task.what_youll_learn)
    ? task.what_youll_learn.filter(Boolean)
    : [];

  // Normalize do points: same as above
  const doPoints = typeof task.what_youll_do === 'string'
    ? task.what_youll_do.split(',').map((p) => p.trim()).filter(Boolean)
    : Array.isArray(task.what_youll_do)
    ? task.what_youll_do.filter(Boolean)
    : [];

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {/* What You'll Learn */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Learn</h3>
        {learnPoints.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
            {learnPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">No learning objectives provided.</p>
        )}
      </div>

      {/* What You'll Do */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Do</h3>
        {doPoints.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
            {doPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">No actions defined for this task.</p>
        )}
      </div>
    </section>
  );
};

const VideoMessage = ({ url }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Company Message</h3>
      </div>
      {url ? (
        <video controls className="w-full rounded-lg" poster="/video-poster.jpg">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="text-sm text-gray-500 italic p-4 text-center">No video available for this task.</div>
      )}
    </div>
  );
};

const SimulationTaskPage = () => {
  const { id, taskId } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [simulation, setSimulation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState(null);

  // Direct Supabase auth check with improved error handling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        console.log('=== DIRECT SUPABASE AUTH CHECK ===');
        console.log('Direct supabase auth user:', authUser);
        console.log('Direct supabase auth error:', error);
        console.log('useUser hook result:', user);
        console.log('================================');
        
        if (error) {
          console.error('Auth check error:', error);
          setError('Authentication error. Please refresh the page.');
        }
        
        setCurrentUser(authUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setCurrentUser(null);
        setError('Failed to check authentication status.');
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setCurrentUser(session?.user || null);
      setError(null); // Clear error on auth change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Get the authenticated user (prioritize direct check over hook)
  const getAuthenticatedUser = useCallback(() => {
    const authUser = currentUser || user;
    console.log('Getting authenticated user:', {
      currentUser,
      hookUser: user,
      selected: authUser
    });
    return authUser;
  }, [currentUser, user]);

  // Improved task progress update function
  const handleUpdateTaskProgress = useCallback(async (taskId, status) => {
    const authUser = getAuthenticatedUser();
    
    if (!authUser) {
      console.error('No authenticated user found:', {
        currentUser,
        hookUser: user,
        authLoading
      });
      setError('Please sign in to continue with the simulation.');
      return false;
    }

    try {
      console.log('Updating task progress with user:', {
        userId: authUser.id,
        simulationId: parseInt(id),
        taskId,
        status
      });

      const result = await updateTaskProgress(authUser.id, parseInt(id), taskId, status);
      
      if (result) {
        // Update local state optimistically
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: status, updated_at: new Date().toISOString() }
              : task
          )
        );
        
        console.log('Task progress updated successfully');
        return true;
      } else {
        throw new Error('No result returned from updateTaskProgress');
      }
    } catch (error) {
      console.error('Failed to update task progress:', error);
      
      // More specific error messages
      if (error.message?.includes('permission') || error.message?.includes('auth')) {
        setError('Authentication error. Please sign in again.');
      } else if (error.message?.includes('network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Error updating progress: ${error.message || 'Unknown error'}`);
      }
      
      return false;
    }
  }, [getAuthenticatedUser, id, currentUser, user, authLoading]);

  // Improved function to load tasks with user progress
  const loadTasksWithProgress = useCallback(async (simulationId) => {
    const authUser = getAuthenticatedUser();
    
    if (!authUser) {
      console.log('No authenticated user, loading tasks without progress');
      try {
        const simTasks = await fetchTasksForSimulation(simulationId);
        return simTasks.map(task => ({ ...task, status: 'not_started' }));
      } catch (error) {
        console.error('Error loading tasks:', error);
        throw error;
      }
    }

    try {
      // Use the utility function for consistency
      const tasksWithProgress = await getTasksWithUserProgress(simulationId, authUser.id);
      return tasksWithProgress;
    } catch (error) {
      console.error('Error loading tasks with progress:', error);
      throw error;
    }
  }, [getAuthenticatedUser]);

  // Main data loading effect
  useEffect(() => {
    const loadSimulation = async () => {
      // Wait for auth to load before proceeding
      if (authLoading) {
        return;
      }

      console.log('Loading simulation, auth user:', getAuthenticatedUser());
      
      try {
        setLoading(true);
        setError(null);
        
        const sims = await fetchSimulations();
        console.log('Fetched simulations:', sims);
        
        const sim = sims.find((s) => s.id === parseInt(id));
        console.log('Found simulation:', sim);
        
        if (!sim) {
          setError('Simulation not found.');
          return;
        }
        
        setSimulation(sim);

        // Load tasks with user progress
        const tasksWithProgress = await loadTasksWithProgress(sim.id);
        console.log('Tasks with progress:', tasksWithProgress);
        setTasks(tasksWithProgress);

        // Mark current task as in_progress if user is logged in and task is not started
        const authUser = getAuthenticatedUser();
        if (authUser && tasksWithProgress.length > 0) {
          const currentTaskIndex = parseInt(taskId) - 1;
          const currentTask = tasksWithProgress[currentTaskIndex];
          
          if (currentTask && currentTask.status === 'not_started') {
            // Don't await this to avoid blocking the UI
            handleUpdateTaskProgress(currentTask.id, 'in_progress').catch(console.error);
          }
        }
      } catch (error) {
        console.error('Error loading simulation:', error);
        setError('Failed to load simulation. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadSimulation();
  }, [id, taskId, authLoading, getAuthenticatedUser, loadTasksWithProgress, handleUpdateTaskProgress]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading simulation...</p>
          <p className="text-sm text-gray-400 mt-2">
            User: {getAuthenticatedUser()?.email || 'Not authenticated'}
          </p>
        </div>
      </div>
    );
  }

  const index = parseInt(taskId) - 1;
  const currentTask = tasks[index];
  const currentTaskIndex = index;
  const nextTask = tasks[currentTaskIndex + 1];
  const isLastTask = currentTaskIndex === tasks.length - 1;

  if (!simulation || !currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h2>
          <p className="text-gray-600 mb-6">The requested task could not be found.</p>
          <button
            onClick={() => navigate(`/internship/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Simulation
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteAndNext = async () => {
    setIsCompleting(true);
    setError(null);
    
    try {
      // Mark current task as completed
      const success = await handleUpdateTaskProgress(currentTask.id, 'completed');
      
      if (success) {
        if (nextTask) {
          // Mark next task as in_progress and navigate
          await handleUpdateTaskProgress(nextTask.id, 'in_progress');
          navigate(`/internship/${id}/task/${currentTaskIndex + 2}`);
        } else {
          // All tasks completed, navigate to completion page or progress page
          navigate(`/progress`);
        }
      } else {
        console.error('Failed to update task progress');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipToNext = () => {
    if (nextTask) {
      navigate(`/internship/${id}/task/${currentTaskIndex + 2}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <TaskStepper tasks={tasks} currentTaskIndex={currentTaskIndex} simulationId={id} />

      <main className="flex-1 p-6 md:p-10 space-y-10">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{currentTask.fullTitle}</h1>
          <p className="text-sm text-gray-500">
            A task from <span className="font-medium">{simulation.company}</span>
          </p>
          {currentTask.status === 'completed' && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Check size={16} />
              <span className="text-sm">Task Completed</span>
            </div>
          )}
          {/* Show auth status for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400">
              User: {getAuthenticatedUser()?.email || 'Not authenticated'}
            </div>
          )}
        </header>

        <TaskOverview task={currentTask} />
        <VideoMessage url={currentTask.videoUrl} />

        <div className="pt-4 space-y-3">
          {/* Primary action button */}
          <div className="flex gap-3">
            <button
              onClick={handleCompleteAndNext}
              disabled={isCompleting}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg shadow transition-all font-semibold text-sm ${
                currentTask.status === 'completed'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isCompleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Check size={18} />
                  {isLastTask 
                    ? 'Complete Simulation' 
                    : currentTask.status === 'completed'
                    ? `Next: ${nextTask?.title || 'Continue'}`
                    : `Complete & Next: ${nextTask?.title || 'Finish'}`
                  }
                </>
              )}
            </button>

            {/* Skip button for non-completed tasks */}
            {currentTask.status !== 'completed' && nextTask && (
              <button
                onClick={handleSkipToNext}
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-3 rounded-lg transition-all"
              >
                Skip to Next
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="text-xs text-gray-500">
            Task {currentTaskIndex + 1} of {tasks.length} • {simulation.company}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimulationTaskPage;
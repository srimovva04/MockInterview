import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { supabase } from '../utils/supabaseClient';

function SimulationsManager() {
  const { id } = useParams(); // If ID exists, show details; otherwise show grid
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState(id ? 'details' : 'grid');
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (id) {
      setView('details');
      fetchSimulationDetails();
    } else {
      setView('grid');
      fetchSimulations();
    }
  }, [id]);

  // Fetch all simulations for grid view
  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select(`
          id,
          company,
          title,
          description,
          category,
          difficulty,
          duration,
          rating,
          image,
          overview
        `);

      if (error) throw error;
      setSimulations(data || []);
    } catch (err) {
      console.error('Error fetching simulations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single simulation details
  const fetchSimulationDetails = async () => {
    setLoading(true);
    try {
      // Fetch simulation data
      const { data: simulationData, error: simError } = await supabase
        .from('simulations')
        .select('*')
        .eq('id', id)
        .single();

      if (simError) throw simError;
      if (!simulationData) throw new Error('Simulation not found');

      setSelectedSimulation(simulationData);
      setFormState(simulationData); 

      // Fetch associated tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('simulation_id', id)
        .order('id', { ascending: true });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      }

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error fetching simulation details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationClick = (simulationId) => {
    navigate(`/edit-internship/${simulationId}`);
  };

  const handleBackToGrid = () => {
    navigate('/edit-internship');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this simulation? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete associated tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('simulation_id', selectedSimulation.id);

      if (tasksError) {
        console.error('Error deleting tasks:', tasksError);
        alert('Warning: Failed to delete some tasks, but continuing...');
      }

      // Then delete the simulation
      const { error: simError } = await supabase
        .from('simulations')
        .delete()
        .eq('id', selectedSimulation.id);

      if (simError) throw simError;

      alert('Simulation deleted successfully!');
      navigate('/edit-internship');
    } catch (err) {
      console.error('Error deleting simulation:', err);
      alert(`Failed to delete simulation: ${err.message}`);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form state to original data
    setFormState(selectedSimulation);
    // Reset tasks to original data by refetching
    fetchSimulationDetails();
  };

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

const handleSaveEdit = async () => {
  try {
    setLoading(true);
    
    console.log('Starting save operation...');
    console.log('Form state:', formState);
    console.log('Tasks to update:', tasks);
    
    // 1. Update simulation info - Remove id field
    const { id, ...simulationUpdateData } = formState;
    
    console.log('Simulation data to update:', simulationUpdateData);
    
    const { data: updatedSimulation, error: simError } = await supabase
      .from('simulations')
      .update(simulationUpdateData)
      .eq('id', selectedSimulation.id)
      .select(); // This will show if anything was actually updated

    if (simError) {
      console.error('Simulation update error:', simError);
      throw simError;
    }
    
    console.log('Simulation update result:', updatedSimulation);
    
    if (!updatedSimulation || updatedSimulation.length === 0) {
      console.warn('No simulation rows were updated!');
    }

    // 2. Update tasks
    for (const task of tasks) {
      const { id: taskId, simulation_id, ...taskData } = task;
      
      console.log(`Updating task ${taskId}:`, taskData);
      
      const { data: updatedTask, error: taskError } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', taskId)
        .select();

      if (taskError) {
        console.error(`Error updating task ${taskId}:`, taskError);
        throw new Error(`Failed to update task: ${task.full_title || task.title} - ${taskError.message}`);
      }
      
      console.log(`Task ${taskId} update result:`, updatedTask);
      
      if (!updatedTask || updatedTask.length === 0) {
        console.warn(`No rows updated for task ${taskId}`);
      }
    }

    // 3. Refresh data
    await fetchSimulationDetails();
    setIsEditing(false);
    
    alert('Save operation completed! Check console for details.');
  } catch (err) {
    console.error('Error saving simulation:', err);
    alert(`Failed to save changes: ${err.message}`);
  } finally {
    setLoading(false);
  }
};  

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-xl text-gray-600">
            {view === 'details' ? 'Loading simulation details...' : 'Loading simulations...'}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">❌</div>
            <div className="text-xl text-red-600 mb-4">{error}</div>
            <button
              onClick={view === 'details' ? handleBackToGrid : fetchSimulations}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {view === 'details' ? '← Back to Simulations' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  if (view === 'grid') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Simulations</h1>
                <p className="text-gray-600 mt-2">
                  Manage and view all internship simulations ({simulations.length} total)
                </p>
              </div>
              <button
                onClick={() => navigate('/add-internship')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>➕</span>
                Create New Simulation
              </button>
            </div>

            {/* Grid */}
            {simulations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No simulations found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first simulation</p>
                <button
                  onClick={() => navigate('/add-internship')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Simulation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulations.map((simulation) => (
                  <div
                    key={simulation.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                    onClick={() => handleSimulationClick(simulation.id)}
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      {simulation.image ? (
                        <img
                          src={simulation.image}
                          alt={simulation.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="text-white text-4xl font-bold">
                          {simulation.company?.charAt(0) || '🏢'}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {simulation.title}
                          </h3>
                          <p className="text-blue-600 font-medium text-sm">
                            {simulation.company}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {simulation.description || simulation.overview}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {simulation.category && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {simulation.category}
                          </span>
                        )}
                        {simulation.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(simulation.difficulty).replace('border-', '').replace(' border', '')}`}>
                            {simulation.difficulty}
                          </span>
                        )}
                        {simulation.duration && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            ⏱️ {simulation.duration}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-xs">
                          {renderStars(simulation.rating)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {simulation.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DETAILS VIEW
  if (view === 'details' && selectedSimulation) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <button
                  onClick={handleBackToGrid}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  ← Back to Simulations
                </button>
                <div className="flex gap-3">
                 {!isEditing ? (
                    <button
                      onClick={handleEditClick}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        disabled={loading}
                      >
                        {loading ? '⏳ Saving...' : '✅ Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        disabled={loading}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

{/* Hero Section */}
<div className="flex flex-col md:flex-row gap-6 mb-6">
  <div className="w-full md:w-1/3">
    {selectedSimulation.image ? (
      <img
        src={selectedSimulation.image}
        alt={selectedSimulation.title}
        className="w-full h-48 object-cover rounded-lg"
      />
    ) : (
      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
        {selectedSimulation.company?.charAt(0) || '🏢'}
      </div>
    )}
  </div>
  <div className="flex-1">
    {isEditing ? (
      <input
        type="text"
        value={formState.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        className="text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mb-2"
      />
    ) : (
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {selectedSimulation.title}
      </h1>
    )}

    {isEditing ? (
      <input
        type="text"
        value={formState.company || ''}
        onChange={(e) => handleInputChange('company', e.target.value)}
        className="text-xl font-semibold text-blue-600 border-b border-blue-300 focus:outline-none focus:border-blue-500 w-full mb-4"
      />
    ) : (
      <p className="text-xl text-blue-600 font-semibold mb-4">
        {selectedSimulation.company}
      </p>
    )}

    <div className="flex flex-wrap gap-3 mb-4">
      {isEditing ? (
        <input
          type="text"
          value={formState.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="px-3 py-1 border border-blue-200 rounded-full text-sm"
          placeholder="Category"
        />
      ) : selectedSimulation.category && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
          📂 {selectedSimulation.category}
        </span>
      )}

      {isEditing ? (
        <input
          type="text"
          value={formState.difficulty || ''}
          onChange={(e) => handleInputChange('difficulty', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-full text-sm"
          placeholder="Difficulty"
        />
      ) : selectedSimulation.difficulty && (
        <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(selectedSimulation.difficulty)}`}>
          🎯 {selectedSimulation.difficulty}
        </span>
      )}

      {isEditing ? (
        <input
          type="text"
          value={formState.duration || ''}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-full text-sm"
          placeholder="Duration"
        />
      ) : selectedSimulation.duration && (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
          ⏱️ {selectedSimulation.duration}
        </span>
      )}
    </div>
    <div className="mb-4">
      {renderStars(selectedSimulation.rating)}
    </div>
  </div>
</div>
</div>

{/* Details Sections */}
<div className="space-y-6">
  {/* Description */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">📝 Description</h2>
    {isEditing ? (
      <textarea
        value={formState.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
      />
    ) : (
      <p className="text-gray-700 leading-relaxed">{selectedSimulation.description}</p>
    )}
  </div>

  {/* Overview */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">🔍 Overview</h2>
    {isEditing ? (
      <textarea
        value={formState.overview || ''}
        onChange={(e) => handleInputChange('overview', e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
      />
    ) : (
      <p className="text-gray-700 leading-relaxed">{selectedSimulation.overview}</p>
    )}
  </div>

  {/* About Company */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">🏢 About Company</h2>
    {isEditing ? (
      <textarea
        value={formState.about_company || ''}
        onChange={(e) => handleInputChange('about_company', e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
      />
    ) : (
      <p className="text-gray-700 leading-relaxed">{selectedSimulation.about_company}</p>
    )}
  </div>

  {/* Features */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">⭐ Features</h2>
    {isEditing ? (
      <textarea
        value={formState.features || ''}
        onChange={(e) => handleInputChange('features', e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
      />
    ) : (
      <p className="text-gray-700 leading-relaxed">{selectedSimulation.features}</p>
    )}
  </div>

  {/* Skills */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">🎓 Skills You'll Learn</h2>
    {isEditing ? (
      <textarea
        value={formState.skills || ''}
        onChange={(e) => handleInputChange('skills', e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
      />
    ) : (
      <p className="text-gray-700 leading-relaxed">{selectedSimulation.skills}</p>
    )}
  </div>

  {/* Tasks */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">📋 Tasks ({tasks.length})</h2>
    </div>

    {tasks.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No tasks found for this simulation</p>
    ) : (
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={task.full_title || ''}
                  onChange={(e) => handleTaskChange(index, 'full_title', e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Full Title"
                />
                <textarea
                  value={task.description || ''}
                  onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                  className="w-full col-span-2 border rounded p-2 text-sm min-h-[80px]"
                  placeholder="Description"
                />
                <textarea
                  value={task.what_youll_learn || ''}
                  onChange={(e) => handleTaskChange(index, 'what_youll_learn', e.target.value)}
                  className="w-full col-span-2 border rounded p-2 text-sm min-h-[80px]"
                  placeholder="What you'll learn"
                />
                <textarea
                  value={task.what_youll_do || ''}
                  onChange={(e) => handleTaskChange(index, 'what_youll_do', e.target.value)}
                  className="w-full col-span-2 border rounded p-2 text-sm min-h-[80px]"
                  placeholder="What you'll do"
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {task.title} - {task.full_title}
                  </h3>
                  <div className="flex gap-2 text-xs">
                    {task.difficulty && (
                      <span className={`px-2 py-1 rounded ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                    )}
                    {task.duration && (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {task.duration}
                      </span>
                    )}
                  </div>
                </div>
                {task.description && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">Description:</h4>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                )}
                {task.what_youll_learn && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">What you'll learn:</h4>
                    <p className="text-gray-600 text-sm">{task.what_youll_learn}</p>
                  </div>
                )}
                {task.what_youll_do && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">What you'll do:</h4>
                    <p className="text-gray-600 text-sm">{task.what_youll_do}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Metadata */}
  <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
    <div className="flex justify-between">
      <span>Simulation ID: {selectedSimulation.id}</span>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default SimulationsManager;

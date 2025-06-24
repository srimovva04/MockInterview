import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from "react-router-dom";



function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function numberToWords(n) {
  const words = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
    'Seven', 'Eight', 'Nine', 'Ten',
  ];
  return words[n] || `${n}`;
}

function AddInternship() {

    const navigate = useNavigate();
  const [simulation, setSimulation] = useState({
    company: '',
    title: '',
    description: '',
    category: '',
    difficulty: '',
    duration: '',
    rating: null, // will always be null
    image: '',
    overview: '',
    about_company: '',
    features: '',
    skills: '',
  });

  const [tasks, setTasks] = useState([
    {
      title: '',
      full_title: '',
      duration: '',
      difficulty: '',
      description: '',
      what_youll_learn: '',
      what_youll_do: '',
    },
  ]);

  const durationOptions = ['1-2 hours', '3-4 hours', '1-2 weeks', '1-2 months'];
  const taskDurationOptions = ['15-30 mins', '30-60 mins', '1-2 hours'];
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSimulationChange = (e) => {
    const { name, value } = e.target;
    setSimulation((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...tasks];
    updated[index][name] = value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        full_title: '',
        duration: '',
        difficulty: '',
        description: '',
        what_youll_learn: '',
        what_youll_do: '',
      },
    ]);
  };

  const removeTask = (index) => {
    if (tasks.length === 1) {
        alert("At least one task is required.");
        return;
    }

    const updatedTasks = tasks.filter((_, idx) => idx !== index);
    setTasks(updatedTasks);
    };


    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Prepare simulation data
        const cleanedSimulation = {
        company: capitalizeWords(simulation.company),
        title: capitalizeWords(simulation.title),
        description: capitalizeWords(simulation.description),
        category: capitalizeWords(simulation.category),
        difficulty: simulation.difficulty,
        duration: simulation.duration,
        image: simulation.image,
        overview: capitalizeWords(simulation.overview),
        about_company: capitalizeWords(simulation.about_company),
        features: capitalizeWords(simulation.features),
        skills: capitalizeWords(simulation.skills),
        rating: null,
        };

        console.log('✅ Inserting simulation:', cleanedSimulation);

        // Insert simulation
        const { data: simData, error: simError } = await supabase
        .from('simulations')
        .insert([cleanedSimulation])
        .select()
        .single();

        if (simError) {
        console.error('❌ Simulation insert error:', simError);
        alert('❌ Failed to insert simulation.');
        return;
        }

        const simulation_id = simData.id;

        // Prepare tasks data
        const formattedTasks = tasks.map((task, idx) => ({
        simulation_id,
        title: `Task ${numberToWords(idx + 1)}`,
        full_title: capitalizeWords(task.full_title),
        duration: task.duration,
        difficulty: task.difficulty,
        description: capitalizeWords(task.description),
        what_youll_learn: capitalizeWords(task.what_youll_learn),
        what_youll_do: capitalizeWords(task.what_youll_do),
        }));

        console.log('✅ Inserting tasks:', formattedTasks);

        // Insert all tasks
        const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert(formattedTasks)
        .select();

        if (taskError) {
        console.error('❌ Task insert error:', taskError);
        alert('⚠️ Simulation saved, but task insert failed.');
        return;
        }

        console.log('✅ Tasks inserted:', taskData);
        alert('✅ Simulation and tasks saved successfully!');
        
        // Reset form
        setSimulation({
        company: '',
        title: '',
        description: '',
        category: '',
        difficulty: '',
        duration: '',
        rating: null,
        image: '',
        overview: '',
        about_company: '',
        features: '',
        skills: '',
        });
        
        setTasks([{
        title: '',
        full_title: '',
        duration: '',
        difficulty: '',
        description: '',
        what_youll_learn: '',
        what_youll_do: '',
        }]);

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        alert('❌ An unexpected error occurred.');
    }
    };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto p-10">

        <button
            className="button button-l !bg-black absolute top-4 right-4"
            onClick={()=> navigate('/edit-internship')}> 
                Edit Simulation 
        </button>
        
        <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Add New Simulation
        </h2>

  <section>
    <h2 className="text-2xl font-semibold text-gray-700 mb-3 mt-2">Simulation Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(simulation).map(([key, value]) => {
        if (key === 'rating') return null;

        if (key === 'difficulty' || key === 'duration') {
          const isDifficulty = key === 'difficulty';
          const options = isDifficulty ? difficultyOptions : durationOptions;

          return (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2">
                {isDifficulty ? 'Difficulty' : 'Duration'}
              </label>
              <select
                name={key}
                value={value}
                onChange={handleSimulationChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select {isDifficulty ? 'difficulty' : 'duration'}</option>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={key}>
            <label className="block text-sm font-semibold mb-2 capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              name={key}
              value={value}
              onChange={handleSimulationChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder={`Enter ${key.replace(/_/g, ' ')}`}
            />
          </div>
        );
      })}
    </div>
  </section>

  <section className="space-y mt-5">
    <div className="flex items-center justify-between">
       <h2 className="text-2xl font-semibold text-gray-700 mb-3 mt-2">Tasks</h2>
      <button
        type="button"
        onClick={addTask}
        className="button button-l"
      >
        + Add Task
      </button>
    </div>

    {tasks.map((task, idx) => (
      <div
        key={idx}
        className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-6 shadow-sm mb-5"
      >
        <h4 className="text-lg font-semibold text-gray-700">
          Task {numberToWords(idx + 1)}
        </h4>
      <div className="relative">
  <div className="flex items-center justify-between">
    {tasks.length > 1 && (
      <button
        type="button"
        onClick={() => removeTask(idx)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Delete
      </button>
    )}
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(task).map(([key, value]) => {
            if (key === 'title') return null;

            if (key === 'difficulty' || key === 'duration') {
              const isDifficulty = key === 'difficulty';
              const options = isDifficulty ? difficultyOptions : taskDurationOptions;

              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-2">
                    {isDifficulty ? 'Difficulty' : 'Duration'}
                  </label>
                  <select
                    name={key}
                    value={value}
                    onChange={(e) => handleTaskChange(idx, e)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select {isDifficulty ? 'difficulty' : 'duration'}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="block text-sm font-semibold mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  name={key}
                  value={value}
                  onChange={(e) => handleTaskChange(idx, e)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </section>

  <div className="text-center">
    <button
      type="submit"
      className="button button-l !bg-green-500"
    >
      Submit Simulation
    </button>
  </div>
</form>

      </div>
    </div>
  );
}

export default AddInternship;
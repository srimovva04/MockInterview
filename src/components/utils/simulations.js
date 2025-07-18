// utils/simulations.js
import { supabase } from './supabaseClient';

// Fetch all simulations
export async function fetchSimulations() {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching simulations:', error.message);
    return [];
  }
  return data;
}

// Fetch tasks for a specific simulation
export async function fetchTasksForSimulation(simulationId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('simulation_id', simulationId)
    .order('id', { ascending: true });

  if (error) {
    console.error(`Error fetching tasks for simulation ${simulationId}:`, error.message);
    return [];
  }
  return data;
}


export const updateTaskProgress = async (userId, simulationId, taskId, status) => {
  try {
    console.log('Updating task progress:', { userId, simulationId, taskId, status });
    
    // Check if record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_task_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('simulation_id', simulationId)
      .eq('task_id', taskId)
      .maybeSingle(); // Use maybeSingle to avoid error when no record found

    if (checkError) {
      console.error('Error checking existing record:', checkError);
      throw checkError;
    }

    let result;
    
    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_task_progress')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('simulation_id', simulationId)
        .eq('task_id', taskId)
        .select()
        .single();

      if (error) throw error;
      result = data;
      console.log('Task progress updated:', result);
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('user_task_progress')
        .insert({
          user_id: userId,
          simulation_id: simulationId,
          task_id: taskId,
          status: status,
          updated_at: new Date().toISOString(),
          comment: null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
      console.log('Task progress inserted:', result);
    }

    return result;
  } catch (error) {
    console.error('Error in updateTaskProgress:', error);
    throw error;
  }
};

// Get tasks with user progress
export async function getTasksWithUserProgress(simulationId, userId) {
  try {
    // First get all tasks for the simulation
    const tasks = await fetchTasksForSimulation(simulationId);
    
    if (!userId) {
      // If no user, return tasks with default status
      return tasks.map(task => ({
        ...task,
        status: 'not_started'
      }));
    }

    // Get user progress for these tasks
    const { data: progressData, error } = await supabase
      .from('user_task_progress')
      .select('task_id, status, updated_at')
      .eq('user_id', userId)
      .eq('simulation_id', simulationId)
      .in('task_id', tasks.map(t => t.id));

    if (error) {
      console.error('Error fetching user progress:', error);
      return tasks.map(task => ({ ...task, status: 'not_started' }));
    }

    // Merge tasks with progress
    return tasks.map(task => {
      const progress = progressData?.find(p => p.task_id === task.id);
      return {
        ...task,
        status: progress?.status || 'not_started',
        updated_at: progress?.updated_at || null
      };
    });
  } catch (error) {
    console.error('Error loading tasks with progress:', error);
    return [];
  }
}



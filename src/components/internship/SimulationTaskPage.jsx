import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { simulations } from '../utils/simulations';
import { CheckCircle, PlayCircle,Briefcase } from 'lucide-react';

const TaskStepper = ({ simulation, currentTaskId }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6 shadow-md hidden md:block">
          <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-blue-600 w-5 h-5" />
              <span className="text-lg font-semibold text-gray-800">Career Simulation</span>
          </div>

      <div className="space-y-4">
        {simulation.tasks.map((task) => {
          const isCompleted = task.id < currentTaskId;
          const isCurrent = task.id === currentTaskId;

          return (
            <button
              key={task.id}
              onClick={() => navigate(`/internship/${id}/task/${task.id}`)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-150 flex items-start space-x-3 ${
                isCurrent
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div
                className={`w-6 h-6 text-sm rounded-full flex items-center justify-center border ${
                  isCompleted ? 'bg-blue-600 text-white border-blue-600' : isCurrent ? 'border-blue-600 text-blue-600' : 'border-gray-400 text-gray-500'
                }`}
              >
                {isCompleted ? <CheckCircle size={14} /> : task.id}
              </div>
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.duration} • {task.difficulty}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const TaskOverview = ({ task }) => (
  <section className="grid md:grid-cols-2 gap-6">
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Learn</h3>
      <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
        {task.whatYoullLearn.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>

    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Do</h3>
      <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
        {task.whatYoullDo.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  </section>
);

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
  const simulation = simulations.find((sim) => sim.id === parseInt(id));
  const task = simulation?.tasks.find((t) => t.id === parseInt(taskId));
  const currentTaskIndex = simulation?.tasks.findIndex((t) => t.id === parseInt(taskId));
  const nextTask = simulation?.tasks[currentTaskIndex + 1];

  if (!simulation || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        Task not found.
      </div>
    );
  }

  const handleNext = () => {
    if (nextTask) {
      navigate(`/internship/${id}/task/${nextTask.id}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <TaskStepper simulation={simulation} currentTaskId={task.id} />

      <main className="flex-1 p-6 md:p-10 space-y-10">
        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{task.fullTitle}</h1>
          <p className="text-sm text-gray-500">
            A task from <span className="font-medium">{simulation.company}</span>
          </p>
        </header>

        <TaskOverview task={task} />

        <VideoMessage url={task.videoUrl} />

        <div className="pt-4">
          {nextTask ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow transition-all"
            >
              <PlayCircle size={18} />
              Next Task: {nextTask.title}
            </button>
          ) : (
            <button
              className="bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow cursor-default"
              disabled
            >
              Program Completed
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SimulationTaskPage;



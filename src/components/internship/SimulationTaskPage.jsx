import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSimulations, fetchTasksForSimulation } from '../utils/simulations';
import { CheckCircle, PlayCircle, Briefcase } from 'lucide-react';

const TaskStepper = ({ tasks, currentTaskId, simulationId }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6 shadow-md hidden md:block">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="text-blue-600 w-5 h-5" />
        <span className="text-lg font-semibold text-gray-800">Career Simulation</span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const isCompleted = task.id < currentTaskId;
          const isCurrent = task.id === currentTaskId;

          return (
            <button
              key={task.id}
              onClick={() => navigate(`/internship/${simulationId}/task/${task.id}`)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-150 flex items-start space-x-3 ${
                isCurrent
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div
                className={`w-6 h-6 text-sm rounded-full flex items-center justify-center border ${
                  isCompleted
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isCurrent
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-400 text-gray-500'
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


// const TaskOverview = ({ task }) => {
//   const learnPoints = Array.isArray(task.whatYoullLearn)
//     ? task.whatYoullLearn
//     : (task.whatYoullLearn || '').split(',').map((p) => p.trim()).filter(Boolean);

//   const doPoints = Array.isArray(task.whatYoullDo)
//     ? task.whatYoullDo
//     : (task.whatYoullDo || '').split(',').map((p) => p.trim()).filter(Boolean);

//   return (
//     <section className="grid md:grid-cols-2 gap-6">
//       <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Learn</h3>
//         {learnPoints.length > 0 ? (
//           <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
//             {learnPoints.map((point, i) => (
//               <li key={i}>{point}</li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500 italic text-sm">No learning objectives provided.</p>
//         )}
//       </div>

//       <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Do</h3>
//         {doPoints.length > 0 ? (
//           <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
//             {doPoints.map((point, i) => (
//               <li key={i}>{point}</li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500 italic text-sm">No actions defined for this task.</p>
//         )}
//       </div>
//     </section>
//   );
// };

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
  const [simulation, setSimulation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimulation = async () => {
      const sims = await fetchSimulations();
      const sim = sims.find((s) => s.id === parseInt(id));
      setSimulation(sim);

      if (sim) {
        const simTasks = await fetchTasksForSimulation(sim.id);
        setTasks(simTasks);
      }

      setLoading(false);
    };

    loadSimulation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading simulation...
      </div>
    );
  }

  const currentTask = tasks.find((t) => t.id === parseInt(taskId));
  const currentTaskIndex = tasks.findIndex((t) => t.id === parseInt(taskId));
  const nextTask = tasks[currentTaskIndex + 1];

  if (!simulation || !currentTask) {
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

  const handleComplete = () => {
    navigate(`/internship`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <TaskStepper tasks={tasks} currentTaskId={currentTask.id} simulationId={id} />

      <main className="flex-1 p-6 md:p-10 space-y-10">
        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{currentTask.fullTitle}</h1>
          <p className="text-sm text-gray-500">
            A task from <span className="font-medium">{simulation.company}</span>
          </p>
        </header>

        <TaskOverview task={currentTask} />
        <VideoMessage url={currentTask.videoUrl} />

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
              onClick={handleComplete}
              className="bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow"
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



// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { simulations } from '../utils/simulations';
// import { CheckCircle, PlayCircle,Briefcase } from 'lucide-react';

// const TaskStepper = ({ simulation, currentTaskId }) => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   return (
//     <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6 shadow-md hidden md:block">
//           <div className="flex items-center gap-2 mb-6">
//               <Briefcase className="text-blue-600 w-5 h-5" />
//               <span className="text-lg font-semibold text-gray-800">Career Simulation</span>
//           </div>

//       <div className="space-y-4">
//         {simulation.tasks.map((task) => {
//           const isCompleted = task.id < currentTaskId;
//           const isCurrent = task.id === currentTaskId;

//           return (
//             <button
//               key={task.id}
//               onClick={() => navigate(`/internship/${id}/task/${task.id}`)}
//               className={`w-full text-left p-3 rounded-lg transition-all duration-150 flex items-start space-x-3 ${
//                 isCurrent
//                   ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
//                   : 'hover:bg-gray-100 text-gray-800'
//               }`}
//             >
//               <div
//                 className={`w-6 h-6 text-sm rounded-full flex items-center justify-center border ${
//                   isCompleted ? 'bg-blue-600 text-white border-blue-600' : isCurrent ? 'border-blue-600 text-blue-600' : 'border-gray-400 text-gray-500'
//                 }`}
//               >
//                 {isCompleted ? <CheckCircle size={14} /> : task.id}
//               </div>
//               <div>
//                 <p className="text-sm font-medium">{task.title}</p>
//                 <p className="text-xs text-gray-500">
//                   {task.duration} • {task.difficulty}
//                 </p>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </aside>
//   );
// };

// const TaskOverview = ({ task }) => (
//   <section className="grid md:grid-cols-2 gap-6">
//     <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Learn</h3>
//       <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
//         {task.whatYoullLearn.map((point, i) => (
//           <li key={i}>{point}</li>
//         ))}
//       </ul>
//     </div>

//     <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Do</h3>
//       <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
//         {task.whatYoullDo.map((point, i) => (
//           <li key={i}>{point}</li>
//         ))}
//       </ul>
//     </div>
//   </section>
// );

// const VideoMessage = ({ url }) => {
//   return (
//     <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white p-4">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-lg font-semibold text-gray-800">Company Message</h3>
//       </div>
//       {url ? (
//         <video controls className="w-full rounded-lg" poster="/video-poster.jpg">
//           <source src={url} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       ) : (
//         <div className="text-sm text-gray-500 italic p-4 text-center">No video available for this task.</div>
//       )}
//     </div>
//   );
// };

// const SimulationTaskPage = () => {
//   const { id, taskId } = useParams();
//   const navigate = useNavigate();
//   const simulation = simulations.find((sim) => sim.id === parseInt(id));
//   const task = simulation?.tasks.find((t) => t.id === parseInt(taskId));
//   const currentTaskIndex = simulation?.tasks.findIndex((t) => t.id === parseInt(taskId));
//   const nextTask = simulation?.tasks[currentTaskIndex + 1];

//   if (!simulation || !task) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
//         Task not found.
//       </div>
//     );
//   }

//   const handleNext = () => {
//     if (nextTask) {
//       navigate(`/internship/${id}/task/${nextTask.id}`);
//     }
//   };

//   const handleComplete=()=>{
//     navigate(`/internship`);
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       <TaskStepper simulation={simulation} currentTaskId={task.id} />

//       <main className="flex-1 p-6 md:p-10 space-y-10">
//         <header className="space-y-1">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{task.fullTitle}</h1>
//           <p className="text-sm text-gray-500">
//             A task from <span className="font-medium">{simulation.company}</span>
//           </p>
//         </header>

//         <TaskOverview task={task} />

//         <VideoMessage url={task.videoUrl} />

//         <div className="pt-4">
//           {nextTask ? (
//             <button
//               onClick={handleNext}
//               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow transition-all"
//             >
//               <PlayCircle size={18} />
//               Next Task: {nextTask.title}
//             </button>
//           ) : (
//             <button
//               onClick={handleComplete}
//               className="bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow cursor-default"
//             >
//               Program Completed
//             </button>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SimulationTaskPage;



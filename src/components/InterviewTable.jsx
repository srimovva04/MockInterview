import React, { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { supabase } from './utils/supabaseClient.js';

const InterviewTable = () => {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('All Status');

  const filteredInterviews =
    filter === 'All Status'
      ? interviews
      : interviews.filter((interview) => interview.status === filter);

  useEffect(() => {
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [interviewsRes, assessmentsRes] = await Promise.all([
      supabase
        .from('interview')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('job_readiness_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);

    if (interviewsRes.error || assessmentsRes.error) {
      console.error('Error fetching data:', interviewsRes.error || assessmentsRes.error);
      return;
    }

    // Normalize both into same format
    const interviews = (interviewsRes.data || []).map(item => ({
      source: 'interview',
      interview: item.interview || item.position || 'Mock Interview',
      position: item.position || '',
      status: item.status || 'Completed',
      appointment: item.appointment || 'N/A',
      id: item.id,
    }));

    const assessments = (assessmentsRes.data || []).map(item => ({
      source: 'assessment',
      interview: 'Job Readiness Assessment',
      position: item.position,
      status: 'Completed',
      appointment: 'N/A',
      id: item.id,
    }));

    // Combine
    setInterviews([...interviews, ...assessments]);
  };

  fetchData();
}, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-900';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Interview History</h2>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Interview</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Appointment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {filteredInterviews.map((interview, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {interview.source === 'assessment' ? 'Job Readiness Assessment' : (interview.interview || '—')}
          </div>
          {interview.position && (
            <div className="text-sm text-gray-500">{interview.position}</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
          {interview.status || 'Unknown'}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {interview.appointment === 'N/A'
          ? 'N/A'
          : new Date(interview.appointment).toLocaleString()}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {interview.source === 'assessment' ? (
            <button
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              onClick={() => window.open(`/learning-path/${interview.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Explore Learning Path</span>
            </button>
          ) : (
            <button
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              onClick={() => window.open(`/generate-report/${interview.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Page 1/1 Total {filteredInterviews.length}</span>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded text-gray-400 hover:text-gray-600">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="p-1 rounded text-gray-400 hover:text-gray-600">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTable;




// import React, { useEffect, useState } from 'react';
// import { ArrowRight, ExternalLink } from 'lucide-react';
// import { supabase } from './utils/supabaseClient.js';

// const InterviewTable = () => {
//   const [interviews, setInterviews] = useState([]);
//   const [filter, setFilter] = useState('All Status');

//   const filteredInterviews =
//     filter === 'All Status'
//       ? interviews
//       : interviews.filter((interview) => interview.status === filter);



//   useEffect(() => {
//     const fetchInterviews = async () => {
//       const { data: { user } } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data, error } = await supabase
//         .from('interview')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('created_at', { ascending: false });

//       if (!error) {
//         setInterviews(data || []);
//       } else {
//         console.error('Error fetching interviews:', error);
//       }
//     };

//     fetchInterviews();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'bg-green-100 text-green-700';
//       case 'Pending':
//         return 'bg-yellow-50 text-yellow-900';
//       default:
//         return 'bg-gray-100 text-gray-70s0';
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//       <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-lg font-semibold text-gray-900">Interview History</h2>
//         <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}>
//           <option>All Status</option>
//           <option>Completed</option>
//           <option>Pending</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Interview</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Appointment</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {interviews.map((interview, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">
//                       {interview.interview || '—'}
//                     </div>
//                     {interview.position && (
//                       <div className="text-sm text-gray-500">{interview.position}</div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
//                     {interview.status || 'Unknown'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {interview.appointment === 'N/A'
//                     ? 'N/A'
//                     : new Date(interview.appointment).toLocaleString()}
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="flex items-center space-x-2">
//                     <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
//                       <ExternalLink className="w-4 h-4" />
//                       <span>Read Report</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-500">Page 1/1 Total {interviews.length}</span>
//           <div className="flex items-center space-x-2">
//             <button className="p-1 rounded text-gray-400 hover:text-gray-600">
//               <ArrowRight className="w-4 h-4 rotate-180" />
//             </button>
//             <button className="p-1 rounded text-gray-400 hover:text-gray-600">
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewTable;



// import React from 'react';
// import { ArrowRight, ExternalLink } from 'lucide-react';

// const InterviewTable = () => {
//   const interviews = [
//     {
//       interview: 'Job Readiness Assessment',
//       position: 'Web Developer',
//       status: 'Completed',
//       appointment: 'N/A'
//     },
//     {
//       interview: 'Web Developer',
//       position: '',
//       status: 'Completed',
//       appointment: 'N/A'
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'bg-green-100 text-green-700';
//       case 'In Progress':
//         return 'bg-blue-100 text-blue-700';
//       case 'Scheduled':
//         return 'bg-yellow-100 text-yellow-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900">Interview History</h2>
//           <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
//             <option>All Status</option>
//             <option>Completed</option>
//             <option>In Progress</option>
//             <option>Scheduled</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
//                 Interview
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
//                 Appointment
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {interviews.map((interview, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">
//                       {interview.interview}
//                     </div>
//                     {interview.position && (
//                       <div className="text-sm text-gray-500">{interview.position}</div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
//                       {interview.status}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {interview.appointment}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center space-x-2">
//                     <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
//                       <ExternalLink className="w-4 h-4" />
//                       <span>Read Report</span>
//                     </button>
//                     <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
//                       <ExternalLink className="w-4 h-4" />
//                       <span>Explore Learning Path</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-500">Page 1/1 Total 2</span>
//           <div className="flex items-center space-x-2">
//             <button className="p-1 rounded text-gray-400 hover:text-gray-600">
//               <ArrowRight className="w-4 h-4 rotate-180" />
//             </button>
//             <button className="p-1 rounded text-gray-400 hover:text-gray-600">
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewTable;
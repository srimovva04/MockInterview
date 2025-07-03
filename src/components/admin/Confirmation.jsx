
import React, { useEffect, useState } from 'react';
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { supabase } from '../utils/supabaseClient';

function Confirmation() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [signedUrls, setSignedUrls] = useState({});
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_task_progress')
      .select(`
        *,
        simulations (
          title
        ),
        tasks (
          title
        )
      `)
      .eq('confirmation_status', 'pending')
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching user_task_progress:', error);
    } else {
      setProgressData(data);
      generateSignedUrls(data);
    }
    setLoading(false);
  };

  const generateSignedUrls = async (data) => {
    const urlMap = {};

    for (const item of data) {
      if (item.uploaded_work_url) {
        const path = item.uploaded_work_url.split('/submissions/')[1];
        if (!path) continue;

        const { data: signed, error } = await supabase.storage
          .from('submissions')
          .createSignedUrl(path, 3600);

        if (!error && signed?.signedUrl) {
          urlMap[item.id] = signed.signedUrl;
        }
      }
    }

    setSignedUrls(urlMap);
  };

  // const handleDecision = async (id, decision) => {
  //   const comment = comments[id];

  //   if (!comment || comment.trim() === '') {
  //     alert('Please enter a comment.');
  //     return;
  //   }

  //   setProcessingIds(prev => new Set(prev).add(id));

  //   const { error } = await supabase
  //     .from('user_task_progress')
  //     .update({ confirmation_status: decision, comment })
  //     .eq('id', id);

  //   setProcessingIds(prev => {
  //     const newSet = new Set(prev);
  //     newSet.delete(id);
  //     return newSet;
  //   });

  //   if (error) {
  //     console.error('Update failed:', error);
  //     alert('Failed to update status');
  //   } else {
  //     alert(`Task ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully`);
  //     setComments((prev) => {
  //       const updated = { ...prev };
  //       delete updated[id];
  //       return updated;
  //     });
  //     fetchProgressData();
  //   }
  // };


const handleDecision = async (id, decision) => {
  const comment = comments[id];

  if (!comment || comment.trim() === '') {
    alert('Please enter a comment.');
    return;
  }

  setProcessingIds(prev => new Set(prev).add(id));

  const updateFields = {
    confirmation_status: decision,
    comment: comment
  };

  if (decision === 'rejected') {
    updateFields.status = 'rejected'; // mark the task as rejected
  }

  const { error } = await supabase
    .from('user_task_progress')
    .update(updateFields)
    .eq('id', id);

  setProcessingIds(prev => {
    const newSet = new Set(prev);
    newSet.delete(id);
    return newSet;
  });

  if (error) {
    console.error('Update failed:', error);
    alert('Failed to update status');
  } else {
    alert(`Task ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully`);
    setComments((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    fetchProgressData();
  }
};


  const downloadFileFromBucket = async (item) => {
    if (!item.uploaded_work_url) return;

    const path = item.uploaded_work_url.split('/submissions/')[1];
    if (!path) {
      alert("Invalid file path");
      return;
    }

    const { data, error } = await supabase.storage
      .from('submissions')
      .download(path);

    if (error) {
      console.error('Download error:', error);
      alert("Download failed");
      return;
    }

    const blobUrl = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = path.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  // Grouping data by user_id + simulation_id
  const groupedData = progressData.reduce((acc, item) => {
    const key = `${item.user_id}__${item.simulation_id}`;
    if (!acc[key]) {
      acc[key] = {
        user_id: item.user_id,
        simulation_id: item.simulation_id,
        simulation_name: item.simulations?.title || `Program ${item.simulation_id}`,
        tasks: []
      };
    }
    acc[key].tasks.push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Task Confirmation</h1>
            </div>
            <p className="text-gray-600">Review and approve submitted tasks from users</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Loading submissions...</span>
              </div>
            </div>
          ) : Object.keys(groupedData).length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Submissions</h3>
              <p className="text-gray-600">All tasks have been reviewed and processed.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedData).map((group) => (
                <div key={`${group.user_id}-${group.simulation_id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Group Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">User:</span>
                        <span className="font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded text-sm">
                          {group.user_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        <span className="font-semibold text-gray-900">Program:</span>
                        <span className="text-indigo-700 font-medium">{group.simulation_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Grid */}
                  <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {group.tasks.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
                        >
                          {/* Task Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {item.tasks?.name || `Task ${item.task_id}`}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Download Section */}
                          <div className="mb-4">
                            {signedUrls[item.id] ? (
                              <button
                                onClick={() => downloadFileFromBucket(item)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium w-full justify-center"
                              >
                                <Download className="h-4 w-4" />
                                Download Submission
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                                <AlertCircle className="h-4 w-4" />
                                No file uploaded
                              </div>
                            )}
                          </div>

                          {/* Comment Section */}
                          <div className="mb-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <MessageSquare className="h-4 w-4" />
                              Review Comment
                            </label>
                            <textarea
                              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your review comment..."
                              rows={3}
                              value={comments[item.id] || ''}
                              onChange={(e) =>
                                setComments((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value
                                }))
                              }
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDecision(item.id, 'accepted')}
                              disabled={processingIds.has(item.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                            >
                              {processingIds.has(item.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecision(item.id, 'rejected')}
                              disabled={processingIds.has(item.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                            >
                              {processingIds.has(item.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
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

export default Confirmation;




// -------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import Sidebar from '../Sidebar';
// import { supabase } from '../utils/supabaseClient';

// function Confirmation() {
//   const [progressData, setProgressData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState({});
//   const [signedUrls, setSignedUrls] = useState({});

//   useEffect(() => {
//     fetchProgressData();
//   }, []);

//   const fetchProgressData = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('user_task_progress')
//       .select(`
//         *,
//         simulations (
//           title
//         ),
//         tasks (
//           title
//         )
//       `)
//       .eq('confirmation_status', 'pending')
//       .eq('status', 'completed');

//     if (error) {
//       console.error('Error fetching user_task_progress:', error);
//     } else {
//       setProgressData(data);
//       generateSignedUrls(data);
//     }
//     setLoading(false);
//   };

//   const generateSignedUrls = async (data) => {
//     const urlMap = {};

//     for (const item of data) {
//       if (item.uploaded_work_url) {
//         const path = item.uploaded_work_url.split('/submissions/')[1];
//         if (!path) continue;

//         const { data: signed, error } = await supabase.storage
//           .from('submissions')
//           .createSignedUrl(path, 3600); // 1 hour

//         if (!error && signed?.signedUrl) {
//           urlMap[item.id] = signed.signedUrl;
//         }
//       }
//     }

//     setSignedUrls(urlMap);
//   };

//   const handleDecision = async (id, decision) => {
//     const comment = comments[id];

//     if (!comment || comment.trim() === '') {
//       alert('Please enter a comment.');
//       return;
//     }

//     const { error } = await supabase
//       .from('user_task_progress')
//       .update({ confirmation_status: decision, comment })
//       .eq('id', id);

//     if (error) {
//       console.error('Update failed:', error);
//       alert('Failed to update status');
//     } else {
//       alert(`Task ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully`);
//       setComments((prev) => {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       });
//       fetchProgressData();
//     }
//   };

//   const downloadFileFromBucket = async (item) => {
//     if (!item.uploaded_work_url) return;

//     const path = item.uploaded_work_url.split('/submissions/')[1];
//     if (!path) {
//       alert("Invalid file path");
//       return;
//     }

//     const { data, error } = await supabase.storage
//       .from('submissions')
//       .download(path);

//     if (error) {
//       console.error('Download error:', error);
//       alert("Download failed");
//       return;
//     }

//     const blobUrl = window.URL.createObjectURL(data);
//     const a = document.createElement('a');
//     a.href = blobUrl;
//     a.download = path.split('/').pop();
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(blobUrl);
//   };

//   // Grouping data by user_id + simulation_id
//   const groupedData = progressData.reduce((acc, item) => {
//     const key = `${item.user_id}__${item.simulation_id}`;
//     if (!acc[key]) {
//       acc[key] = {
//         user_id: item.user_id,
//         simulation_id: item.simulation_id,
//         simulation_name: item.simulations?.title || `Program ${item.simulation_id}`,
//         tasks: []
//       };
//     }
//     acc[key].tasks.push(item);
//     return acc;
//   }, {});

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 ml-64 p-6 overflow-y-auto">
//         <h1 className="text-2xl font-semibold mb-4">Confirmation Page</h1>

//         {loading ? (
//           <p>Loading...</p>
//         ) : Object.keys(groupedData).length === 0 ? (
//           <p>No pending submissions.</p>
//         ) : (
//           Object.values(groupedData).map((group) => (
//             <div key={`${group.user_id}-${group.simulation_id}`} className="mb-8">
//               <h2 className="text-lg font-medium mb-2">
//                 User: <span className="font-mono">{group.user_id}</span> — Program: <span className="font-semibold">{group.simulation_name}</span>
//               </h2>
//               <div className="flex flex-wrap gap-4 pl-2">
//                 {group.tasks.map((item) => (
//                   <div
//                     key={item.id}
//                     className="w-[300px] bg-white p-4 rounded shadow border flex flex-col"
//                   >
//                     <p className="text-sm font-semibold">Task: {item.tasks?.name || `Task ${item.task_id}`}</p>
//                     <p className="text-xs text-gray-600 mb-1">Status: {item.status}</p>

//                     {signedUrls[item.id] ? (
//                       <button
//                         onClick={() => downloadFileFromBucket(item)}
//                         className="text-blue-600 text-sm underline mt-1"
//                       >
//                         Download Submitted Work
//                       </button>
//                     ) : (
//                       <p className="text-gray-500 text-sm">No uploaded file.</p>
//                     )}

//                     <textarea
//                       className="mt-2 w-full border rounded p-2 text-sm"
//                       placeholder="Enter your comment..."
//                       value={comments[item.id] || ''}
//                       onChange={(e) =>
//                         setComments((prev) => ({
//                           ...prev,
//                           [item.id]: e.target.value
//                         }))
//                       }
//                     />

//                     <div className="flex gap-2 mt-2">
//                       <button
//                         onClick={() => handleDecision(item.id, 'accepted')}
//                         className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => handleDecision(item.id, 'rejected')}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Confirmation;

// ----------------------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import Sidebar from '../Sidebar';
// import { supabase } from '../utils/supabaseClient';

// function Confirmation() {
//   const [progressData, setProgressData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState({});
//   const [signedUrls, setSignedUrls] = useState({});

//   useEffect(() => {
//     fetchProgressData();
//   }, []);

//   const fetchProgressData = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('user_task_progress')
//       .select('*')
//       .eq('confirmation_status', 'pending')
//       .eq('status', 'completed');

//     if (error) {
//       console.error('Error fetching user_task_progress:', error);
//     } else {
//       setProgressData(data);
//       generateSignedUrls(data);
//     }
//     setLoading(false);
//   };

//   const generateSignedUrls = async (data) => {
//     const urlMap = {};

//     for (const item of data) {
//       if (item.uploaded_work_url) {
//         // Extract the path inside the bucket
//         const urlParts = item.uploaded_work_url.split('/submissions/')[1];
//         if (!urlParts) continue;

//         const { data: signed, error } = await supabase.storage
//           .from('submissions')
//           .createSignedUrl(urlParts, 60 * 60); // valid for 1 hour

//         if (!error && signed?.signedUrl) {
//           urlMap[item.id] = signed.signedUrl;
//         }
//       }
//     }

//     setSignedUrls(urlMap);
//   };

//     const handleDecision = async (id, decision) => {
//     const comment = comments[id];

//     if (!comment || comment.trim() === '') {
//         alert("Please enter a comment.");
//         return;
//     }

//     const { error } = await supabase
//         .from('user_task_progress')
//         .update({ confirmation_status: decision, comment })
//         .eq('id', id);

//     if (error) {
//         console.error('Error updating confirmation_status:', error);
//         alert('Failed to update status');
//     } else {
//         alert(`Task ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully`);
        
//         // Remove the comment from state
//         setComments((prev) => {
//         const newState = { ...prev };
//         delete newState[id];
//         return newState;
//         });

//         // Refresh list to hide confirmed tasks
//         fetchProgressData();
//     }
//     };

//     const downloadFileFromBucket = async (item) => {
//     if (!item.uploaded_work_url) return;

//     // Extract the path after /submissions/
//     const filePath = item.uploaded_work_url.split('/submissions/')[1];
//     if (!filePath) {
//         alert("Invalid file path");
//         return;
//     }

//     const { data, error } = await supabase.storage
//         .from('submissions')
//         .download(filePath);

//     if (error) {
//         console.error('Download error:', error);
//         alert("Failed to download file.");
//         return;
//     }

//     const blobUrl = window.URL.createObjectURL(data);
//     const a = document.createElement('a');
//     a.href = blobUrl;
//     a.download = filePath.split('/').pop(); // extract filename
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(blobUrl);
//     };


//     return (
//         <div className="flex min-h-screen bg-gray-50">
//         <Sidebar />

//         <div className="flex-1 ml-64 p-6 overflow-y-auto">
//             <h1 className="text-2xl font-semibold mb-4">Confirmation Page</h1>

//             {loading ? (
//             <p>Loading...</p>
//             ) : progressData.length === 0 ? (
//             <p>No pending submissions.</p>
//             ) : (
//             <div className="space-y-6">
//                 {progressData.map((item) => (
//                 <div key={item.id} className="bg-white p-4 rounded shadow-md border">
//                     <p><strong>User ID:</strong> {item.user_id}</p>
//                     <p><strong>Simulation ID:</strong> {item.simulation_id}</p>
//                     <p><strong>Task ID:</strong> {item.task_id}</p>
//                     <p><strong>Status:</strong> {item.status}</p>

//                     {signedUrls[item.id] ? (
//                     <button
//                         onClick={() => downloadFileFromBucket(item)}

//                         // onClick={() => forceDownload(signedUrls[item.id], `submission_${item.id}`)}
//                         className="text-blue-600 underline mt-2 inline-block"                   
//                     >
//                             Download Submitted Work
//                     </button>

//                     ) : (
//                     <p className="text-gray-500">No uploaded file.</p>
//                     )}

//                     <textarea
//                         className="mt-3 w-full border rounded p-2"
//                         placeholder="Enter your comment..."
//                         value={comments[item.id] || ''}
//                         onChange={(e) =>
//                             setComments((prev) => ({
//                             ...prev,
//                             [item.id]: e.target.value
//                             }))}
//                     />

//                     <div className="flex gap-2 mt-3">
//                     <button
//                         onClick={() => handleDecision(item.id, 'accepted')}
//                         className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
//                     >
//                         Accept 
//                     </button>
//                     <button
//                         onClick={() => handleDecision(item.id, 'rejected')}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                     >
//                         Reject
//                     </button>
//                     </div>

//                 </div>
//                 ))}
//             </div>
//             )}
//         </div>
//         </div>
//     );
// }

// export default Confirmation;

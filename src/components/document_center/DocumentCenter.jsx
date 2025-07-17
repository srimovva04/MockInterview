import React, { useState, useEffect, useRef } from "react";
import { FileText, Download, Eye, Trash2, Upload } from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { UserAuth } from "../Auth/AuthContext";
import Sidebar from "../Sidebar";

const DocumentCenter = () => {
  const { session } = UserAuth();
  const userId = session?.user?.id;

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setVariant(type);
    setTimeout(() => setMessage(null), 2500);
  };

  const fetchResumes = async () => {
    if (!userId) {
      setResumes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .storage
        .from("resumes")
        .list(`${userId}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "desc" },
        });

      if (error) throw error;

      const mappedResumes = (data || [])
        .filter((item) => item.name && !item.name.endsWith("/"))
        .map((item, idx) => ({
          id: `${item.name}-${idx}`,
          name: item.name,
          size: item.metadata && item.metadata.size
            ? `${Math.round(item.metadata.size / 1024)} KB`
            : "",
          uploadedAt:
            item.metadata && item.metadata.lastModified
              ? new Date(item.metadata.lastModified).toISOString().slice(0, 10)
              : "",
          type: item.metadata?.mimetype || "",
        }));

      setResumes(mappedResumes);
    } catch (err) {
      showMessage("Failed to load resumes", "error");
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
    setUploading(true);
    showMessage("Uploading...", "success");


    const fileExt = file.name.split('.').pop();
    const baseName = file.name
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/\s/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
    let safeName = `${baseName}.${fileExt}`;

    const { data: existingFiles, error: listError } = await supabase
      .storage
      .from("resumes")
      .list(`${userId}/`);

    if (listError) {
      setUploading(false);
      showMessage("Error checking for existing files", "error");
      return;
    }

    const allNames = (existingFiles || []).map(f => f.name);
    if (allNames.includes(safeName)) {
      let counter = 1;
      let newName;
      do {
        newName = `${baseName} (${counter}).${fileExt}`;
        counter++;
      } while (allNames.includes(newName));
      safeName = newName;
    }

    const filePath = `${userId}/${safeName}`;

    const { error } = await supabase
      .storage
      .from("resumes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    setUploading(false);
    if (error) {
      showMessage("Failed to upload file", "error");
    } else {
      showMessage("Uploaded successfully!", "success");
      fetchResumes();
    }
    e.target.value = "";
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePreview = async (resume) => {
    try {
      const { data, error } = await supabase
        .storage
        .from("resumes")
        .createSignedUrl(`${userId}/${resume.name}`, 60);
      if (error || !data?.signedUrl) throw error;
      showMessage(`Opening preview for ${resume.name}...`);
      window.open(data.signedUrl, "_blank");
    } catch {
      showMessage("Could not generate preview link", "error");
    }
  };

  const handleDownload = async (resume) => {
    try {
      const { data, error } = await supabase
        .storage
        .from("resumes")
        .createSignedUrl(`${userId}/${resume.name}`, 60);
      if (error || !data?.signedUrl) throw error;
      showMessage(`Downloading ${resume.name}...`);
      window.open(data.signedUrl, "_blank");
    } catch {
      showMessage("Could not generate download link", "error");
    }
  };

  // const handleDelete = async (resumeId) => {
  //   const resume = resumes.find((r) => r.id === resumeId);
  //   if (!resume) return;
  //   try {
  //     const { error } = await supabase
  //       .storage
  //       .from("resumes")
  //       .remove([`${userId}/${resume.name}`]);
  //     if (error) throw error;
  //     setResumes(resumes.filter((r) => r.id !== resumeId));
  //     showMessage("Resume deleted successfully");
  //   } catch {
  //     showMessage("Failed to delete resume", "error");
  //   }
  // };

const handleDelete = async (resumeId) => {
  const resume = resumes.find((r) => r.id === resumeId);
  if (!resume) return;

  // Confirmation dialog
  const confirmed = window.confirm(`Are you sure you want to delete "${resume.name}"? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    const { error } = await supabase
      .storage
      .from("resumes")
      .remove([`${userId}/${resume.name}`]);
    if (error) throw error;
    setResumes(resumes.filter((r) => r.id !== resumeId));
    showMessage("Resume deleted successfully");
  } catch {
    showMessage("Failed to delete resume", "error");
  }
};


  const getFileIcon = () => <FileText className="h-8 w-8 text-blue-500" />;

  const messageColors =
    variant === "error"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-green-100 text-green-800 border-green-300";

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Sign in to view your documents.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }



return (
  <div className="flex h-screen overflow-hidden bg-white">
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-1 justify-center items-start py-12 px-4 overflow-y-auto">
      <div className="w-full max-w-5xl">

        {/* Notification Bar */}
        {message && (
          <div className={`border px-4 py-2 rounded mb-6 shadow-sm ${messageColors}`}>
            {message}
          </div>
        )}

        <div className="px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Document Center</h1>
              <p className="text-gray-500 mt-2 max-w-md">
                Manage your resumes and documents in one place.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={openFileDialog}
                disabled={uploading}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                <Upload className="h-5 w-5" />
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.doc,.docx,image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Document List */}
          <div>
            {resumes.length > 0 ? (
              <ul className="space-y-4">
                {resumes.map((resume) => (
                  <li key={resume.id} className="flex items-center bg-gray-100 rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition">
                    {getFileIcon(resume.type)}
                    <div className="flex-1 min-w-0 ml-4">
                      <div className="text-base font-medium text-gray-800 truncate">{resume.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {resume.size} {resume.uploadedAt && <>• {resume.uploadedAt}</>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handlePreview(resume)}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </button>
                      <button
                        onClick={() => handleDownload(resume)}
                        className="flex items-center text-xs text-green-600 hover:text-green-800 transition"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="flex items-center text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-500 rounded px-2 py-1 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-6">Upload your first resume to get started.</p>
                <button
                  onClick={openFileDialog}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                  disabled={uploading}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);


// return (
//   <div className="flex h-screen overflow-hidden bg-white">
//     <Sidebar />

//     {/* Main Content */}
//     <div className="flex flex-1 justify-center items-start py-12 px-4 overflow-y-auto">
//       <div className="w-full max-w-4xl">
//         {/* Notification Bar */}
//         {message && (
//           <div className={`border px-4 py-2 rounded mb-6 shadow ${messageColors}`}>
//             {message}
//           </div>
//         )}

//         <div className=" px-8 py-8">
//           {/* Header Section */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Document Center</h1>
//               <p className="text-slate-600 mt-3 max-w-md">Manage your resumes and documents in one place.</p>
//             </div>
//             <div>
//               <button
//                 type="button"
//                 onClick={openFileDialog}
//                 disabled={uploading}
//                 className="flex items-center gap-2 px-5 py-3 button button-m"
//               >
//                 <Upload className="h-5 w-5" />
//                 {uploading ? "Uploading..." : "Upload Resume"}
//               </button>
//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="application/pdf,.doc,.docx,image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 disabled={uploading}
//               />
//             </div>
//           </div>

//           {/* Divider */}
//           <hr className="my-8 border-slate-700" />

//           {/* Document List */}
//           <div>
//             {resumes.length > 0 ? (
//               <ul className="divide-y divide-slate-800 rounded-xl overflow-hidden">
//                 {resumes.map((resume) => (
//                   <li key={resume.id} className="flex items-center px-5 py-4">
//                     {getFileIcon(resume.type)}
//                     <div className="flex-1 min-w-0 ml-4">
//                       <div className="text-base font-medium text-slate-800 truncate">
//                         {resume.name}
//                       </div>
//                       <div className="text-xs text-slate-500 mt-1">
//                         {resume.size} {resume.uploadedAt && <>• {resume.uploadedAt}</>}
//                       </div>
//                     </div>
//                     <div className="flex gap-2 ml-4">
//                       <button
//                         onClick={() => handlePreview(resume)}
//                         className="flex items-center text-xs border border-slate-300 "
//                       >
//                         <Eye className="h-4 w-4 mr-1" /> Preview
//                       </button>
//                       <button
//                         onClick={() => handleDownload(resume)}
//                         className="flex items-center text-xs border border-slate-300"
//                       >
//                         <Download className="h-4 w-4 mr-1" /> Download
//                       </button>
//                       <button
//                         onClick={() => handleDelete(resume.id)}
//                         className="flex items-center border border-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded px-2 py-2 transition"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="text-center py-16">
//                 <FileText className="h-14 w-14 text-slate-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-slate-700 mb-2">
//                   No documents found
//                 </h3>
//                 <p className="text-slate-500 mb-6">
//                   Upload your first resume to get started.
//                 </p>
//                 <button
//                   onClick={openFileDialog}
//                   className="flex items-center justify-center gap-2 px-5 py-3 button button-m"
//                   disabled={uploading}
//                 >
//                   <Upload className="h-5 w-5 mr-2" />
//                   {uploading ? "Uploading..." : "Upload Resume"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );





  // return (
  //    <div className="flex h-screen overflow-hidden bg-radial-blue">
  //     <Sidebar />

  //   <div className="p-6 space-y-6">
  //     {/* Notification bar */}
  //     {message && (
  //       <div className={`border px-4 py-2 rounded mb-4 ${messageColors}`}>
  //         {message}
  //       </div>
  //     )}

  //     {/* Hidden file input */}
  //     <input
  //       ref={fileInputRef}
  //       type="file"
  //       accept="application/pdf,.doc,.docx,image/*"
  //       className="hidden"
  //       onChange={handleFileChange}
  //       disabled={uploading}
  //     />
  //     <div className="flex-1 ml-64 overflow-y-auto p-8">
  //     {/* Header */}
  //     <div className="flex justify-between items-center">
  //       <div>
  //         <h1 className="text-3xl font-bold text-slate-700">Document Center</h1>
  //         <p className="text-slate-600 mt-2">
  //           Manage your resumes and documents in one place
  //         </p>
  //       </div>
  //       <button
  //         type="button"
  //         onClick={openFileDialog}
  //         disabled={uploading}
  //         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
  //       >
  //         <Upload className="h-4 w-4" />
  //         {uploading ? "Uploading..." : "Upload Resume"}
  //       </button>
  //     </div>

  //     {/* Stats */}
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //       <div className="flex items-center space-x-2">
  //         <FileText className="h-5 w-5 text-blue-500" />
  //         <div>
  //           <p className="text-sm text-slate-600">Total Documents</p>
  //           <p className="text-2xl font-bold text-slate-800">{resumes.length}</p>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Documents List */}
  //     {resumes.length > 0 ? (
  //       <ul className="divide-y divide-slate-200 rounded-lg bg-white border shadow-sm">
  //         {resumes.map((resume) => (
  //           <li key={resume.id} className="flex items-center px-4 py-3">
  //             {getFileIcon(resume.type)}
  //             <div className="flex-1 min-w-0 ml-4">
  //               <div className="text-sm font-medium text-slate-800 truncate">
  //                 {resume.name}
  //               </div>
  //               <div className="text-xs text-slate-500 mt-1">
  //                 {resume.size} {resume.uploadedAt && <>• {resume.uploadedAt}</>}
  //               </div>
  //             </div>
  //             <div className="flex gap-2 ml-4">
  //               <button
  //                 onClick={() => handlePreview(resume)}
  //                 className="flex items-center text-xs border border-slate-300 bg-white rounded px-2 py-1 hover:bg-slate-50"
  //               >
  //                 <Eye className="h-3 w-3 mr-1" /> Preview
  //               </button>
  //               <button
  //                 onClick={() => handleDownload(resume)}
  //                 className="flex items-center text-xs border border-slate-300 bg-white rounded px-2 py-1 hover:bg-slate-50"
  //               >
  //                 <Download className="h-3 w-3 mr-1" /> Download
  //               </button>
  //               <button
  //                 onClick={() => handleDelete(resume.id)}
  //                 className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-slate-300 rounded px-2 py-1"
  //               >
  //                 <Trash2 className="h-3 w-3" />
  //               </button>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     ) : (
  //       <div className="text-center py-12">
  //         <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-slate-600 mb-2">
  //           No documents found
  //         </h3>
  //         <p className="text-slate-500 mb-4">
  //           Upload your first resume to get started
  //         </p>
  //         <button
  //           onClick={openFileDialog}
  //           className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  //           disabled={uploading}
  //         >
  //           <Upload className="h-4 w-4 mr-2" />
  //           {uploading ? "Uploading..." : "Upload Resume"}
  //         </button>
  //       </div>
  //     )}
  //     </div>
  //   </div>
  //   </div>
  // );
};

export default DocumentCenter;


// import React, { useState, useEffect } from "react";
// import { FileText, Download, Eye, Trash2, Upload } from "lucide-react";
// import { supabase } from "../utils/supabaseClient";
// import { UserAuth } from "../Auth/AuthContext";

// const DocumentCenter = () => {
//   const { session } = UserAuth();
//   const userId = session?.user?.id;

//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState(null);
//   const [variant, setVariant] = useState("success");

//   const showMessage = (msg, type = "success") => {
//     setMessage(msg);
//     setVariant(type);
//     setTimeout(() => setMessage(null), 2500);
//   };

//   useEffect(() => {
//     const loadResumes = async () => {
//       if (!userId) {
//         setResumes([]);
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .storage
//           .from("resumes")
//           .list(`${userId}/`, {
//             limit: 100,
//             offset: 0,
//             sortBy: { column: "name", order: "desc" },
//           });

//         if (error) throw error;

//         // Only include files (filter out folders)
//         const mappedResumes = (data || [])
//           .filter((item) => item.name && !item.name.endsWith("/"))
//           .map((item, idx) => ({
//             id: `${item.id || item.name}-${idx}`,
//             name: item.name,
//             size: item.metadata && item.metadata.size
//               ? `${Math.round(item.metadata.size / 1024)} KB`
//               : "",
//             uploadedAt:
//               item.metadata && item.metadata.lastModified
//                 ? new Date(item.metadata.lastModified).toISOString().slice(0, 10)
//                 : "",
//             type: item.metadata?.mimetype || "",
//           }));

//         setResumes(mappedResumes);
//       } catch (err) {
//         showMessage("Failed to load resumes", "error");
//         setResumes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadResumes();
//   }, [userId]);

//   // Handle preview and download (open with createSignedUrl)
//   const handlePreview = async (resume) => {
//     try {
//       const { data, error } = await supabase
//         .storage
//         .from("resumes")
//         .createSignedUrl(`${userId}/${resume.name}`, 60);
//       if (error || !data?.signedUrl) throw error;
//       showMessage(`Opening preview for ${resume.name}...`);
//       window.open(data.signedUrl, "_blank");
//     } catch {
//       showMessage("Could not generate preview link", "error");
//     }
//   };

//   const handleDownload = async (resume) => {
//     try {
//       const { data, error } = await supabase
//         .storage
//         .from("resumes")
//         .createSignedUrl(`${userId}/${resume.name}`, 60);
//       if (error || !data?.signedUrl) throw error;
//       showMessage(`Downloading ${resume.name}...`);
//       window.open(data.signedUrl, "_blank");
//     } catch {
//       showMessage("Could not generate download link", "error");
//     }
//   };

//   // Delete file from storage
//   const handleDelete = async (resumeId) => {
//     const resume = resumes.find((r) => r.id === resumeId);
//     if (!resume) return;
//     try {
//       const { error } = await supabase
//         .storage
//         .from("resumes")
//         .remove([`${userId}/${resume.name}`]);
//       if (error) throw error;
//       setResumes(resumes.filter((r) => r.id !== resumeId));
//       showMessage("Resume deleted successfully");
//     } catch {
//       showMessage("Failed to delete resume", "error");
//     }
//   };

//   const handleUpload = () => {
//     showMessage("Upload integration coming soon");
//   };

//   const getFileIcon = (type) => (
//     <FileText className="h-8 w-8 text-blue-500" />
//   );

//   const messageColors =
//     variant === "error"
//       ? "bg-red-100 text-red-800 border-red-300"
//       : "bg-green-100 text-green-800 border-green-300";

//   if (!userId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Sign in to view your documents.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Notification bar */}
//       {message && (
//         <div className={`border px-4 py-2 rounded mb-4 ${messageColors}`}>
//           {message}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-700">Document Center</h1>
//           <p className="text-slate-600 mt-2">
//             Manage your resumes and documents in one place
//           </p>
//         </div>
//         <button
//           onClick={handleUpload}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           <Upload className="h-4 w-4" />
//           Upload Resume
//         </button>
//       </div>

//       {/* Stats (hardcoded for now except total) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="rounded-lg bg-white shadow-sm border p-4 flex items-center space-x-2">
//           <FileText className="h-5 w-5 text-blue-500" />
//           <div>
//             <p className="text-sm text-slate-600">Total Documents</p>
//             <p className="text-2xl font-bold text-slate-800">{resumes.length}</p>
//           </div>
//         </div>
//         <div className="rounded-lg bg-white shadow-sm border p-4 flex items-center space-x-2">
//           <Download className="h-5 w-5 text-green-500" />
//           <div>
//             <p className="text-sm text-slate-600">Downloads</p>
//             <p className="text-2xl font-bold text-slate-800">24</p>
//           </div>
//         </div>
//         <div className="rounded-lg bg-white shadow-sm border p-4 flex items-center space-x-2">
//           <Eye className="h-5 w-5 text-purple-500" />
//           <div>
//             <p className="text-sm text-slate-600">Views</p>
//             <p className="text-2xl font-bold text-slate-800">128</p>
//           </div>
//         </div>
//       </div>

//       {/* Documents List */}
//       {resumes.length > 0 ? (
//         <ul className="divide-y divide-slate-200 rounded-lg bg-white border shadow-sm">
//           {resumes.map((resume) => (
//             <li key={resume.id} className="flex items-center px-4 py-3">
//               {getFileIcon(resume.type)}
//               <div className="flex-1 min-w-0 ml-4">
//                 <div className="text-sm font-medium text-slate-800 truncate">
//                   {resume.name}
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   {resume.size} {resume.uploadedAt && <>• {resume.uploadedAt}</>}
//                 </div>
//               </div>
//               <div className="flex gap-2 ml-4">
//                 <button
//                   onClick={() => handlePreview(resume)}
//                   className="flex items-center text-xs border border-slate-300 bg-white rounded px-2 py-1 hover:bg-slate-50"
//                 >
//                   <Eye className="h-3 w-3 mr-1" /> Preview
//                 </button>
//                 <button
//                   onClick={() => handleDownload(resume)}
//                   className="flex items-center text-xs border border-slate-300 bg-white rounded px-2 py-1 hover:bg-slate-50"
//                 >
//                   <Download className="h-3 w-3 mr-1" /> Download
//                 </button>
//                 <button
//                   onClick={() => handleDelete(resume.id)}
//                   className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-slate-300 rounded px-2 py-1"
//                 >
//                   <Trash2 className="h-3 w-3" />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <div className="text-center py-12">
//           <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-slate-600 mb-2">
//             No documents found
//           </h3>
//           <p className="text-slate-500 mb-4">
//             Upload your first resume to get started
//           </p>
//           <button
//             onClick={handleUpload}
//             className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             <Upload className="h-4 w-4 mr-2" />
//             Upload Resume
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentCenter;

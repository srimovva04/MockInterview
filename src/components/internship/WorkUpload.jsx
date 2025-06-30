import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSimulations, fetchTasksForSimulation, updateTaskProgress, getTasksWithUserProgress } from '../utils/simulations';
import { CheckCircle, PlayCircle, Briefcase, Check, AlertCircle, Upload, FileText, Clock, ArrowLeft } from 'lucide-react';

import { supabase } from '../utils/supabaseClient';


const WorkUpload = ({ task, onUploadSuccess, isUploading, setIsUploading, currentUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (task.status === 'completed') {
      setUploadError('This task has already been submitted.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }
    
    if (!currentUser) {
      setUploadError('You must be logged in to upload files');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    let uploadedFilePath = null; // Track the uploaded file path for cleanup

    try {
      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${currentUser.id}_${task.id}_${Date.now()}.${fileExt}`;
      const filePath = `task-submissions/${fileName}`;
      uploadedFilePath = filePath; // Store for potential cleanup

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update or insert task progress in database
      const { error: progressError } = await supabase
        .from('user_task_progress')
        .upsert({
          user_id: currentUser.id,
          simulation_id: task.simulation_id,
          task_id: task.id,
          status: 'completed',
          confirmation_status: 'pending',
          uploaded_work_url: publicUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,task_id'
        });

      if (progressError) {
        // Database update failed - clean up the uploaded file
        console.error('Database update failed, cleaning up uploaded file:', progressError);
        
        try {
          const { error: deleteError } = await supabase.storage
            .from('submissions')
            .remove([uploadedFilePath]);
          
          if (deleteError) {
            console.error('Failed to clean up uploaded file:', deleteError);
            // Don't throw here as we want to show the original database error to user
          } else {
            console.log('Successfully cleaned up uploaded file after database error');
          }
        } catch (cleanupError) {
          console.error('Error during file cleanup:', cleanupError);
        }

        throw new Error(`Failed to update progress: ${progressError.message}`);
      }

      // Success - reset file selection and notify parent
      onUploadSuccess(publicUrl);
      setSelectedFile(null);
      uploadedFilePath = null; // Clear the path since we succeeded
      
    } catch (error) {
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show upload status if task is completed
  if (task.status === 'completed' && task.uploaded_work_url) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-green-800">Work Submitted</h4>
            <p className="text-sm text-green-700 mt-1">
              Your work has been uploaded successfully.
              {task.confirmation_status === 'pending' && (
                <span className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  Awaiting review
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">Submitted by: You</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Upload Your Work</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select file to upload
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading || task.status === 'completed'}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.mp4,.mov,.avi"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR, JPG, PNG, MP4, MOV, AVI (Max 10MB)
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">({formatFileSize(selectedFile.size)})</span>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{uploadError}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || task.status === 'completed'}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
            !selectedFile || isUploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit Work
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkUpload;


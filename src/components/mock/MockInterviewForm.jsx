import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { supabase } from '../utils/supabaseClient';

export const MockInterviewForm = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [scheduleNow, setScheduleNow] = useState(true);
  const [previousResumes, setPreviousResumes] = useState([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [resumeMode, setResumeMode] = useState('select');

  const [formData, setFormData] = useState({
    role: '',
    domain: 'general',
    interviewType: 'general',
    date: '',
    time: '',
    timezone: '',
  });

  useEffect(() => {
    const fetchUserAndResumes = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      setUserId(user.id);

      const { data: files, error: fileError } = await supabase.storage
        .from('resumes')
        .list(`${user.id}/`, { limit: 100 });

      if (!fileError && files) {
        setPreviousResumes(files);
      }
    };

    fetchUserAndResumes();
  }, []);

  const handleResumeSelect = async (e) => {
    const value = e.target.value;
    if (value === 'upload-new') {
      setResumeMode('upload');
    } else {
      setResumeMode('select');
      setSelectedResumeUrl(value);
    }
  };

const handleResumeUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !userId) return;

  const fileSizeMB = file.size / 1024 / 1024;

  if (file.type !== 'application/pdf') {
    alert('Only PDF files are allowed');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('File size should not exceed 5MB');
    return;
  }

  const filePath = `${userId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);

  if (uploadError) {
    alert('Upload failed');
    return;
  }

  const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
  setSelectedResumeUrl(data.publicUrl);
  setResumeMode('select');

  const { data: newFiles } = await supabase.storage
    .from('resumes')
    .list(`${userId}/`);

  setPreviousResumes(newFiles || []);
  alert('Resume uploaded successfully!');
};



  // const handleResumeUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !userId) return;

  //   if (file.type !== 'application/pdf') {
  //     alert('Only PDF files are allowed');
  //     return;
  //   }

  //   const filePath = `${userId}/${Date.now()}_${file.name}`;
  //   const { error: uploadError } = await supabase.storage
  //     .from('resumes')
  //     .upload(filePath, file);

  //   if (uploadError) {
  //     alert('Upload failed');
  //     return;
  //   }

  //   const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
  //   setSelectedResumeUrl(data.publicUrl);
  //   setResumeMode('select');

  //   const { data: newFiles } = await supabase.storage
  //     .from('resumes')
  //     .list(`${userId}/`);

  //   setPreviousResumes(newFiles || []);
  //   alert('Resume uploaded successfully!');
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('User not authenticated');
      return;
    }

    const resume_url = selectedResumeUrl || null;

    if (!scheduleNow) {
      const { error } = await supabase.from('interview').insert([
        {
          user_id: user.id,
          interview: formData.role || null,
          position: formData.interviewType || null,
          status: 'Pending',
          appointment:
            formData.date && formData.time
              ? `${formData.date} ${formData.time} ${formData.timezone}`
              : null,
          created_at: new Date().toISOString(),
          resume_url,
        },
      ]);

      if (error) {
        alert('Failed to schedule interview: ' + error.message);
        return;
      }

      alert('Interview scheduled successfully!');
      onClose();
    } else {
      navigate('/mockInterview', {
        state: {
          ...formData,
          scheduleNow,
          resume_url,
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-sm">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Start Your Next Interview</h2>
        <hr className="border-gray-300 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg border border-gray-300 bg-black/2">
          {/* Resume Upload / Select */}

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Resume</label>
            <select
              className="w-full border px-3 py-2 rounded"
              onChange={(e) => {
                if (e.target.value === 'upload-new') {
                  document.getElementById('fileUpload').click(); // Trigger file input
                } else {
                  handleResumeSelect(e);
                }
              }}
              value={selectedResumeUrl || ''}
            >
              <option value="">None</option>
              {previousResumes.map((file) => {
                const { data } = supabase.storage
                  .from('resumes')
                  .getPublicUrl(`${userId}/${file.name}`);
                return (
                  <option key={file.name} value={data.publicUrl}>
                    {file.name}
                  </option>
                );
              })}
              <option value="upload-new">Upload New Resume</option>
            </select>

            {/* Hidden file input, triggered when "Upload New Resume" is selected */}
            <input
              id="fileUpload"
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 pr-10 rounded"
            >
              <option value="">Select your Role</option>
              <option value="job1">Job-1</option>
              <option value="job2">Job-2</option>
              <option value="job3">Job-3</option>
            </select>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="general">General</option>
              <option value="algorithms">Algorithms</option>
              <option value="system-design">System Design</option>
            </select>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Interview Type</label>
            <select
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="general">General</option>
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          {/* Schedule Options */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Schedule Interview</label>
            <div className="flex gap-2 p-4 border border-gray-300 rounded justify-center">
              <button
                type="button"
                onClick={() => setScheduleNow(true)}
                className={`px-4 py-2 rounded border ${
                  scheduleNow ? 'button button-m' : 'bg-gray-100 text-blue-800'
                }`}
              >
                Immediately
              </button>
              <button
                type="button"
                onClick={() => setScheduleNow(false)}
                className={`px-4 py-2 rounded border ${
                  !scheduleNow ? 'button button-m' : 'bg-gray-100 text-blue-800'
                }`}
              >
                Set Date and Time
              </button>
            </div>

            <Transition
              show={!scheduleNow}
              enter="transition-all duration-300"
              enterFrom="max-h-0 opacity-0"
              enterTo="max-h-screen opacity-100"
              leave="transition-all duration-200"
              leaveFrom="max-h-screen opacity-100"
              leaveTo="max-h-0 opacity-0"
            >
              <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded border">
                <div className="flex gap-4">

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                </div>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="IST">Indian Standard Time (IST)</option>
                  <option value="ET">Eastern Time (ET)</option>
                  <option value="PT">Pacific Time (PT)</option>
                  <option value="GMT">Greenwich Mean Time (GMT)</option>
                  {/* Add more if needed */}
                </select>
              </div>
            </Transition>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-gray-700">
              Cancel
            </button>
            <button type="submit" className="button button-m">
              Launch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
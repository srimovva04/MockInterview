import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { Transition } from '@headlessui/react';

export const MockInterviewForm = ({ open, onClose ,onSubmit}) => {
  const navigate = useNavigate();  
  const [scheduleNow, setScheduleNow] = useState(true);
  const [formData, setFormData] = useState({
    resume: null,
    role: '',
    domain: 'general',
    interviewType: 'general',
    date: '',
    time: '',
    timezone: 'UTC',
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form submitted:', {
    ...formData,
    scheduleNow,
  });

  // Pass form data using state
  navigate('/mockInterview', {
    state: {
      ...formData,
      scheduleNow,
    },
  });
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-sm">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          X
        </button>

        <h2 className="text-xl font-semibold mb-4">Start Your Next Interview</h2>
        <hr className="border-gray-300 mb-4" />

        <form className="space-y-4 p-6 rounded-lg border border-gray-300 bg-black/2" onSubmit={handleSubmit} >
          {/* Resume Upload */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Resume <span className="text-gray-400">Optional</span>
            </label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1 items-center">
              Role <span className="text-gray-400 ml-1">Optional</span>
            </label>
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

          {/* Knowledge Domain */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Select Knowledge Domain (Specialization) <span className="text-gray-400">Optional</span>
            </label>
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
            <label className="block text-base font-semibold text-gray-800 mb-1 items-center">
              Interview Type <span className="text-gray-400 ml-1">Optional</span>
            </label>
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

          {/* Schedule Interview */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">Schedule your interview</label>
            <div className="flex justify-center mb-4">
              <div className="flex gap-2 p-4 border border-gray-300 rounded">
              <button
                type="button"
                onClick={() => setScheduleNow(true)}
                className={`px-4 py-2 rounded border transition ${
                  scheduleNow ? 'bg-blue-800 text-white' : 'bg-gray-100 text-blue-800'
                }`}
              >
                Immediately
              </button>
              <button
                type="button"
                onClick={() => setScheduleNow(false)}
                className={`px-4 py-2 rounded border transition ${
                  !scheduleNow ? 'bg-blue-800 text-white' : 'bg-gray-100 text-blue-800'
                }`}
              >
                Set Date and Time
              </button>
            </div>
            </div>
            

            <Transition
              show={!scheduleNow}
              enter="transition-all duration-300 ease-in-out"
              enterFrom="max-h-0 opacity-0"
              enterTo="max-h-screen opacity-100"
              leave="transition-all duration-200 ease-in-out"
              leaveFrom="max-h-screen opacity-100"
              leaveTo="max-h-0 opacity-0"
            >
              <div className="overflow-hidden">
                <div className="space-y-4 bg-gray-50 p-4 rounded border">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-1">Pick a date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-1">Select your time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-1">Time Zone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="CET">Central European Time (CET)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700"
            >
              Cancel
            </button>

            <button type="submit" className="px-6 py-2 bg-blue-800 text-white rounded">
              Launch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


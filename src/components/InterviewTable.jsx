import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

const InterviewTable = () => {
  const interviews = [
    {
      interview: 'Job Readiness Assessment',
      position: 'Web Developer',
      status: 'Completed',
      appointment: 'N/A'
    },
    {
      interview: 'Web Developer',
      position: '',
      status: 'Completed',
      appointment: 'N/A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Interview History</h2>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Scheduled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {interview.interview}
                    </div>
                    {interview.position && (
                      <div className="text-sm text-gray-500">{interview.position}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {interview.appointment}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Read Report</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Explore Learning Path</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Page 1/1 Total 2</span>
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
import React from 'react';

const StudentQueue: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Live Queue Status</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        Queue Visualization & Wait Time
      </div>
    </div>
  );
};

export default StudentQueue;

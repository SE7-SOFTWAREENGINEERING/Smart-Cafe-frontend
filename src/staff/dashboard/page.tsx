import React from 'react';

const StaffDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Live Occupancy</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">85%</p>
          <span className="text-sm text-gray-400">120/140 Seats</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Tokens</h3>
          <p className="text-3xl font-bold mt-2 text-orange-500">24</p>
          <span className="text-sm text-gray-400">Next: #405</span>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

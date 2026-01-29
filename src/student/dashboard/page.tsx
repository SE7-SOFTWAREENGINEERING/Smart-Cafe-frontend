import React from 'react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Current Booking</h3>
          <p className="text-xl font-semibold mt-2">No active booking</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Wallet Balance</h3>
          <p className="text-xl font-semibold mt-2">₹ 450.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Sustainability Score</h3>
          <p className="text-xl font-semibold mt-2 text-green-600">850 pts</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

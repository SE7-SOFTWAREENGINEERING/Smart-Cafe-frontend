import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Total Users</h3>
          <p className="text-2xl font-bold mt-1">2,450</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Students</h3>
          <p className="text-2xl font-bold mt-1">2,300</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Staff</h3>
          <p className="text-2xl font-bold mt-1">45</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-medium uppercase">System Health</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">99.9%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

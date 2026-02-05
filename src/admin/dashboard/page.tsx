import React from 'react';
import { Users, UserCheck, ShieldCheck, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System Governance & Health</p>
      </header>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Users</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">2,450</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
        </div>

        {/* Students */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Students</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">2,300</p>
          </div>
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
             <UserCheck size={24} />
          </div>
        </div>

        {/* Staff */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Staff</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">45</p>
          </div>
          <div className="p-3 rounded-full bg-purple-50 text-purple-600">
             <ShieldCheck size={24} />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">System Health</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">99.9%</p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
             <Activity size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';

const ManagerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Predicted Demand</h3>
          <p className="text-2xl font-bold mt-2">1,250 Meals</p>
          <span className="text-sm text-green-600">↑ 12% vs last week</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Food Waste Risk</h3>
          <p className="text-2xl font-bold mt-2 text-yellow-600">Low</p>
          <span className="text-sm text-gray-400">~2% variance</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Todays Revenue</h3>
          <p className="text-2xl font-bold mt-2">₹ 45,200</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

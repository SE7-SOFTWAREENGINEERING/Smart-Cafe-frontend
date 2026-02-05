import React from 'react';
import { TrendingUp, AlertTriangle, DollarSign, Utensils } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Operational Overview & Demand Analytics</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Predicted Demand Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Predicted Demand</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">1,250 <span className="text-lg font-normal text-gray-500">Meals</span></p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Utensils size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <TrendingUp size={16} />
            <span>12% increase vs last week</span>
          </div>
        </div>

        {/* Food Waste Risk Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Food Waste Risk</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">Low</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>~2% variance expected</span>
          </div>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Today's Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹ 45,200</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Daily average: ₹ 42,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

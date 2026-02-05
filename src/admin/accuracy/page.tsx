import React from 'react';
import { BarChart } from 'lucide-react';

const AdminAccuracy: React.FC = () => {
  // Mock Data
  const accuracyData = [
    { day: 'Mon', predicted: 1200, actual: 1150 },
    { day: 'Tue', predicted: 1250, actual: 1280 },
    { day: 'Wed', predicted: 1300, actual: 1290 },
    { day: 'Thu', predicted: 1180, actual: 1200 },
    { day: 'Fri', predicted: 1350, actual: 1320 },
    { day: 'Sat', predicted: 900, actual: 850 },
    { day: 'Sun', predicted: 950, actual: 980 },
  ];

  const maxVal = Math.max(...accuracyData.map(d => Math.max(d.predicted, d.actual)));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Forecast Accuracy</h1>
        <p className="text-sm text-gray-500 mt-1">Evaluate AI model performance.</p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">MAPE (Error Rate)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">3.2%</p>
            <span className="text-xs text-green-600 font-medium">Excellent Performance</span>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Root Mean Sq. Error</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">45.2</p>
            <span className="text-xs text-gray-400">Meals per day deviation</span>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Model Status</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-lg font-bold text-green-700">Healthy</p>
            </div>
            <span className="text-xs text-gray-400">Last retrained: 2 days ago</span>
         </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-semibold text-gray-900 flex items-center gap-2">
             <BarChart size={18} className="text-blue-600" />
             Predicted vs Actual Demand
           </h3>
           <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-300"></span> Predicted
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Actual
              </div>
           </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-2">
           {accuracyData.map((data, index) => (
             <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full h-full flex items-end justify-center gap-1 relative">
                   {/* Predicted Bar */}
                   <div 
                     className="w-1/2 bg-blue-300 rounded-t-sm transition-all hover:opacity-80"
                     style={{ height: `${(data.predicted / maxVal) * 100}%` }}
                   ></div>
                   {/* Actual Bar */}
                   <div 
                     className="w-1/2 bg-blue-600 rounded-t-sm transition-all hover:opacity-80"
                     style={{ height: `${(data.actual / maxVal) * 100}%` }}
                   ></div>
                   
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10">
                      <div className="font-semibold mb-1">{data.day}</div>
                      <div>Pred: {data.predicted}</div>
                      <div>Actual: {data.actual}</div>
                   </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{data.day}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAccuracy;

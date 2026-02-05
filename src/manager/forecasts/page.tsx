import React, { useState } from 'react';
import { Filter, BarChart2 } from 'lucide-react';

const ManagerForecasts: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('Week');
  const [mealFilter, setMealFilter] = useState('All');

  const chartData = [120, 150, 180, 140, 160, 190, 170];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...chartData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecast Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven demand prediction and planning.</p>
        </div>
        
        {/* Filters Panel */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-gray-200">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600 font-medium cursor-pointer"
          >
            <option>Today</option>
            <option>Week</option>
            <option>Month</option>
          </select>
          <div className="w-px h-4 bg-gray-200"></div>
          <select 
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600 font-medium cursor-pointer"
          >
            <option>All Types</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Demand Trend
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
            Next 7 Days
          </span>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {chartData.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
               <div className="relative w-full flex justify-center items-end h-48 bg-gray-50 rounded-lg overflow-hidden">
                  <div 
                    className="w-full mx-1 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600"
                    style={{ height: `${(value / maxVal) * 100}%` }}
                  ></div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow transition-opacity z-10">
                    {value}
                  </div>
               </div>
               <span className="text-xs text-gray-500 font-medium">{days[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-900">Item-wise Predictions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                      <th className="px-4 py-3 rounded-l-lg">Item Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Predicted Qty</th>
                      <th className="px-4 py-3">Trend</th>
                      <th className="px-4 py-3 rounded-r-lg">Confidence</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">Vegetable Biryani</td>
                      <td className="px-4 py-3 text-gray-500">Lunch</td>
                      <td className="px-4 py-3">150 plates</td>
                      <td className="px-4 py-3 text-green-600">↑ High</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">92%</span>
                        </div>
                      </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">Paneer Butter Masala</td>
                      <td className="px-4 py-3 text-gray-500">Lunch</td>
                      <td className="px-4 py-3">80 plates</td>
                      <td className="px-4 py-3 text-gray-500">→ Stable</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '89%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">89%</span>
                        </div>
                      </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">Idli Sambar</td>
                      <td className="px-4 py-3 text-gray-500">Breakfast</td>
                      <td className="px-4 py-3">200 plates</td>
                      <td className="px-4 py-3 text-green-600">↑ High</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '95%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">95%</span>
                        </div>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerForecasts;

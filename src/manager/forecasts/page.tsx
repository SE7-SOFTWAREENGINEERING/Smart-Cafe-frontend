import React from 'react';

const ManagerForecasts: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Forecast Analytics</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center text-gray-400">
        Interactive Charts (Recharts/Chart.js) Placeholder
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4">Item-wise Predictions</h3>
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
                <tr>
                    <th className="px-4 py-2 rounded-l-lg">Item Name</th>
                    <th className="px-4 py-2">Predicted Qty</th>
                    <th className="px-4 py-2 rounded-r-lg">Confidence</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr>
                    <td className="px-4 py-3">Vegetable Biryani</td>
                    <td className="px-4 py-3">150 plates</td>
                    <td className="px-4 py-3 text-green-600">High (92%)</td>
                </tr>
                <tr>
                    <td className="px-4 py-3">Paneer Butter Masala</td>
                    <td className="px-4 py-3">80 plates</td>
                    <td className="px-4 py-3 text-green-600">High (89%)</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerForecasts;

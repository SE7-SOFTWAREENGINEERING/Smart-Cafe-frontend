import React from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import Button from '../../components/common/Button';

const AdminCapacity: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
         <h1 className="text-2xl font-bold text-gray-900">Capacity & Priority</h1>
         <p className="text-sm text-gray-500 mt-1">Manage forecasting limits and queue priority.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
            <Settings size={20} className="text-blue-600" />
            <h3>Global Configuration</h3>
          </div>
          
          <div className="space-y-6">
             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                   <label className="block text-sm font-medium text-gray-900">Max Capacity per Slot</label>
                   <p className="text-xs text-gray-500 mt-1">Limit across all meal types</p>
                </div>
                <input type="number" defaultValue={200} className="w-24 border border-gray-300 rounded px-3 py-2 text-center font-bold" />
             </div>

             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                   <label className="block text-sm font-medium text-gray-900">Priority Quota (Staff)</label>
                   <p className="text-xs text-gray-500 mt-1">Reserved seats for staff</p>
                </div>
                <input type="number" defaultValue={20} className="w-24 border border-gray-300 rounded px-3 py-2 text-center font-bold" />
             </div>

             <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg flex gap-3 text-sm text-orange-700">
               <AlertCircle size={20} className="shrink-0" />
               <p>Warning: Reducing capacity below predicted demand (avg 180) may increase queue wait times significantly.</p>
             </div>
          </div>
          
          <div className="mt-8">
             <Button className="w-full">Update Global Settings</Button>
          </div>
        </div>

        {/* Slot Overrides */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
               <h3 className="font-semibold text-gray-900">Slot-specific Overrides</h3>
               <p className="text-xs text-gray-500 mt-1">Adjust capacity for peak hours only.</p>
           </div>
           
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                  <tr>
                      <th className="px-6 py-3">Time Slot</th>
                      <th className="px-6 py-3">Override</th>
                      <th className="px-6 py-3">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  <tr>
                      <td className="px-6 py-4 font-medium">12:30 PM - 01:00 PM</td>
                      <td className="px-6 py-4">
                        <input type="number" defaultValue={250} className="w-20 border border-gray-300 rounded px-2 py-1" />
                      </td>
                      <td className="px-6 py-4 text-red-600 hover:underline cursor-pointer">Reset</td>
                  </tr>
                  <tr>
                      <td className="px-6 py-4 font-medium">01:00 PM - 01:30 PM</td>
                      <td className="px-6 py-4">
                        <input type="number" defaultValue={220} className="w-20 border border-gray-300 rounded px-2 py-1" />
                      </td>
                      <td className="px-6 py-4 text-red-600 hover:underline cursor-pointer">Reset</td>
                  </tr>
              </tbody>
           </table>
           
           <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
             <button className="text-sm text-blue-600 font-medium hover:underline">+ Add Time Slot Override</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;

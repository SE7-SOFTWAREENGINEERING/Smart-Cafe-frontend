import React from 'react';
<<<<<<< HEAD
import { AlertCircle, Settings, Scale, Utensils, Users, Timer } from 'lucide-react';
=======
import { AlertCircle, Settings } from 'lucide-react';
>>>>>>> 56c300a93b26840b98a438e615f5fdf827779a16
import Button from '../../components/common/Button';

const AdminCapacity: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
<<<<<<< HEAD
        <h1 className="text-2xl font-bold text-gray-900">Policies & Capacity</h1>
        <p className="text-sm text-gray-500 mt-1">Manage capacity limits, fairness rules, and serving policies.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Constraints & Token Rules */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Scale size={20} className="text-blue-600" />
              <h3>Fairness Constraints</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Max Bookings / Student / Day</label>
                <input type="number" defaultValue={2} className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold" />
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">Peak Booking Window (mins)</label>
                <input type="number" defaultValue={30} className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Timer size={20} className="text-red-600" />
              <h3>Token Lifecycle Rules</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Token Expiry Duration</label>
                  <p className="text-xs text-gray-500">Mins after slot end</p>
                </div>
                <input type="number" defaultValue={60} className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700" />
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <label className="block text-sm font-medium text-gray-900">No-Show Grace Period</label>
                  <p className="text-xs text-gray-500">Mins before penalty</p>
                </div>
                <input type="number" defaultValue={15} className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700" />
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">No-Show Penalty</label>
                  <p className="text-xs text-gray-400">Days to block after violation</p>
                </div>
                <input type="number" defaultValue={7} className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Utensils size={20} className="text-orange-600" />
              <h3>Serving Rules</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Rice Portion Limit (g)</label>
                <input type="number" defaultValue={250} className="w-20 border border-gray-300 rounded px-2 py-1 text-right" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Curry Portion Limit (ml)</label>
                <input type="number" defaultValue={150} className="w-20 border border-gray-300 rounded px-2 py-1 text-right" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Capacity & Priorities */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Settings size={20} className="text-gray-600" />
              <h3>Global Capacity</h3>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">Max Capacity per Slot</label>
                <p className="text-xs text-gray-500 mt-1">Limit across all meal types</p>
              </div>
              <input type="number" defaultValue={200} className="w-24 border border-gray-300 rounded px-3 py-2 text-center font-bold text-lg" />
            </div>

            <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg flex gap-3 text-sm text-orange-700 mb-6">
              <AlertCircle size={20} className="shrink-0" />
              <p>Warning: Reducing capacity below predicted demand (avg 180) may increase queue wait times.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <Users size={20} className="text-purple-600" />
              <h3>Fairness & Priority Logic</h3>
            </div>

            <div className="space-y-6">
              {/* Priority Config */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Segments</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Faculty & Staff</span>
                        <p className="text-xs text-gray-500">Guaranteed slots</p>
                      </div>
                    </div>
                    <input type="number" defaultValue={50} className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Guests / Events</span>
                        <p className="text-xs text-gray-500">High priority allocation</p>
                      </div>
                    </div>
                    <input type="number" defaultValue={20} className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv" />
                  </div>
                </div>
              </div>

              {/* Logic Visualizer */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Token Assignment Logic</h4>
                <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border border-gray-100">
                  IF User.Group == Priority THEN Assign_Reserved_Slot<br />
                  ELSE IF Slot.Capacity &gt; 0 THEN Assign_Standard_Slot<br />
                  ELSE Add_To_Waitlist
                </p>
              </div>

              {/* Misuse Detection */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                  <AlertCircle size={14} />
                  Misuse Detection (Recent)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 bg-red-50 rounded text-red-700">
                    <span><strong>ID: 2201</strong> - Suspicious bulk booking</span>
                    <button className="underline hover:text-red-900">Investigate</button>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-red-50 rounded text-red-700">
                    <span><strong>ID: 4055</strong> - Proxy proxy detected</span>
                    <button className="underline hover:text-red-900">Investigate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full">Save All Policy Changes</Button>
=======
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
>>>>>>> 56c300a93b26840b98a438e615f5fdf827779a16
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;

import React, { useState } from 'react';
import { Clock, Users, Slash, CheckCircle, AlertTriangle } from 'lucide-react';

const SlotManagement: React.FC = () => {
  const [slots, setSlots] = useState([
    { time: '12:00 PM', capacity: 150, booked: 142, status: 'Full' },
    { time: '12:30 PM', capacity: 150, booked: 98, status: 'Available' },
    { time: '01:00 PM', capacity: 150, booked: 45, status: 'Available' },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Slot & Booking Control</h3>
        <button className="text-xs text-blue-600 font-medium hover:underline">Manage Capacity</button>
      </div>

      <div className="space-y-4">
        {slots.map((slot, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md border border-gray-200 text-gray-700">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{slot.time}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${slot.booked / slot.capacity > 0.9 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{slot.booked}/{slot.capacity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               {slot.status === 'Full' ? (
                 <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">Full</span>
               ) : (
                 <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Open</span>
               )}
               <button className="text-gray-400 hover:text-red-500 transition" title="Block Slot">
                 <Slash size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
          Manual Override
        </button>
        <button className="flex-1 text-center py-2 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-1">
          <AlertTriangle size={12} /> Emergency Cancel
        </button>
      </div>
    </div>
  );
};

export default SlotManagement;

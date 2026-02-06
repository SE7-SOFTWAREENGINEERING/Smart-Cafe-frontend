import React, { useState } from 'react';
import { Calendar, Plus, Clock, Edit2, AlertTriangle } from 'lucide-react';

const SlotManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('Today, 12 Oct');
  
  const slots = [
    { time: '12:00 PM - 12:30 PM', capacity: 150, booked: 142, status: 'Full' },
    { time: '12:30 PM - 01:00 PM', capacity: 150, booked: 98, status: 'Available' },
    { time: '01:00 PM - 01:30 PM', capacity: 150, booked: 45, status: 'Available' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Slot Management</h3>
        <button className="text-brand hover:text-brand-hover text-sm font-medium flex items-center gap-1">
          <Plus size={16} /> Add Slot
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm font-medium">{selectedDate}</span>
        </div>
        <button className="text-xs text-brand hover:underline" onClick={() => setSelectedDate('Tomorrow, 13 Oct')}>Change</button>
      </div>

      <div className="space-y-3">
        {slots.map((slot, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition bg-white">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${slot.status === 'Full' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{slot.time}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${slot.status === 'Full' ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{slot.booked}/{slot.capacity}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-light rounded transition">
                <Edit2 size={16} />
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

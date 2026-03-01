import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Edit2, AlertTriangle, Loader2 } from 'lucide-react';
import { getSlots, type Slot } from '../../../services/booking.service';

const SlotManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('Today, 12 Oct');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveSlots = async () => {
      try {
        const data = await getSlots();
        setSlots(data);
      } catch (error) {
        console.error('Error fetching live slots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveSlots();
  }, [selectedDate]); // Re-fetch on date change if implemented later

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
        {loading ? (
          <div className="flex justify-center py-6 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No active slots found.
          </div>
        ) : (
          slots.map((slot, idx) => {
            const isFull = slot.booked >= slot.capacity;
            return (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition bg-white">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isFull ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{slot.time}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((slot.booked / slot.capacity) * 100, 100)}%` }}
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
            );
          })
        )}
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

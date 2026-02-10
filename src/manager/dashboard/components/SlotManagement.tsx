import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Edit2, AlertTriangle, X, Check } from 'lucide-react';
import { getTimings, getCapacities, getAllBookings, setSlotCapacity } from '../../../services/admin.service';
import { getAllSettings } from '../../../services/system.service';

import toast from 'react-hot-toast';

interface SlotData {
  time: string;
  slotStart: Date;
  capacity: number;
  booked: number;
  status: 'Available' | 'Full' | 'Closed';
  isOverride: boolean;
}

const SlotManagement: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to today
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedSlotForOverride, setSelectedSlotForOverride] = useState<SlotData | null>(null);
  const [overrideCapacity, setOverrideCapacity] = useState<number>(150);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      // Use local date for querying to avoid timezone shifts
      const offset = currentDate.getTimezoneOffset();
      const localDate = new Date(currentDate.getTime() - (offset * 60 * 1000));
      const dateStr = localDate.toISOString().split('T')[0];

      // 1. Fetch Timings
      const timings = await getTimings(dayName);
      const todayTiming = timings.find(t => t.day === dayName);

      // Continued even if holiday to check for overrides

      // 2. Fetch Global Max Capacity
      const settings = await getAllSettings();
      const maxCapSetting = settings.find(s => s.settingKey === 'MAX_CAPACITY_PER_SLOT');
      const globalMaxCapacity = maxCapSetting ? parseInt(maxCapSetting.settingValue) : 150;

      // 3. Fetch Slot Overrides
      const overrides = await getCapacities(dateStr);

      // 4. Fetch Bookings
      const bookings = await getAllBookings({ date: dateStr, limit: 1000 }); // Fetch enough bookings

      // 5. Generate Slots
      const generatedSlots: SlotData[] = [];
      // Track generated slot times to avoid duplicates
      const generatedTimes = new Set<number>();

      if (todayTiming && !todayTiming.is_holiday) {
        const [openH, openM] = todayTiming.opening_time.split(':').map(Number);
        const [closeH, closeM] = todayTiming.closing_time.split(':').map(Number);

        const start = new Date(currentDate);
        start.setHours(openH, openM, 0, 0);
        const end = new Date(currentDate);
        end.setHours(closeH, closeM, 0, 0);

        // Assuming 30 min slots
        for (let dt = new Date(start); dt < end; dt.setMinutes(dt.getMinutes() + 30)) {
          generatedTimes.add(dt.getTime());
          const slotEnd = new Date(dt);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          // Format Time Label
          const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const timeLabel = `${formatTime(dt)} - ${formatTime(slotEnd)}`;

          // Finds Overrides
          const override = overrides.find(o => new Date(o.slot_time).getTime() === dt.getTime());
          const capacity = override ? override.max_capacity : globalMaxCapacity;

          // Count Bookings
          const bookedCount = bookings.bookings.filter((b: any) => {
            const bTime = new Date(b.slotTime).getTime();
            return bTime >= dt.getTime() && bTime < slotEnd.getTime();
          }).length;

          generatedSlots.push({
            time: timeLabel,
            slotStart: new Date(dt),
            capacity,
            booked: bookedCount,
            status: bookedCount >= capacity ? 'Full' : 'Available',
            isOverride: !!override
          });
        }
      }

      // 6. Add Extra Slots from Overrides (that are outside standard timings)
      console.log('Overrides to process:', overrides);

      // 6. Add Extra Slots from Overrides (that are outside standard timings)
      overrides.forEach(o => {
        const oTime = new Date(o.slot_time).getTime();
        // Fuzzy check for existing slots (1s tolerance)
        const exists = generatedSlots.some(s => Math.abs(s.slotStart.getTime() - oTime) < 1000);

        if (!exists) {
          console.log('Adding extra slot from override:', o.slot_time);
          const dt = new Date(o.slot_time);
          const slotEnd = new Date(dt);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const timeLabel = `${formatTime(dt)} - ${formatTime(slotEnd)}`;

          const bookedCount = bookings.bookings.filter((b: any) => {
            const bTime = new Date(b.slotTime).getTime();
            return bTime >= dt.getTime() && bTime < slotEnd.getTime();
          }).length;

          generatedSlots.push({
            time: timeLabel,
            slotStart: dt,
            capacity: o.max_capacity,
            booked: bookedCount,
            status: bookedCount >= o.max_capacity ? 'Full' : 'Available',
            isOverride: true
          });
        }
      });

      // Sort slots by time
      generatedSlots.sort((a, b) => a.slotStart.getTime() - b.slotStart.getTime());

      setSlots(generatedSlots);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleOverrideClick = (slot: SlotData) => {
    setSelectedSlotForOverride(slot);
    setOverrideCapacity(slot.capacity);
    setIsOverrideModalOpen(true);
  };

  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotCapacity, setNewSlotCapacity] = useState(150);

  const handleAddSlot = () => {
    setNewSlotTime('');
    setNewSlotCapacity(150);
    setIsAddSlotModalOpen(true);
  };

  const handleSaveNewSlot = async () => {
    if (!newSlotTime) return toast.error('Please select a time');

    try {
      const [hours, minutes] = newSlotTime.split(':').map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hours, minutes, 0, 0);

      await setSlotCapacity({
        slot_time: slotDate,
        max_capacity: newSlotCapacity
      });

      toast.success('New slot added');
      setIsAddSlotModalOpen(false);
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add slot';
      toast.error(message);
    }
  };

  const handleSaveOverride = async () => {
    if (!selectedSlotForOverride) return;
    try {
      await setSlotCapacity({
        slot_time: selectedSlotForOverride.slotStart,
        max_capacity: overrideCapacity
      });
      toast.success('Capacity updated');
      setIsOverrideModalOpen(false);
      fetchData(); // Refresh
    } catch (error) {
      toast.error('Failed to update capacity');
    }
  };

  const formattedDate = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  // Helper for date input value (YYYY-MM-DD)
  const dateInputValue = (() => {
    const offset = currentDate.getTimezoneOffset();
    const localDate = new Date(currentDate.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  })();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newDate = new Date(e.target.value);
    // Maintain current time logic if needed, but here we just need the date
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Slot Management</h3>
        <button
          onClick={handleAddSlot}
          className="text-brand hover:text-brand-hover text-sm font-medium flex items-center gap-1">
          <Plus size={16} /> Add Slot
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
        <input
          type="date"
          value={dateInputValue}
          onChange={handleDateChange}
          className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {loading ? <div className="text-center py-4 text-xs text-gray-500">Loading slots...</div> :
          slots.length === 0 ? <div className="text-center py-4 text-xs text-gray-500">No slots available (Holiday or Closed)</div> :
            slots.map((slot, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg hover:border-gray-200 transition bg-white ${slot.isOverride ? 'border-orange-200 bg-orange-50' : 'border-gray-100'}`}>
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
                          style={{ width: `${Math.min((slot.booked / slot.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{slot.booked}/{slot.capacity} {slot.isOverride && '(Override)'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOverrideClick(slot)}
                    className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-light rounded transition"
                    title="Override Capacity"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setIsOverrideModalOpen(true)} // Example: Open modal for current selection or first slot. Simplify to notify.
          className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
          Manual Override
        </button>
        <button className="flex-1 text-center py-2 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-1">
          <AlertTriangle size={12} /> Emergency Cancel
        </button>
      </div>

      {/* Override Modal */}
      {isOverrideModalOpen && selectedSlotForOverride && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center p-4 rounded-xl">
          <div className="bg-white border border-gray-200 shadow-lg p-4 rounded-lg w-full max-w-xs transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Override Capacity</h4>
              <button onClick={() => setIsOverrideModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <p className="text-xs text-gray-500 mb-2">Slot: {selectedSlotForOverride.time}</p>
            <input
              type="number"
              value={overrideCapacity}
              onChange={(e) => setOverrideCapacity(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setIsOverrideModalOpen(false)} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveOverride} className="flex-1 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg flex justify-center items-center gap-1">
                <Check size={12} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddSlotModalOpen && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center p-4 rounded-xl">
          <div className="bg-white border border-gray-200 shadow-lg p-4 rounded-lg w-full max-w-xs transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Add New Slot</h4>
              <button onClick={() => setIsAddSlotModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Time</label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Capacity</label>
                <input
                  type="number"
                  value={newSlotCapacity}
                  onChange={(e) => setNewSlotCapacity(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setIsAddSlotModalOpen(false)} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveNewSlot} className="flex-1 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg flex justify-center items-center gap-1">
                <Check size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;

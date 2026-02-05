import React, { useState } from 'react';
import { Calendar, Clock, Save, Coffee } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminTimings: React.FC = () => {
  const [schedule, setSchedule] = useState(DAYS.map(day => ({
    day,
    isOpen: day !== 'Sunday',
    openTime: '08:00',
    closeTime: '20:00',
    isHoliday: false
  })));

  const handleToggleHoliday = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isHoliday = !newSchedule[index].isHoliday;
    setSchedule(newSchedule);
  };

  const handleChangeTime = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timings & Holidays</h1>
          <p className="text-sm text-gray-500 mt-1">Configure cafeteria operating hours.</p>
        </div>
        <Button>
          <Save size={16} className="mr-2" />
          Save Schedule
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
           <div className="bg-blue-50 p-2 rounded-full text-blue-600">
             <Calendar size={20} />
           </div>
           <h3 className="font-semibold text-gray-900">Weekly Schedule</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {schedule.map((slot, index) => (
            <div key={slot.day} className={cn("p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", slot.isHoliday && "bg-gray-50")}>
              <div className="w-32">
                <span className={cn("font-medium", slot.isHoliday ? "text-gray-400" : "text-gray-900")}>
                  {slot.day}
                </span>
                {slot.isHoliday && <span className="ml-2 text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">Holiday</span>}
              </div>

              {!slot.isHoliday ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <input 
                      type="time" 
                      value={slot.openTime}
                      onChange={(e) => handleChangeTime(index, 'openTime', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      value={slot.closeTime}
                      onChange={(e) => handleChangeTime(index, 'closeTime', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                  <Coffee size={16} className="mr-2" /> Closed
                </div>
              )}

              <div className="w-32 flex justify-end">
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!slot.isHoliday} 
                    onChange={() => handleToggleHoliday(index)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-600 text-xs w-10">{!slot.isHoliday ? 'Open' : 'Closed'}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTimings;

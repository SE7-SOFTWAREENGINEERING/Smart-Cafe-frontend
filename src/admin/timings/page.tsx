import React, { useState } from 'react';
import { Calendar, Clock, Save, Coffee, Smartphone, UserCheck, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { getSettingByKey, saveSystemSetting } from '../../services/system.service';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminTimings: React.FC = () => {
  const [schedule, setSchedule] = useState(DAYS.map(day => ({
    day,
    isOpen: day !== 'Sunday',
    openTime: '08:00',
    closeTime: '20:00',
    isHoliday: false
  })));

  // New Service Mode State
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);
  const [walkInEnabled, setWalkInEnabled] = useState(true);
  const CANTEENS = ['Sopanam', 'Prasada', 'Samudra'];
  const [selectedCanteen, setSelectedCanteen] = useState(CANTEENS[0]);

  const [slotDuration, setSlotDuration] = useState('10');
  const [loading, setLoading] = useState(false);
  const [holidayDates, setHolidayDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  React.useEffect(() => {
    loadSettings();
  }, [selectedCanteen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const suffix = `_${selectedCanteen.toUpperCase()}`;

      const timingSetting = await getSettingByKey(`TIMING_CONFIG${suffix}`);
      if (timingSetting) {
        setSchedule(JSON.parse(timingSetting.settingValue));
      } else {
        // Reset to default if not found
        setSchedule(DAYS.map(day => ({
          day,
          isOpen: day !== 'Sunday',
          openTime: '08:00',
          closeTime: '20:00',
          isHoliday: false
        })));
      }

      const serviceSetting = await getSettingByKey(`SERVICE_MODES${suffix}`);
      if (serviceSetting) {
        const modes = JSON.parse(serviceSetting.settingValue);
        setOnlineBookingEnabled(modes.onlineBooking);
        setWalkInEnabled(modes.walkIn);
      } else {
        setOnlineBookingEnabled(true);
        setWalkInEnabled(true);
      }

      const slotSetting = await getSettingByKey(`SLOT_CONFIG${suffix}`);
      if (slotSetting) {
        setSlotDuration(slotSetting.settingValue);
      } else {
        setSlotDuration('10');
      }

      const holidaySetting = await getSettingByKey(`HOLIDAY_DATES${suffix}`);
      if (holidaySetting) {
        setHolidayDates(JSON.parse(holidaySetting.settingValue));
      } else {
        setHolidayDates([]);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const suffix = `_${selectedCanteen.toUpperCase()}`;
      await saveSystemSetting(`TIMING_CONFIG${suffix}`, schedule, 'TIMINGS', `Weekly operating hours for ${selectedCanteen}`);
      await saveSystemSetting(`SERVICE_MODES${suffix}`, { onlineBooking: onlineBookingEnabled, walkIn: walkInEnabled }, 'TIMINGS', `Active service modes for ${selectedCanteen}`);
      await saveSystemSetting(`SLOT_CONFIG${suffix}`, slotDuration, 'TIMINGS', `Slot duration for ${selectedCanteen}`);
      await saveSystemSetting(`HOLIDAY_DATES${suffix}`, holidayDates, 'TIMINGS', `Blockout dates for ${selectedCanteen}`);
      toast.success(`${selectedCanteen} settings saved successfully`);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const toggleHolidayDate = (dateStr: string) => {
    if (holidayDates.includes(dateStr)) {
      setHolidayDates(holidayDates.filter(d => d !== dateStr));
    } else {
      setHolidayDates([...holidayDates, dateStr]);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    // Adjusted for Monday start if needed, but standard 0=Sun is fine for simple view
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-10"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isBlocked = holidayDates.includes(dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div
          key={d}
          onClick={() => toggleHolidayDate(dateStr)}
          className={cn(
            "h-10 flex items-center justify-center rounded cursor-pointer text-sm font-medium transition-colors border",
            isBlocked
              ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
              : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50",
            isToday && !isBlocked && "border-blue-500 text-blue-600 font-bold"
          )}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Timings & Service Controls</h1>
          <p className="text-sm text-gray-500 mt-1">Configure operating hours and service availability. {loading && '(Loading...)'}</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>

      {/* Canteen Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {CANTEENS.map(canteen => (
          <button
            key={canteen}
            onClick={() => setSelectedCanteen(canteen)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              selectedCanteen === canteen
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {canteen}
          </button>
        ))}
      </div>


      {/* Slot Configuration (New) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Slot Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-1">Define the duration of each booking interval.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Slot Duration:</label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="20">20 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>
      </div>

      {/* Service Modes Section (New) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn("p-6 rounded-xl shadow-sm border transition-colors", onlineBookingEnabled ? "bg-white border-blue-100" : "bg-gray-50 border-gray-200")}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", onlineBookingEnabled ? "bg-blue-50 text-blue-600" : "bg-gray-200 text-gray-500")}>
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Online Booking</h3>
                <p className="text-sm text-gray-500">App & Web ordering</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlineBookingEnabled}
                onChange={() => setOnlineBookingEnabled(!onlineBookingEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            {onlineBookingEnabled
              ? "Users can place orders remotely via the application."
              : "Remote ordering is disabled. Users can only view menu."}
          </p>
        </div>

        <div className={cn("p-6 rounded-xl shadow-sm border transition-colors", walkInEnabled ? "bg-white border-green-100" : "bg-gray-50 border-gray-200")}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", walkInEnabled ? "bg-green-50 text-green-600" : "bg-gray-200 text-gray-500")}>
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Walk-in Mode</h3>
                <p className="text-sm text-gray-500">Counter service</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={walkInEnabled}
                onChange={() => setWalkInEnabled(!walkInEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            {walkInEnabled
              ? "Counter staff can process direct orders without app booking."
              : "Walk-in service is suspended. Only pre-booked orders allowed."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-full text-purple-600">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Operating Schedule</h3>
          </div>
          {Array.isArray(schedule) && !schedule.find(s => !s.isHoliday && s.day === 'Sunday') && (
            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              <AlertCircle size={14} />
              <span>Sunday Closed</span>
            </div>
          )}
        </div>


        <div className="divide-y divide-gray-100">
          {Array.isArray(schedule) && schedule.map((slot, index) => (
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-600 text-xs w-10">{!slot.isHoliday ? 'Open' : 'Closed'}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-full text-red-600">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Holiday & Maintenance Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded"> &lt; </button>
            <span className="text-sm font-medium w-32 text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded"> &gt; </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">Click dates to toggle them as closed/holiday.</p>
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-gray-500">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminTimings;

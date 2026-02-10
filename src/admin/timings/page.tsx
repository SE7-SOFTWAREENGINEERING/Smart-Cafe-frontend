import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Save,
  Coffee,
  Smartphone,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Button from "../../components/common/Button";
import { cn } from "../../utils/cn";
import {
  getAllSettings,
  bulkUpdateSettings,
  updateSettingValue,
} from "../../services/system.service";
import toast from "react-hot-toast";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isHoliday: boolean;
}

const AdminTimings: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map((day) => ({
      day,
      isOpen: day !== "Sunday",
      openTime: "08:00",
      closeTime: "20:00",
      isHoliday: false,
    })),
  );

  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);
  const [walkInEnabled, setWalkInEnabled] = useState(true);
  const [slotDuration, setSlotDuration] = useState("15");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings();
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.settingKey.toLowerCase()] = s.settingValue;
      });

      if (map["online_booking_enabled"])
        setOnlineBookingEnabled(map["online_booking_enabled"] === "true");
      if (map["walkin_enabled"])
        setWalkInEnabled(map["walkin_enabled"] === "true");
      if (map["slot_duration"]) setSlotDuration(map["slot_duration"]);

      // Load schedule from settings if stored
      if (map["operating_schedule"]) {
        try {
          const parsed = JSON.parse(map["operating_schedule"]);
          if (Array.isArray(parsed) && parsed.length === 7) setSchedule(parsed);
        } catch {
          /* use defaults */
        }
      }
    } catch (err: any) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await bulkUpdateSettings([
        { key: "online_booking_enabled", value: String(onlineBookingEnabled) },
        { key: "walkin_enabled", value: String(walkInEnabled) },
        { key: "slot_duration", value: slotDuration },
        { key: "operating_schedule", value: JSON.stringify(schedule) },
      ]);
      toast.success("Schedule saved successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOnlineBooking = async () => {
    const newVal = !onlineBookingEnabled;
    setOnlineBookingEnabled(newVal);
    try {
      const updated = await updateSettingValue(
        "online_booking_enabled",
        String(newVal),
      );
      setOnlineBookingEnabled(String(updated.settingValue) === "true");
      toast.success(`Online booking ${newVal ? "enabled" : "disabled"}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
      setOnlineBookingEnabled(!newVal);
    }
  };

  const handleToggleWalkIn = async () => {
    const newVal = !walkInEnabled;
    setWalkInEnabled(newVal);
    try {
      const updated = await updateSettingValue(
        "walkin_enabled",
        String(newVal),
      );
      setWalkInEnabled(String(updated.settingValue) === "true");
      toast.success(`Walk-in mode ${newVal ? "enabled" : "disabled"}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
      setWalkInEnabled(!newVal);
    }
  };

  const handleToggleHoliday = (index: number) => {
    const newSchedule = [...schedule];
    const isHoliday = !newSchedule[index].isHoliday;
    newSchedule[index].isHoliday = isHoliday;
    newSchedule[index].isOpen = !isHoliday;
    setSchedule(newSchedule);
  };

  const handleChangeTime = (
    index: number,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <RefreshCw size={24} className="animate-spin mr-2" /> Loading
        settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Timings & Service Controls
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure operating hours and service availability.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw size={16} className="animate-spin mr-2" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          {saving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>

      {/* Slot Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Slot Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Define the duration of each booking interval.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Slot Duration:
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
          >
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="20">20 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>
      </div>

      {/* Service Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={cn(
            "p-6 rounded-xl shadow-sm border transition-colors",
            onlineBookingEnabled
              ? "bg-white border-blue-100"
              : "bg-gray-50 border-gray-200",
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  onlineBookingEnabled
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-200 text-gray-500",
                )}
              >
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
                onChange={handleToggleOnlineBooking}
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

        <div
          className={cn(
            "p-6 rounded-xl shadow-sm border transition-colors",
            walkInEnabled
              ? "bg-white border-green-100"
              : "bg-gray-50 border-gray-200",
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  walkInEnabled
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-200 text-gray-500",
                )}
              >
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
                onChange={handleToggleWalkIn}
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

      {/* Operating Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-full text-purple-600">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Operating Schedule</h3>
          </div>
          {!schedule.find((s) => !s.isHoliday && s.day === "Sunday") && (
            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              <AlertCircle size={14} />
              <span>Sunday Closed</span>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {schedule.map((slot, index) => (
            <div
              key={slot.day}
              className={cn(
                "p-4 flex items-center justify-between hover:bg-gray-50 transition-colors",
                slot.isHoliday && "bg-gray-50",
              )}
            >
              <div className="w-32">
                <span
                  className={cn(
                    "font-medium",
                    slot.isHoliday ? "text-gray-400" : "text-gray-900",
                  )}
                >
                  {slot.day}
                </span>
                {slot.isHoliday && (
                  <span className="ml-2 text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                    Holiday
                  </span>
                )}
              </div>

              {!slot.isHoliday ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <input
                      type="time"
                      value={slot.openTime}
                      onChange={(e) =>
                        handleChangeTime(index, "openTime", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.closeTime}
                      onChange={(e) =>
                        handleChangeTime(index, "closeTime", e.target.value)
                      }
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
                  <span className="ml-3 text-sm font-medium text-gray-600 text-xs w-10">
                    {!slot.isHoliday ? "Open" : "Closed"}
                  </span>
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

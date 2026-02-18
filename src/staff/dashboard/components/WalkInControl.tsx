import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import * as bookingService from "../../../services/booking.service";
import * as systemService from "../../../services/system.service";
import toast from "react-hot-toast";

const WalkInControl: React.FC = () => {
  const [walkIns, setWalkIns] = useState(0);
  const [loading, setLoading] = useState(true);
  const [walkinEnabled, setWalkinEnabled] = useState(true);
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get today's booking stats to count walk-ins
      const today = new Date().toISOString().split("T")[0];
      const [stats, walkinSetting, onlineSetting] = await Promise.all([
        bookingService.getBookingStats({ date: today }).catch(() => null),
        systemService.getSetting("walkin_enabled").catch(() => null),
        systemService.getSetting("online_booking_enabled").catch(() => null),
      ]);

      if (stats && (stats as any).walkinCount !== undefined) {
        setWalkIns((stats as any).walkinCount);
      } else if (stats && (stats as any).totalBookings !== undefined) {
        // Approximate: count walk-ins from total
        setWalkIns((stats as any).walkinBookings || 0);
      }

      if (walkinSetting) {
        setWalkinEnabled(walkinSetting.settingValue === "true");
      }
      if (onlineSetting) {
        setOnlineBookingEnabled(onlineSetting.settingValue === "true");
      }
    } catch (error) {
      console.error("Failed to load walk-in data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWalkin = async () => {
    try {
      const newValue = !walkinEnabled;
      await systemService.updateSettingValue(
        "walkin_enabled",
        String(newValue),
      );
      setWalkinEnabled(newValue);
      toast.success(newValue ? "Walk-ins enabled" : "Walk-ins blocked");
    } catch (error) {
      console.error("Failed to toggle walk-ins:", error);
      toast.error("Failed to update walk-in setting");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={20} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            System Status
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Current operating mode
          </p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* Online Booking Status */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${onlineBookingEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                {/* Smartphone Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900">Online Booking</p>
                <p className="text-xs text-gray-500">App & Web ordering</p>
            </div>
            </div>
             <div className="flex items-center">
                 <div className={`text-xs font-bold px-2 py-1 rounded ${onlineBookingEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                    {onlineBookingEnabled ? 'Active' : 'Disabled'}
                 </div>
            </div>
        </div>

        {/* Walk-in Mode Status */}
        <div className={`p-3 rounded-lg border flex items-center justify-between ${walkinEnabled ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${walkinEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {/* User Check Icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                </div>
                <div>
                     <p className="text-sm font-semibold text-gray-900">Walk-in Mode</p>
                     <p className="text-xs text-gray-500">Counter service</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={walkinEnabled}
                    onChange={toggleWalkin}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Walk-ins Today</span>
        <p className="text-2xl font-bold text-gray-900">
          {walkIns}
        </p>
      </div>

    </div>
  );
};

export default WalkInControl;

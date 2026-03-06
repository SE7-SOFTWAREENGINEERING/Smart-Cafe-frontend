import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  getBookingStats,
  getAllBookings,
} from "../../../services/booking.service";
import {
  getSetting,
  updateSettingValue,
} from "../../../services/system.service";
import toast from "react-hot-toast";

interface Props {
  canteenId?: string;
}

const QueueMonitor: React.FC<Props> = ({ canteenId }) => {
  const [isQueueActive, setIsQueueActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inQueue: 0,
    issued: 0,
    served: 0,
    expired: 0,
  });

  const loadData = useCallback(async () => {
    try {
      const [bookingStats, queueSetting] = await Promise.all([
        getBookingStats({ canteenId }).catch(() => null),
        getSetting("queue_enabled").catch(() => null),
      ]);

      if (queueSetting) setIsQueueActive(queueSetting.settingValue === "true");

      // Compute stats from bookings
      if (bookingStats) {
        setStats({
          inQueue: (bookingStats as any).confirmed || 0,
          issued: (bookingStats as any).total || 0,
          served: (bookingStats as any).completed || 0,
          expired: (bookingStats as any).expired || 0,
        });
      } else {
        // Fallback: fetch bookings directly
        try {
          const allBookings = await getAllBookings();
          const list = Array.isArray(allBookings)
            ? allBookings
            : (allBookings as any).bookings || [];
          const confirmed = list.filter(
            (b: any) => b.status === "confirmed",
          ).length;
          const completed = list.filter(
            (b: any) => b.status === "completed",
          ).length;
          const expired = list.filter(
            (b: any) => b.status === "expired",
          ).length;
          setStats({
            inQueue: confirmed,
            issued: list.length,
            served: completed,
            expired,
          });
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleToggleQueue = async () => {
    const next = !isQueueActive;
    setIsQueueActive(next);
    try {
      await updateSettingValue("queue_enabled", String(next));
      toast.success(next ? "Queue resumed" : "Queue paused");
    } catch {
      setIsQueueActive(!next);
      toast.error("Failed to update queue status");
    }
  };

  const trafficLevel =
    stats.issued === 0 && stats.inQueue === 0
      ? "No Data"
      : stats.inQueue > 50
        ? "High Traffic"
        : stats.inQueue > 20
          ? "Moderate"
          : "Low Traffic";
  const trafficColor =
    stats.issued === 0 && stats.inQueue === 0
      ? "text-gray-500 bg-gray-100"
      : stats.inQueue > 50
        ? "text-red-600 bg-red-50"
        : stats.inQueue > 20
          ? "text-amber-600 bg-amber-50"
          : "text-green-600 bg-green-50";

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[250px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">
            Live Queue Status
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {stats.inQueue}
            </h2>
            <div
              className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trafficColor}`}
            >
              <Users size={12} className="mr-1" />
              {trafficLevel}
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <span className="block text-xl font-bold text-gray-800">
            {stats.issued}
          </span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">
            Issued
          </span>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <span className="block text-xl font-bold text-blue-700">
            {stats.served}
          </span>
          <span className="text-[10px] text-blue-600 uppercase font-semibold">
            Served
          </span>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <span className="block text-xl font-bold text-red-700">
            {stats.expired}
          </span>
          <span className="text-[10px] text-red-600 uppercase font-semibold">
            Expired
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* FIFO Status */}
        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">FIFO Compliance</span>
          <span className="text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
            {stats.issued > 0
              ? Math.round((stats.served / stats.issued) * 100)
              : 0}
            %
          </span>
        </div>

        {/* Wait Time */}
        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">In Queue</span>
          <span className="text-gray-900 font-medium">
            {stats.inQueue} waiting
          </span>
        </div>

        {/* Controls */}
        <div className="pt-2 flex gap-2">
          <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium py-2 rounded-lg transition flex justify-center items-center gap-1">
            <AlertCircle size={14} /> Force Clear
          </button>
          <button
            onClick={handleToggleQueue}
            className={`flex-1 text-xs font-medium py-2 rounded-lg transition flex justify-center items-center gap-1 ${isQueueActive ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
          >
            {isQueueActive ? (
              <PauseCircle size={14} />
            ) : (
              <PlayCircle size={14} />
            )}
            {isQueueActive ? "Pause Queue" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueMonitor;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Filter } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { getScanHistory, type Booking } from "../../services/booking.service";

const formatTime = (date?: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date?: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const StaffScanHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  });
  const [sortOrder, setSortOrder] = useState("desc");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getScanHistory({ date: selectedDate });
      setBookings(result.bookings || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load scan history",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sortedBookings = useMemo(() => {
    const items = [...bookings];
    items.sort((a, b) => {
      const aTime = a.completedAt ? new Date(a.completedAt) : new Date(0);
      const bTime = b.completedAt ? new Date(b.completedAt) : new Date(0);
      return sortOrder === "asc"
        ? aTime.getTime() - bTime.getTime()
        : bTime.getTime() - aTime.getTime();
    });
    return items;
  }, [bookings, sortOrder]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
          <p className="text-sm text-gray-500">
            Completed scans for the selected date.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
          <Button variant="secondary" onClick={loadHistory}>
            Refresh
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-10">
          <Loader />
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-500">
          No scans found for this date.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sortedBookings.map((booking) => {
              const completedAt = booking.completedAt
                ? new Date(booking.completedAt)
                : null;
              const slotTime =
                booking.slot?.startTime && booking.slot?.endTime
                  ? `${booking.slot.startTime} - ${booking.slot.endTime}`
                  : (booking.slot as any)?.time || "N/A";
              const studentName =
                (booking as any).user?.fullName ||
                (booking as any).guestName ||
                "Student";

              return (
                <div
                  key={booking.id}
                  className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.tokenNumber}
                    </p>
                    <p className="text-xs text-gray-500">{studentName}</p>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" />
                    <span>{slotTime}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedAt ? (
                      <span>
                        {formatDate(completedAt)} at {formatTime(completedAt)}
                      </span>
                    ) : (
                      <span>Completed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffScanHistory;


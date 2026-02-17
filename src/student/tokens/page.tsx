import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Filter, ArrowDownUp, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import {
  getMyBookings,
  type Booking,
  type Slot,
} from "../../services/booking.service";
import {
  getPublicSettings,
  type PublicSettings,
} from "../../services/system.service";

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

const parseTimeToDate = (baseDate: Date, timeText?: string) => {
  if (!timeText) return null;
  let text = String(timeText).trim();
  if (text.includes("-")) {
    text = text.split("-")[0].trim();
  }

  const match = text.match(/^(\d{1,2}):(\d{2})(\s*[AP]M)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.trim().toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const getSlotTimeValue = (slot?: Slot) => {
  if (!slot) return "N/A";
  if (slot.startTime && slot.endTime) {
    return `${slot.startTime} - ${slot.endTime}`;
  }
  return (slot as any).time || slot.startTime || "N/A";
};

const StudentTokens: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicSettings, setPublicSettings] = useState<PublicSettings | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const loadTokens = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPublicSettings = useCallback(async () => {
    try {
      const settings = await getPublicSettings();
      setPublicSettings(settings);
    } catch (error) {
      console.error("Failed to load public settings:", error);
    }
  }, []);

  useEffect(() => {
    loadTokens();
    loadPublicSettings();
  }, [loadTokens, loadPublicSettings]);

  const getSlotStartTime = (slot?: Slot) => {
    if (!slot?.date) return null;
    const baseDate = new Date(slot.date);
    const startText = slot.startTime || (slot as any).time || "";
    return parseTimeToDate(baseDate, startText);
  };

  const getSlotEndTime = (slot?: Slot) => {
    if (!slot?.date) return null;
    const baseDate = new Date(slot.date);

    if (slot.endTime) {
      const end = parseTimeToDate(baseDate, slot.endTime);
      if (end) return end;
    }

    const start = getSlotStartTime(slot);
    if (!start) return null;

    const duration = publicSettings?.slotDuration || 15;
    return new Date(start.getTime() + duration * 60000);
  };

  const getTokenExpiryTime = (booking?: Booking | null) => {
    if (!booking?.slot) return null;
    const endTime = getSlotEndTime(booking.slot);
    if (!endTime) return null;

    const expiryMins = publicSettings?.tokenExpiryMins || 60;
    return new Date(endTime.getTime() + expiryMins * 60000);
  };

  const isExpired = (booking: Booking) => {
    const expiryTime = getTokenExpiryTime(booking);
    if (!expiryTime) return false;
    return new Date() > expiryTime;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "expired") return isExpired(booking);
      if (statusFilter === "cancelled") {
        return booking.status === "cancelled" || booking.status === "no_show";
      }
      if (statusFilter === "active") {
        return (
          !isExpired(booking) &&
          booking.status !== "cancelled" &&
          booking.status !== "no_show"
        );
      }
      return true;
    });
  }, [bookings, statusFilter, publicSettings]);

  const sortedBookings = useMemo(() => {
    const sorted = [...filteredBookings];
    sorted.sort((a, b) => {
      const aTime = getSlotStartTime(a.slot) || new Date(a.createdAt);
      const bTime = getSlotStartTime(b.slot) || new Date(b.createdAt);
      return sortOrder === "asc"
        ? aTime.getTime() - bTime.getTime()
        : bTime.getTime() - aTime.getTime();
    });
    return sorted;
  }, [filteredBookings, sortOrder, publicSettings]);

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tokens</h1>
          <p className="text-sm text-gray-500">
            View all your tokens, including expired ones.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All tokens</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownUp size={16} className="text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-10">
          <Loader />
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-500">
          No tokens found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedBookings.map((booking) => {
            const expiryTime = getTokenExpiryTime(booking);
            const expired = isExpired(booking);
            const slotTime = getSlotTimeValue(booking.slot);
            const startTime = getSlotStartTime(booking.slot);
            const statusLabel = expired ? "expired" : booking.status;

            return (
              <div
                key={booking.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Token Number
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {booking.tokenNumber}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                      expired
                        ? "bg-red-100 text-red-700"
                        : booking.status === "cancelled" ||
                            booking.status === "no_show"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <span>{slotTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500" />
                    <span>{formatDate(startTime)}</span>
                  </div>
                  {expired && expiryTime && (
                    <div className="text-xs font-semibold text-red-600">
                      Expired at {formatTime(expiryTime)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    Total: ₹{booking.totalAmount}
                  </div>
                  <Link
                    to="/user/token"
                    state={{
                      bookingId: booking.id,
                      tokenNumber: booking.tokenNumber,
                      slotTime,
                      slotDate: booking.slot?.date,
                      totalAmount: booking.totalAmount,
                      items: booking.items,
                      status: booking.status,
                    }}
                  >
                    <Button size="sm" variant="secondary">
                      <div className="flex items-center gap-2">
                        <QrCode size={14} />
                        View Token
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTokens;

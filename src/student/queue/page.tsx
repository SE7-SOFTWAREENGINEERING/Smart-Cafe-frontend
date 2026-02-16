import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  RefreshCw,
  MapPin,
  Coffee,
  Loader2,
} from "lucide-react";
import * as bookingService from "../../services/booking.service";
import type { Booking, Slot, QueueInfo } from "../../services/booking.service";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";

const StudentQueue: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  useEffect(() => {
    loadQueueData();

    // Poll every 15 seconds for live updates
    const interval = setInterval(() => {
      loadQueueData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Track time since last load
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated((prev) => {
        if (prev === "Just now") return "15s ago";
        return prev;
      });
    }, 15000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const loadQueueData = async () => {
    try {
      setLoading(true);
      const bookings = await bookingService.getMyBookings();
      const today = new Date().toISOString().split("T")[0];
      const active = bookings.find(
        (b) =>
          (b.status === "confirmed" || b.status === "pending") &&
          (b.slot?.date?.startsWith(today) || b.createdAt?.startsWith(today)),
      );
      setActiveBooking(active || null);

      if (active?.slot) {
        // Fetch full slot details to get booked count
        const slotId =
          typeof active.slot === "object"
            ? (active.slot as Slot).id || (active.slot as any)._id
            : active.slot;
        if (slotId) {
          try {
            const slotData = await bookingService.getSlotById(slotId);
            setSlot(slotData);
          } catch {
            // Slot info already in booking
            if (typeof active.slot === "object") setSlot(active.slot as Slot);
          }
        }

        // Try to get canteen info if available
        const canteenId =
          (active as any).canteen || (active.slot as any)?.canteen;
        if (canteenId && typeof canteenId === "string") {
          try {
            const canteenData = await canteenService.getCanteenById(canteenId);
            setCanteen(canteenData);
          } catch {
            // Not critical
          }
        }

        // Fetch real-time queue info from backend
        if (slotId) {
          try {
            const qi = await bookingService.getQueueInfo(slotId as string);
            setQueueInfo(qi);
          } catch {
            // Fallback handled in render
          }
        }
      }

      setLastUpdated("Just now");
    } catch (error) {
      console.error("Failed to load queue data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use real-time backend queue data when available, fallback to heuristic
  const totalInSlot = queueInfo?.totalInQueue ?? slot?.booked ?? 0;
  const position = queueInfo?.position ?? (activeBooking ? Math.max(1, Math.ceil(totalInSlot * 0.3)) : 0);
  const peopleAhead = queueInfo?.peopleAhead ?? Math.max(0, position - 1);
  const waitTime = queueInfo?.estimatedWaitMins ?? Math.ceil(peopleAhead * 2.5);

  if (loading && !activeBooking) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-3 text-gray-400" size={32} />
        <p className="text-gray-500">Loading queue info...</p>
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          <Coffee size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            No Active Booking
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Book a slot first to see your queue position.
          </p>
          <button
            onClick={() => navigate("/user/booking")}
            className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors"
          >
            Book a Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
      </div>

      {/* Main KPI Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500 animate-pulse"></div>

        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
          Your Position
        </p>
        <div className="flex items-baseline justify-center gap-1 mb-6">
          <span className="text-6xl font-black text-gray-900">{position}</span>
          <span className="text-xl text-gray-400 font-medium">
            / {totalInSlot || "—"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div>
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
              <Users size={16} />
              <span className="text-xs font-bold">AHEAD</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{peopleAhead}</p>
          </div>
          <div className="border-l border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
              <Clock size={16} />
              <span className="text-xs font-bold">WAIT</span>
            </div>
            <p className="text-xl font-bold text-brand">
              ~{Math.ceil(waitTime)}m
            </p>
          </div>
        </div>
      </div>

      {/* Status & Location */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {canteen?.name || "Canteen"}
              </h3>
              <p className="text-xs text-gray-500">
                {slot
                  ? `${slot.startTime} - ${slot.endTime}`
                  : `Token: ${activeBooking.tokenNumber}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="bg-brand-light border border-brand/20 p-4 rounded-xl flex gap-3">
          <Coffee size={20} className="text-brand shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand font-bold mb-1">
              While you wait...
            </p>
            <p className="text-xs text-brand leading-relaxed">
              Check out the new dessert menu! You can add items to your existing
              order until 5 mins before pickup.
            </p>
          </div>
        </div>
      </div>

      {/* Live Indicator Footer & Debug */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Updated {lastUpdated}</span>
        </div>

      </div>
    </div>
  );
};

export default StudentQueue;

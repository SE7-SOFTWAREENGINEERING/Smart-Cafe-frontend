import React, { useState, useEffect } from "react";
import { Check, FastForward, MoreVertical, Loader2 } from "lucide-react";
import * as bookingService from "../../../services/booking.service";
import type { Booking } from "../../../services/booking.service";
import toast from "react-hot-toast";

const QueueList: React.FC = () => {
  const [queue, setQueue] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const bookings = await bookingService.getAllBookings({
        status: "confirmed",
      });
      // Sort by creation time (FIFO)
      const sorted = (
        Array.isArray(bookings) ? bookings : (bookings as any).bookings || []
      ).sort(
        (a: Booking, b: Booking) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setQueue(sorted);
    } catch (error) {
      console.error("Failed to load queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServe = async (booking: Booking) => {
    try {
      await bookingService.completeBooking(booking.id);
      toast.success(`Token ${booking.tokenNumber} served!`);
      loadQueue();
    } catch (error) {
      console.error("Failed to mark as served:", error);
      toast.error("Failed to serve token");
    }
  };

  const handleSkip = async (booking: Booking) => {
    try {
      await bookingService.markNoShow(booking.id);
      toast.success(`Token ${booking.tokenNumber} skipped (no show)`);
      loadQueue();
    } catch (error) {
      console.error("Failed to skip:", error);
      toast.error("Failed to skip token");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
          Live Queue (FIFO)
        </h3>
        <span className="text-xs bg-brand-light text-brand px-2 py-1 rounded font-medium">
          {queue.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={16} /> Loading queue...
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No bookings in queue
          </div>
        ) : (
          queue.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                idx === 0
                  ? "bg-brand-light border-brand/20 shadow-sm ring-1 ring-brand/10"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0
                      ? "bg-brand text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${idx === 0 ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {item.tokenNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item as any).user?.name || item.guestName || "Student"} •{" "}
                    {item.items?.length || 0} items
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                {idx === 0 ? (
                  <>
                    <button
                      onClick={() => handleServe(item)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Mark Served"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleSkip(item)}
                      className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:text-amber-600 hover:border-amber-200 transition"
                      title="Skip (No Show)"
                    >
                      <FastForward size={16} />
                    </button>
                  </>
                ) : (
                  <button className="p-2 text-gray-300 hover:text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueList;

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  Plus,
  Clock,
  AlertTriangle,
  Loader2,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getSlots,
  createSlot,
  cancelSlotById,
  type Slot,
} from "../../../services/booking.service";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 15_000;

interface Props {
  canteenId?: string;
}

const SlotManagement: React.FC<Props> = ({ canteenId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState<{ time: string; capacity: number | string }>({ time: "", capacity: "" });
  const [creating, setCreating] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dateLabel = `Today, ${today.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;

  const loadSlots = useCallback(async () => {
    try {
      const data = await getSlots({ date: dateStr, canteenId });
      const list = Array.isArray(data) ? data : (data as any).slots || [];
      setSlots(list);
      setError(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load slots";
      // Only set error on initial load, not on poll failures
      if (slots.length === 0) {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [dateStr, canteenId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Auto-refresh polling so admin-side changes sync here
  useEffect(() => {
    pollRef.current = setInterval(() => {
      loadSlots();
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadSlots]);

  const getSlotStatus = (slot: Slot) => {
    if (slot.status?.toLowerCase() === "cancelled") return "Cancelled";
    if ((slot.booked || 0) >= (slot.capacity || 1)) return "Full";
    return "Available";
  };

  const formatSlotTime = (slot: Slot): string => {
    if (slot.startTime && slot.endTime) {
      return `${slot.startTime} - ${slot.endTime}`;
    }
    if (slot.startTime) return slot.startTime;
    const rawTime = (slot as any).time;
    if (rawTime) return rawTime;
    return "—";
  };

  const handleAddSlot = async () => {
    if (!newSlot.time) return;
    try {
      setCreating(true);
      await createSlot({
        date: dateStr,
        time: newSlot.time,
        capacity: Number(newSlot.capacity) || 0,
        canteenId,
      });
      toast.success("Slot created");
      setShowAddForm(false);
      setNewSlot({ time: "", capacity: "" });
      await loadSlots();
    } catch {
      toast.error("Failed to create slot");
    } finally {
      setCreating(false);
    }
  };

  const handleEmergencyCancel = async (slotId: string) => {
    if (!confirm("Cancel this slot? All bookings will be cancelled.")) return;
    try {
      await cancelSlotById(slotId);
      toast.success("Slot cancelled");
      await loadSlots();
    } catch {
      toast.error("Failed to cancel slot");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[250px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center min-h-[250px] gap-3">
        <AlertCircle className="text-red-400" size={28} />
        <p className="text-sm text-gray-600 text-center">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            loadSlots();
          }}
          className="text-sm text-brand hover:text-brand-hover font-medium flex items-center gap-1"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Slot Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-brand hover:text-brand-hover text-sm font-medium flex items-center gap-1"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}{" "}
          {showAddForm ? "Cancel" : "Add Slot"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 space-y-2">
          <input
            type="time"
            value={newSlot.time}
            onChange={(e) =>
              setNewSlot((s) => ({ ...s, time: e.target.value }))
            }
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5"
          />
          <input
            type="number"
            value={newSlot.capacity}
            onChange={(e) =>
              setNewSlot((s) => ({ ...s, capacity: e.target.value === "" ? "" : +e.target.value }))
            }
            placeholder="Capacity"
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5"
          />
          <button
            onClick={handleAddSlot}
            disabled={creating}
            className="w-full bg-brand text-white text-xs py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Slot"}
          </button>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm font-medium">{dateLabel}</span>
        </div>
      </div>

      <div className="space-y-3">
        {slots.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">
            No slots for today
          </p>
        ) : (
          slots.map((slot) => {
            const status = getSlotStatus(slot);
            const slotId = slot.id || (slot as any)._id;
            const timeLabel = formatSlotTime(slot);
            return (
              <div
                key={slotId}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition bg-white"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${status === "Full" ? "bg-red-50 text-red-600" : status === "Cancelled" ? "bg-gray-100 text-gray-400" : "bg-green-50 text-green-600"}`}
                  >
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {timeLabel}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${status === "Full" ? "bg-red-500" : status === "Cancelled" ? "bg-gray-300" : "bg-green-500"}`}
                          style={{
                            width: `${Math.min(((slot.booked || 0) / (slot.capacity || 1)) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {slot.booked || 0}/{slot.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {status !== "Cancelled" && (
                    <button
                      onClick={() => handleEmergencyCancel(slotId)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Cancel Slot"
                    >
                      <AlertTriangle size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SlotManagement;

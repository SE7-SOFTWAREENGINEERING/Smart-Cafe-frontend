import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  Sliders,
  AlertTriangle,
  Ban,
  Eye,
  AlertCircle,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";
import Button from "../../components/common/Button";
import { cn } from "../../utils/cn";
import {
  getSlots,
  createSlot as apiCreateSlot,
  updateSlotCapacity,
  getAllBookings,
  deleteSlot,
} from "../../services/booking.service";
import type { Slot, Booking } from "../../services/booking.service";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";
import toast from "react-hot-toast";

const SLOT_CREATION_BUFFER_MINUTES = 10;
const POLL_INTERVAL_MS = 15_000;

const getLocalDateString = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const AdminBookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotBookings, setSlotBookings] = useState<Booking[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create Slot Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSlot, setNewSlot] = useState({
    time: "",
    capacity: 200,
    mealType: "LUNCH" as "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS",
    canteenId: "",
  });

  const loadCanteens = useCallback(async () => {
    try {
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load canteens");
    }
  }, [selectedCanteenId]);

  // Silent fetch for polling (no loading spinner)
  const fetchSlotsSilent = useCallback(async () => {
    try {
      const data = await getSlots({
        date: selectedDate,
        canteenId: selectedCanteenId || undefined,
      });
      setSlots(data);
    } catch {
      /* silent */
    }
  }, [selectedDate, selectedCanteenId]);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSlots({
        date: selectedDate,
        canteenId: selectedCanteenId || undefined,
      });
      setSlots(data);
      // Refresh selected slot if it exists
      if (selectedSlot) {
        const updated = data.find(
          (s) => s.id === selectedSlot.id || (s as any)._id === selectedSlot.id,
        );
        setSelectedSlot(updated || null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedCanteenId]);

  useEffect(() => {
    loadCanteens();
  }, [loadCanteens]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Auto-refresh polling so manager-side changes sync here
  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchSlotsSilent();
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchSlotsSilent]);

  const handleCancelSlot = async (id: string) => {
    if (
      !window.confirm(
        "Emergency Delete: Are you sure you want to delete this slot? All existing bookings will be affected.",
      )
    )
      return;
    try {
      await deleteSlot(id);
      toast.success("Slot deleted successfully");
      setSelectedSlot(null);
      fetchSlots();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete slot");
    }
  };

  const handleCapacityOverride = async () => {
    if (!selectedSlot) return;
    const newCap = prompt(
      "Enter new capacity limit for this slot:",
      String(selectedSlot.capacity),
    );
    if (!newCap) return;
    const parsedCap = Number(newCap);
    if (!Number.isFinite(parsedCap) || !Number.isInteger(parsedCap)) {
      toast.error("Capacity must be a whole number");
      return;
    }
    if (parsedCap < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }
    if (selectedSlot.booked && parsedCap < selectedSlot.booked) {
      toast.error(
        `Capacity cannot be less than current bookings (${selectedSlot.booked})`,
      );
      return;
    }
    try {
      await updateSlotCapacity(
        selectedSlot.id || (selectedSlot as any)._id,
        parsedCap,
      );
      toast.success("Capacity updated");
      fetchSlots();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update capacity");
    }
  };

  const handleViewBookings = async () => {
    if (!selectedSlot) return;
    try {
      const data = await getAllBookings({ date: selectedDate });
      const filtered = data.bookings.filter((b: any) => {
        const slotId =
          typeof b.slot === "string" ? b.slot : b.slot?.id || b.slot?._id;
        return slotId === (selectedSlot.id || (selectedSlot as any)._id);
      });
      setSlotBookings(filtered);
      setShowBookings(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load bookings");
    }
  };

  const [operatingSchedule, setOperatingSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await import("../../services/system.service").then((m) =>
          m.getAllSettings(),
        );
        const scheduleSetting = settings.find(
          (s) => s.settingKey.toUpperCase() === "OPERATING_SCHEDULE",
        );
        if (scheduleSetting?.settingValue) {
          try {
            const parsed = JSON.parse(scheduleSetting.settingValue);
            if (Array.isArray(parsed)) setOperatingSchedule(parsed);
          } catch (e) {
            console.error("Failed to parse schedule", e);
          }
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    fetchSettings();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    // 0. Canteen Validation
    const targetCanteenId = newSlot.canteenId || selectedCanteenId;
    if (!targetCanteenId) {
      toast.error("Please select a canteen to create a slot for.");
      setCreating(false);
      return;
    }

    // 1. Minimum Time Validation
    if (newSlot.time && selectedDate === getLocalDateString()) {
      const now = new Date();
      const minTime = new Date(
        now.getTime() + SLOT_CREATION_BUFFER_MINUTES * 60000,
      );
      const minTimeText = minTime.toTimeString().slice(0, 5);

      if (newSlot.time < minTimeText) {
        toast.error(
          `Slot time must be at least ${SLOT_CREATION_BUFFER_MINUTES} minutes from now`,
        );
        setCreating(false);
        return;
      }
    }

    // 2. Operating Schedule Validation
    if (operatingSchedule.length > 0) {
      const dateObj = new Date(selectedDate);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[dateObj.getDay()];
      const dayConfig = operatingSchedule.find((d) => d.day === dayName);

      if (dayConfig) {
        if (!dayConfig.isOpen) {
          toast.error(`Cannot create slot: Canteen is closed on ${dayName}s.`);
          setCreating(false);
          return;
        }

        if (dayConfig.openTime && dayConfig.closeTime && newSlot.time) {
          const slotTime = newSlot.time;
          const openTime = dayConfig.openTime;
          const closeTime = dayConfig.closeTime;

          if (slotTime < openTime || slotTime >= closeTime) {
            toast.error(
              `Slot time ${slotTime} is outside operating hours (${openTime} - ${closeTime}).`,
            );
            setCreating(false);
            return;
          }
        }
      }
    }

    try {
      await apiCreateSlot({
        date: selectedDate,
        time: newSlot.time,
        capacity: newSlot.capacity,
        mealType: newSlot.mealType,
        canteenId: newSlot.canteenId || selectedCanteenId,
      });
      toast.success("Slot created successfully");
      setIsCreateModalOpen(false);
      setNewSlot({
        time: "",
        capacity: 200,
        mealType: "LUNCH",
        canteenId: selectedCanteenId,
      });
      fetchSlots();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create slot");
    } finally {
      setCreating(false);
    }
  };

  const getSlotStatus = (slot: Slot) => {
    if (slot.status === "CANCELLED") return "Cancelled";
    if (slot.booked >= slot.capacity) return "Full";
    if (slot.booked >= slot.capacity * 0.85) return "FastFilling";
    return "Open";
  };

  const getSlotDisplayTime = (slot: Slot) => {
    return slot.startTime || (slot as any).time || "—";
  };

  const minSlotTime =
    selectedDate === getLocalDateString()
      ? new Date(Date.now() + SLOT_CREATION_BUFFER_MINUTES * 60000)
          .toTimeString()
          .slice(0, 5)
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slot Operations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor occupancy, manage slots, and handle emergencies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCanteenId}
            onChange={(e) => {
              setSelectedCanteenId(e.target.value);
              setSelectedSlot(null);
              setShowBookings(false);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Canteens</option>
            {canteens.map((canteen) => {
              const id = canteen.id || canteen._id || "";
              return (
                <option key={id} value={id}>
                  {canteen.name}
                </option>
              );
            })}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Button variant="secondary" onClick={fetchSlots} disabled={loading}>
            <RefreshCw
              size={16}
              className={cn("mr-2", loading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setNewSlot((prev) => ({
                ...prev,
                canteenId: prev.canteenId || selectedCanteenId,
              }));
              setIsCreateModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Create Slot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Slot Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Live Slot Status — {selectedDate}
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <RefreshCw size={24} className="animate-spin mr-2" /> Loading
                slots...
              </div>
            ) : slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>No slots found for this date. Create one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const status = getSlotStatus(slot);
                  const slotId = slot.id || (slot as any)._id;
                  return (
                    <button
                      key={slotId}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowBookings(false);
                      }}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all relative overflow-hidden",
                        (selectedSlot?.id || (selectedSlot as any)?._id) ===
                          slotId
                          ? "ring-2 ring-blue-500 ring-offset-1"
                          : "",
                        status === "Cancelled"
                          ? "bg-gray-100 border-gray-200 text-gray-400"
                          : status === "Full"
                            ? "bg-red-50 border-red-100 text-red-700"
                            : status === "FastFilling"
                              ? "bg-amber-50 border-amber-100 text-amber-700"
                              : "bg-green-50 border-green-100 text-green-700",
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm">
                          {getSlotDisplayTime(slot)}
                        </span>
                        {status === "Cancelled" && <Ban size={14} />}
                        {status === "Full" && <AlertCircle size={14} />}
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-lg">
                          {slot.booked || 0}
                        </span>
                        <span className="opacity-70">
                          {" "}
                          / {slot.capacity > 0 ? slot.capacity : "-"}
                        </span>
                      </div>
                      {slot.mealType && (
                        <div className="text-[10px] mt-1 opacity-60 uppercase font-medium">
                          {slot.mealType}
                        </div>
                      )}
                      {status !== "Cancelled" && slot.capacity > 0 && (
                        <div className="w-full h-1 bg-black/5 mt-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              status === "Full"
                                ? "bg-red-500"
                                : status === "FastFilling"
                                  ? "bg-amber-500"
                                  : "bg-green-500",
                            )}
                            style={{
                              width: `${Math.min(((slot.booked || 0) / slot.capacity) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            {selectedSlot ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {getSlotDisplayTime(selectedSlot)} Slot
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-semibold uppercase mt-1 inline-block",
                      getSlotStatus(selectedSlot) === "Cancelled"
                        ? "bg-gray-100 text-gray-600"
                        : getSlotStatus(selectedSlot) === "Full"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600",
                    )}
                  >
                    {getSlotStatus(selectedSlot)}
                  </span>
                  {selectedSlot.mealType && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 uppercase">
                      {selectedSlot.mealType}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="secondary"
                    onClick={handleViewBookings}
                  >
                    <Eye size={16} className="mr-2" />
                    View Bookings ({selectedSlot.booked || 0})
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="secondary"
                    onClick={handleCapacityOverride}
                  >
                    <Sliders size={16} className="mr-2" />
                    Adjust Capacity ({selectedSlot.capacity})
                  </Button>
                </div>

                {/* Bookings list */}
                {showBookings && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      Bookings ({slotBookings.length})
                    </h4>
                    {slotBookings.length === 0 ? (
                      <p className="text-xs text-gray-400">
                        No bookings for this slot.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {slotBookings.map((b) => (
                          <div
                            key={b.id || (b as any)._id}
                            className="text-xs p-2 bg-gray-50 rounded flex justify-between items-center"
                          >
                            <div>
                              <span className="font-medium">
                                #{b.tokenNumber}
                              </span>
                              <span className="text-gray-400 ml-2">
                                {b.status}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              ₹{b.totalAmount}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Emergency Zone
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Deleting a slot will remove it from the schedule and notify
                    booked users.
                  </p>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent"
                    variant="danger"
                    disabled={getSlotStatus(selectedSlot) === "Cancelled"}
                    onClick={() =>
                      handleCancelSlot(
                        selectedSlot.id || (selectedSlot as any)._id,
                      )
                    }
                  >
                    Delete Slot
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>Select a slot from the grid to manage operations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Slot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Slot
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canteen
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSlot.canteenId || selectedCanteenId}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, canteenId: e.target.value })
                  }
                >
                  <option value="">Select canteen</option>
                  {canteens.map((canteen) => {
                    const id = canteen.id || canteen._id || "";
                    return (
                      <option key={id} value={id}>
                        {canteen.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Time
                </label>
                <input
                  required
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSlot.time}
                  min={minSlotTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, time: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSlot.mealType}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, mealType: e.target.value as any })
                  }
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACKS">Snacks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  max={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newSlot.capacity}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  disabled
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  value={selectedDate}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Slot will be created for the selected date.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  <Plus size={16} className="mr-2" />
                  {creating ? "Creating..." : "Create Slot"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;


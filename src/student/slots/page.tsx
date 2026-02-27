import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  ArrowLeft,
  Clock,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../utils/cn";
import {
  getTodaySlotsByCanteen,
  getTodaySlots,
  createBooking,
} from "../../services/booking.service";
import type { Slot } from "../../services/booking.service";
import { getPublicSettings } from "../../services/system.service";
import { useCart } from "../../store/cart.store";
import toast from "react-hot-toast";
import { getOperatingStatus } from "../../utils/serviceSchedule";

const StudentSlots: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCanteenId = searchParams.get("canteenId") || "";
  const { items: cartItems, getTotal, clearCart, getItemCount } = useCart();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [serviceBlockReason, setServiceBlockReason] = useState("");
  const [activeCanteenId, setActiveCanteenId] = useState(() => {
    return queryCanteenId || localStorage.getItem("selectedCanteenId") || "";
  });

  useEffect(() => {
    loadPublicSettings();
    // Redirect if cart is empty
    if (getItemCount() === 0) {
      toast.error("Your cart is empty. Add items first.");
      navigate("/user/booking");
      return;
    }
    fetchSlots();
  }, [activeCanteenId]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadPublicSettings();
    }, 30000);

    const handleFocus = () => {
      loadPublicSettings();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadPublicSettings = async () => {
    try {
      const settings = await getPublicSettings();
      if (!settings.masterBookingEnabled) {
        setServiceBlockReason("System under maintenance.");
        return;
      }

      if (!settings.onlineBookingEnabled) {
        setServiceBlockReason("Online booking is currently disabled.");
        return;
      }

      const status = getOperatingStatus(settings.operatingSchedule);
      setServiceBlockReason(status.isOpen ? "" : status.reason || "");
    } catch (err) {
      console.error("Failed to load public settings:", err);
      setServiceBlockReason("");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSlots();
    }, 30000);

    const handleFocus = () => {
      fetchSlots();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [activeCanteenId]);

  useEffect(() => {
    if (queryCanteenId) {
      localStorage.setItem("selectedCanteenId", queryCanteenId);
      setActiveCanteenId(queryCanteenId);
    }
  }, [queryCanteenId]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = activeCanteenId
        ? await getTodaySlotsByCanteen(activeCanteenId)
        : await getTodaySlots();
      setSlots(data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setError("Failed to load available slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slot: Slot) => {
    if (slot.status === "CANCELLED" || slot.status === "FULL") return "full";
    const ratio = slot.booked / slot.capacity;
    if (ratio >= 1) return "full";
    if (ratio >= 0.8) return "filling-fast";
    return "available";
  };

  const getSlotTime = (slot: Slot) => {
    // Backend Slot model has `time` field (string like "12:00 PM")
    // Frontend Slot type has startTime/endTime
    return (slot as any).time || slot.startTime || "N/A";
  };

  const getAvailable = (slot: Slot) => {
    return slot.capacity - slot.booked;
  };

  const handleSlotClick = (slot: Slot) => {
    if (serviceBlockReason) {
      return;
    }
    const status = getSlotStatus(slot);
    if (status === "full") return;
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    setError("");

    try {
      const bookingPayload = {
        slotId: selectedSlot.id,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const booking = await createBooking(bookingPayload);

      // Clear cart after successful booking
      clearCart();
      setIsModalOpen(false);

      // Navigate to token page with booking data
      navigate("/user/token", {
        state: {
          bookingId: booking.id,
          tokenNumber: booking.tokenNumber,
          slotTime: getSlotTime(selectedSlot),
          slotDate: (booking as any).slot?.date || selectedSlot.date,
          totalAmount: booking.totalAmount,
          items: booking.items,
          status: booking.status,
        },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to create booking. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = getTotal();

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Select Time Slot</h1>
          <p className="text-sm text-gray-500">
            Choose a pickup time to skip the queue
          </p>
        </div>
      </header>

      {/* Cart Summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-blue-800 font-medium">
            {getItemCount()} item{getItemCount() > 1 ? "s" : ""} in cart
          </p>
          <p className="text-lg font-bold text-blue-900">₹{totalPrice}</p>
        </div>
        <button
          onClick={() => navigate("/user/cart")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit Cart
        </button>
      </div>

      {serviceBlockReason && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
          {serviceBlockReason}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs bg-white p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-gray-600">Filling Fast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <span className="text-gray-600">Full</span>
        </div>
      </div>

      {/* Slot Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-3 text-gray-400 text-sm">Loading slots...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Clock size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-700">No Slots Available</h3>
          <p className="text-sm text-gray-500 mt-1">
            No pickup slots have been set up for today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const status = getSlotStatus(slot);
            const isFull = status === "full";
            const isFilling = status === "filling-fast";
            const isSelected = selectedSlot?.id === slot.id;
            const available = getAvailable(slot);
            const time = getSlotTime(slot);

            return (
              <button
                key={slot.id}
                disabled={isFull || !!serviceBlockReason}
                onClick={() => handleSlotClick(slot)}
                className={cn(
                  "relative p-4 rounded-xl border text-left transition-all overflow-hidden",
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
                    : isFull
                      ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                      : serviceBlockReason
                        ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm",
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={cn(
                      "font-bold text-lg",
                      isFull ? "text-gray-400" : "text-gray-900",
                    )}
                  >
                    {time}
                  </span>
                  {isSelected && (
                    <CheckCircle size={18} className="text-brand" />
                  )}
                  {isFilling && !isSelected && (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>

                <p
                  className={cn(
                    "text-xs font-medium mt-1",
                    isFull
                      ? "text-red-500"
                      : isFilling
                        ? "text-amber-600"
                        : "text-green-600",
                  )}
                >
                  {isFull
                    ? "Booked Out"
                    : isFilling
                      ? "Filling Fast"
                      : `${available} spots left`}
                </p>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isFull
                        ? "bg-red-300"
                        : isFilling
                          ? "bg-amber-400"
                          : "bg-green-500",
                    )}
                    style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Tokens are valid for 15 mins only. Late
          arrivals may lose their priority.
        </p>
      </div>

      {/* Confirmation Modal */}
      {selectedSlot && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setError("");
          }}
          title="Confirm Order"
          footer={
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                isLoading={isBooking}
                disabled={!!serviceBlockReason}
              >
                Confirm & Book
              </Button>
            </div>
          }
        >
          {serviceBlockReason && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
              {serviceBlockReason}
            </div>
          )}
          <div className="space-y-4 py-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <p className="text-gray-500">Pickup slot at</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {getSlotTime(selectedSlot)}
              </h3>
            </div>

            {/* Order Summary in Modal */}
            <div className="border-t pt-4 space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentSlots;


import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { UserPlus, Check, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import * as bookingService from "../../services/booking.service";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";
import { getPublicSettings } from "../../services/system.service";
import toast from "react-hot-toast";
import { getOperatingStatus } from "../../utils/serviceSchedule";

const StaffWalkin: React.FC = () => {
  const [personCount, setPersonCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [tokenGenerated, setTokenGenerated] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);


  
  // Slots & Selection
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // Real capacity data from canteen
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceBlockReason, setServiceBlockReason] = useState("");

  useEffect(() => {
    loadCanteens();
    loadPublicSettings();
  }, []);

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

  useEffect(() => {
    if (selectedCanteenId) {
      loadSlots();
    } else {
      setSlots([]);
    }
  }, [selectedCanteenId]);

  const loadSlots = async () => {
    try {
      const data = await bookingService.getTodaySlotsByCanteen(selectedCanteenId);
      setSlots(data);
    } catch (error) {
       console.error("Failed to load slots", error);
    }
  };

  const loadPublicSettings = async () => {
    try {
      const settings = await getPublicSettings();
      if (!settings.masterBookingEnabled) {
        setServiceBlockReason("System under maintenance.");
        return;
      }

      if (!settings.walkinEnabled) {
        setServiceBlockReason("Walk-in service is currently disabled.");
        return;
      }

      const status = getOperatingStatus(settings.operatingSchedule);
      setServiceBlockReason(status.isOpen ? "" : status.reason || "");
    } catch (error) {
      console.error("Failed to load public settings:", error);
      setServiceBlockReason("");
    }
  };

  const loadCanteens = async () => {
    try {
      setLoading(true);
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
      if (data.length > 0) {
        setSelectedCanteenId(data[0].id || data[0]._id || "");
      }
    } catch (error) {
      console.error("Failed to load canteens:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCanteen = canteens.find(
    (c) => (c.id || c._id) === selectedCanteenId,
  );
  const capacity = selectedCanteen
    ? {
        current: selectedCanteen.occupancy,
        max: selectedCanteen.capacity,
        available: selectedCanteen.capacity - selectedCanteen.occupancy,
      }
    : { current: 0, max: 0, available: 0 };
  const isEligible = capacity.available >= personCount;
  const isBlocked = !!serviceBlockReason;

  const handleGenerate = async () => {
    try {
      if (!selectedSlotId) {
        toast.error("Please select a time slot");
        return;
      }
      setGenerating(true);

      const result = await bookingService.createWalkinBooking({
        slotId: selectedSlotId,
        guestName: guestName || `Walk-in Guest (${personCount})`,
        items: [],
      });

      setTokenGenerated(result.tokenNumber);
      toast.success("Walk-in token generated!");
      setGuestName("");
    } catch (error: any) {
      console.error("Failed to generate walk-in token:", error);
      toast.error(error?.response?.data?.message || "Failed to generate token");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Issue Walk-in Token
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          For faculty, guests, or students without pre-booking.
        </p>
      </header>

      {serviceBlockReason && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
          {serviceBlockReason}
        </div>
      )}

      {/* Canteen Selection */}
      {loading ? (
        <div className="flex items-center justify-center py-4 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={16} /> Loading
          canteens...
        </div>
      ) : (
        canteens.length > 1 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Canteen
            </label>
            <select
              value={selectedCanteenId}
              onChange={(e) => setSelectedCanteenId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {canteens.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )
      )}

      {/* Capacity Status */}
      <div
        className={cn(
          "p-4 rounded-lg border flex items-center gap-4",
          isEligible && !isBlocked
            ? "bg-green-50 border-green-100 text-green-800"
            : "bg-red-50 border-red-100 text-red-800",
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            isEligible ? "bg-green-100" : "bg-red-100",
          )}
        >
          {isEligible && !isBlocked ? (
            <Check size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">
            {isEligible && !isBlocked
              ? "Walk-ins Allowed"
              : "Walk-ins Unavailable"}
          </h3>
          <p className="text-sm opacity-90">
            {capacity.available} seats available (Current Occupancy:{" "}
            {Math.round((capacity.current / capacity.max) * 100)}%)
          </p>
        </div>
      </div>

     {/* Slot Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h3 className="text-sm font-medium text-gray-700 mb-3">Select Slot</h3>
         {slots.length === 0 ? (
             <p className="text-sm text-gray-400">No slots available for today.</p>
         ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {slots.map(slot => {
                     // Parse slot time
                     const now = new Date();
                     const [hours, minutes] = slot.time.split(':').map(Number); // Assuming "HH:mm" format
                     const slotTime = new Date();
                     slotTime.setHours(hours, minutes, 0, 0);
                     
                     // Allow 15 min buffer? No, simple expiry for now as per request
                     const isExpired = now > slotTime;
                     const isSlotFull = slot.booked >= slot.capacity;
                     const isDisabled = isSlotFull || isExpired;

                     return (
                        <button
                            key={slot.id}
                            disabled={isDisabled}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={cn(
                                "p-3 rounded-lg border text-left transition-all",
                                selectedSlotId === slot.id 
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50",
                                isDisabled && "opacity-50 cursor-not-allowed bg-gray-50"
                            )}
                        >
                            <div className={cn("text-sm font-semibold", isExpired ? "text-red-500" : "text-gray-900")}>
                                {slot.time}
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className={cn("text-xs", isExpired ? "text-red-400" : "text-gray-500")}>
                                    {slot.mealType}
                                </span>
                                <span className={cn(
                                    "text-[10px] font-medium px-1.5 py-0.5 rounded", 
                                    isExpired ? "bg-red-100 text-red-700" :
                                    isSlotFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                )}>
                                    {isExpired ? "EXPIRED" : isSlotFull ? "FULL" : `${slot.capacity - slot.booked} left`}
                                </span>
                            </div>
                        </button>
                     );
                 })}
             </div>
         )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {tokenGenerated ? (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Token Generated!
            </h3>
            <div className="my-4 text-4xl font-mono font-bold text-blue-600 tracking-wider p-4 bg-gray-50 rounded-lg inline-block border border-gray-200">
              {tokenGenerated}
            </div>
            <p className="text-gray-500">
              Please issue this token number to the guest.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => setTokenGenerated(null)}
            >
              Issue Another
            </Button>
          </div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guest Name (optional)
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of People
            </label>
            <div className="flex gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setPersonCount(n)}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center font-bold transition-all",
                    personCount === n
                      ? "border-blue-600 bg-blue-600 text-white shadow-md scale-105"
                      : "border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <Button
              className="w-full h-12 text-lg"
              disabled={!isEligible || isBlocked || generating}
              isLoading={generating}
              onClick={handleGenerate}
            >
              <UserPlus className="mr-2" />
              {isEligible && !isBlocked
                ? `Generate Token for ${personCount} ${personCount > 1 ? "People" : "Person"}`
                : "Not Enough Capacity"}
            </Button>

            {!isEligible && !isBlocked && (
              <p className="text-center text-red-500 text-sm mt-3 font-medium">
                Cannot issue token: Not enough seats.
              </p>
            )}
            {isBlocked && (
              <p className="text-center text-amber-700 text-sm mt-3 font-medium">
                Walk-in token generation is currently unavailable.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffWalkin;

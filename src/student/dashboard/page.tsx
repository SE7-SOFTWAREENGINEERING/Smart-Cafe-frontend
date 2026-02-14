import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ChevronRight,
  Coffee,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../store/auth.store";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";
import * as notificationService from "../../services/notification.service";
import type { Notification } from "../../services/notification.service";
import * as bookingService from "../../services/booking.service";
import type { Booking, Slot } from "../../services/booking.service";

const getTimeString = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};



const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Get user name from logged-in user
  const studentName = user?.name || user?.fullName || "Student";

  // Active booking state (from API)
  const [, setActiveBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(true);

  const [todaySlots, setTodaySlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Canteens state
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [canteensLoading, setCanteensLoading] = useState(true);

  useEffect(() => {
    loadCanteens();
    loadNotifications();
    loadActiveBooking();
    loadTodaySlots();

    // Poll for notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    // Keep today's slots fresh in case of admin deletions
    const slotsInterval = setInterval(() => {
      loadTodaySlots();
    }, 30000);

    const handleFocus = () => {
      loadTodaySlots();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      clearInterval(slotsInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);



  const loadActiveBooking = async () => {
    try {
      setBookingLoading(true);
      const bookings = await bookingService.getMyBookings();
      // Find the most recent confirmed/pending booking for today
      const today = new Date().toISOString().split("T")[0];
      const active = bookings.find(
        (b) =>
          (b.status === "confirmed" || b.status === "pending") &&
          (b.slot?.date?.startsWith(today) || b.createdAt?.startsWith(today)),
      );
      setActiveBooking(active || null);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const loadTodaySlots = async () => {
    try {
      setSlotsLoading(true);
      const slots = await bookingService.getTodaySlots();
      setTodaySlots(slots);
    } catch (error) {
      console.error("Failed to load slots:", error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      // Fetch latest 5 notifications
      const data = await notificationService.getNotifications({ limit: 5 });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const loadCanteens = async () => {
    try {
      setCanteensLoading(true);
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
    } catch (error) {
      console.error("Failed to load canteens:", error);
    } finally {
      setCanteensLoading(false);
    }
  };

  // Get color styles based on canteen index or imageColor
  const getCanteenColors = (index: number) => {
    const colors = [
      {
        bg: "bg-orange-100",
        text: "text-orange-600",
        accent: "bg-orange-50",
        hover: "group-hover:bg-orange-100",
        hoverChevron: "group-hover:text-orange-500",
      },
      {
        bg: "bg-green-100",
        text: "text-green-600",
        accent: "bg-green-50",
        hover: "group-hover:bg-green-100",
        hoverChevron: "group-hover:text-green-500",
      },
      {
        bg: "bg-blue-100",
        text: "text-blue-600",
        accent: "bg-blue-50",
        hover: "group-hover:bg-blue-100",
        hoverChevron: "group-hover:text-blue-500",
      },
      {
        bg: "bg-purple-100",
        text: "text-purple-600",
        accent: "bg-purple-50",
        hover: "group-hover:bg-purple-100",
        hoverChevron: "group-hover:text-purple-500",
      },
      {
        bg: "bg-red-100",
        text: "text-red-600",
        accent: "bg-red-50",
        hover: "group-hover:bg-red-100",
        hoverChevron: "group-hover:text-red-500",
      },
    ];
    return colors[index % colors.length];
  };

  // Get crowd status color
  const getCrowdColor = (status: string, crowd: string) => {
    if (status === "Closed") return "text-gray-500";
    if (status === "Closing Soon") return "text-red-500";
    if (crowd === "High") return "text-orange-600";
    if (crowd === "Medium") return "text-yellow-600";
    return "text-green-600";
  };









  return (
    <div className="space-y-6 pb-20">
      {" "}
      {/* pb-20 for bottom nav if exists */}
      {/* 1. Header & Welcome */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi, {studentName} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Clock size={16} />
            <span className="text-sm font-medium">{getTimeString()}</span>
          </div>
        </div>

        {/* Top Right Icons (Wallet/Notifs) - Visual Only from screenshot */}
        <div className="flex gap-3">
          <Link
            to="/user/cart"
            className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ShoppingBag size={20} className="text-gray-700" />
          </Link>
        </div>
      </header>
      {/* 2. Today's Booking Status */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">Your Token</h2>
        </div>

        {bookingLoading ? (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Loading booking...</span>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-600 mb-4">
              View all your tokens, including expired ones.
            </p>
            <Link to="/user/tokens" className="block">
              <Button className="w-full">Open My Tokens</Button>
            </Link>
          </div>
        )}
        {/* 2.5 Today's Slots */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">Today's Slots</h2>
            <Link
              to="/user/slots"
              className="text-sm text-brand font-semibold hover:underline"
            >
              View All
            </Link>
          </div>
          {slotsLoading ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading slots...</span>
            </div>
          ) : todaySlots.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-500">
              No slots available today.
            </div>
          ) : (
            <div className="space-y-4">
              {canteens.map((canteen) => {
                const canteenId = canteen.id || canteen._id || "";
                const canteenSlots = todaySlots.filter(
                  (slot) =>
                    ((slot as any).canteenId || slot.canteenId || "default") ===
                    canteenId,
                );

                if (canteenSlots.length === 0) return null;

                return (
                  <div key={canteenId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {canteen.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {canteenSlots.length} slots
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {canteenSlots.slice(0, 4).map((slot) => {
                        const start =
                          slot.startTime || (slot as any).time || "";
                        const end = slot.endTime ? ` - ${slot.endTime}` : "";
                        return (
                          <div
                            key={slot.id || (slot as any)._id}
                            className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <div className="text-sm font-semibold text-gray-900">
                              {start}
                              {end}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {slot.mealType || "Meal"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {slot.booked || 0}/{slot.capacity} booked
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {(() => {
                const knownIds = new Set(
                  canteens.map((c) => c.id || c._id).filter(Boolean),
                );
                const extraSlots = todaySlots.filter((slot) => {
                  const id = (slot as any).canteenId || slot.canteenId;
                  return !id || !knownIds.has(id);
                });

                if (extraSlots.length === 0) return null;

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Other Slots
                      </h3>
                      <span className="text-xs text-gray-500">
                        {extraSlots.length} slots
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {extraSlots.slice(0, 4).map((slot) => {
                        const start =
                          slot.startTime || (slot as any).time || "";
                        const end = slot.endTime ? ` - ${slot.endTime}` : "";
                        return (
                          <div
                            key={slot.id || (slot as any)._id}
                            className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <div className="text-sm font-semibold text-gray-900">
                              {start}
                              {end}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {slot.mealType || "Meal"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {slot.booked || 0}/{slot.capacity} booked
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </section>
      </section>
      {/* 3. Canteen Selection - Now Dynamic */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Select Canteen</h2>
          <Link
            to="/user/queue"
            className="text-sm font-medium text-brand hover:text-brand-hover"
          >
            View Queues
          </Link>
        </div>

        <div className="space-y-3">
          {canteensLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading canteens...</span>
            </div>
          ) : canteens.length > 0 ? (
            canteens.map((canteen, index) => {
              const colors = getCanteenColors(index);
              const crowdColor = getCrowdColor(canteen.status, canteen.crowd);

              return (
                <Link
                  key={canteen.id || canteen._id}
                  to={`/user/booking?canteenId=${canteen.id || canteen._id}`}
                  className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 ${colors.accent} rounded-full -mr-8 -mt-8 ${colors.hover} transition-colors`}
                  ></div>
                  <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-lg`}
                      >
                        {canteen.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {canteen.name}
                        </h3>
                        <p
                          className={`text-xs font-medium mt-0.5 ${crowdColor}`}
                        >
                          {canteen.status} • {canteen.crowd} Crowd
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`text-gray-300 ${colors.hoverChevron} transition-colors`}
                    />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500">
              <Coffee size={32} className="mx-auto mb-2 opacity-50" />
              <p>No canteens available</p>
            </div>
          )}
        </div>
      </section>
      {/* 4. Notification Preview */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
          <Link
            to="/user/notifications"
            className="text-xs font-semibold text-brand hover:text-brand-hover"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {notificationsLoading ? (
            <div className="flex items-center justify-center py-4 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span className="text-sm">Loading updates...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex gap-3 ${notif.isUrgent ? "bg-red-50 border-red-100" : "bg-white border-gray-100 shadow-sm"}`}
              >
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full ${notif.isUrgent ? "bg-red-500" : "bg-brand"}`}
                ></div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${notif.isUrgent ? "text-red-900" : "text-gray-900"}`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300 self-center" />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-gray-100">
              <p>No new updates</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;

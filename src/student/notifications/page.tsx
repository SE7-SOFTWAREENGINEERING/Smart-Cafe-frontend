import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Bell,
  Megaphone,
  XCircle,
  ArrowLeft,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import * as notificationService from "../../services/notification.service";
import type { Notification } from "../../services/notification.service";
import toast from "react-hot-toast";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const getNotifType = (
  n: Notification,
): "success" | "warning" | "info" | "urgent" => {
  if (n.isUrgent) return "urgent";
  if (n.type === "alert") return "warning";
  if (n.type === "order") return "success";
  return "info";
};

const StudentNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useNotificationSocket();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({ limit: 50 });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };


  return (
    <div className="pb-24 space-y-6">
      {/* 1. Header with Push Toggle */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {isConnected ? (
            <div title="Connected">
              <Wifi size={18} className="text-green-600" />
            </div>
          ) : (
            <div title="Disconnected">
              <WifiOff size={18} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="bg-brand-light p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">
                Get updates about your order
              </p>
            </div>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${pushEnabled ? "bg-brand" : "bg-gray-300"
              }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                pushEnabled ? "left-7" : "left-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center -mt-2">
        <h2 className="font-bold text-gray-900">Recent Updates</h2>
        <button
          onClick={markAllRead}
          className="text-xs text-brand hover:text-brand-hover font-medium"
        >
          Mark all as read
        </button>
      </div>

      {/* 2. Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-gray-100">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const notifType = getNotifType(notif);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={cn(
                  "p-4 rounded-xl border flex gap-4 transition-all cursor-pointer",
                  !notif.isRead
                    ? "bg-white border-brand/20 shadow-sm"
                    : "bg-gray-50 border-gray-100 opacity-90",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    notifType === "success"
                      ? "bg-green-100 text-green-600"
                      : notifType === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : notifType === "urgent"
                          ? "bg-red-100 text-red-600"
                          : "bg-brand/10 text-brand",
                  )}
                >
                  {notifType === "success" && <CheckCircle size={20} />}
                  {notifType === "warning" && <AlertTriangle size={20} />}
                  {notifType === "urgent" && <XCircle size={20} />}
                  {notifType === "info" && <Info size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4
                      className={cn(
                        "font-bold text-sm truncate pr-2",
                        notifType === "urgent"
                          ? "text-red-700"
                          : !notif.isRead
                            ? "text-gray-900"
                            : "text-gray-700",
                      )}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <div className="w-2 h-2 bg-brand rounded-full mt-1 shrink-0"></div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Broadcast Mock */}
      <div className="mt-8 p-4 bg-gray-900 rounded-xl text-center text-gray-400 text-xs">
        <Megaphone className="mx-auto mb-2 opacity-50" size={20} />
        <p>Emergency broadcasts are sent directly by Admin.</p>
        <p className="text-[10px] mt-1">
          {isConnected ? '🟢 Real-time updates active' : '🔴 Reconnecting...'}
        </p>
      </div>
    </div>
  );
};

export default StudentNotifications;

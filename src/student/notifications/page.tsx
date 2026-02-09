import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, CheckCircle, Info, Bell,
  Megaphone, XCircle, ArrowLeft, Wifi, WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { getNotifications, markAllNotificationsRead, type Notification } from '../../services/notification.service';
import { useNotificationSocket, type NotificationData } from '../../hooks/useNotificationSocket';


interface UINotification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'urgent';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mapNotificationToUI = (notification: Notification): UINotification => {
  const getTitle = (type: string, message: string) => {
    if (message.includes('confirmed') || message.includes('Booking confirmed')) return 'Booking Confirmed';
    if (message.includes('cancelled')) return 'Booking Cancelled';
    if (message.includes('missed')) return 'Slot Expired';
    if (message.includes('Reminder')) return 'Slot Reminder';
    if (message.includes('coming up')) return 'Slot Reminder';

    switch (type) {
      case 'urgent': return 'Alert';
      case 'warning': return 'Queue Alert';
      case 'info': return 'Reminder';
      default: return 'Notification';
    }
  };

  const getTimeAgo = (sentAt: string) => {
    const now = new Date();
    const sent = new Date(sentAt);
    const diffMs = now.getTime() - sent.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return 'Yesterday';
  };

  return {
    id: notification.notificationId,
    type: notification.type as 'success' | 'warning' | 'info' | 'urgent',
    title: getTitle(notification.type, notification.message),
    message: notification.message,
    time: getTimeAgo(notification.sentAt),
    isRead: notification.isRead
  };
};

const StudentNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      const uiNotifications = data.map(mapNotificationToUI);
      setNotifications(uiNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle new real-time notifications
  const handleNewNotification = useCallback((notification: NotificationData) => {
    console.log('Handling new notification:', notification);

    const uiNotification = mapNotificationToUI({
      notificationId: notification.notificationId,
      type: notification.type as 'success' | 'warning' | 'info' | 'urgent',
      message: notification.message,
      sentAt: notification.sentAt,
      isRead: notification.isRead
    });

    setNotifications(prev => [uiNotification, ...prev]);

    // Show browser notification if enabled
    if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(uiNotification.title, {
        body: uiNotification.message,
        icon: '/favicon.ico'
      });
    }
  }, [pushEnabled]);

  // Initialize WebSocket connection
  const { isConnected, connectionError } = useNotificationSocket(handleNewNotification);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Request notification permission
  useEffect(() => {
    if (pushEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [pushEnabled]);

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
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
              <p className="text-xs text-gray-500">Get updates about your order</p>
            </div>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${pushEnabled ? "bg-brand" : "bg-gray-300"
              }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? "left-7" : "left-1"
              }`}></div>
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

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <p className="font-semibold">Connection Error</p>
          <p className="text-xs">{connectionError}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-2 text-sm text-brand hover:text-brand-hover font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 2. Notification List */}
      {!loading && !error && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">You'll see updates about your bookings here</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "p-4 rounded-xl border flex gap-4 transition-all",
                  !notif.isRead ? "bg-white border-brand/20 shadow-sm" : "bg-gray-50 border-gray-100 opacity-90"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  notif.type === 'success' ? "bg-green-100 text-green-600" :
                    notif.type === 'warning' ? "bg-amber-100 text-amber-700" :
                      notif.type === 'urgent' ? "bg-red-100 text-red-600" :
                        "bg-brand/10 text-brand"
                )}>
                  {notif.type === 'success' && <CheckCircle size={20} />}
                  {notif.type === 'warning' && <AlertTriangle size={20} />}
                  {notif.type === 'urgent' && <XCircle size={20} />}
                  {notif.type === 'info' && <Info size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "font-bold text-sm truncate pr-2",
                      notif.type === 'urgent' ? "text-red-700" :
                        !notif.isRead ? "text-gray-900" : "text-gray-700"
                    )}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <div className="w-2 h-2 bg-brand rounded-full mt-1 shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>
      )}

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

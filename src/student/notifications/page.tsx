import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Info, Bell,
  Megaphone, XCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'urgent';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'info',
    title: 'Slot Reminder',
    message: 'Hurry! Your booked slot at Sopanam starts in 10 minutes.',
    time: 'Just now',
    isRead: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Queue Alert',
    message: 'High crowd detected at Prasada Canteen. Expect delays of 15-20 mins.',
    time: '5 mins ago',
    isRead: false
  },
  {
    id: 3,
    type: 'urgent',
    title: 'Emergency Announcement',
    message: 'Water supply interruption in Samudra block. Canteen closing at 2 PM today.',
    time: '1 hour ago',
    isRead: true
  },
  {
    id: 4,
    type: 'success',
    title: 'Booking Confirmed',
    message: 'Your slot for Lunch at 12:30 PM is confirmed. Token: A-24',
    time: '2 hours ago',
    isRead: true
  },
  {
    id: 5,
    type: 'urgent',
    title: 'Slot Expired',
    message: 'You missed your slot at 11:00 AM. The token is no longer valid.',
    time: 'Yesterday',
    isRead: true
  }
];

const StudentNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
            className={`w-12 h-6 rounded-full transition-colors relative ${
              pushEnabled ? "bg-brand" : "bg-gray-300"
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              pushEnabled ? "left-7" : "left-1"
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

      {/* 2. Notification List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
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
                notif.type === 'warning' ? "bg-orange-100 text-orange-600" :
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
        ))}
      </div>

      {/* Emergency Broadcast Mock */}
      <div className="mt-8 p-4 bg-gray-900 rounded-xl text-center text-gray-400 text-xs">
        <Megaphone className="mx-auto mb-2 opacity-50" size={20} />
        <p>Emergency broadcasts are sent directly by Admin.</p>
      </div>

    </div>
  );
};

export default StudentNotifications;

import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Booking Confirmed',
    message: 'Your slot for Lunch at 12:30 PM is confirmed. Token: A-24',
    time: '10 mins ago',
    isRead: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Queue Alert',
    message: 'The queue for Counter 2 is moving slower than expected.',
    time: '2 hours ago',
    isRead: true
  },
  {
    id: 3,
    type: 'info',
    title: 'Menu Update',
    message: 'New vegan options are available in the salad bar today.',
    time: 'Yesterday',
    isRead: true
  }
];

const StudentNotifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id} 
              className={cn(
                "p-4 flex gap-4 transition-colors hover:bg-gray-50",
                !notif.isRead ? "bg-blue-50/50" : "bg-white"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notif.type === 'success' ? "bg-green-100 text-green-600" :
                notif.type === 'warning' ? "bg-orange-100 text-orange-600" :
                "bg-blue-100 text-blue-600"
              )}>
                {notif.type === 'success' && <CheckCircle size={20} />}
                {notif.type === 'warning' && <AlertTriangle size={20} />}
                {notif.type === 'info' && <Info size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={cn("font-medium text-sm", !notif.isRead ? "text-gray-900" : "text-gray-700")}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              
              {!notif.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;

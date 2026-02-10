import React from 'react';
import { useAuth } from '../../store/auth.store';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import { getUnreadCount, getMyNotifications, markAllAsRead } from '../../services/notification.service';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  // Fetch unread count on mount
  React.useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Optional: Poll every minute
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count", error);
    }
  };

  const handleToggleNotifications = async () => {
    if (!showNotifications) {
      // Opening header
      try {
        const data = await getMyNotifications(10, 0); // Get latest 10
        setNotifications(data.notifications || []);
        setShowNotifications(true);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    } else {
      setShowNotifications(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20 relative">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Smart Cafeteria</h1>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-brand hover:text-brand-hover font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n: any) => (
                        <div
                          key={n.notificationId}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div>
                              <p className={`text-sm ${!n.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {n.message}
                              </p>
                              <span className="text-xs text-gray-400 mt-1 block">
                                {new Date(n.sentAt).toLocaleDateString()} • {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <UserIcon size={18} className="text-gray-500" />
              <span>{user.name} ({user.role})</span>
            </div>
          </>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

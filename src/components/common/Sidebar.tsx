import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Leaf,
  Bell,
  QrCode,
  UserPlus,
  Megaphone,
  TrendingUp,
  BarChart,
  Settings,
  Database
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/booking', label: 'Book Slot', icon: Calendar },
          { to: '/student/queue', label: 'Queue Status', icon: Clock },
          { to: '/student/notifications', label: 'Notifications', icon: Bell },
          { to: '/student/sustainability', label: 'Sustainability', icon: Leaf },
        ];
      case 'staff':
        return [
          { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/staff/scan-token', label: 'Scan Token', icon: QrCode },
          { to: '/staff/walkin', label: 'Walk-in Token', icon: UserPlus },
          { to: '/staff/announcements', label: 'Announcements', icon: Megaphone },
        ];
      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/manager/forecasts', label: 'Forecasts', icon: TrendingUp },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/menu', label: 'Food Menu', icon: Leaf },
          { to: '/admin/bookings', label: 'Slot Operations', icon: Clock },
          { to: '/admin/roles', label: 'User Roles', icon: Users },
          { to: '/admin/timings', label: 'Timings & Holidays', icon: Calendar },
          { to: '/admin/capacity', label: 'Policies & Capacity', icon: Settings },
          { to: '/admin/accuracy', label: 'Forecast Accuracy', icon: BarChart },
          { to: '/admin/system', label: 'System Maintenance', icon: Database },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-slate-900 h-[calc(100vh-4rem)] flex-shrink-0 text-white overflow-y-auto">
      <div className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

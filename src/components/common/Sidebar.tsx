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
    // Normalize role to lowercase for case-insensitive matching
    const role = (user.role || '').toLowerCase();
    switch (role) {
      case 'user':
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/booking', label: 'Book Slot', icon: Calendar },
          { to: '/student/queue', label: 'Queue Status', icon: Clock },
          { to: '/student/notifications', label: 'Notifications', icon: Bell },
          { to: '/student/sustainability', label: 'Sustainability', icon: Leaf },
        ];
      case 'canteen_staff':
      case 'canteenstaff':
      case 'canteen staff':
        return [
          { to: '/canteen-staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/canteen-staff/scan-token', label: 'Scan Token', icon: QrCode },
          { to: '/canteen-staff/walkin', label: 'Walk-in Token', icon: UserPlus },
          { to: '/canteen-staff/announcements', label: 'Announcements', icon: Megaphone },
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
        console.warn('Unknown role:', user.role);
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-[#0f172a] h-full flex flex-col text-white flex-shrink-0 border-r border-slate-800">
      <div className="p-3 space-y-1 overflow-y-auto mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-black text-white shadow-md border border-white/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

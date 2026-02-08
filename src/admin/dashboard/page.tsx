import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, ShieldCheck, Activity,
  Settings, CalendarClock, Utensils,
  Database, Bell, AlertTriangle, TrendingUp
} from 'lucide-react';
import * as userService from '../../services/user.service';
import * as notificationService from '../../services/notification.service';
import { getDailyForecast, type MealForecast } from '../../services/forecast.service';

interface Stats {
  totalUsers: number;
  students: number;
  staff: number;
  onlineUsers: number;
}

interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'announcement' | 'alert' | 'system';
  isUrgent: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    students: 0,
    staff: 0,
    onlineUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [forecasts, setForecasts] = useState<MealForecast[]>([]);
  const [forecastDate, setForecastDate] = useState('');
  const [forecastLoading, setForecastLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadAlerts();
    loadForecast();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userService.getUserStats();
      
      // Calculate students (users) and staff from byRole data
      const students = data.byRole.find(r => r._id === 'user')?.count || 0;
      const staffRoles = ['canteen_staff', 'kitchen_staff', 'counter_staff', 'manager', 'admin'];
      const staff = data.byRole
        .filter(r => staffRoles.includes(r._id))
        .reduce((sum, r) => sum + r.count, 0);
      
      setStats({
        totalUsers: data.total,
        students,
        staff,
        onlineUsers: data.online,
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const notifications = await notificationService.getNotifications({ limit: 5, unreadOnly: false });
      setAlerts(notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isUrgent: n.isUrgent,
        createdAt: n.createdAt,
      })));
    } catch (error) {
      console.error('Failed to load alerts:', error);
      // Use fallback static alerts if API fails
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };

  const loadForecast = async () => {
    try {
      setForecastLoading(true);
      const data = await getDailyForecast();
      setForecasts(data.forecasts || []);
      if (data.date) {
        setForecastDate(
          new Date(data.date).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        );
      }
    } catch {
      setForecasts([]);
    } finally {
      setForecastLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getAlertStyle = (type: string, isUrgent: boolean) => {
    if (isUrgent || type === 'alert') return { bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-600' };
    if (type === 'announcement') return { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'text-orange-600' };
    if (type === 'system') return { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-600' };
    return { bg: 'bg-gray-50', border: 'border-gray-100', icon: 'text-gray-600' };
  };

  // Quick Access Modules
  const modules = [
    { title: 'Capacity & Policies', icon: Settings, href: '/admin/capacity', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Slot Management', icon: CalendarClock, href: '/admin/bookings', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Food Menu', icon: Utensils, href: '/admin/menu', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Service Timings', icon: CalendarClock, href: '/admin/timings', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'System Maintenance', icon: Database, href: '/admin/system', color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Notification Log', icon: Bell, href: '/admin/notifications', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System Governance & Health</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Users</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">
              {loading ? '...' : stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Students</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">
              {loading ? '...' : stats.students.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Staff</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">
              {loading ? '...' : stats.staff.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-purple-50 text-purple-600">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Online Now</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {loading ? '...' : stats.onlineUsers.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Forecast Summary */}
      {forecastLoading ? (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-gray-900">Today's Demand Forecast</h2>
          </div>
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="animate-pulse">Loading forecast...</div>
          </div>
        </section>
      ) : forecasts.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-gray-900">Today's Demand Forecast</h2>
            {forecastDate && (
              <span className="ml-auto text-xs text-gray-400">{forecastDate}</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {forecasts.map((f) => {
              const colors: Record<string, { bg: string; text: string; bar: string }> = {
                BREAKFAST: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500' },
                LUNCH: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500' },
                DINNER: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
                SNACKS: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
              };
              const c = colors[f.mealType] || { bg: 'bg-gray-50', text: 'text-gray-600', bar: 'bg-gray-500' };
              const maxPredicted = Math.max(...forecasts.map(x => x.predictedCount), 1);
              const pct = Math.round((f.predictedCount / maxPredicted) * 100);
              return (
                <div key={f.mealType} className={`p-4 rounded-lg border ${c.bg}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>{f.mealType}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{f.predictedCount}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  {f.actualCount != null && f.actualCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Actual: {f.actualCount}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700 font-medium">
            Total Predicted: {forecasts.reduce((s, f) => s + f.predictedCount, 0).toLocaleString()} meals
          </div>
        </section>
      )}

      {/* Quick Access Grid */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.href}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group"
            >
              <div className={`p-3 rounded-full ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                <mod.icon size={24} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{mod.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={20} className="text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900">Recent System Alerts</h2>
        </div>

        <div className="space-y-4">
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <div className="animate-pulse">Loading alerts...</div>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => {
              const style = getAlertStyle(alert.type, alert.isUrgent);
              return (
                <div key={alert.id} className={`flex items-start gap-4 p-4 ${style.bg} rounded-lg border ${style.border}`}>
                  <div className="mt-1">
                    {alert.isUrgent || alert.type === 'alert' ? (
                      <AlertTriangle size={16} className={style.icon} />
                    ) : alert.type === 'announcement' ? (
                      <Activity size={16} className={style.icon} />
                    ) : (
                      <Database size={16} className={style.icon} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">{formatTimeAgo(alert.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Bell size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No recent alerts</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

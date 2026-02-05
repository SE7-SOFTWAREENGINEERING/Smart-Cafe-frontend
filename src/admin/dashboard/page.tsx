import React from 'react';
import {
  Users, UserCheck, ShieldCheck, Activity,
  BarChart3, Settings, CalendarClock, Utensils,
  Database, Bell
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Quick Access Modules
  const modules = [
    { title: 'Models & Accuracy', icon: BarChart3, href: '/admin/accuracy', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Capacity & Policies', icon: Settings, href: '/admin/capacity', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Slot Management', icon: CalendarClock, href: '/admin/bookings', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Food Menu', icon: Utensils, href: '/admin/menu', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Service Timings', icon: CalendarClock, href: '/admin/timings', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'System Maintenance', icon: Database, href: '/admin/system', color: 'text-red-600', bg: 'bg-red-50' },
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
            <p className="text-2xl font-bold mt-1 text-gray-900">2,450</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Students</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">2,300</p>
          </div>
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Staff</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">45</p>
          </div>
          <div className="p-3 rounded-full bg-purple-50 text-purple-600">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">System Health</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">99.9%</p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((mod) => (
            <a
              key={mod.title}
              href={mod.href}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group"
            >
              <div className={`p-3 rounded-full ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                <mod.icon size={24} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{mod.title}</span>
            </a>
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
          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="mt-1">
              <Activity size={16} className="text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">High Booking Volume Detected</h4>
              <p className="text-xs text-gray-600 mt-1">Slot 12:30 PM is 95% full. Recommendations available.</p>
              <span className="text-[10px] text-gray-400 mt-2 block">10 mins ago</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="mt-1">
              <Database size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Automated Backup Completed</h4>
              <p className="text-xs text-gray-600 mt-1">Daily database snapshot saved successfully.</p>
              <span className="text-[10px] text-gray-400 mt-2 block">2 hours ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import {
  Users, UserCheck, ShieldCheck,
  BarChart3, Settings, CalendarClock, Utensils,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSystemStats, type DashboardStats } from '../../services/dashboard.service';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats', error);
      toast.error('Failed to load system stats');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  // Calculate Aggregates
  const totalUsers = stats?.usersByRole.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const studentCount = stats?.usersByRole.find(u => u._id === 'User')?.count || 0;
  // Staff includes Manager, CanteenStaff, KitchenStaff, CounterStaff
  const staffCount = stats?.usersByRole
    .filter(u => ['Manager', 'CanteenStaff', 'KitchenStaff', 'CounterStaff'].includes(u._id))
    .reduce((acc, curr) => acc + curr.count, 0) || 0;


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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Users</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">
              {loading ? <span className="animate-pulse">...</span> : totalUsers}
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
              {loading ? <span className="animate-pulse">...</span> : studentCount}
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
              {loading ? <span className="animate-pulse">...</span> : staffCount}
            </p>
          </div>
          <div className="p-3 rounded-full bg-purple-50 text-purple-600">
            <ShieldCheck size={24} />
          </div>
        </div>


      </div>

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


    </div>
  );
};

export default AdminDashboard;

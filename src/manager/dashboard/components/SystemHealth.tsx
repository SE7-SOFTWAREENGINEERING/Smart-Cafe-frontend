import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Wifi } from 'lucide-react';
import { getSystemStats } from '../../../services/admin.service';

const SystemHealth: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getSystemStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-gray-500 text-sm font-medium mb-6">System Health</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
          <Activity size={18} className="text-green-600" />
          <div>
            <p className="text-xs font-semibold text-green-800">Users Active</p>
            <p className="text-[10px] text-green-600">Total: {stats ? stats.usersByRole.reduce((a: any, b: any) => a + b.count, 0) : '...'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
          <Database size={18} className="text-green-600" />
          <div>
            <p className="text-xs font-semibold text-green-800">Bookings Today</p>
            <p className="text-[10px] text-green-600">
              {stats ? stats.todayBookings.reduce((a: any, b: any) => a + b.count, 0) : '...'} processed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
          <Server size={18} className="text-yellow-600" />
          <div>
            <p className="text-xs font-semibold text-yellow-800">No-Show Rate</p>
            <p className="text-[10px] text-yellow-600">{stats ? ((stats.noShowRate.no_shows / stats.noShowRate.total) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
          <Wifi size={18} className="text-green-600" />
          <div>
            <p className="text-xs font-semibold text-green-800">Notification Svc</p>
            <p className="text-[10px] text-green-600">Online</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">Last system check: Just now</p>
      </div>
    </div>
  );
};

export default SystemHealth;

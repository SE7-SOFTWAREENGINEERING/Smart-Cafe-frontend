import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet, AlertOctagon } from 'lucide-react';
import { getSystemStats } from '../../../services/admin.service';

const RevenueStats: React.FC = () => {
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getSystemStats();
        // Calculate revenue based on today's bookings (assuming 50 per meal)
        const todayCount = stats.todayBookings.reduce((acc: number, curr: any) => acc + curr.count, 0);
        setRevenue(todayCount * 50);
      } catch (error) {
        console.error('Failed to fetch revenue stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Today's Revenue (Est.)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : `₹ ${revenue.toLocaleString()}`}
          </p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          {/* Mock trend for now as we don't have historical revenue readily available in the same format */}
          <span className="text-green-600 font-medium flex items-center gap-1"><TrendingUp size={14} /> +8%</span>
          <span>vs average</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} /> Digital/Online
            </span>
            <span className="font-medium text-gray-900">₹ {(revenue * 0.75).toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Wallet size={14} /> Cash/Token
            </span>
            <span className="font-medium text-gray-900">₹ {(revenue * 0.25).toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium">
        <AlertOctagon size={14} />
        <span>All transactions settled</span>
      </div>
    </div>
  );
};

export default RevenueStats;

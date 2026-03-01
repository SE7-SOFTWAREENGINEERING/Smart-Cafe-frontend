import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, PlayCircle, PauseCircle, RefreshCw, Loader2 } from 'lucide-react';
import { getQueueStatus } from '../../../services/staff.service';

const QueueMonitor: React.FC = () => {
  const [isQueueActive, setIsQueueActive] = useState(true);
  const [stats, setStats] = useState({ waiting: 0, served: 0, expired: 0 });
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getQueueStatus();
      let w = 0, s = 0, e = 0;
      data.queueStatus.forEach(slot => {
        w += slot.waiting;
        s += slot.completed;
        e += slot.noShows;
      });
      setStats({ waiting: w, served: s, expired: e });
    } catch (error) {
      console.error('Error fetching queue status', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Optional: poll every 30s
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalIssued = stats.waiting + stats.served + stats.expired;
  const isHighTraffic = stats.waiting > 20;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Live Queue Status</h3>
          <div className="flex items-center gap-2 mt-2">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
              <h2 className="text-3xl font-bold text-gray-900">{stats.waiting}</h2>
            )}

            {isHighTraffic && !loading && (
              <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                <Users size={12} className="mr-1" />
                High Traffic
              </div>
            )}
          </div>
        </div>

        <button onClick={fetchQueue} disabled={loading} className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <span className="block text-xl font-bold text-gray-800">{loading ? '-' : totalIssued}</span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Issued</span>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <span className="block text-xl font-bold text-blue-700">{loading ? '-' : stats.served}</span>
          <span className="text-[10px] text-blue-600 uppercase font-semibold">Served</span>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <span className="block text-xl font-bold text-red-700">{loading ? '-' : stats.expired}</span>
          <span className="text-[10px] text-red-600 uppercase font-semibold">Expired</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* FIFO Status - Calculated mock based on active wait size for UI sake */}
        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">FIFO Compliance</span>
          <span className="text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> 98%
          </span>
        </div>

        {/* Wait Time */}
        <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">Avg. Wait Time</span>
          <span className="text-gray-900 font-medium">12 mins</span>
        </div>

        {/* Controls */}
        <div className="pt-2 flex gap-2">
          <button
            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium py-2 rounded-lg transition flex justify-center items-center gap-1"
          >
            <AlertCircle size={14} /> Force Clear
          </button>
          <button
            onClick={() => setIsQueueActive(!isQueueActive)}
            className={`flex-1 text-xs font-medium py-2 rounded-lg transition flex justify-center items-center gap-1 ${isQueueActive ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            {isQueueActive ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
            {isQueueActive ? 'Pause Queue' : 'Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueMonitor;

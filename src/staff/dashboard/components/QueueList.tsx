import React, { useState, useEffect } from 'react';
import { Check, FastForward, MoreVertical, Loader2 } from 'lucide-react';
import { getLiveQueue, updateQueueItemStatus, type LiveQueueItem } from '../../../services/staff.service';

const QueueList: React.FC = () => {
  const [queue, setQueue] = useState<LiveQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const data = await getLiveQueue();
      setQueue(data);
    } catch (error) {
      console.error('Failed to fetch live queue', error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (bookingId: number, status: 'Completed' | 'NoShow') => {
    // Optimistic UI update
    setQueue(prev => prev.filter(q => q.bookingId !== bookingId));
    try {
      await updateQueueItemStatus(bookingId, status);
    } catch (error) {
      console.error(`Failed to mark status ${status}`, error);
      fetchQueue(); // Revert on failure
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Live Queue (FIFO)</h3>
        <span className="text-xs bg-brand-light text-brand px-2 py-1 rounded font-medium">
          {loading ? '...' : queue.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {loading && queue.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center p-4 text-gray-500 text-sm border-2 border-dashed border-gray-100 rounded-lg">
            Queue empty.
          </div>
        ) : (
          queue.map((item, idx) => (
            <div
              key={item.bookingId}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${idx === 0
                ? 'bg-brand-light border-brand/20 shadow-sm ring-1 ring-brand/10'
                : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                  #{item.bookingId}
                </div>
                <div>
                  <p className={`text-sm font-bold ${idx === 0 ? 'text-gray-900' : 'text-gray-700'}`}>{item.userName}</p>
                  <p className="text-xs text-gray-500">{item.mealType} • {new Date(item.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex gap-1 shrink-0 ml-2">
                {idx === 0 ? (
                  <>
                    <button
                      onClick={() => handleAction(item.bookingId, 'Completed')}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Mark Served"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleAction(item.bookingId, 'NoShow')}
                      className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:text-amber-600 hover:border-amber-200 transition"
                      title="Skip / No-Show"
                    >
                      <FastForward size={16} />
                    </button>
                  </>
                ) : (
                  <button className="p-2 text-gray-300 hover:text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueList;

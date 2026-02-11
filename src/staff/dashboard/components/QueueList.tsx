import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { QueueStatus } from '../../../services/staff.service';

interface QueueListProps {
  queueStats: QueueStatus[];
}

const QueueList: React.FC<QueueListProps> = ({ queueStats }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Live Queue (Stats)</h3>
        <span className="text-xs bg-brand-light text-brand px-2 py-1 rounded font-medium">
            {queueStats.reduce((acc, cur) => acc + cur.waiting, 0)} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {queueStats.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No active slots found.
            </div>
        ) : (
            queueStats.map((item, idx) => (
            <div 
                key={idx} 
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                item.waiting > 0 
                    ? 'bg-brand-light border-brand/20 shadow-sm ring-1 ring-brand/10' 
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
            >
                <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold flex-col leading-tight ${
                    item.waiting > 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                    <span className="text-sm">{item.waiting}</span>
                    <span className="text-[8px] font-normal opacity-80">WAIT</span>
                </div>
                <div>
                    <p className={`text-sm font-bold ${item.waiting > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {new Date(item.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-500">{item.mealType} • {item.completed} Served</p>
                </div>
                </div>

                <div className="flex gap-1 items-center">
                    {/* Actions removed as per backend limitations on specific booking control via list */}
                     <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {item.noShows} No-show
                     </span>
                     <button className="p-2 text-gray-300 hover:text-gray-500">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default QueueList;

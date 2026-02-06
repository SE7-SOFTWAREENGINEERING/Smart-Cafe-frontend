import React from 'react';
import { Check, FastForward, MoreVertical } from 'lucide-react';

const QueueList: React.FC = () => {
  const queue = [
    { id: 'A-405', name: 'Rohan Sharma', status: 'Next', plan: 'Combo Meal' },
    { id: 'A-406', name: 'Priya Verma', status: 'Waiting', plan: 'Mini Thali' },
    { id: 'B-102', name: 'Kabir Singh', status: 'Waiting', plan: 'Snacks' },
    { id: 'C-205', name: 'Sanya Malhotra', status: 'Waiting', plan: 'Beverage' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Live Queue (FIFO)</h3>
        <span className="text-xs bg-brand-light text-brand px-2 py-1 rounded font-medium">4 Pending</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {queue.map((item, idx) => (
          <div 
            key={item.id} 
            className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
              idx === 0 
                ? 'bg-brand-light border-brand/20 shadow-sm ring-1 ring-brand/10' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <div>
                <p className={`text-sm font-bold ${idx === 0 ? 'text-gray-900' : 'text-gray-700'}`}>{item.id}</p>
                <p className="text-xs text-gray-500">{item.name} • {item.plan}</p>
              </div>
            </div>

            <div className="flex gap-1">
              {idx === 0 ? (
                <>
                  <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Mark Served">
                    <Check size={16} />
                  </button>
                   <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:text-amber-600 hover:border-amber-200 transition" title="Skip">
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
        ))}
      </div>
    </div>
  );
};

export default QueueList;

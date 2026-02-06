import React, { useState } from 'react';
import { UserPlus, UserMinus, ShieldAlert } from 'lucide-react';

const WalkInControl: React.FC = () => {
  const [walkIns, setWalkIns] = useState(12);
  const [capacityFull, setCapacityFull] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Walk-in Mgmt</h3>
          <p className="text-xs text-gray-400 mt-1">Manual entry for unbooked</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${capacityFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {capacityFull ? 'Blocked' : 'Allowed'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-3xl font-bold text-gray-900">{walkIns} <span className="text-sm font-normal text-gray-400">issued</span></p>
        
        <div className="flex items-center gap-1">
             <button 
               onClick={() => setWalkIns(Math.max(0, walkIns - 1))}
               className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
             >
               <UserMinus size={18} />
             </button>
             <button 
               onClick={() => !capacityFull && setWalkIns(walkIns + 1)}
               disabled={capacityFull}
               className={`p-2 rounded-lg transition text-white ${capacityFull ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand hover:bg-brand-hover'}`}
             >
               <UserPlus size={18} />
             </button>
        </div>
      </div>

      {capacityFull ? (
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2 text-red-700">
           <ShieldAlert size={16} className="mt-0.5 shrink-0" />
           <p className="text-xs">Capacity Full. Walk-in token generation is temporarily disabled.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
           <span className="text-xs text-gray-500">Occupancy is safe</span>
           <button 
             onClick={() => setCapacityFull(true)}
             className="text-xs font-medium text-red-600 hover:text-red-700"
           >
             Block Walk-ins
           </button>
        </div>
      )}
    </div>
  );
};

export default WalkInControl;

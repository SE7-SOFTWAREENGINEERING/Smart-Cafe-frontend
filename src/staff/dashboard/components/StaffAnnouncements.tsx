import React, { useState } from 'react';
import { Megaphone, Check } from 'lucide-react';

const StaffAnnouncements: React.FC = () => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-4 text-orange-600">
        <Megaphone size={18} />
        <h3 className="text-sm font-bold uppercase tracking-wider">Announcements</h3>
      </div>

      {!acknowledged ? (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">Queue Override Active</p>
          <p className="text-xs text-gray-700 leading-relaxed">
            Manager has authorized priority queue for exam students (wearing ID card). Please comply.
          </p>
          <p className="text-[10px] text-gray-400 mt-2 text-right">02:15 PM • Manager</p>
          
          <button 
            onClick={() => setAcknowledged(true)}
            className="w-full mt-3 bg-white border border-gray-200 text-orange-600 text-xs font-medium py-2 rounded hover:bg-orange-600 hover:text-white transition flex items-center justify-center gap-1"
          >
            <Check size={12} /> Acknowledge
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center h-40">
           <Check size={24} className="text-green-500 mb-2" />
           <p className="text-xs text-gray-500">All announcements acknowledged.</p>
        </div>
      )}
    </div>
  );
};

export default StaffAnnouncements;

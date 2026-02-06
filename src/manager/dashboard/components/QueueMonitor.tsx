import React, { useState } from 'react';
import { Users, Clock, AlertCircle, PlayCircle, PauseCircle, RefreshCw } from 'lucide-react';

const QueueMonitor: React.FC = () => {
  const [isQueueActive, setIsQueueActive] = useState(true);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Live Queue Status</h3>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">42</h2>
            <div className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <Users size={12} className="mr-1" />
              High Traffic
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 transition">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <span className="block text-xl font-bold text-gray-800">128</span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Issued</span>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <span className="block text-xl font-bold text-blue-700">86</span>
          <span className="text-[10px] text-blue-600 uppercase font-semibold">Served</span>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <span className="block text-xl font-bold text-red-700">5</span>
          <span className="text-[10px] text-red-600 uppercase font-semibold">Expired</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* FIFO Status */}
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

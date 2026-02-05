import React from 'react';
import { Clock } from 'lucide-react';

const StudentQueue: React.FC = () => {
  // Mock Data
  const queueData = {
    tokenNumber: 'A-24',
    position: 5,
    totalInQueue: 32,
    estimatedWait: '12 mins'
  };

  const progressPercentage = ((queueData.totalInQueue - queueData.position) / queueData.totalInQueue) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Queue Status</h1>
          <p className="text-gray-500 text-sm mt-1">Track your position in real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-lg mx-auto">
        <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
          <Clock size={48} className="text-blue-600" />
        </div>
        
        <h2 className="text-gray-500 font-medium uppercase tracking-wide text-sm">Your Token Number</h2>
        <div className="text-5xl font-black text-gray-900 mt-2 tracking-tight">{queueData.tokenNumber}</div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="block text-gray-500 text-xs font-medium uppercase">Position</span>
            <span className="block text-2xl font-bold text-gray-900 mt-1">
              {queueData.position} <span className="text-sm font-normal text-gray-400">/ {queueData.totalInQueue}</span>
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="block text-gray-500 text-xs font-medium uppercase">Est. Wait Time</span>
            <span className="block text-2xl font-bold text-blue-600 mt-1">{queueData.estimatedWait}</span>
          </div>
        </div>

        {/* Visual Progress */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                You are here
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                Counter
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div 
              style={{ width: `${progressPercentage}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            ></div>
          </div>
          <p className="text-xs text-gray-400">
            Queue saves approx. 15 mins of standing time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentQueue;

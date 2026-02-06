import React from 'react';
import { History, CheckCircle, XCircle, UserPlus, FastForward } from 'lucide-react';

const ActionLog: React.FC = () => {
  const logs = [
    { time: '12:42 PM', action: 'Served Token A-404', type: 'serve' },
    { time: '12:40 PM', action: 'Issued Walk-in #W-12', type: 'walkin' },
    { time: '12:38 PM', action: 'Rejected B-102 (Expired)', type: 'reject' },
    { time: '12:35 PM', action: 'Skipped A-402 (No Show)', type: 'skip' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'serve': return <CheckCircle size={14} className="text-green-600" />;
      case 'walkin': return <UserPlus size={14} className="text-brand" />;
      case 'reject': return <XCircle size={14} className="text-red-600" />;
      case 'skip': return <FastForward size={14} className="text-amber-600" />;
      default: return <History size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Your Activity</h3>
        <History size={16} className="text-gray-400" />
      </div>

      <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
              {getIcon(log.type)}
            </div>
            <div className="pt-1">
              <p className="text-xs font-semibold text-gray-800">{log.action}</p>
              <p className="text-[10px] text-gray-400">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionLog;

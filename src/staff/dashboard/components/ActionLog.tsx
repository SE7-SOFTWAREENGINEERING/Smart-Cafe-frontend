import React from 'react';
import { History, CheckCircle, XCircle, UserPlus, FastForward } from 'lucide-react';

export interface ActionLogItem {
    time: string;
    action: string;
    type: 'serve' | 'walkin' | 'reject' | 'skip';
}

interface ActionLogProps {
    logs?: ActionLogItem[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs = [] }) => {
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Your Activity</h3>
        <History size={16} className="text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
        {logs.length === 0 ? (
            <p className="text-xs text-gray-400 pl-8">No recent activity</p>
        ) : (
            logs.map((log, idx) => (
            <div key={idx} className="flex gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon(log.type)}
                </div>
                <div className="pt-1">
                <p className="text-xs font-semibold text-gray-800">{log.action}</p>
                <p className="text-[10px] text-gray-400">{log.time}</p>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ActionLog;

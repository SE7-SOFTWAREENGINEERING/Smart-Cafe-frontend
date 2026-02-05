import React from 'react';
import { Users, ClipboardList, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const StaffDashboard: React.FC = () => {
  // Mock data
  const occupancy = 85; // percentage
  const totalSeats = 140;
  const occupiedSeats = 120;
  const pendingTokens = 24;
  const nextToken = 'A-405';

  // Determine color based on occupancy
  const getOccupancyColor = (value: number) => {
    if (value >= 90) return 'text-red-600 bg-red-50';
    if (value >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const occupancyStyle = getOccupancyColor(occupancy);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time operational overview.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Occupancy Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Live Occupancy</h3>
               <p className="text-xs text-gray-400 mt-1">Updates every 30s</p>
             </div>
             <div className={cn("p-2 rounded-full", occupancyStyle)}>
                <Users size={24} />
             </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={cn("text-4xl font-bold", occupancy >= 90 ? "text-red-600" : occupancy >= 70 ? "text-orange-600" : "text-green-600")}>
              {occupancy}%
            </span>
            <span className="text-gray-500 font-medium">Full</span>
          </div>
          
          <div className="mt-4">
             <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className={cn("h-2.5 rounded-full transition-all duration-500", occupancy >= 90 ? "bg-red-500" : occupancy >= 70 ? "bg-orange-500" : "bg-green-500")}
                  style={{ width: `${occupancy}%` }}
                ></div>
             </div>
             <p className="text-sm text-gray-600 mt-2 flex justify-between">
               <span>{occupiedSeats} / {totalSeats} Seats</span>
               {occupancy >= 90 && <span className="text-red-600 font-medium flex items-center text-xs"><AlertCircle size={12} className="mr-1"/> Near Capacity</span>}
             </p>
          </div>
        </div>

        {/* Pending Tokens Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Tokens</h3>
               <p className="text-xs text-gray-400 mt-1">Queue status</p>
             </div>
             <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <ClipboardList size={24} />
             </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{pendingTokens}</span>
            <span className="text-gray-500 font-medium">Waiting</span>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
             <span className="text-sm text-blue-800 font-medium">Next to serve:</span>
             <span className="text-xl font-bold text-blue-700">{nextToken}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

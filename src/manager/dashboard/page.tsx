import React, { useState } from 'react';
import { Calendar, RefreshCw, Clock } from 'lucide-react';
import DemandForecast from './components/DemandForecast';
import FoodWasteControl from './components/FoodWasteControl';
import RevenueStats from './components/RevenueStats';
import SlotManagement from './components/SlotManagement';
import QueueMonitor from './components/QueueMonitor';
import StaffControls from './components/StaffControls';
import NotificationCenter from './components/NotificationCenter';
import SystemHealth from './components/SystemHealth';

const ManagerDashboard: React.FC = () => {
  const [currentDate] = useState('Today, 12 Oct');
  const [currentSession, setCurrentSession] = useState('Lunch');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
           <p className="text-sm text-gray-500 mt-1">Operational Overview & Real-time Analytics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
             <Calendar size={16} className="text-gray-400" />
             <span className="font-medium">{currentDate}</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
             <Clock size={16} className="text-gray-400" />
             <select 
               value={currentSession}
               onChange={(e) => setCurrentSession(e.target.value)}
               className="bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium cursor-pointer"
             >
               <option>Breakfast</option>
               <option>Lunch</option>
               <option>Snacks</option>
               <option>Dinner</option>
             </select>
          </div>

           <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium text-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             Open
           </div>

           <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
             <RefreshCw size={18} />
           </button>
        </div>
      </header>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Row 1: Demand & Waste (Sustainability) */}
        <div className="lg:col-span-2">
           <DemandForecast />
        </div>
        <div className="lg:col-span-1">
           <FoodWasteControl />
        </div>

        {/* Row 2: Operation Controls */}
        <div className="lg:col-span-1">
           <QueueMonitor />
        </div>
        <div className="lg:col-span-1">
           <SlotManagement />
        </div>
        <div className="lg:col-span-1">
           <RevenueStats />
        </div>

        {/* Row 3: Management & System */}
        <div className="lg:col-span-1">
           <StaffControls />
        </div>
        <div className="lg:col-span-1">
           <NotificationCenter />
        </div>
        <div className="lg:col-span-1">
           <SystemHealth />
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;

import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import QueueList from './components/QueueList';
import WalkInControl from './components/WalkInControl';
import StaffAnnouncements from './components/StaffAnnouncements';
import ActionLog from './components/ActionLog';
import { useAuth } from '../../store/auth.store';
import { getOccupancy } from '../../services/staff.service';
import { useNavigate } from 'react-router-dom';

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [occupancy, setOccupancy] = useState(0);

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const occ = await getOccupancy();
        setOccupancy(occ.percentage);
      } catch (error) {
        console.error("Failed to fetch slots for occupancy", error);
      }
    };

    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Identity */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary font-bold uppercase">
            {user?.name?.charAt(0) || <User size={20} />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{user?.name || 'Staff User'}</h1>
            <p className="text-xs text-gray-500 font-medium">Counter Staff • <span className="text-green-600">Active Session</span></p>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Occupancy Bar */}
          <div className="hidden md:block flex-1 max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">Live Occupancy</span>
              <span className={`${occupancy > 80 ? 'text-orange-600' : 'text-brand-secondary'} font-bold`}>{occupancy}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${occupancy > 90 ? 'bg-red-500' : occupancy > 80 ? 'bg-orange-500' : 'bg-brand-secondary'}`}
                style={{ width: `${occupancy}%` }}
              ></div>
            </div>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition">
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">

        {/* Left Col: Scanning (Priority) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1">
            <WalkInControl />
          </div>
        </div>

        {/* Middle Col: Queue Flow */}
        <div className="lg:col-span-5 h-[500px] lg:h-auto">
          <QueueList />
        </div>

        {/* Right Col: Communication & Logs */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-none">
            <StaffAnnouncements />
          </div>
          <div className="flex-1 overflow-hidden">
            <ActionLog />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;

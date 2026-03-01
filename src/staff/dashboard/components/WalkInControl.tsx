import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOccupancy } from '../../../services/staff.service';

const WalkInControl: React.FC = () => {
  const [capacityData, setCapacityData] = useState({ current: 0, max: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const occ = await getOccupancy();
        setCapacityData({ current: occ.current, max: occ.max });
      } catch (error) {
        console.error("Failed to fetch capacity", error);
      }
    };
    fetchCapacity();
  }, []);

  const walkInCount = capacityData.current; // Approximating walk-in + booked
  const capacityFull = capacityData.max > 0 && capacityData.current >= capacityData.max;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Walk-in Mgmt</h3>
          <p className="text-xs text-gray-400 mt-1">Manual entry for unbooked</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase overflow-hidden whitespace-nowrap ${capacityFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {capacityFull ? 'Blocked' : 'Allowed'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <PieChart className="text-gray-400" size={24} />
          {walkInCount} <span className="text-sm font-normal text-gray-400">active</span>
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/staff/walkin')}
            disabled={capacityFull}
            className={`py-2 px-3 rounded-lg transition text-white flex items-center gap-2 text-sm font-medium ${capacityFull ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand hover:bg-brand-hover shadow-sm'}`}
          >
            <UserPlus size={16} /> Issue
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
          <span className="text-xs text-gray-500">Live Occupancy: {capacityData.current} / {capacityData.max || '-'}</span>
          <span className="text-xs font-medium text-green-600">
            {capacityData.max ? Math.max(0, capacityData.max - capacityData.current) : 0} Seats Left
          </span>
        </div>
      )}
    </div>
  );
};

export default WalkInControl;

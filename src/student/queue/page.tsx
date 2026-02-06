import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Users, RefreshCw,
  MapPin, Coffee
} from 'lucide-react';


const StudentQueue: React.FC = () => {
  const navigate = useNavigate();

  // Mock State for Queue Simulation
  // In a real app, this would come from a WebSocket or polling API
  const [position, setPosition] = useState(5);
  const [peopleAhead, setPeopleAhead] = useState(4);
  const [waitTime, setWaitTime] = useState(12); // minutes
  const [lastUpdated, setLastUpdated] = useState("Just now");

  // Simulate Queue Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev <= 1) return 1; // You're next!
        const newPos = prev - 1;
        setPeopleAhead(newPos - 1);
        setWaitTime(newPos * 2.5); // Approx 2.5 mins per person
        setLastUpdated("Just now");
        return newPos;
      });
    }, 5000); // Update every 5 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // Update "Last updated" text simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated("10s ago");
    }, 10000);
    return () => clearInterval(interval);
  }, [position]);

  return (
    <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
      </div>

      {/* Main KPI Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500 animate-pulse"></div>

        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Your Position</p>
        <div className="flex items-baseline justify-center gap-1 mb-6">
          <span className="text-6xl font-black text-gray-900">{position}</span>
          <span className="text-xl text-gray-400 font-medium">/ 15</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div>
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
              <Users size={16} />
              <span className="text-xs font-bold">AHEAD</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{peopleAhead}</p>
          </div>
          <div className="border-l border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
              <Clock size={16} />
              <span className="text-xs font-bold">WAIT</span>
            </div>
            <p className="text-xl font-bold text-brand">~{Math.ceil(waitTime)}m</p>
          </div>
        </div>
      </div>

      {/* Status & Location */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Sopanam Canteen</h3>
              <p className="text-xs text-gray-500">Counter 2 (Meals)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="bg-brand-light border border-brand/20 p-4 rounded-xl flex gap-3">
          <Coffee size={20} className="text-brand shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand font-bold mb-1">While you wait...</p>
            <p className="text-xs text-brand leading-relaxed">
              Check out the new dessert menu! You can add items to your existing order until 5 mins before pickup.
            </p>
          </div>
        </div>
      </div>

      {/* Live Indicator Footer */}
      <div className="mt-auto flex justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

    </div>
  );
};

export default StudentQueue;

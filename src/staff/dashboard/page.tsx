import React, { useState, useEffect } from "react";
import { LogOut, User, Building2 } from "lucide-react";
import QueueList from "./components/QueueList";
import WalkInControl from "./components/WalkInControl";
import StaffAnnouncements from "./components/StaffAnnouncements";
import ActionLog from "./components/ActionLog";
import ServingRules from "./components/ServingRules";
import { useAuth } from "../../store/auth.store";
import * as AuthService from "../../services/auth.service"; // Import AuthService
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const staffName = user?.name || user?.fullName || "Staff";

  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [, setLoading] = useState(true);

  // We'll manage assignedCanteenId here, defaulting to auth user's but updating from API
  const [assignedCanteenId, setAssignedCanteenId] = useState<string>((user as any)?.canteenId || ""); 
  const [assignedCanteenName, setAssignedCanteenName] = useState<string>("");

  useEffect(() => {
    // 1. Fetch latest profile to check for new assignment
    const fetchProfile = async () => {
        try {
            const profile = await AuthService.getProfile();
            if (profile && (profile as any).canteenId) {
                setAssignedCanteenId((profile as any).canteenId);
            }
        } catch (e) {
            console.error("Failed to refresh profile", e);
        }
    };
    fetchProfile();

    loadCanteens();
    // Poll occupancy every 30 seconds
    const interval = setInterval(() => {
        loadCanteens();
        fetchProfile(); // Also poll profile for re-assignment updates
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCanteens = async () => {
    try {
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
      // Resolve assigned canteen name
      if (assignedCanteenId) {
        const match = data.find(
          (c) => (c.id || c._id) === assignedCanteenId
        );
        setAssignedCanteenName(match?.name || "Unknown Canteen");
      }
    } catch (error) {
      console.error("Failed to load canteens:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute overall occupancy from all canteens
  const totalCapacity = canteens.reduce((s, c) => s + c.capacity, 0);
  const totalOccupancy = canteens.reduce((s, c) => s + c.occupancy, 0);
  const occupancy =
    totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Identity */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary font-bold">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{staffName}</h1>
            <p className="text-xs text-gray-500 font-medium">
              Counter Staff •{" "}
              <span className="text-green-600">Active Session</span>
            </p>
            {assignedCanteenName ? (
              <p className="text-xs text-brand font-medium flex items-center gap-1 mt-0.5">
                <Building2 size={12} /> Assigned to: {assignedCanteenName}
              </p>
            ) : (
              <p className="text-xs text-amber-500 font-medium mt-0.5">
                Unassigned — No canteen allotted
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Occupancy Bar */}
          <div className="hidden md:block flex-1 max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">Live Occupancy</span>
              <span
                className={`${occupancy > 80 ? "text-orange-600" : "text-brand-secondary"} font-bold`}
              >
                {occupancy}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${occupancy > 90 ? "bg-red-500" : occupancy > 80 ? "bg-orange-500" : "bg-brand-secondary"}`}
                style={{ width: `${occupancy}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition"
          >
            <LogOut size={16} />{" "}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
        {/* Left Col: Scanning (Priority) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Token Scanner removed as per request (separate page) */}
          {/* Token Scanner removed as per request (separate page) */}
          {/* Scan Token link removed */}
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
           <div className="flex-none">
            <ServingRules />
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

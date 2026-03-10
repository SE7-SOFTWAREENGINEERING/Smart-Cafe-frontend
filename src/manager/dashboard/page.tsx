import React, { useState, useCallback, useEffect } from "react";
import { Calendar, RefreshCw, Clock, Building2 } from "lucide-react";
import DemandForecast from "./components/DemandForecast";
import FoodWasteControl from "./components/FoodWasteControl";
import RevenueStats from "./components/RevenueStats";
import SlotManagement from "./components/SlotManagement";
import QueueMonitor from "./components/QueueMonitor";
import StaffControls from "./components/StaffControls";
import NotificationCenter from "./components/NotificationCenter";
import SystemHealth from "./components/SystemHealth";
import { getCanteens, type Canteen } from "../../services/canteen.service";

const STORAGE_KEY = "manager_selected_canteen";

const getMealSession = (): string => {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 15) return "Lunch";
  if (h < 17) return "Snacks";
  return "Dinner";
};

const formatDate = (): string => {
  const d = new Date();
  return `Today, ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
};

const ManagerDashboard: React.FC = () => {
  const [currentDate] = useState(formatDate());
  const [currentSession, setCurrentSession] = useState(getMealSession());
  const [refreshKey, setRefreshKey] = useState(0);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>("");
  const [loadingCanteens, setLoadingCanteens] = useState(true);

  // Load canteens and restore selection from localStorage
  useEffect(() => {
    const loadCanteens = async () => {
      try {
        const data = await getCanteens({ isActive: true });
        setCanteens(data);

        // Restore selection from localStorage or use first canteen
        const savedCanteenId = localStorage.getItem(STORAGE_KEY);
        if (savedCanteenId && data.some(c => c.id === savedCanteenId || c._id === savedCanteenId)) {
          setSelectedCanteenId(savedCanteenId);
        } else if (data.length > 0) {
          const firstId = data[0].id || data[0]._id || "";
          setSelectedCanteenId(firstId);
          localStorage.setItem(STORAGE_KEY, firstId);
        }
      } catch (err) {
        console.error("Failed to load canteens:", err);
      } finally {
        setLoadingCanteens(false);
      }
    };
    loadCanteens();
  }, []);

  const handleCanteenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canteenId = e.target.value;
    setSelectedCanteenId(canteenId);
    localStorage.setItem(STORAGE_KEY, canteenId);
    // Trigger refresh of all components
    setRefreshKey((k) => k + 1);
  };

  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const selectedCanteen = canteens.find(c => c.id === selectedCanteenId || c._id === selectedCanteenId);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational Overview & Real-time Analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Canteen Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
            <Building2 size={16} className="text-orange-500" />
            {loadingCanteens ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <select
                value={selectedCanteenId}
                onChange={handleCanteenChange}
                className="bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium cursor-pointer min-w-[120px]"
              >
                {canteens.map((canteen) => (
                  <option key={canteen.id || canteen._id} value={canteen.id || canteen._id}>
                    {canteen.name}
                  </option>
                ))}
                {canteens.length === 0 && (
                  <option value="">No canteens available</option>
                )}
              </select>
            )}
          </div>

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

          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${selectedCanteen?.status === "Open"
              ? "bg-green-100 text-green-700"
              : selectedCanteen?.status === "Closing Soon"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${selectedCanteen?.status === "Open" ? "bg-green-500" : selectedCanteen?.status === "Closing Soon" ? "bg-amber-500" : "bg-red-500"
              }`}></span>
            {selectedCanteen?.status || "Open"}
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Demand & Waste (Sustainability) */}
        <div className="lg:col-span-2">
          <DemandForecast
            key={`df-${refreshKey}`}
            mealType={currentSession}
            canteenId={selectedCanteenId}
          />
        </div>
        <div className="lg:col-span-1">
          <FoodWasteControl key={`fw-${refreshKey}`} />
        </div>

        {/* Row 2: Operation Controls */}
        <div className="lg:col-span-1">
          <QueueMonitor key={`qm-${refreshKey}`} canteenId={selectedCanteenId} />
        </div>
        <div className="lg:col-span-1">
          <SlotManagement key={`sm-${refreshKey}`} canteenId={selectedCanteenId} />
        </div>
        <div className="lg:col-span-1">
          <RevenueStats key={`rs-${refreshKey}`} canteenId={selectedCanteenId} />
        </div>

        {/* Row 3: Management & System */}
        <div className="lg:col-span-1">
          <StaffControls key={`sc-${refreshKey}`} canteenId={selectedCanteenId} />
        </div>
        <div className="lg:col-span-1">
          <NotificationCenter key={`nc-${refreshKey}`} />
        </div>
        <div className="lg:col-span-1">
          <SystemHealth key={`sh-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

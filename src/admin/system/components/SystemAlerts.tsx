import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import api from "../../../services/api.config";

const SystemAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Poll every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      // We use the new /alerts endpoint or fallback to notifications if not ready
      const response = await api.get("/alerts");
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch system alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-32">
        <span className="text-gray-400 text-sm">Loading alerts...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Bell size={20} className="text-gray-700" />
        <h3 className="font-bold text-gray-900">Recent System Alerts</h3>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Bell size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No recent alerts</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-red-50 border border-red-100 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Bell size={16} className="text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                <span className="text-[10px] text-gray-400 mt-2 block">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;

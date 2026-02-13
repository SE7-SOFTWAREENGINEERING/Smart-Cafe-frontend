import React, { useState, useEffect } from "react";
import { Activity, Server, Database, Wifi, Loader2 } from "lucide-react";
import {
  getAllSettings,
  type SystemSetting,
} from "../../../services/system.service";

interface HealthItem {
  label: string;
  status: string;
  icon: React.ReactNode;
  healthy: boolean;
}

const SystemHealth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HealthItem[]>([]);
  const [lastCheck, setLastCheck] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const settings = await getAllSettings();
        const list = Array.isArray(settings)
          ? settings
          : (settings as any).settings || [];

        const findSetting = (key: string) =>
          list.find((s: SystemSetting) => s.settingKey === key);

        const maintenance = findSetting("maintenance_mode");
        const booking = findSetting("master_booking_enabled");
        const queue = findSetting("queue_enabled");
        const notif = findSetting("notification_enabled");

        setItems([
          {
            label: "Booking System",
            status:
              booking?.settingValue === "true"
                ? "Online"
                : booking?.settingValue === "false"
                  ? "Disabled"
                  : "Online",
            icon: <Activity size={18} />,
            healthy: booking?.settingValue !== "false",
          },
          {
            label: "Queue System",
            status:
              queue?.settingValue === "true"
                ? "Active"
                : queue?.settingValue === "false"
                  ? "Paused"
                  : "Active",
            icon: <Database size={18} />,
            healthy: queue?.settingValue !== "false",
          },
          {
            label: "Maintenance Mode",
            status: maintenance?.settingValue === "true" ? "Enabled" : "Off",
            icon: <Server size={18} />,
            healthy: maintenance?.settingValue !== "true",
          },
          {
            label: "Notifications",
            status: notif?.settingValue === "false" ? "Disabled" : "Online",
            icon: <Wifi size={18} />,
            healthy: notif?.settingValue !== "false",
          },
        ]);

      } catch {
        /* ignore */
      } finally {
        setLastCheck(
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        );
        setLoading(false);
      }
    };
    load();

    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-gray-500 text-sm font-medium mb-6">System Health</h3>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const bgColor = item.healthy
            ? "bg-green-50 border-green-100"
            : "bg-yellow-50 border-yellow-100";
          const textColor = item.healthy ? "text-green-600" : "text-yellow-600";
          const headColor = item.healthy ? "text-green-800" : "text-yellow-800";
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-3 rounded-lg border ${bgColor}`}
            >
              <span className={textColor}>{item.icon}</span>
              <div>
                <p className={`text-xs font-semibold ${headColor}`}>
                  {item.label}
                </p>
                <p className={`text-[10px] ${textColor}`}>{item.status}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Last system check: {lastCheck || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default SystemHealth;

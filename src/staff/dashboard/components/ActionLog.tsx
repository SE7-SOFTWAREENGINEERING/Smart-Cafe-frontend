import React, { useState, useEffect } from "react";
import {
  History,
  CheckCircle,
  XCircle,
  FastForward,
  Loader2,
} from "lucide-react";
import * as notificationService from "../../../services/notification.service";
import type { Notification } from "../../../services/notification.service";

const ActionLog: React.FC = () => {
  const [logs, setLogs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const data = await notificationService.getNotifications({ limit: 10 });
      setLogs(data);
    } catch (error) {
      console.error("Failed to load action logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (notif: Notification) => {
    if (notif.type === "order")
      return <CheckCircle size={14} className="text-green-600" />;
    if (notif.type === "alert")
      return <XCircle size={14} className="text-red-600" />;
    if (notif.type === "system")
      return <FastForward size={14} className="text-amber-600" />;
    return <History size={14} className="text-gray-400" />;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
          Your Activity
        </h3>
        <History size={16} className="text-gray-400" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={14} /> Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-sm">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon(log)}
              </div>
              <div className="pt-1">
                <p className="text-xs font-semibold text-gray-800">
                  {log.message}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionLog;

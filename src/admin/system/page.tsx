import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import {
  Database,
  Download,
  RefreshCw,
  History as HistoryIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";
import {
  getAllSettings,
  updateSettingValue,
  runBackup,
  getAuditLogs,
} from "../../services/system.service";
import toast from "react-hot-toast";
import SystemAlerts from "./components/SystemAlerts";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  time: string;
}

const AdminSystem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);
  const [runningBackup, setRunningBackup] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settings, audits] = await Promise.all([
        getAllSettings(),
        getAuditLogs(10).catch(() => []),
      ]);

      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.settingKey.toLowerCase()] = s.settingValue;
      });

      if (map["auto_backup_enabled"] !== undefined) {
        setAutoBackupEnabled(map["auto_backup_enabled"] === "true");
      }
      if (map["online_booking_enabled"] !== undefined) {
        setOnlineBookingEnabled(map["online_booking_enabled"] === "true");
      }

      const logs: AuditEntry[] = (Array.isArray(audits) ? audits : [])
        .slice(0, 10)
        .map((n: any) => ({
          id: n._id || n.id || String(Math.random()),
          action: n.action || "System event",
          user: n.userName || n.userRole || "System",
          time: n.createdAt
            ? new Date(n.createdAt).toLocaleString()
            : "Unknown",
        }));
      setAuditLogs(logs);
    } catch (err: any) {
      toast.error("Failed to load system data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoBackup = async () => {
    const newVal = !autoBackupEnabled;
    try {
      const updated = await updateSettingValue(
        "auto_backup_enabled",
        String(newVal),
      );
      setAutoBackupEnabled(String(updated.settingValue) === "true");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
      setAutoBackupEnabled(!newVal);
    }
  };

  const handleRunBackup = async () => {
    try {
      setRunningBackup(true);
      const result = await runBackup();
      toast.success(`Backup completed: ${result.fileName}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Backup failed");
    } finally {
      setRunningBackup(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <RefreshCw size={24} className="animate-spin mr-2" /> Loading system
        data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          System Maintenance & Governance
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage system status and view audit logs.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Auto-Backup Toggle */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Database size={20} className="text-blue-600" />
                  Database Backup
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Auto-daily backup configuration
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackupEnabled}
                    onChange={handleToggleAutoBackup}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Auto-Daily
                  </span>
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunBackup}
                  disabled={runningBackup}
                >
                  <Download size={16} className="mr-2" />
                  {runningBackup ? "Backing Up..." : "Run Backup"}
                </Button>
              </div>
            </div>
          </div>

          {/* System Settings Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">
              Quick System Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Online Booking</div>
                <div
                  className={cn(
                    "text-lg font-bold",
                    onlineBookingEnabled ? "text-green-600" : "text-gray-400",
                  )}
                >
                  {onlineBookingEnabled ? "ACTIVE" : "DISABLED"}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Auto Backup</div>
                <div
                  className={cn(
                    "text-lg font-bold",
                    autoBackupEnabled ? "text-green-600" : "text-gray-400",
                  )}
                >
                  {autoBackupEnabled ? "ENABLED" : "DISABLED"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Audit Logs from notifications */}
        <div className="lg:col-span-1 self-start space-y-6">
          <SystemAlerts />

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:sticky lg:top-20 h-[calc(100vh-32rem)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HistoryIcon size={20} className="text-gray-500" />
                Recent Activity
              </h3>
              <button
                onClick={loadData}
                className="text-xs text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No recent activity found.
                </p>
              ) : (
                <div className="space-y-6">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="relative pl-6 border-l-2 border-gray-100 last:border-0"
                    >
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.action}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {log.user}
                        </span>
                        <span className="text-xs text-gray-400">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;

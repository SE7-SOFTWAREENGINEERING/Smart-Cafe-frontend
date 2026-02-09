import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Settings,
  RefreshCw,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Send,
  Users,
} from "lucide-react";
import {
  getNotificationLog,
  type NotificationLogEntry,
} from "../../services/notification.service";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 15_000;

const ROLE_LABELS: Record<string, string> = {
  user: "Students",
  canteen_staff: "Canteen Staff",
  kitchen_staff: "Kitchen Staff",
  counter_staff: "Counter Staff",
  manager: "Managers",
  admin: "Admins",
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  announcement: {
    icon: <Megaphone size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Announcement",
  },
  alert: {
    icon: <AlertTriangle size={14} />,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Alert",
  },
  system: {
    icon: <Settings size={14} />,
    color: "text-gray-600",
    bg: "bg-gray-50",
    label: "System",
  },
  order: {
    icon: <Bell size={14} />,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Order",
  },
};

const AdminNotifications: React.FC = () => {
  const [logs, setLogs] = useState<NotificationLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const limit = 20;

  const fetchLogs = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const result = await getNotificationLog({
          page,
          limit,
          type: typeFilter || undefined,
        });
        setLogs(result.logs || []);
        setTotal(result.total || 0);
      } catch {
        if (!silent) toast.error("Failed to load notification log");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [page, typeFilter],
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Silent polling
  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchLogs(true);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit) || 1;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatRoles = (roles: string[]) => {
    if (!roles || roles.length === 0) return "All Users";
    return roles.map((r) => ROLE_LABELS[r] || r).join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="text-blue-600" size={24} />
                Notification Log
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View all broadcast notifications sent across the system
              </p>
            </div>
            <button
              onClick={() => fetchLogs()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition shadow-sm"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Filter by type:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setTypeFilter(""); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  typeFilter === ""
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => { setTypeFilter(key); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                    typeFilter === key
                      ? "bg-gray-900 text-white"
                      : `${config.bg} ${config.color} hover:opacity-80`
                  }`}
                >
                  {config.icon}
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
              <p className="text-sm text-gray-400">Loading notifications...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="text-gray-300 mb-3" size={40} />
              <p className="text-sm text-gray-400">No notifications found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <div className="flex items-center gap-1">
                          <Send size={12} />
                          Sent By
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          Receivers
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Message
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Recipients
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log, index) => {
                      const typeInfo = TYPE_CONFIG[log.type] || TYPE_CONFIG.system;
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}
                            >
                              {typeInfo.icon}
                              {typeInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {log.sentByName || (
                              <span className="text-gray-400 italic">System</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px]">
                            {formatRoles(log.targetRoles)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                            {log.title}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[250px] truncate">
                            {log.message}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold min-w-[28px]">
                              {log.recipientCount}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500">
                  Showing page {page} of {totalPages} ({total} total broadcasts)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[40px] text-center">
                    {page}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;

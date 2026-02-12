import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Megaphone,
  AlertCircle,
  Check,
  Loader2,
  Users,
} from "lucide-react";
import {
  sendBroadcast,
  getNotifications,
  type Notification,
} from "../../../services/notification.service";
import toast from "react-hot-toast";

const ROLE_OPTIONS = [
  { value: "user", label: "Students" },
  { value: "canteen_staff", label: "Canteen Staff", extraRoles: ["kitchen_staff", "counter_staff"] },
  { value: "manager", label: "Managers" },
  { value: "admin", label: "Admins" },
];

const NotificationCenter: React.FC = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [logs, setLogs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showRolePicker, setShowRolePicker] = useState(false);

  const loadLogs = async () => {
    try {
      const data = await getNotifications({ limit: 5 });
      const list = Array.isArray(data)
        ? data
        : (data as any).notifications || [];
      setLogs(list);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadLogs();
      setLoading(false);
    };
    init();
  }, []);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const selectAllRoles = () => {
    if (selectedRoles.length === ROLE_OPTIONS.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(ROLE_OPTIONS.map((r) => r.value));
    }
  };

  const receiverLabel =
    selectedRoles.length === 0 || selectedRoles.length === ROLE_OPTIONS.length
      ? "All Users"
      : selectedRoles.length === 1
        ? ROLE_OPTIONS.find((r) => r.value === selectedRoles[0])?.label || ""
        : `${selectedRoles.length} roles`;

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      // Expand extraRoles (e.g. canteen_staff -> canteen_staff + kitchen_staff + counter_staff)
      const expandedRoles = selectedRoles.length > 0 && selectedRoles.length < ROLE_OPTIONS.length
        ? selectedRoles.flatMap((r) => {
            const opt = ROLE_OPTIONS.find((o) => o.value === r);
            return opt?.extraRoles ? [r, ...opt.extraRoles] : [r];
          })
        : undefined;
      const result = await sendBroadcast({
        title: title || "Announcement",
        message,
        type: "announcement",
        roles: expandedRoles,
      });
      setSent(true);
      toast.success(`Sent to ${result.recipientCount} users`);
      await loadLogs();
      setTimeout(() => {
        setSent(false);
        setMessage("");
        setTitle("");
        setSelectedRoles([]);
      }, 2000);
    } catch {
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">
          Notifications & Alerts
        </h3>
        <div
          className="bg-red-50 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-100 transition"
          title="Trigger Emergency Alert"
        >
          <AlertCircle size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 mb-2 placeholder-gray-400 font-medium"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none placeholder-gray-400"
            rows={2}
            placeholder="Type announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          {/* Receiver Picker */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowRolePicker(!showRolePicker)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition"
            >
              <Users size={12} />
              <span>
                Send to: <span className="font-semibold text-gray-700">{receiverLabel}</span>
              </span>
            </button>

            {showRolePicker && (
              <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg space-y-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedRoles.length === 0 || selectedRoles.length === ROLE_OPTIONS.length}
                    onChange={selectAllRoles}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span className="font-medium text-gray-700">All Users</span>
                </label>
                <div className="border-t border-gray-100 my-1"></div>
                {ROLE_OPTIONS.map((role) => (
                  <label
                    key={role.value}
                    className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.value)}
                      onChange={() => toggleRole(role.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-gray-600">{role.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition ${sent ? "bg-green-100 text-green-700" : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"}`}
            >
              {sent ? (
                <Check size={12} />
              ) : sending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
              {sent ? "Sent" : sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Recent Logs
          </p>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-300" size={20} />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No recent notifications
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <div
                  className={`mt-1 ${log.type === "announcement" ? "text-blue-500" : "text-green-500"}`}
                >
                  {log.type === "announcement" ? (
                    <Megaphone size={14} />
                  ) : (
                    <Bell size={14} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-800">
                    {log.message || log.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

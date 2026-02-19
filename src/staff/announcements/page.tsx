import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { Megaphone, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import * as notificationService from "../../services/notification.service";
import type { Notification } from "../../services/notification.service";
import toast from "react-hot-toast";

const StaffAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({
        type: "announcement",
        limit: 20,
      });
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!newMessage.trim()) return;

    try {
      setBroadcasting(true);
      await notificationService.sendBroadcast({
        title: isPriority ? "⚠️ Priority Announcement" : "Announcement",
        message: newMessage,
        type: "announcement",
        isUrgent: isPriority,
      });
      toast.success("Announcement broadcast successfully!");
      setNewMessage("");
      setIsPriority(false);
      loadAnnouncements();
    } catch (error) {
      console.error("Failed to broadcast:", error);
      toast.error("Failed to send announcement");
    } finally {
      setBroadcasting(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Broadcast messages to students and staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Megaphone size={18} className="text-blue-600" /> New Broadcast
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Content
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="e.g. Special menu available for lunch today..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Mark as High Priority
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleBroadcast}
                disabled={!newMessage.trim() || broadcasting}
                isLoading={broadcasting}
              >
                Broadcast Message
              </Button>
            </div>
          </div>
        </div>

        {/* Preview List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            Active Announcements
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {announcements.length}
            </span>
          </h3>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader2 className="animate-spin mr-2" size={16} /> Loading...
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                No active announcements.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={cn(
                    "p-4 rounded-lg border bg-white shadow-sm flex gap-3 relative group",
                    announcement.isUrgent
                      ? "border-red-100 bg-red-50/30"
                      : "border-gray-100",
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 mt-0.5",
                      announcement.isUrgent ? "text-red-500" : "text-blue-500",
                    )}
                  >
                    {announcement.isUrgent ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Megaphone size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm text-gray-800",
                        announcement.isUrgent && "font-medium",
                      )}
                    >
                      {announcement.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{formatTime(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAnnouncements;

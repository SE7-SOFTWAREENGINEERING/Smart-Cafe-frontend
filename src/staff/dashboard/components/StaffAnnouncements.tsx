import React, { useState, useEffect } from "react";
import { Megaphone, Check, Loader2, Send, Users } from "lucide-react";
import * as notificationService from "../../../services/notification.service";
import type { Notification } from "../../../services/notification.service";
import toast from "react-hot-toast";

const StaffAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Broadcast state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({
        type: "announcement",
        limit: 5,
      });
      setAnnouncements(data.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to acknowledge:", error);
    }
  };
  
  const handleSendBroadcast = async () => {
    if (!message.trim() || !title.trim()) return;
    
    try {
      setSending(true);
      await notificationService.sendBroadcast({
        title,
        message,
        type: "announcement",
        roles: ["user"], // Target students only
        isUrgent: false
      });
      
      setSent(true);
      toast.success("Announcement sent to students");
      
      // Reset form
      setTimeout(() => {
        setSent(false);
        setTitle("");
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to send broadcast:", error);
      toast.error("Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-amber-600">
        <Megaphone size={18} />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Announcements
        </h3>
      </div>
      
      {/* New Announcement Form */}
      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 mb-6">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-1">
          <Send size={12} /> New Broadcast to Students
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Special Menu)"
            className="w-full text-sm px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder-gray-400"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your announcement here..."
            className="w-full text-sm px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder-gray-400 min-h-[80px] resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Users size={10} /> Visible to: <span className="font-semibold text-gray-700">All Students</span>
            </span>
            <button
              onClick={handleSendBroadcast}
              disabled={!title.trim() || !message.trim() || sending}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                sent 
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {sent ? (
                <>
                  <Check size={14} /> Sent
                </>
              ) : sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send Now <Send size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">
          Received Announcements
        </h4>
        
        {loading ? (
          <div className="flex items-center justify-center py-4 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={14} /> Loading...
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-gray-50 border border-gray-100 rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {ann.title}
                  </p>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {new Date(ann.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-3">
                  {ann.message}
                </p>
                <button
                  onClick={() => handleAcknowledge(ann.id)}
                  className="w-full bg-white border border-gray-200 text-gray-500 text-xs font-medium py-1.5 rounded hover:bg-gray-50 hover:text-gray-700 transition flex items-center justify-center gap-1"
                >
                  <Check size={12} /> Mark Read
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32 text-gray-400">
            <Check size={20} className="mb-2 opacity-50" />
            <p className="text-xs">
              No new announcements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAnnouncements;

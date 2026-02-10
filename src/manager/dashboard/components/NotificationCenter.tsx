import React, { useState } from 'react';
import { Send, Megaphone, AlertCircle, Check } from 'lucide-react';
import staffService from '../../../services/staff.service';
import toast from 'react-hot-toast';

const NotificationCenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await staffService.getAnnouncements();
      setLogs(data || []);
    } catch (error) {
      console.error("Failed to load logs", error);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      try {
        setLoading(true);
        await staffService.sendAnnouncement(message);
        setSent(true);
        toast.success('Announcement sent');
        fetchLogs(); // Refresh logs
        setTimeout(() => {
          setSent(false);
          setMessage('');
        }, 3000);
      } catch (error) {
        console.error(error);
        toast.error('Failed to send announcement');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">Notifications & Alerts</h3>
        <div className="bg-red-50 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-100 transition" title="Trigger Emergency Alert">
          <AlertCircle size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none placeholder-gray-400"
            rows={3}
            placeholder="Type announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
            <select className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-600">
              <option>All Students</option>
            </select>
            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition ${sent ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}
            >
              {loading ? '...' : (sent ? <Check size={12} /> : <Send size={12} />)}
              {sent ? 'Sent' : (loading ? 'Sending' : 'Send')}
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Logs</p>
          {logs.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No recent announcements</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-1 text-blue-500"><Megaphone size={14} /></div>
                <div>
                  <p className="text-xs text-gray-800">"{log.message}"</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.recipientCount} Recipients
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

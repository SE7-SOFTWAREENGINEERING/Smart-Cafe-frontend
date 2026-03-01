import React, { useState, useEffect } from 'react';
import { Megaphone, Check, Loader2 } from 'lucide-react';
import { getAnnouncements } from '../../../services/staff.service';

const StaffAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState<number[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
    // Poll every 30 seconds
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (id: number) => {
    setAcknowledged((prev) => [...prev, id]);
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !acknowledged.includes(a.notification_id)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-amber-600">
        <Megaphone size={18} />
        <h3 className="text-sm font-bold uppercase tracking-wider">Announcements</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-24 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : visibleAnnouncements.length > 0 ? (
          visibleAnnouncements.map((announcement) => (
            <div key={announcement.notification_id} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {announcement.message}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 text-right">
                {new Date(announcement.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

              <button
                onClick={() => handleAcknowledge(announcement.notification_id)}
                className="w-full mt-3 bg-white border border-gray-200 text-amber-600 text-xs font-medium py-2 rounded hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-1"
              >
                <Check size={12} /> Acknowledge
              </button>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
            <Check size={24} className="text-green-500 mb-2" />
            <p className="text-xs text-gray-500">All announcements acknowledged.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAnnouncements;

import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Megaphone, Trash2, Clock, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { sendAnnouncement } from '../../services/staff.service';

interface Announcement {
    id: number;
    message: string;
    isPriority: boolean;
    timestamp: string;
}

const StaffAnnouncements: React.FC = () => {
    const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([
        { id: 1, message: "Lunch service will be delayed by 10 mins due to maintenance.", isPriority: true, timestamp: "10 mins ago" },
        { id: 2, message: "Special Falafel Wrap available at Counter 3 today!", isPriority: false, timestamp: "1 hour ago" }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isPriority, setIsPriority] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleBroadcast = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);
        setSuccessMsg(null);
        try {
            const res = await sendAnnouncement(newMessage);

            const newAnnouncement: Announcement = {
                id: Date.now(),
                message: newMessage,
                isPriority,
                timestamp: "Just now"
            };

            setActiveAnnouncements([newAnnouncement, ...activeAnnouncements]);
            setSuccessMsg(`Broadcast sent to ${res.notificationsSent || 0} active users.`);
            setNewMessage("");
            setIsPriority(false);

            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (error) {
            console.error("Failed to broadcast", error);
            alert("Failed to broadcast announcement. Backend may be unreachable.");
        } finally {
            setLoading(false);
        }
    };

    const deleteAnnouncement = (id: number) => {
        // Ideally this hits a DELETE /staff/announcement/:id
        setActiveAnnouncements(activeAnnouncements.filter(a => a.id !== id));
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-sm text-gray-500 mt-1">Broadcast messages to students and staff.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Editor */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Megaphone size={18} className="text-blue-600" /> New Broadcast
                    </h3>

                    {successMsg && (
                        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <CheckCircle size={16} /> {successMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none disabled:bg-gray-50"
                                placeholder="e.g. Special menu available for lunch today..."
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isPriority}
                                    onChange={(e) => setIsPriority(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    disabled={loading}
                                />
                                <span className="text-sm text-gray-700">Mark as High Priority</span>
                            </label>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleBroadcast} disabled={!newMessage.trim() || loading}>
                                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                                {loading ? 'Broadcasting...' : 'Broadcast Message'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Preview List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        Active Announcements
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{activeAnnouncements.length}</span>
                    </h3>

                    <div className="space-y-3">
                        {activeAnnouncements.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                                No active announcements.
                            </div>
                        )}
                        {activeAnnouncements.map(announcement => (
                            <div key={announcement.id} className={cn("p-4 rounded-lg border bg-white shadow-sm flex gap-3 relative group", announcement.isPriority ? "border-red-100 bg-red-50/30" : "border-gray-100")}>
                                <div className={cn("shrink-0 mt-0.5", announcement.isPriority ? "text-red-500" : "text-blue-500")}>
                                    {announcement.isPriority ? <AlertTriangle size={18} /> : <Megaphone size={18} />}
                                </div>
                                <div className="flex-1">
                                    <p className={cn("text-sm text-gray-800", announcement.isPriority && "font-medium")}>{announcement.message}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        <Clock size={12} />
                                        <span>{announcement.timestamp}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteAnnouncement(announcement.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="Remove announcement"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAnnouncements;

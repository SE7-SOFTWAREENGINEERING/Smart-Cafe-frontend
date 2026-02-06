import React, { useState } from 'react';
import { Bell, Send, Megaphone, AlertCircle, Check } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
      }, 3000);
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
               <option>Staff Only</option>
               <option>Queue Only</option>
             </select>
             <button 
               onClick={handleSend}
               disabled={!message.trim()}
               className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition ${sent ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}
             >
               {sent ? <Check size={12} /> : <Send size={12} />}
               {sent ? 'Sent' : 'Send'}
             </button>
           </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Logs</p>
          <div className="flex gap-3 items-start">
             <div className="mt-1 text-blue-500"><Megaphone size={14} /></div>
             <div>
               <p className="text-xs text-gray-800">"Lunch service delayed by 10 mins."</p>
               <p className="text-[10px] text-gray-400">11:45 AM • All Students</p>
             </div>
          </div>
          <div className="flex gap-3 items-start">
             <div className="mt-1 text-green-500"><Bell size={14} /></div>
             <div>
               <p className="text-xs text-gray-800">"Special dessert available now!"</p>
               <p className="text-[10px] text-gray-400">12:15 PM • Queued Students</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

import React from 'react';
import Button from '../../components/common/Button';

const StaffAnnouncements: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Message</label>
          <textarea 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
            placeholder="e.g. Special menu available for lunch today..."
          />
        </div>
        
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Mark as High Priority</span>
            </label>
        </div>

        <div className="flex justify-end">
            <Button>Broadcast Message</Button>
        </div>
      </div>
    </div>
  );
};

export default StaffAnnouncements;

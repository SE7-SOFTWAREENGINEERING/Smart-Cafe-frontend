import React from 'react';

const StudentNotifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      <div className="bg-white divide-y divide-gray-100 rounded-xl shadow-sm border border-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 hover:bg-gray-50">
            <h4 className="font-medium text-gray-900">Booking Confirmed</h4>
            <p className="text-sm text-gray-500 mt-1">Your slot for Lunch at 12:30 PM is confirmed.</p>
            <span className="text-xs text-gray-400 mt-2 block">2 hours ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;

import React from 'react';

const AdminCapacity: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Capacity & Priority</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4">Slot Configuration</h3>
        {/* Placeholder controls */}
        <div className="space-y-4 max-w-md">
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Max Capacity per Slot</span>
                <input type="number" className="border border-gray-300 rounded px-2 py-1 w-24" value="200" readOnly />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Priority Pass Quota</span>
                <input type="number" className="border border-gray-300 rounded px-2 py-1 w-24" value="20" readOnly />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;

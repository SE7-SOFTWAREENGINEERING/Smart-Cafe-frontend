import React from 'react';
import { Users, UserPlus, Briefcase, MoreHorizontal } from 'lucide-react';

const StaffControls: React.FC = () => {
  const staff = [
    { name: 'Ravi Kumar', role: 'Counter 1', status: 'Active', workload: 'High' },
    { name: 'Anita Singh', role: 'Kitchen', status: 'Active', workload: 'Normal' },
    { name: 'Rajesh D.', role: 'Cleaning', status: 'Break', workload: 'Low' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Staff on Duty</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {staff.map((member, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {member.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
          <UserPlus size={14} /> Assign Staff
        </button>
        <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
          <Briefcase size={14} /> View Roster
        </button>
      </div>
    </div>
  );
};

export default StaffControls;

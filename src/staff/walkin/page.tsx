import React from 'react';
import Button from '../../components/common/Button';
import { UserPlus } from 'lucide-react';

const StaffWalkin: React.FC = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Issue Walk-in Token</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
        <div className="flex gap-4 mb-8">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className="w-12 h-12 rounded-full border border-gray-300 hover:border-blue-500 hover:bg-blue-50 focus:ring-2 ring-blue-500 transition-all font-medium text-gray-700">
              {n}
            </button>
          ))}
        </div>

        <Button className="w-full h-12 text-lg">
          <UserPlus className="mr-2" />
          Generate Token
        </Button>
      </div>
    </div>
  );
};

export default StaffWalkin;

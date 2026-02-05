import React from 'react';
import { CreditCard, Calendar, Leaf } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock data - in real app this comes from context/api
  const booking = null; // { time: '12:30 PM', status: 'Confirmed' }
  const walletBalance = 450.00;
  const ecoScore = 850;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your cafeteria overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Booking Card */}
        <div className={`p-6 rounded-xl shadow-sm border ${booking ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Current Booking</h3>
            <Calendar size={20} className={booking ? 'text-blue-600' : 'text-gray-400'} />
          </div>
          {booking ? (
            <div>
              <p className="text-2xl font-bold text-blue-900">12:30 PM</p>
              <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded-full mt-2">
                Confirmed
              </span>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-gray-700">No active booking</p>
              <p className="text-sm text-gray-400 mt-1">Book a slot to skip the queue.</p>
            </div>
          )}
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Wallet Balance</h3>
            <CreditCard size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹ {walletBalance.toFixed(2)}</p>
          <button className="text-sm text-blue-600 font-medium mt-2 hover:underline">
            + Add Money
          </button>
        </div>

        {/* Sustainability Score Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Sustainability Score</h3>
            <Leaf size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{ecoScore} pts</p>
          <p className="text-sm text-gray-400 mt-1">Top 15% of students!</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, QrCode, Bell, ChevronRight,
  Calendar, Coffee, MapPin, ShoppingBag
} from 'lucide-react';
import Button from '../../components/common/Button';

const StudentDashboard: React.FC = () => {
  // Mock Data
  const studentName = "Siddharth";
  const mealTime = "Lunch Time"; // Dynamic based on time
  const hasBooking = true; // Toggle for demo

  const tokenDetails = {
    tokenNo: "T-142",
    slot: "12:30 PM - 12:45 PM",
    items: ["Veg Meal", "Lime Juice"],
    status: "Confirmed"
  };

  const notifications = [
    { id: 1, text: "Your order T-142 is ready for pickup!", time: "2m ago", urgent: true },
    { id: 2, text: "New menu items added for tomorrow.", time: "1h ago", urgent: false }
  ];

  return (
    <div className="space-y-6 pb-20"> {/* pb-20 for bottom nav if exists */}

      {/* 1. Header & Welcome */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi, {studentName} 👋</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Clock size={16} />
            <span className="text-sm font-medium">{mealTime}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/student/cart" className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ShoppingBag size={20} className="text-gray-700" />
          </Link>
          <Link to="/student/notifications" className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Bell size={20} className="text-gray-700" />
            {notifications.some(n => n.urgent) && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Today's Booking Status */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Your Token</h2>
          {hasBooking && (
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
              {tokenDetails.status}
            </span>
          )}
        </div>

        {hasBooking ? (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Token Number</p>
                <h3 className="text-4xl font-bold mb-4">{tokenDetails.tokenNo}</h3>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Calendar size={16} />
                    <span>Today, {tokenDetails.slot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <MapPin size={16} />
                    <span>Main Cafeteria</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QrCode size={80} className="text-gray-900" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-500/30">
              <p className="text-xs text-blue-200 truncate">
                Items: {tokenDetails.items.join(", ")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Coffee size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">No active booking</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Hungry? Book a slot to skip the queue.</p>
            <Link to="/student/booking">
              <Button size="sm">Book Now</Button>
            </Link>
          </div>
        )}
      </section>

      {/* 3. Canteen Selection (Replaces Quick Actions) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Select Canteen</h2>
          <Link to="/student/queue" className="text-sm font-medium text-blue-600 hover:text-blue-700">View Queues</Link>
        </div>

        <div className="space-y-3">
          {/* Sopanam */}
          <Link to="/student/booking?canteenId=c1" className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-8 -mt-8 group-hover:bg-orange-100 transition-colors"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">S</div>
                <div>
                  <h3 className="font-bold text-gray-900">Sopanam</h3>
                  <p className="text-xs text-green-600 font-medium mt-0.5">Open • High Crowd</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>

          {/* Prasada */}
          <Link to="/student/booking?canteenId=c2" className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8 group-hover:bg-green-100 transition-colors"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">P</div>
                <div>
                  <h3 className="font-bold text-gray-900">Prasada</h3>
                  <p className="text-xs text-green-600 font-medium mt-0.5">Open • Medium Crowd</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-green-500 transition-colors" />
            </div>
          </Link>

          {/* Samudra */}
          <Link to="/student/booking?canteenId=c3" className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 group-hover:bg-blue-100 transition-colors"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">S</div>
                <div>
                  <h3 className="font-bold text-gray-900">Samudra</h3>
                  <p className="text-xs text-red-500 font-medium mt-0.5">Closing Soon • Low Crowd</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Notification Preview */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
          <Link to="/student/notifications" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        <div className="space-y-3">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-xl border flex gap-3 ${notif.urgent ? "bg-red-50 border-red-100" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className={`mt-0.5 w-2 h-2 rounded-full ${notif.urgent ? "bg-red-500" : "bg-blue-500"}`}></div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${notif.urgent ? "text-red-900" : "text-gray-900"}`}>
                  {notif.text}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 self-center" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default StudentDashboard;

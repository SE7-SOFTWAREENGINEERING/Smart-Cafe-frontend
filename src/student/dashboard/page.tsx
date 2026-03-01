import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, QrCode, Bell, ChevronRight,
  Calendar, MapPin, ShoppingBag
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../store/auth.store';
import { getUserBookings } from '../../services/booking.service';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  // Ensure we have a default user name if context is loading or empty
  const studentName = user?.name || "Student";

  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    fetchActiveBooking();
  }, []);

  const fetchActiveBooking = async () => {
    try {
      const bookings = await getUserBookings(true); // Fetch upcoming
      if (bookings && bookings.length > 0) {
        // Map backend response to UI structure
        // Taking the most recent upcoming booking
        const latest = bookings[0];
        setActiveBooking({
          id: latest.bookingId,
          status: latest.status,
          token: {
            tokenId: latest.token?.tokenId || '---',
            qrCodeImage: latest.token?.qrCode || ''
          },
          mealType: latest.mealType,
          slotTime: new Date(latest.slotTime),
          endTime: new Date(new Date(latest.slotTime).getTime() + 15 * 60000), // +15 mins
          canteenName: 'Sopanam', // Default for now
          items: [latest.mealType || 'Standard Meal']
        });
      }
    } catch (err) {
      console.error("Failed to fetch booking", err);
    }
  };

  // Mock Canteens
  const canteens = [
    { id: 'c1', name: 'Sopanam', initial: 'S', color: 'orange', status: 'Open', crowd: 'High Crowd' },
    { id: 'c2', name: 'Prasada', initial: 'P', color: 'green', status: 'Open', crowd: 'Medium Crowd' },
    { id: 'c3', name: 'Samudra', initial: 'S', color: 'red', status: 'Closing Soon', crowd: 'Low Crowd' },
  ];

  const getTimeString = () => "Lunch Time"; // Static for screenshot match

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* 1. Header Area with Greeting & Actions */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Hi, {studentName} <span className="text-2xl">👋</span>
          </h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Clock size={16} />
            <span className="text-sm font-medium">{getTimeString()}</span>
          </div>
        </div>

        {/* Top Right Icons (Wallet/Notifs) - Visual Only from screenshot */}
        <div className="flex gap-3">
          <Link to="/student/cart" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
          </Link>
          <Link to="/student/notifications" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Link>
        </div>
      </header>

      {/* 2. Your Token Card */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">Your Token</h2>
          {activeBooking && (
            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {activeBooking.status}
            </span>
          )}
        </div>

        {activeBooking ? (
          <div className="bg-[#ea580c] text-white rounded-xl shadow-lg relative overflow-hidden">
            {/* Main Card Content */}
            <div className="p-6 flex justify-between items-center relative z-10">
              <div className="space-y-4">
                <div>
                  <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">TOKEN NUMBER</p>
                  <h3 className="text-6xl font-bold tracking-tight">T-{activeBooking.token.tokenId}</h3>
                </div>

                <div className="space-y-1 mt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                    <Calendar size={16} />
                    <span>
                      {activeBooking.slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {activeBooking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                    <MapPin size={16} />
                    <span>{activeBooking.canteenName}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded-xl shadow-sm">
                {activeBooking.token.qrCodeImage ? (
                  <img src={activeBooking.token.qrCodeImage} alt="QR" className="w-24 h-24" />
                ) : (
                  <QrCode size={100} className="text-gray-900" />
                )}
              </div>
            </div>

            {/* Bottom Strip (Items) */}
            <div className="bg-black/10 px-6 py-3 mt-2 backdrop-blur-sm border-t border-white/10">
              <p className="text-xs text-orange-50 font-medium">
                Items: {activeBooking.items.join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 mb-4">No active booking found.</p>
            <Link to="/student/booking">
              <Button>Book a Slot Now</Button>
            </Link>
          </div>
        )}
      </section>

      {/* 3. Select Canteen */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Select Canteen</h2>
          <Link to="/student/queue" className="text-sm font-bold text-orange-600 hover:text-orange-700">View Queues</Link>
        </div>

        <div className="grid gap-3">
          {canteens.map((canteen) => (
            <Link
              key={canteen.id}
              to={`/student/booking?canteenId=${canteen.id}`}
              className="group block bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Logo/Initial */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold 
                        ${canteen.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                      canteen.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'}`}>
                    {canteen.initial}
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{canteen.name}</h3>
                    <p className={`text-xs font-semibold mt-0.5
                             ${canteen.status === 'Open' ? 'text-green-600' : 'text-red-500'}`}>
                      {canteen.status} • <span className={
                        canteen.crowd.includes('High') ? 'text-orange-600' :
                          canteen.crowd.includes('Medium') ? 'text-yellow-600' : 'text-green-600'
                      }>{canteen.crowd}</span>
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default StudentDashboard;

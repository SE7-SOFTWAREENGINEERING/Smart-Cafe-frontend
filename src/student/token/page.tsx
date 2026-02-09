import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
    CheckCircle, QrCode, Download, Home, Info,
    MapPin, Clock, Calendar
} from 'lucide-react';

const StudentToken: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // In a real app, we'd fetch this from ID or state
    const orderDetails = {
        id: location.state?.orderId || '#ORD-9821',
        slot: location.state?.slotTime || '12:30 PM',
        canteen: location.state?.canteen || 'Sopanam',
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        items: location.state?.items || [],
        totalPrice: location.state?.totalPrice || 0,
        fairnessReason: "You booked 2 hours in advance, securing priority access over walk-ins."
    };

    const itemSummary = orderDetails.items.length > 0
        ? orderDetails.items.map((i: any) => `${i.quantity} x ${i.name}`).join(', ')
        : "Standard Meal";

    return (
        <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-center">

            <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-6 relative overflow-hidden">
                {/* Success Banner */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>

                <div className="space-y-2">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-short">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-xs px-4">{itemSummary}</p>
                </div>

                <div className="border-t border-b border-gray-100 py-6 space-y-4">
                    {/* QR Code Placeholder */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl inline-block shadow-lg">
                        <QrCode size={120} />
                    </div>
                    <p className="text-xs font-mono text-gray-400">Scan at Counter</p>

                    <div className="bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-700">
                        Order ID: <span className="font-bold text-gray-900">{orderDetails.id}</span>
                        {orderDetails.totalPrice > 0 && (
                            <>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="font-bold text-brand">₹{orderDetails.totalPrice}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="text-brand" size={18} />
                        <span className="text-lg font-bold text-gray-900">{orderDetails.slot}</span>
                        <span className="text-xs bg-brand-light text-brand px-2 py-0.5 rounded"> today</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="text-red-500" size={18} />
                        <span>{orderDetails.canteen} Canteen</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="text-orange-500" size={18} />
                        <span>{orderDetails.date}</span>
                    </div>

                    <div className="h-px bg-gray-100 my-4"></div>

                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Token Number</span>
                        <span className="text-sm text-gray-500">Wait Time</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">A-24</span>
                        <span className="text-lg font-bold text-brand">~15m</span>
                    </div>
                </div>

                <div className="bg-brand-light border border-brand/20 rounded-xl p-3 text-left flex gap-3">
                    <Info size={18} className="text-brand shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-brand uppercase tracking-wide mb-1">Why this slot?</p>
                        <p className="text-xs text-brand leading-relaxed">
                            {orderDetails.fairnessReason}
                        </p>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="w-full max-w-sm mt-8 space-y-3">
                <Button variant="secondary" className="w-full flex justify-center items-center gap-2">
                    <Download size={18} />
                    Download Ticket
                </Button>
                <Button
                    className="w-full flex justify-center items-center gap-2"
                    onClick={() => navigate('/student/dashboard')}
                >
                    <Home size={18} />
                    Back to Dashboard
                </Button>
            </div>

        </div>
    );
};

export default StudentToken;

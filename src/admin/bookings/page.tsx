import React, { useState } from 'react';
import { Clock, Sliders, AlertTriangle, UserPlus, Ban, Eye, Search, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';

interface Slot {
    id: string;
    time: string;
    capacity: number;
    booked: number;
    status: 'Open' | 'Full' | 'Cancelled' | 'FastFilling';
}

const MOCK_SLOTS: Slot[] = [
    { id: '1', time: '08:00 AM', capacity: 200, booked: 45, status: 'Open' },
    { id: '2', time: '08:15 AM', capacity: 200, booked: 180, status: 'FastFilling' },
    { id: '3', time: '08:30 AM', capacity: 200, booked: 200, status: 'Full' },
    { id: '4', time: '08:45 AM', capacity: 200, booked: 198, status: 'Full' },
    { id: '5', time: '09:00 AM', capacity: 200, booked: 120, status: 'Open' },
    { id: '6', time: '09:15 AM', capacity: 0, booked: 0, status: 'Cancelled' },
];

const AdminBookings: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [slots, setSlots] = useState(MOCK_SLOTS);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const handleCancelSlot = (id: string) => {
        if (window.confirm('Emergency Cancel: Are you sure you want to cancel this slot? All existing bookings will be notified.')) {
            setSlots(slots.map(s => s.id === id ? { ...s, status: 'Cancelled', capacity: 0 } : s));
            setSelectedSlot(null);
        }
    };

    const handleOverrideBooking = () => {
        if (selectedSlot) {
            const count = prompt("Enter number of bookings to force add:");
            if (count) {
                const toAdd = parseInt(count);
                setSlots(slots.map(s => s.id === selectedSlot.id ? { ...s, booked: s.booked + toAdd } : s));
                alert("Bookings force-added successfully.");
            }
        }
    };

    const handleCapacityOverride = () => {
        if (selectedSlot) {
            const newCap = prompt("Enter new capacity limit for this slot:", selectedSlot.capacity.toString());
            if (newCap) {
                setSlots(slots.map(s => s.id === selectedSlot.id ? { ...s, capacity: parseInt(newCap) } : s));
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Slot Operations</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor occupancy, manage slots, and handle emergencies.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Button variant="secondary">
                        <Search size={16} className="mr-2" />
                        Find Booking
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Slot Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={18} />
                            Live Slot Status
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {slots.map(slot => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                        "p-3 rounded-lg border text-left transition-all relative overflow-hidden",
                                        selectedSlot?.id === slot.id ? "ring-2 ring-blue-500 ring-offset-1" : "",
                                        slot.status === 'Cancelled' ? "bg-gray-100 border-gray-200 text-gray-400" :
                                            slot.status === 'Full' ? "bg-red-50 border-red-100 text-red-700" :
                                                slot.status === 'FastFilling' ? "bg-orange-50 border-orange-100 text-orange-700" :
                                                    "bg-green-50 border-green-100 text-green-700"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm">{slot.time}</span>
                                        {slot.status === 'Cancelled' && <Ban size={14} />}
                                        {slot.status === 'Full' && <AlertCircle size={14} />}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-semibold text-lg">{slot.booked}</span>
                                        <span className="opacity-70"> / {slot.capacity > 0 ? slot.capacity : '-'}</span>
                                    </div>
                                    {/* Progress Bar */}
                                    {slot.status !== 'Cancelled' && (
                                        <div className="w-full h-1 bg-black/5 mt-2 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full",
                                                    slot.status === 'Full' ? "bg-red-500" :
                                                        slot.status === 'FastFilling' ? "bg-orange-500" : "bg-green-500"
                                                )}
                                                style={{ width: `${Math.min((slot.booked / slot.capacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        {selectedSlot ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedSlot.time} Slot</h3>
                                    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold uppercase mt-1 inline-block",
                                        selectedSlot.status === 'Cancelled' ? "bg-gray-100 text-gray-600" :
                                            selectedSlot.status === 'Full' ? "bg-red-100 text-red-600" :
                                                "bg-green-100 text-green-600"
                                    )}>
                                        {selectedSlot.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full justify-start" variant="secondary" onClick={() => alert('View list mock')}>
                                        <Eye size={16} className="mr-2" />
                                        View Bookings
                                    </Button>
                                    <Button className="w-full justify-start" variant="secondary" onClick={handleCapacityOverride}>
                                        <Sliders size={16} className="mr-2" />
                                        Adjust Capacity
                                    </Button>
                                    <Button className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50" variant="secondary" onClick={handleOverrideBooking}>
                                        <UserPlus size={16} className="mr-2" />
                                        Override & Add
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                                        <AlertTriangle size={16} />
                                        Emergency Zone
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-3">Cancelling a slot will notify all booked users and refund tokens.</p>
                                    <Button
                                        className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent"
                                        variant="danger"
                                        disabled={selectedSlot.status === 'Cancelled'}
                                        onClick={() => handleCancelSlot(selectedSlot.id)}
                                    >
                                        Cancel Slot
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                <Clock size={48} className="mb-4 opacity-20" />
                                <p>Select a slot from the grid to manage operations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;

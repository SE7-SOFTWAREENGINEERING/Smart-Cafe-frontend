import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
    ArrowLeft, Clock, Info, CheckCircle, AlertTriangle, Loader
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getSlots, bookSlot } from '../../services/booking.service';
import { useAuth } from '../../store/auth.store';
import { useCart } from '../../store/cart.store';
import toast from 'react-hot-toast';

interface TimeSlot {
    id: string;
    time: string;
    capacity: number;
    booked: number;
    status: 'available' | 'filling-fast' | 'full';
}

const StudentSlots: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, totalPrice, clearCart } = useCart();

    // State
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    // Fetch Slots
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const data = await getSlots();
                // Map backend data to UI model
                const mappedSlots: TimeSlot[] = data.map(s => {
                    const isFull = s.booked >= s.capacity;
                    const isFilling = !isFull && s.booked >= (s.capacity * 0.8);

                    return {
                        id: s._id, // This is the ISO time string from backend
                        time: s.time, // Formatted time from service
                        capacity: s.capacity,
                        booked: s.booked,
                        status: isFull ? 'full' : isFilling ? 'filling-fast' : 'available'
                    };
                });
                setSlots(mappedSlots);
            } catch (error) {
                console.error("Failed to fetch slots", error);
                toast.error("Failed to load time slots. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, []);

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.status === 'full') return;
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const confirmBooking = async () => {
        if (!selectedSlot || !user) return;
        setIsBooking(true);

        try {
            // Call API
            const itemNames = items.map(i => i.name);
            await bookSlot(selectedSlot.id, user.id, 'Lunch', itemNames);

            toast.success("Booking confirmed!");
            setIsModalOpen(false);

            const bookingDetails = {
                orderId: `#ORD-${Math.floor(Math.random() * 10000)}`,
                slotTime: selectedSlot.time,
                items: items,
                totalPrice: totalPrice,
                canteen: 'Sopanam'
            };

            clearCart();

            // Navigate to Success
            navigate('/student/token', {
                state: bookingDetails
            });
        } catch (error: any) {
            console.error("Booking failed", error);
            const msg = error.response?.data?.message || "Failed to book slot. Please try another.";
            toast.error(msg);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-24 space-y-6">

            {/* 1. Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Select Time Slot</h1>
                    <p className="text-sm text-gray-500">Choose a pickup time to skip the queue.</p>
                </div>
            </header>

            {/* 2. Legend */}
            <div className="flex flex-wrap gap-3 text-xs bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-gray-600 font-medium">Filling Fast</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    <span className="text-gray-600 font-medium">Full</span>
                </div>
            </div>

            {/* 3. Slot Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin text-orange-500" size={32} />
                </div>
            ) : slots.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Clock size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No slots available for today.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {slots.map(slot => {
                        const isFull = slot.status === 'full';
                        const isFilling = slot.status === 'filling-fast';
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                            <button
                                key={slot.id}
                                disabled={isFull}
                                onClick={() => handleSlotClick(slot)}
                                className={cn(
                                    "relative p-4 rounded-xl border text-left transition-all overflow-hidden group",
                                    isSelected
                                        ? "border-orange-500 ring-2 ring-orange-500 bg-orange-50"
                                        : isFull
                                            ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                                            : "bg-white border-gray-200 hover:border-orange-300 hover:shadow-md"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className={cn("font-bold text-lg", isFull ? "text-gray-400" : "text-gray-900")}>
                                        {slot.time}
                                    </span>
                                    {isSelected && <CheckCircle size={18} className="text-orange-600" />}
                                    {isFilling && !isSelected && <AlertTriangle size={16} className="text-orange-500" />}
                                </div>

                                <div className="relative z-10">
                                    <p className={cn(
                                        "text-xs font-bold mt-1 transition-colors uppercase tracking-wider",
                                        isFull ? "text-red-500" : isFilling ? "text-orange-600" : "text-green-600"
                                    )}>
                                        {isFull ? "Booked Out" : isFilling ? "Filling Fast" : "Available"}
                                    </p>

                                    {/* Progress bar */}
                                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                isFull ? "bg-red-300" : isFilling ? "bg-orange-400" : "bg-green-500"
                                            )}
                                            style={{ width: `${Math.min((slot.booked / slot.capacity) * 100, 100)}%` }}
                                        ></div>
                                    </div>

                                    <p className="text-[10px] text-gray-400 mt-1.5 text-right">
                                        {slot.capacity - slot.booked} spots left
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 4. Tips */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                <Info size={20} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Token expires 15 mins after the slot time. Late arrivals may lose their priority queue access.
                </p>
            </div>

            {/* Confirmation Modal */}
            {selectedSlot && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Confirm Order"
                    footer={
                        <div className="flex gap-3 justify-end">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={confirmBooking}
                                isLoading={isBooking}
                                className="bg-[#ea580c] hover:bg-[#c2410c] text-white"
                            >
                                Pay & Book
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-4 text-center py-4">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Clock size={32} />
                        </div>

                        <div>
                            <p className="text-gray-500 font-medium">You are booking a slot at</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{selectedSlot.time}</h3>
                        </div>

                        <p className="text-sm text-gray-500 border-t border-gray-100 pt-4 mt-4">
                            Total Amount: <span className="text-gray-900 font-bold">₹{totalPrice}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Slot Queue Position: <span className="text-gray-900 font-bold">#{selectedSlot.booked + 1}</span>
                        </p>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default StudentSlots;

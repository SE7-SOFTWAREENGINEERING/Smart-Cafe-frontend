import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
    ArrowLeft, Clock, Info, CheckCircle, AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface TimeSlot {
    id: string;
    time: string;
    capacity: number;
    booked: number;
    status: 'available' | 'filling-fast' | 'full';
}

const MOCK_SLOTS: TimeSlot[] = [
    { id: '1', time: '12:00 PM', capacity: 50, booked: 48, status: 'full' },
    { id: '2', time: '12:15 PM', capacity: 50, booked: 42, status: 'filling-fast' },
    { id: '3', time: '12:30 PM', capacity: 50, booked: 20, status: 'available' },
    { id: '4', time: '12:45 PM', capacity: 50, booked: 10, status: 'available' },
    { id: '5', time: '01:00 PM', capacity: 50, booked: 5, status: 'available' },
    { id: '6', time: '01:15 PM', capacity: 50, booked: 0, status: 'available' },
];

const StudentSlots: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.status === 'full') return;
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const confirmBooking = async () => {
        if (!selectedSlot) return;
        setIsBooking(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsBooking(false);
        setIsModalOpen(false);

        // Navigate to Success
        navigate('/student/token', {
            state: {
                slotTime: selectedSlot.time,
                orderId: `#ORD-${Math.floor(Math.random() * 10000)}`
            }
        });
    };

    return (
        <div className="pb-24 space-y-6">

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
            <div className="flex flex-wrap gap-3 text-xs bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-gray-600">Filling Fast</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                    <span className="text-gray-600">Full</span>
                </div>
            </div>

            {/* 3. Slot Grid */}
            <div className="grid grid-cols-2 gap-3">
                {MOCK_SLOTS.map(slot => {
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
                                    ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50"
                                    : isFull
                                        ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className={cn("font-bold text-lg", isFull ? "text-gray-400" : "text-gray-900")}>
                                    {slot.time}
                                </span>
                                {isSelected && <CheckCircle size={18} className="text-brand" />}
                                {isFilling && !isSelected && <AlertTriangle size={16} className="text-orange-500" />}
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">Availability</span>
                                    <span className={cn(
                                        "font-medium",
                                        isFull ? "text-red-500" : isFilling ? "text-orange-600" : "text-green-600"
                                    )}>
                                        {((slot.capacity - slot.booked) / slot.capacity * 100).toFixed(0)}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            isFull ? "bg-red-300" : isFilling ? "bg-orange-400" : "bg-green-500"
                                        )}
                                        style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 4. Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Tokens are valid for 15 mins only. Late arrivals may loose their priority.
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
                            <Button onClick={confirmBooking} isLoading={isBooking}>Pay & Book</Button>
                        </div>
                    }
                >
                    <div className="space-y-4 text-center py-2">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} />
                        </div>

                        <div>
                            <p className="text-gray-500">You are booking a slot at</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{selectedSlot.time}</h3>
                        </div>

                        <p className="text-sm text-gray-500 border-t pt-4 mt-4">
                            Total Amount to Pay: <span className="text-gray-900 font-bold">₹280</span>
                        </p>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default StudentSlots;

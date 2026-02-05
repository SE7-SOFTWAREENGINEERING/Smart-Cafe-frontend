import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Info } from 'lucide-react';
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

const StudentBooking: React.FC = () => {
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsBooking(false);
    setIsModalOpen(false);
    alert('Booking Confirmed for ' + selectedSlot.time);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book a Slot</h1>
          <p className="text-gray-500 text-sm mt-1">Select a time to skip the long queues.</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm w-fit">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></span> Filling Fast
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></span> Full
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_SLOTS.map((slot) => {
          const isFull = slot.status === 'full';
          const isFilling = slot.status === 'filling-fast';
          
          return (
            <button
              key={slot.id}
              disabled={isFull}
              onClick={() => handleSlotClick(slot)}
              className={cn(
                "relative p-4 rounded-xl border text-left transition-all",
                isFull 
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-70" 
                  : isFilling
                    ? "bg-orange-50 border-orange-200 hover:shadow-md hover:border-orange-300"
                    : "bg-white border-green-200 hover:shadow-md hover:border-green-300"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "font-bold text-lg",
                  isFull ? "text-gray-500" : "text-gray-900"
                )}>
                  {slot.time}
                </span>
                {isFilling && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    Fast
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-gray-500">Capacity</span>
                <span className={cn(
                  "font-medium",
                  isFull ? "text-red-500" : "text-gray-700"
                )}>
                  {slot.booked}/{slot.capacity}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    isFull ? "bg-gray-400" : isFilling ? "bg-orange-500" : "bg-green-500"
                  )}
                  style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Booking"
          footer={
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmBooking} isLoading={isBooking}>
                Confirm Slot
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
              <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Booking Rules</h4>
                <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc pl-3">
                  <li>Please arrive 5 minutes before your slot.</li>
                  <li>Booking is valid for 15 minutes only.</li>
                  <li>Missed slots affect your sustainability score.</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center py-4">
              <p className="text-gray-500">You are booking a slot for</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{selectedSlot.time}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentBooking;

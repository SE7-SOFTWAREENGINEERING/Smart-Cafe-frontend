import React, { useState } from 'react';
import { Clock, Sliders, AlertTriangle, UserPlus, Ban, Eye, Search, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';

import { getLiveSlots, updateSlotCapacity, toggleSlotStatus, getSlotBookings, addWalkInBookings } from '../../services/slot.service';
import toast from 'react-hot-toast';

interface Slot {
    id: string;
    time: string;
    capacity: number;
    booked: number;
    status: 'Open' | 'Full' | 'Cancelled' | 'FastFilling';
    isActive: boolean;
}

// Removed MOCK_SLOTS

const AdminBookings: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);

    // New state for bookings modal
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [slotBookings, setSlotBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const data = await getLiveSlots(selectedDate);
            setSlots(data);
        } catch (error) {
            toast.error('Failed to load slots');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const handleCancelSlot = async (id: string) => {
        if (window.confirm('Emergency Cancel: Are you sure you want to cancel this slot? All existing bookings will be notified.')) {
            try {
                await toggleSlotStatus(id);
                toast.success('Slot status updated');
                fetchSlots();
                setSelectedSlot(null);
            } catch (error) {
                toast.error('Failed to cancel slot');
            }
        }
    };

    const handleOverrideBooking = async () => {
        if (selectedSlot) {
            const count = prompt("Enter number of bookings to force add (Walk-in):");
            if (count) {
                const toAdd = parseInt(count);
                if (isNaN(toAdd) || toAdd <= 0) return toast.error('Invalid number');

                try {
                    await addWalkInBookings(selectedSlot.id, toAdd);
                    toast.success('Bookings force-added successfully');
                    fetchSlots();
                } catch (error) {
                    toast.error('Failed to add bookings');
                }
            }
        }
    };

    const handleViewBookings = async () => {
        if (!selectedSlot) return;
        setShowBookingsModal(true);
        setLoadingBookings(true);
        try {
            const data = await getSlotBookings(selectedSlot.id);
            setSlotBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleCapacityOverride = async () => {
        if (selectedSlot) {
            const newCap = prompt("Enter new capacity limit for this slot:", selectedSlot.capacity.toString());
            if (newCap) {
                try {
                    await updateSlotCapacity(selectedSlot.id, parseInt(newCap));
                    toast.success('Capacity updated');
                    fetchSlots();
                } catch (error) {
                    toast.error('Failed to update capacity');
                }
            }
        }
    };

    const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
    const [newSlotData, setNewSlotData] = useState({ time: '12:00', maxCapacity: 50 });

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Service expects date, time, capacity
            // using selectedDate
            await import('../../services/slot.service').then(m => m.createSlot(selectedDate, newSlotData.time, newSlotData.maxCapacity));
            toast.success('Slot created successfully');
            setShowCreateSlotModal(false);
            fetchSlots();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create slot');
        }
    };

    const handleDeleteSlot = async () => {
        if (selectedSlot && window.confirm('Are you sure you want to permanently delete this slot?')) {
            try {
                await import('../../services/slot.service').then(m => m.deleteSlot(selectedSlot.id));
                toast.success('Slot deleted');
                setSelectedSlot(null);
                fetchSlots();
            } catch (error) {
                toast.error('Failed to delete slot');
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
                    <Button size="sm" onClick={() => setShowCreateSlotModal(true)}>
                        <UserPlus size={16} className="mr-2" />
                        Add Slot
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
                            {loading && <span className="text-xs text-blue-500 font-normal animate-pulse ml-2">Updating...</span>}
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
                                                slot.status === 'FastFilling' ? "bg-amber-50 border-amber-100 text-amber-700" :
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
                                                        slot.status === 'FastFilling' ? "bg-amber-500" : "bg-green-500"
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
                                    <Button className="w-full justify-start" variant="secondary" onClick={handleViewBookings}>
                                        <Eye size={16} className="mr-2" />
                                        View Bookings
                                    </Button>
                                    <Button className="w-full justify-start" variant="secondary" onClick={handleCapacityOverride}>
                                        <Sliders size={16} className="mr-2" />
                                        Adjust Capacity
                                    </Button>
                                    <Button className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50" variant="secondary" onClick={handleOverrideBooking}>
                                        <UserPlus size={16} className="mr-2" />
                                        Override & Add
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-gray-100 space-y-3">
                                    <Button
                                        className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent"
                                        variant="danger"
                                        disabled={selectedSlot.status === 'Cancelled'}
                                        onClick={() => handleCancelSlot(selectedSlot.id)}
                                    >
                                        Cancel Slot (Emergency)
                                    </Button>
                                    <Button
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                        variant="secondary"
                                        onClick={handleDeleteSlot}
                                    >
                                        Delete Slot Permanently
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

            {/* Bookings Modal */}
            {showBookingsModal && selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Bookings for {selectedSlot.time}</h3>
                            <button onClick={() => setShowBookingsModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {loadingBookings ? (
                                <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                            ) : slotBookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No bookings found for this slot.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2">ID</th>
                                            <th className="px-4 py-2">User</th>
                                            <th className="px-4 py-2">Role</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slotBookings.map((booking) => (
                                            <tr key={booking.bookingId} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">#{booking.bookingId}</td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{booking.userName}</div>
                                                    <div className="text-xs text-gray-500">{booking.userEmail}</div>
                                                </td>
                                                <td className="px-4 py-3">{booking.role}</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",
                                                        booking.status === 'Booked' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                    )}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <Button variant="secondary" onClick={() => setShowBookingsModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Slot Modal */}
            {showCreateSlotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Slot</h3>
                        <form onSubmit={handleCreateSlot} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newSlotData.time}
                                    onChange={e => setNewSlotData({ ...newSlotData, time: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newSlotData.maxCapacity}
                                    onChange={e => setNewSlotData({ ...newSlotData, maxCapacity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setShowCreateSlotModal(false)} type="button">Cancel</Button>
                                <Button type="submit">Create Slot</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;

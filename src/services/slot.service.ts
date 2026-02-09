import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface Slot {
    id: string;
    time: string;
    capacity: number;
    booked: number;
    status: 'Open' | 'Full' | 'Cancelled' | 'FastFilling';
    isActive: boolean;
}

export const getLiveSlots = async (date: string): Promise<Slot[]> => {
    try {
        const token = localStorage.getItem('token');
        // Default to LUNCH or determine based on time, but for now fetch all or just pass generic params if backend supports
        // Backend live-capacity supports date/mealType optional.
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/slots/live-capacity`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { date }
        });

        return response.data.data.slots.map((s: any) => {
            let status: 'Open' | 'Full' | 'Cancelled' | 'FastFilling' = 'Open';
            if (!s.isActive) status = 'Cancelled';
            else if (s.isFull) status = 'Full';
            else if ((s.currentCount / s.maxCapacity) > 0.8) status = 'FastFilling';

            return {
                id: s.slotId,
                time: s.slotStart,
                capacity: s.maxCapacity,
                booked: s.currentCount,
                status,
                isActive: s.isActive
            };
        });
    } catch (error) {
        console.error('Error fetching live slots:', error);
        throw error;
    }
};

export const updateSlotCapacity = async (slotId: string, newCapacity: number): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/slots/${slotId}/capacity`,
            { maxCapacity: newCapacity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error updating slot capacity:', error);
        throw error;
    }
};

export const toggleSlotStatus = async (slotId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/slots/${slotId}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error toggling slot status:', error);
        throw error;
    }
};

export const getSlotBookings = async (slotId: string): Promise<any[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/slots/${slotId}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching slot bookings:', error);
        throw error;
    }
};



export const addWalkInBookings = async (slotId: string, count: number): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/slots/${slotId}/walk-in`,
            { count },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error adding walk-in bookings:', error);
        throw error;
    }
};

export const createSlot = async (date: string, time: string, maxCapacity: number): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/slots`,
            { date, time, maxCapacity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error creating slot:', error);
        throw error;
    }
};

export const deleteSlot = async (slotId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/slots/${slotId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error deleting slot:', error);
        throw error;
    }
};

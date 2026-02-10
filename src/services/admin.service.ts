import axios from 'axios';
import { API_CONFIG } from './api.config';

// Types
export interface CafeteriaTiming {
    timing_id: number;
    day: string;
    opening_time: string;
    closing_time: string;
    is_holiday: boolean;
}

export interface CapacitySlot {
    capacity_id: number;
    slot_time: string; // ISO date string
    max_capacity: number;
}

export interface SystemStats {
    usersByRole: Array<{ _id: string; count: number }>;
    bookingStats: Array<{ _id: { status: string; date: string }; count: number }>;
    todayBookings: Array<{ _id: { meal_type: string; status: string }; count: number }>;
    peakHours: Array<{ _id: number; count: number }>;
    noShowRate: { total: number; no_shows: number; completed: number };
}

export interface Booking {
    bookingId: number;
    slotTime: string;
    mealType: string;
    status: string;
    user: {
        userId: number;
        name: string;
        email: string;
    };
}

// Get Cafeteria Timings
export const getTimings = async (day?: string): Promise<CafeteriaTiming[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/timings`, {
            headers: { Authorization: `Bearer ${token}` },
            params: day ? { day } : undefined
        });
        return response.data.data.timings;
    } catch (error) {
        console.error('Error fetching timings:', error);
        throw error;
    }
};

// Update Cafeteria Timing
export const updateTiming = async (data: { day: string; opening_time: string; closing_time: string; is_holiday: boolean }): Promise<CafeteriaTiming> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/admin/timings`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating timing:', error);
        throw error;
    }
};

// Get Slot Capacities
export const getCapacities = async (date?: string): Promise<CapacitySlot[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/capacity`, {
            headers: { Authorization: `Bearer ${token}` },
            params: date ? { date } : undefined
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching capacities:', error);
        throw error;
    }
};

// Set Slot Capacity
export const setSlotCapacity = async (data: { slot_time: Date | string; max_capacity: number }): Promise<CapacitySlot> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/admin/capacity`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error setting capacity:', error);
        throw error;
    }
};

// Bulk Create Capacity
export const bulkCreateCapacity = async (data: { start_date: string; end_date: string; meal_config: any[] }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/admin/capacity/bulk`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error bulk creating capacity:', error);
        throw error;
    }
};

// Get System Stats
export const getSystemStats = async (): Promise<SystemStats> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

// Get All Bookings
export const getAllBookings = async (params: { status?: string; date?: string; meal_type?: string; limit?: number; offset?: number }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

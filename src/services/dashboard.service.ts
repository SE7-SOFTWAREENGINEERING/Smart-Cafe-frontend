import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface DashboardStats {
    usersByRole: { _id: string; count: number }[];
    bookingStats: { _id: { status: string; date: string }; count: number }[];
    todayBookings: { _id: { meal_type: string; status: string }; count: number }[];
    peakHours: { _id: number; count: number }[];
    noShowRate: { total: number; no_shows: number; completed: number };
}

export const getSystemStats = async (): Promise<DashboardStats> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching system stats:', error);
        throw error;
    }
};

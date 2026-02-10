import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface Notification {
    notificationId: number;
    message: string;
    type: 'Alert' | 'Reminder' | 'Announcement';
    sentAt: Date;
    isRead: boolean;
}

export const getMyNotifications = async (limit = 20, offset = 0) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit, offset }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getUnreadCount = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return 0; // Don't fetch if no token

        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data.unreadCount;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

export const markAsRead = async (notificationId: number) => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/notifications/${notificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error marking as read:', error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/notifications/mark-all-read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error marking all as read:', error);
        throw error;
    }
};

import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface Notification {
    notificationId: number;
    type: 'success' | 'warning' | 'info' | 'urgent'; // Mapped from backend types
    message: string;
    sentAt: string;
    isRead: boolean;
}

export const getNotifications = async (): Promise<Notification[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.data && response.data.data.notifications) {
            return response.data.data.notifications.map((n: any) => ({
                notificationId: n.notificationId,
                type: mapNotificationType(n.type),
                message: n.message,
                sentAt: n.sentAt,
                isRead: n.isRead || false
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

const mapNotificationType = (type: string): 'success' | 'warning' | 'info' | 'urgent' => {
    switch (type?.toLowerCase()) {
        case 'reminder': return 'info';
        case 'alert': return 'urgent';
        case 'announcement': return 'warning';
        default: return 'info';
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/notifications/mark-all-read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error marking notifications read:', error);
    }
};

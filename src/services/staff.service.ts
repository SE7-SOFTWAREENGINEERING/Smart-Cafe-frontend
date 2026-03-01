import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface QueueStatus {
    slotTime: string;
    mealType: string;
    waiting: number;
    completed: number;
    noShows: number;
}

export interface QueueStatusResponse {
    currentTime: string;
    queueStatus: QueueStatus[];
}

export interface LiveQueueItem {
    bookingId: number;
    userName: string;
    mealType: string;
    slotTime: string;
    queuePosition: number;
}

export interface ScanResponse {
    success: boolean;
    message: string;
    access?: 'APPROVED' | 'DENIED';
    data?: {
        userName: string;
        userEmail: string;
        slotTime: string;
        mealType: string;
        scannedAt: string;
    };
}

export const getQueueStatus = async (mealType?: string): Promise<QueueStatusResponse> => {
    try {
        const token = localStorage.getItem('token');
        const params: any = {};
        if (mealType) params.meal_type = mealType;

        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/queue-status`, {
            headers: { Authorization: `Bearer ${token}` },
            params
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching queue status:', error);
        throw error;
    }
};

export const getLiveQueue = async (): Promise<LiveQueueItem[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/live-queue`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching live queue:', error);
        throw error;
    }
};

export const updateQueueItemStatus = async (bookingId: number, status: 'Completed' | 'NoShow'): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/staff/queue/${bookingId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Error updating queue status:', error);
        throw error;
    }
};

export const scanToken = async (qr_code: string): Promise<ScanResponse> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/scan-token`,
            { qr_code },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error scanning token:', error);
        if (error.response && error.response.data) {
            return error.response.data; // The backend returns specific access=DENIED statuses on error as well
        }
        throw error;
    }
};

export interface WalkInResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const issueWalkInToken = async (user_email: string, meal_type: string): Promise<WalkInResponse> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/walk-in-token`,
            { user_email, meal_type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error issuing walk-in token:', error);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
};

export interface AnnouncementResponse {
    success: boolean;
    message: string;
    notificationsSent?: number;
}

export const sendAnnouncement = async (message: string): Promise<AnnouncementResponse> => {
    try {
        const token = localStorage.getItem('token');
        // Setting 'title' or 'priority' might require backend schema changes. 
        // Sending basic message for now.
        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/announcement`,
            { message },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error broadcasting announcement:', error);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
};

export const getAnnouncements = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/announcements`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
};

export interface OccupancyData {
    current: number;
    max: number;
    percentage: number;
}

export const getOccupancy = async (): Promise<OccupancyData> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/occupancy`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching occupancy:', error);
        throw error;
    }
};

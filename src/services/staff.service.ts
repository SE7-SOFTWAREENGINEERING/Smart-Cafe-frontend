import axios from 'axios';
import { API_CONFIG } from './api.config';
import { ROLES } from '../constants/roles';

export interface StaffMember {
    userId: number;
    name: string;
    email: string;
    role: string;
    status?: string; // Optional as backend might not return it yet
    workload?: string; // Frontend specific for now
}

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

const staffService = {
    // Get all staff members
    getAllStaff: async () => {
        try {
            // Filter by role=CANTEEN_STAFF
            // Note: API_CONFIG.MAIN_BACKEND_URL is used in other files, assuming it's correct. 
            // api.config.ts likely exports API_CONFIG not API_URL default.
            const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users?role=${ROLES.CANTEEN_STAFF}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add new staff (Register)
    addStaff: async (staffData: { name: string; email: string; password?: string; role: string }) => {
        try {
            // Using public register endpoint, or if we need admin specific route we can add one.
            // For now, using auth/register as per plan.
            // Note: auth/register might log them in automatically or return a token.
            // We just want to create the user.
            const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/register`, {
                fullName: staffData.name,
                email: staffData.email,
                password: staffData.password || 'Staff@123', // Default password if not provided
                role: ROLES.CANTEEN_STAFF // Enforce Staff role
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Remove staff
    removeStaff: async (userId: number) => {
        try {
            const response = await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users/${userId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Send Announcement
    sendAnnouncement: async (message: string) => {
        try {
            const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/announcement`, {
                message
            }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Announcement History
    getAnnouncements: async () => {
        try {
            const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/announcement`, {
                headers: getAuthHeader()
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Queue Status
    getQueueStatus: async () => {
        try {
            const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/queue-status`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default staffService;

import axios from 'axios';
import { API_CONFIG } from './api.config';
import type { User, Role } from '../types';

export const getUsers = async (role?: string): Promise<User[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { role: role === 'all' ? undefined : role }
        });

        return response.data.data.users.map((u: any) => ({
            id: u.userId,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status || 'Active',
            isOnline: false, // Backend doesn't track this yet
            joinedAt: u.createdAt
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (userData: { name: string; email: string; role: Role; password?: string }): Promise<User> => {
    try {
        const token = localStorage.getItem('token');
        // Default password for created users if not provided
        const payload = {
            ...userData,
            password: userData.password || 'Welcome123'
        };

        const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const u = response.data.data;
        return {
            id: u.userId,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUserRole = async (userId: string | number, role: Role): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users/${userId}/role`, { role }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

export const updateUserStatus = async (userId: string | number, status: 'Active' | 'Suspended'): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users/${userId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string | number): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

import axios from 'axios';
import { API_CONFIG } from './api.config';
import type { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/login`, {
      email,
      password,
    });
    
    // Store token
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data.data.user;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please check your network connection.');
  }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const register = async (name: string, email: string, password: string, role: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/register`, {
        fullName: name,
        email,
        password,
        role // Send role as is (User, CanteenStaff, Manager, Admin)
      });
      
      // Store token
      if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data.data.user;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Registration failed. Please check your network connection.');
    }
};

// ---------------------------------------------------------------------------
// OTP & Password Reset
// ---------------------------------------------------------------------------

export const sendOtp = async (email: string) => {
    try {
        await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/send-otp`, { email });
    } catch (error: any) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw new Error('Failed to send OTP');
    }
};

export const verifyOtp = async (email: string, otp: string) => {
    try {
        await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/verify-otp`, { email, otp });
    } catch (error: any) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw new Error('Invalid OTP');
    }
};

export const resetPassword = async (email: string, otp: string, password: string) => {
    try {
        await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/auth/reset-password`, { email, otp, password });
    } catch (error: any) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw new Error('Failed to reset password');
    }
};


export const getCurrentUser = async (): Promise<User> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data.user;
    } catch (error: any) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw new Error('Failed to fetch user profile');
    }
};

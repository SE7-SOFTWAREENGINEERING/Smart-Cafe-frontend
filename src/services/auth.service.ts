import api, { API_CONFIG } from "./api.config";
import axios from "axios";
import type { User } from "../types";

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, {
      email,
      password,
    });

    // Store token
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data.data.user;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Login failed. Please check your network connection.");
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
};

/**
 * Register new user
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = "user",
): Promise<User> => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/register`, {
      fullName: name,
      email,
      password,
      role: role.toLowerCase().replace(" ", "_"), // Normalize role
    });

    // Store token
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data.data.user;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "Registration failed. Please check your network connection.",
    );
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch("/auth/profile", data);
  return response.data.data;
};

/**
 * Change password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await api.post("/auth/change-password", { currentPassword, newPassword });
};

// ---------------------------------------------------------------------------
// OTP & Password Reset
// ---------------------------------------------------------------------------

/**
 * Send OTP for password reset
 */
export const sendOtp = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_CONFIG.BASE_URL}/auth/send-otp`, { email });
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    throw new Error("Failed to send OTP");
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (email: string, otp: string): Promise<void> => {
  try {
    await axios.post(`${API_CONFIG.BASE_URL}/auth/verify-otp`, { email, otp });
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    throw new Error("Invalid OTP");
  }
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
  email: string,
  otp: string,
  password: string,
): Promise<void> => {
  try {
    await axios.post(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
      email,
      otp,
      password,
    });
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    throw new Error("Failed to reset password");
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored token
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

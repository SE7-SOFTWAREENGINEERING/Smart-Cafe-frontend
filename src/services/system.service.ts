import axios from 'axios';
import { API_CONFIG } from './api.config';

// Types
export interface SystemSetting {
  _id: string;
  settingKey: string;
  settingValue: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  category: 'BOOKING' | 'CAPACITY' | 'NOTIFICATION' | 'SECURITY' | 'GENERAL';
  isEditable: boolean;
  typedValue?: string | number | boolean | object;
}

// Get all settings
export const getAllSettings = async (category?: string): Promise<SystemSetting[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system`, {
      headers: { Authorization: `Bearer ${token}` },
      params: category ? { category } : undefined
    });
    return response.data.data.settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Get settings grouped by category
export const getSettingsGrouped = async (): Promise<Record<string, SystemSetting[]>> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/grouped`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grouped settings:', error);
    throw error;
  }
};

// Get a single setting
export const getSetting = async (key: string): Promise<SystemSetting> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/${key}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching setting:', error);
    throw error;
  }
};

// Create or update a setting
export const upsertSetting = async (data: Partial<SystemSetting> & { settingKey: string; settingValue: string }): Promise<SystemSetting> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/system`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error saving setting:', error);
    throw error;
  }
};

// Quick update setting value
export const updateSettingValue = async (key: string, value: string | number | boolean): Promise<SystemSetting> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/system/${key}`, { value }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating setting:', error);
    throw error;
  }
};

// Delete a setting
export const deleteSetting = async (key: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/system/${key}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    throw error;
  }
};

// Bulk update settings
export const bulkUpdateSettings = async (settings: Array<{ key: string; value: string | number | boolean }>): Promise<SystemSetting[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/system/bulk`, { settings }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error bulk updating settings:', error);
    throw error;
  }
};

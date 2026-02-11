import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface SystemSetting {
  settingKey: string;
  settingValue: string;
  dataType: string;
  description?: string;
  category?: string;
  isEditable: boolean;
}

export interface AuditLog {
  _id: string;
  action: string;
  user: string; // or User object
  details: string;
  createdAt: string;
}

export const getSystemSettings = async (category?: string): Promise<SystemSetting[]> => {
  try {
    const token = localStorage.getItem('token');
    const params = category ? { category } : {};

    // Flatten grouped response or handle it. 
    // The backend returns { data: { GENERAL: [...], TIMINGS: [...] } }
    // Let's just return the raw data if needed, or helper to find specific key.
    // Actually the backend `getAllSettings` returns valid array effectively if we use that endpoint, 
    // but `getSettingsByCategory` returns object.
    // Let's use `getAllSettings` for simplicity if we can, but `grouped` is also fine.

    // Let's try to get all settings as a flat list for now to search easily
    const allResponse = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return allResponse.data.data.settings;

  } catch (error) {
    console.error('Error fetching system settings:', error);
    return [];
  }
};

export const getSettingByKey = async (key: string): Promise<SystemSetting | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/${key}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    // console.error(`Error fetching setting ${key}:`, error);
    return null; // Return null if not found
  }
}

export const saveSystemSetting = async (key: string, value: any, category: string = 'GENERAL', description: string = ''): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/system`,
      {
        settingKey: key,
        settingValue: typeof value === 'object' ? JSON.stringify(value) : String(value),
        dataType: typeof value === 'object' ? 'JSON' : 'STRING',
        category,
        description,
        isEditable: true
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error(`Error saving setting ${key}:`, error);
    throw error;
  }
};

export const getAuditLogs = async (limit: number = 20): Promise<AuditLog[]> => {
  // We need to implement this endpoint in backend later if not exists
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/audit-logs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

// Analytics (Mocking the python response for now via Node backend)
export const getAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    // Pointing to Node backend which will proxy or calculate
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getBackups = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/system/backups`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching backups:', error);
    return [];
  }
};

export const triggerBackup = async (): Promise<{ success: boolean; message: string; path?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/system/backups/trigger`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error triggering backup:', error);
    throw error;
  }
};

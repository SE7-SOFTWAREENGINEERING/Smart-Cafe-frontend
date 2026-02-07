import axios from 'axios';
import { API_CONFIG } from './api.config';

// Types
export interface MenuItem {
  _id: string;
  itemName: string;
  isVeg: boolean;
  description?: string;
  category: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Menu {
  _id: string;
  menuDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  isActive: boolean;
  items?: MenuItem[];
}

// ========== PUBLIC/STUDENT ENDPOINTS ==========

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const getMenuList = async (params?: { date?: string; mealType?: string }): Promise<Menu[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data.data.menus;
  } catch (error) {
    console.error('Error fetching menu list:', error);
    throw error;
  }
};

export const getMenuById = async (menuId: string): Promise<Menu> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu/${menuId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

export const getMenuItemById = async (itemId: string): Promise<MenuItem> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

// ========== ADMIN ENDPOINTS ==========

export const createMenu = async (data: { menuDate: string; mealType: string; isActive?: boolean }): Promise<Menu> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/menu`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

export const updateMenu = async (menuId: string, data: Partial<Menu>): Promise<Menu> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/menu/${menuId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

export const deleteMenu = async (menuId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/menu/${menuId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
};

export const createMenuItem = async (data: Partial<MenuItem> & { menuId: string }): Promise<MenuItem> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (itemId: string, data: Partial<MenuItem>): Promise<MenuItem> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items/${itemId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

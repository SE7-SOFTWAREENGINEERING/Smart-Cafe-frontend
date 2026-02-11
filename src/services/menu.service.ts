import axios from 'axios';
import { API_CONFIG } from './api.config';

// Types
import type { MenuItem } from '../types';

// Helper to map backend item to frontend item
const mapToFrontendItem = (item: any): MenuItem => ({
  id: item._id, // Map _id to id
  name: item.itemName, // Map itemName to name
  price: item.price || 0,
  // isVeg: item.isVeg, // Not in frontend type
  description: item.description,
  // category: item.category, // Not in frontend type (uses mealType instead)
  // Ensure Title Case for frontend (e.g. 'LUNCH' -> 'Lunch')
  mealType: (item.mealType ? item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1).toLowerCase() : 'Lunch') as any, // Default or mapped
  dietaryType: item.dietaryType || (item.isVeg ? 'Veg' : 'Non-Veg'),
  allergens: item.allergens || [],
  ecoScore: item.ecoScore || item.nutritionalInfo?.ecoScore || 'C',
  portionSize: item.portionSize || 'Regular',
  isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
});


export interface Menu {
  _id: string;
  menuDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  isActive: boolean;
  items?: any[]; // Keep flexible for backend raw items
}

// ========== PUBLIC/STUDENT ENDPOINTS ==========

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu`);
    // Legacy endpoint might need mapping too if used, but for now focusing on admin
    return response.data.map(mapToFrontendItem);
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
    return mapToFrontendItem(response.data.data);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

export const getDailyItems = async (date?: string): Promise<MenuItem[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items/daily`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { date }
    });
    return response.data.data.map(mapToFrontendItem);
  } catch (error) {
    console.error('Error fetching daily items:', error);
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

export const createMenuItem = async (data: Partial<MenuItem> & { menuId?: string; date?: string; mealType?: string }): Promise<MenuItem> => {
  try {
    const token = localStorage.getItem('token');
    // Map frontend fields back to backend fields for creation
    const payload = {
      ...data,
      itemName: data.name, // Map name to itemName
      // other fields map naturally or are handled by backend leniently
    };
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return mapToFrontendItem(response.data.data);
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (itemId: string, data: Partial<MenuItem>): Promise<MenuItem> => {
  try {
    const token = localStorage.getItem('token');
    const payload = {
      ...data,
      itemName: data.name,
    };
    const response = await axios.put(`${API_CONFIG.MAIN_BACKEND_URL}/menu/items/${itemId}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return mapToFrontendItem(response.data.data);
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

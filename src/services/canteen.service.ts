import api from './api.config';

// Types
export interface Canteen {
  id: string;
  _id?: string;
  name: string;
  location?: string;
  status: 'Open' | 'Closed' | 'Closing Soon';
  crowd: 'Low' | 'Medium' | 'High';
  capacity: number;
  occupancy: number;
  isActive: boolean;
  imageUrl?: string | null;
  imageColor?: string;
  operatingHours?: {
    open: string;
    close: string;
  };
  ecoScore: 'A' | 'B' | 'C' | 'D' | 'E';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ========== PUBLIC ENDPOINTS ==========

/**
 * Get all canteens
 */
export const getCanteens = async (params?: { 
  status?: string; 
  isActive?: boolean;
  search?: string;
}): Promise<Canteen[]> => {
  const response = await api.get('/canteens', { params });
  return response.data.data?.canteens || response.data.data || [];
};

/**
 * Get canteen by ID
 */
export const getCanteenById = async (canteenId: string): Promise<Canteen> => {
  const response = await api.get(`/canteens/${canteenId}`);
  return response.data.data;
};

// ========== ADMIN ENDPOINTS ==========

/**
 * Create a new canteen (Admin only)
 */
export const createCanteen = async (data: Partial<Canteen>): Promise<Canteen> => {
  const response = await api.post('/canteens', data);
  return response.data.data;
};

/**
 * Update canteen (Admin only)
 */
export const updateCanteen = async (canteenId: string, data: Partial<Canteen>): Promise<Canteen> => {
  const response = await api.patch(`/canteens/${canteenId}`, data);
  return response.data.data;
};

/**
 * Delete canteen (Admin only)
 */
export const deleteCanteen = async (canteenId: string): Promise<void> => {
  await api.delete(`/canteens/${canteenId}`);
};

/**
 * Toggle canteen active status (Admin only)
 */
export const toggleCanteenStatus = async (canteenId: string): Promise<Canteen> => {
  const response = await api.patch(`/canteens/${canteenId}/toggle`);
  return response.data.data;
};

/**
 * Update canteen occupancy (Admin only)
 */
export const updateOccupancy = async (canteenId: string, occupancy: number): Promise<Canteen> => {
  const response = await api.patch(`/canteens/${canteenId}/occupancy`, { occupancy });
  return response.data.data;
};

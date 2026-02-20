import api from './api.config';

// Types
export interface UserStats {
  total: number;
  active: number;
  online: number;
  byRole: Array<{
    _id: string;
    count: number;
    active: number;
    online: number;
  }>;
}

export interface User {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isOnline: boolean;
  avatar?: string;
  canteenId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user statistics (Management only)
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/users/stats');
  return response.data.data;
};

/**
 * Get all users with pagination and filters
 */
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  canteenId?: string;
  unassigned?: string;
}): Promise<{ users: User[]; total: number; page: number; totalPages: number }> => {
  const response = await api.get('/users', { params });
  const data = response.data.data;
  // Backend returns { items, pagination } format
  return {
    users: data.items || [],
    total: data.pagination?.total || 0,
    page: data.pagination?.page || 1,
    totalPages: data.pagination?.totalPages || 1,
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data.data;
};

/**
 * Update user
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (id: string, role: string): Promise<User> => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data.data;
};

/**
 * Update user status
 */
export const updateUserStatus = async (id: string, status: string): Promise<User> => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

/**
 * Force logout user
 */
export const forceLogout = async (id: string): Promise<void> => {
  await api.post(`/users/${id}/force-logout`);
};

/**
 * Assign staff to a canteen
 */
export const assignCanteen = async (userId: string, canteenId: string | null): Promise<User> => {
  const response = await api.patch(`/users/${userId}/canteen`, { canteenId });
  return response.data.data;
};

import api from "./api.config";

// Types
export interface MenuItem {
  id: string;
  _id?: string;
  itemName: string;
  category: string; // MEAL TYPE: Breakfast, Lunch, etc.
  dietaryType: string; // Veg, Non-Veg, etc.
  description?: string;
  price?: number;
  isAvailable?: boolean;
  isVeg?: boolean; // Kept for backward compatibility
  canteens?: Array<string | { id?: string; _id?: string; name?: string }>;
  canteenName?: string;
  allergens?: string[];
  ecoScore?: string;
  portionSize?: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Menu {
  id: string;
  _id?: string;
  menuDate: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  isActive: boolean;
  items?: MenuItem[];
}

// ========== PUBLIC/STUDENT ENDPOINTS ==========

/**
 * Get all menus (with optional filters)
 */
export const getMenus = async (params?: {
  date?: string;
  mealType?: string;
  isActive?: boolean;
}): Promise<Menu[]> => {
  const response = await api.get("/menus", { params });
  return response.data.data?.menus || response.data.data || [];
};

/**
 * Get menu by ID
 */
export const getMenuById = async (menuId: string): Promise<Menu> => {
  const response = await api.get(`/menus/${menuId}`);
  return response.data.data;
};

/**
 * Get all menu items
 */
export const getMenuItems = async (params?: {
  category?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  dietaryType?: string;
  canteen?: string;
}): Promise<MenuItem[]> => {
  const response = await api.get("/menu-items", { params });
  return response.data.data?.menuItems || response.data.data || [];
};

/**
 * Get menu item by ID
 */
export const getMenuItemById = async (itemId: string): Promise<MenuItem> => {
  const response = await api.get(`/menu-items/${itemId}`);
  return response.data.data;
};

// ========== ADMIN/MANAGEMENT ENDPOINTS ==========

/**
 * Create a new menu (Management only)
 */
export const createMenu = async (data: {
  menuDate: string;
  mealType: string;
  isActive?: boolean;
}): Promise<Menu> => {
  const response = await api.post("/menus", data);
  return response.data.data;
};

/**
 * Update menu (Management only)
 */
export const updateMenu = async (
  menuId: string,
  data: Partial<Menu>,
): Promise<Menu> => {
  const response = await api.patch(`/menus/${menuId}`, data);
  return response.data.data;
};

/**
 * Delete menu (Management only)
 */
export const deleteMenu = async (menuId: string): Promise<void> => {
  await api.delete(`/menus/${menuId}`);
};

/**
 * Create a new menu item (Management only)
 */
export const createMenuItem = async (
  data: Partial<MenuItem>,
): Promise<MenuItem> => {
  const response = await api.post("/menu-items", data);
  return response.data.data;
};

/**
 * Update menu item (Management only)
 */
export const updateMenuItem = async (
  itemId: string,
  data: Partial<MenuItem>,
): Promise<MenuItem> => {
  const response = await api.patch(`/menu-items/${itemId}`, data);
  return response.data.data;
};

/**
 * Delete menu item (Management only)
 */
export const deleteMenuItem = async (itemId: string): Promise<void> => {
  await api.delete(`/menu-items/${itemId}`);
};

/**
 * Toggle menu item availability (Management only)
 */
export const toggleMenuItemAvailability = async (
  itemId: string,
): Promise<MenuItem> => {
  const response = await api.patch(`/menu-items/${itemId}/toggle`);
  return response.data.data;
};

// Legacy alias
export const getMenuList = getMenus;

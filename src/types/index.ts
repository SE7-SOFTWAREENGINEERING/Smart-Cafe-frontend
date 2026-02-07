export type Role = 'user' | 'canteen_staff' | 'canteenstaff' | 'kitchen_staff' | 'counter_staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks';
  dietaryType: 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain';
  allergens: string[];
  ecoScore: 'A' | 'B' | 'C' | 'D' | 'E';
  portionSize: 'Small' | 'Regular';
  isAvailable: boolean;
}

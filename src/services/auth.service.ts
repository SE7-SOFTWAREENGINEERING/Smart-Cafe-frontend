import type { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock Logic based on email pattern and specific passwords
  if (email.includes('admin')) {
    if (password === 'Admin@123') {
      return { id: '1', name: 'Admin User', email, role: 'admin' };
    }
  }
  else if (email.includes('staff')) {
    if (password === 'Staff@123') {
      return { id: '2', name: 'Staff User', email, role: 'staff' };
    }
  }
  else if (email.includes('manager')) {
    if (password === 'Manager@123') {
      return { id: '3', name: 'Manager User', email, role: 'manager' };
    }
  }
  // Default to student if password matches generic student password
  else {
    if (password === 'Student@123') {
      return { id: '4', name: 'Student User', email, role: 'student' };
    }
  }

  throw new Error('Invalid credentials');
};

export const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '../types';
import * as AuthService from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for persisted user
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await AuthService.login(email, password);
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await AuthService.register(name, email, password, role);
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

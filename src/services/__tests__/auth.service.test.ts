import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { login, logout, register, sendOtp, verifyOtp, resetPassword } from '../auth.service';

// Mock axios BEFORE importing modules that use it
vi.mock('axios', () => {
  const m = {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    create: vi.fn().mockReturnThis(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return {
    default: m,
    ...m,
  };
});
const mockedAxios = vi.mocked(axios, true);

// Mock api config
vi.mock('../api.config', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
  };
  return {
    default: mockApi,
    api: mockApi,
    API_CONFIG: {
      BASE_URL: 'http://localhost:3000/api'
    }
  };
});
// The mockedApi variable is not needed here as auth tests use axios

// Mock localStorage from setup.ts globally
const localStorageMock = (window as any).localStorage;

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'test-token',
            user: { id: '1', email: 'test@example.com', role: 'student' }
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await login('test@example.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'test@example.com', password: 'password123' }
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(result).toEqual(mockResponse.data.data.user);
    });

    it('should throw error on login failure', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid email or password' } }
      });

      await expect(login('wrong@example.com', 'wrongpass')).rejects.toThrow('Invalid email or password');
    });

    it('should handle network errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(login('test@example.com', 'password')).rejects.toThrow('Login failed. Please check your network connection.');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('register', () => {
    it('should register successfully and store token', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'new-token',
            user: { id: '2', email: 'new@example.com', role: 'Student' }
          }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await register('Test User', 'new@example.com', 'password123', 'student');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        { fullName: 'Test User', email: 'new@example.com', password: 'password123', role: 'student' }
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token');
      expect(result).toEqual(mockResponse.data.data.user);
    });

    it('should throw error on registration failure', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Email already exists' } }
      });

      await expect(register('Test', 'existing@email.com', 'pass', 'student')).rejects.toThrow('Email already exists');
    });
  });

  describe('OTP Functions', () => {
    it('sendOtp should call correct endpoint', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await sendOtp('test@example.com');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/send-otp'),
        { email: 'test@example.com' }
      );
    });

    it('verifyOtp should call correct endpoint', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await verifyOtp('test@example.com', '123456');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/verify-otp'),
        { email: 'test@example.com', otp: '123456' }
      );
    });

    it('resetPassword should call correct endpoint', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await resetPassword('test@example.com', '123456', 'newPassword');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/reset-password'),
        { email: 'test@example.com', otp: '123456', password: 'newPassword' }
      );
    });
  });
});

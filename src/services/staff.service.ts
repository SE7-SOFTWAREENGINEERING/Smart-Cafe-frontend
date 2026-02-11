import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface QueueStatus {
  slotTime: string;
  mealType: string;
  waiting: number;
  completed: number;
  noShows: number;
}

export interface AvailableSlot {
  slotTime: string;
  maxCapacity: number;
  bookedCount: number;
  remainingSlots: number;
  isAvailable: boolean;
}

export interface ScanTokenResponse {
  success: boolean;
  message: string;
  access: 'APPROVED' | 'DENIED';
  data?: {
    userName: string;
    userEmail: string;
    slotTime: string;
    mealType: string;
    scannedAt: string;
  };
}

export const staffService = {
  // Scan and validate a token
  scanToken: async (qrCode: string): Promise<ScanTokenResponse> => {
    try {
      const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/scan-token`, 
        { qr_code: qrCode },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      // Return the error response structure for UI handling
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Get queue status (aggregated counts per slot)
  getQueueStatus: async (mealType?: string): Promise<QueueStatus[]> => {
    try {
      const params = mealType ? { meal_type: mealType } : {};
      const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/staff/queue-status`, { 
        params,
        headers: {
             // Assuming we have a way to get the token. For now, we might need to mock or get from localStorage
             'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (response.data.success) {
          return response.data.data.queueStatus;
      }
      return [];
    } catch (error) {
      console.error('Error fetching queue status:', error);
      throw error;
    }
  },

  // Issue walk-in token
  issueWalkInToken: async (email: string, mealType: string) => {
    try {
      const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/walk-in-token`, 
        { user_email: email, meal_type: mealType },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error issuing walk-in token:', error);
        throw error;
    }
  },

  // Get available slots to calculate occupancy
  getAvailableSlots: async (date?: string): Promise<AvailableSlot[]> => {
    try {
       const params = date ? { date } : {};
       const response = await axios.get(`${API_CONFIG.BOOKING_API_URL}/available-slots`, {
           params,
           headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
           }
       });
       if (response.data.success) {
           return response.data.data.slots;
       }
       return [];
    } catch (error) {
        console.error('Error fetching available slots:', error);
        // Fallback to Main Backend if booking API url is different/mocked?
        // Note: api.config.ts has BOOKING_API_URL pointing to 5000 (Python).
        // But getAvailableSlots is in bookingController.js (Node, 6500).
        // IMPORTANT: The Booking Routes are mounted on the MAIN backend (6500).
        // API_CONFIG might be misconfigured if it points bookings to 5000.
        // Let's try MAIN_BACKEND_URL for bookings too as I saw the code in bookingController.js.
        
        const params = date ? { date } : {};
        try {
            const retryResponse = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/bookings/available-slots`, {
                params,
                headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (retryResponse.data.success) {
                return retryResponse.data.data.slots;
            }
         } catch (retryError) {
             console.error('Retry failed:', retryError);
         }
        throw error;
    }
  },

  // Send announcement to students
  sendAnnouncement: async (message: string, isPriority: boolean = false) => {
    try {
      const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/staff/announcement`, 
        { message, is_priority: isPriority },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending announcement:', error);
      throw error;
    }
  }
};

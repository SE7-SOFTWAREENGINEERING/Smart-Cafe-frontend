import axios from 'axios';
import { API_CONFIG } from './api.config';

// Define types for Booking response
export interface Slot {
  _id: string;
  time: string;
  capacity: number;
  booked: number;
}

export const getSlots = async (canteen: string = 'Sopanam'): Promise<Slot[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/bookings/available-slots`, {
      params: { canteen },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.data && response.data.data.slots) {
      return response.data.data.slots.map((s: any) => ({
        _id: s.slotTime,
        time: new Date(s.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        capacity: s.maxCapacity,
        booked: s.bookedCount
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

export const bookSlot = async (slotId: string, mealType: string = 'Lunch', canteen: string = 'Sopanam', items: string[] = []) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_CONFIG.MAIN_BACKEND_URL}/bookings`, {
      slot_time: slotId,
      meal_type: mealType,
      canteen: canteen,
      items: items
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error booking slot:', error);
    throw error;
  }
};


export interface Booking {
  bookingId: number;
  slotTime: string;
  mealType: string;
  status: string;
  queuePosition?: number;
  token?: {
    qrCode: string;
    tokenId: number;
    status: string;
  };
}

export const getUserBookings = async (upcomingOnly: boolean = false): Promise<Booking[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_CONFIG.MAIN_BACKEND_URL}/bookings/my-bookings`, {
      params: { upcoming: upcomingOnly },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data.bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const cancelSlot = async (bookingId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_CONFIG.MAIN_BACKEND_URL}/bookings/${bookingId}`, {
      action: 'cancel'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling slot:', error);
    throw error;
  }
};

import axios from 'axios';
import { API_CONFIG } from './api.config';

// Define types for Booking response if needed
export interface Slot {
  _id: string;
  time: string;
  capacity: number;
  booked: number;
  // Add other fields as per the API response
}

export const getSlots = async (canteen: string = 'Sopanam'): Promise<Slot[]> => {
  try {
    const response = await axios.get(`${API_CONFIG.BOOKING_API_URL}/slots`, {
      params: { canteen }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

export const bookSlot = async (slotTime: string, mealType: string, canteen: string) => {
  try {
    const response = await axios.post(`${API_CONFIG.BOOKING_API_URL}/book`, {
      slot_time: slotTime,
      meal_type: mealType,
      canteen: canteen
    });
    return response.data;
  } catch (error) {
    console.error('Error booking slot:', error);
    throw error;
  }
};

export const cancelSlot = async (slotId: string) => {
  try {
    const response = await axios.post(`${API_CONFIG.BOOKING_API_URL}/cancel`, {
      slot_id: slotId,
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling slot:', error);
    throw error;
  }
};

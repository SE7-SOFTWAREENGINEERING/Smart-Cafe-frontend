import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getSlots, bookSlot, cancelSlot } from '../booking.service';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Booking Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSlots', () => {
    it('should fetch available slots successfully', async () => {
      const mockSlots = [
        { _id: '1', time: '12:00', capacity: 50, booked: 10 },
        { _id: '2', time: '13:00', capacity: 50, booked: 25 },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockSlots });

      const result = await getSlots();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/slots')
      );
      expect(result).toEqual(mockSlots);
      expect(result).toHaveLength(2);
    });

    it('should throw error on fetch failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(getSlots()).rejects.toThrow('Network Error');
    });
  });

  describe('bookSlot', () => {
    it('should book a slot successfully', async () => {
      const mockResponse = { success: true, message: 'Slot booked for user123' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await bookSlot('slot123', 'user123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/book'),
        { slot_id: 'slot123', user_id: 'user123' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when slot is full', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Slot is full' } }
      });

      await expect(bookSlot('full-slot', 'user123')).rejects.toBeDefined();
    });
  });

  describe('cancelSlot', () => {
    it('should cancel a booking successfully', async () => {
      const mockResponse = { success: true, message: 'Booking cancelled' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await cancelSlot('slot123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/cancel'),
        { slot_id: 'slot123' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle cancel errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Cancel failed'));

      await expect(cancelSlot('invalid-slot')).rejects.toThrow('Cancel failed');
    });
  });
});

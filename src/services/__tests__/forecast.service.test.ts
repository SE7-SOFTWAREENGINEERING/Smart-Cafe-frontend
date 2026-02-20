import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getForecast, getAnalytics } from '../forecast.service';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Forecast Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getForecast', () => {
    it('should fetch forecast for given input', async () => {
      const mockInput = {
        Day_of_Week: 'Monday',
        Meal_Type: 'Lunch',
        Is_Veg: true,
        Event_Context: 'NORMAL',
        Weather: 'Sunny'
      };
      const mockResponse = {
        prediction: 150.5,
        input: mockInput
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await getForecast(mockInput);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/predict'),
        mockInput
      );
      expect(result.prediction).toBe(150.5);
      expect(result.input).toEqual(mockInput);
    });

    it('should handle different meal types', async () => {
      const dinnerInput = {
        Day_of_Week: 'Friday',
        Meal_Type: 'Dinner',
        Is_Veg: false,
        Event_Context: 'EXAM',
        Weather: 'Cloudy'
      };
      const mockResponse = { prediction: 200, input: dinnerInput };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await getForecast(dinnerInput);

      expect(result.prediction).toBe(200);
    });

    it('should throw error on forecast failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Model not trained'));

      await expect(getForecast({
        Day_of_Week: 'Monday',
        Meal_Type: 'Lunch',
        Is_Veg: true,
        Event_Context: 'NORMAL',
        Weather: 'Sunny'
      })).rejects.toThrow('Model not trained');
    });
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data successfully', async () => {
      const mockAnalytics = {
        total_records: 1000,
        average_demand: 125.5,
        metrics: { mape: 8.5, rmse: 12.3 },
        top_drivers: [
          { factor: 'Day_of_Week_Friday', importance: 0.25 },
          { factor: 'Meal_Type_Lunch', importance: 0.20 }
        ],
        chart_data: [
          { day: 'Mon', actual: 100, predicted: 105 },
          { day: 'Tue', actual: 120, predicted: 115 }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockAnalytics });

      const result = await getAnalytics();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics')
      );
      expect(result.total_records).toBe(1000);
      expect(result.average_demand).toBe(125.5);
      expect(result.metrics.mape).toBe(8.5);
      expect(result.top_drivers).toHaveLength(2);
      expect(result.chart_data).toHaveLength(2);
    });

    it('should throw error on analytics failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Data not loaded'));

      await expect(getAnalytics()).rejects.toThrow('Data not loaded');
    });
  });
});

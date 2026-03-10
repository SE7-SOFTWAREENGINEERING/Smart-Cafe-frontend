import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api.config';
import { getForecast, getAnalytics } from '../forecast.service';

// Mock api.config
vi.mock('../api.config', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockApi,
    api: mockApi,
    API_CONFIG: {
      BASE_URL: 'http://localhost:3000/api'
    }
  };
});
const mockedApi = vi.mocked(api, true);

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
      
      const mockDailyForecast = {
        date: new Date().toISOString().split('T')[0],
        forecasts: [{
          id: '1',
          date: new Date().toISOString().split('T')[0],
          mealType: 'LUNCH',
          predictedCount: 150.5,
          weatherCondition: 'Sunny',
          isSpecialPeriod: false,
          specialPeriodType: 'NONE'
        }]
      };

      mockedApi.get.mockResolvedValueOnce({ data: { data: mockDailyForecast } });

      const result = await getForecast(mockInput as any);

      expect(mockedApi.get).toHaveBeenCalledWith(
        expect.stringContaining('/forecast/daily'),
        expect.anything()
      );
      expect(result.prediction).toBe(150.5);
    });

    it('should handle different meal types', async () => {
      const dinnerInput = {
        Day_of_Week: 'Friday',
        Meal_Type: 'Dinner',
        Is_Veg: false,
        Event_Context: 'EXAM',
        Weather: 'Cloudy'
      };
      
      const mockDailyForecast = {
        date: new Date().toISOString().split('T')[0],
        forecasts: [{
          id: '1',
          date: new Date().toISOString().split('T')[0],
          mealType: 'DINNER',
          predictedCount: 200,
          weatherCondition: 'Cloudy',
          isSpecialPeriod: false,
          specialPeriodType: 'NONE'
        }]
      };
      
      mockedApi.get.mockResolvedValueOnce({ data: { data: mockDailyForecast } });

      const result = await getForecast(dinnerInput as any);
      expect(result.prediction).toBe(200);
    });

    it('should throw error on forecast failure', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Model not trained'));

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
      const mockAccuracy = {
        overall: { overallAccuracy: 91.5, totalForecasts: 1000 },
        byMealType: []
      };
      const mockWeekly = [{
        date: '2024-03-10',
        forecasts: [{ mealType: 'LUNCH', predictedCount: 100, actualCount: 105 }]
      }];

      mockedApi.get.mockResolvedValueOnce({ data: { data: mockAccuracy } });
      mockedApi.get.mockResolvedValueOnce({ data: { data: mockWeekly } });

      const result = await getAnalytics();

      expect(mockedApi.get).toHaveBeenCalled();
      expect(result.total_records).toBe(1000);
    });
  });
});

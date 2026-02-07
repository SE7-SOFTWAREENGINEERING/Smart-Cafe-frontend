import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface ForecastInput {
  Day_of_Week: string;
  Meal_Type: string;
  Is_Veg: boolean;
  Event_Context: string;
  Weather: string;
}

export interface ForecastResponse {
  prediction: number;
  input: ForecastInput;
}

export interface AnalyticsResponse {
  total_records: number;
  average_demand: number;
  metrics: {
    mape: number;
    rmse: number;
  };
  top_drivers: { factor: string; importance: number }[];
  chart_data: { day: string; actual: number; predicted: number }[];
}

export const getForecast = async (data: ForecastInput): Promise<ForecastResponse> => {
  try {
    const response = await axios.post(`${API_CONFIG.FORECAST_API_URL}/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  try {
    const response = await axios.get(`${API_CONFIG.FORECAST_API_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

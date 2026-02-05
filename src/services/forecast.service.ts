import api from './api.config';

// Types
export interface DailyForecast {
  date: string;
  forecasts: MealForecast[];
}

export interface MealForecast {
  id: string;
  date: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
  predictedCount: number;
  actualCount?: number;
  accuracy?: number;
  weatherCondition: string;
  isSpecialPeriod: boolean;
  specialPeriodType: string;
}

export interface AccuracyMetrics {
  byMealType: {
    _id: string;
    averageAccuracy: number;
    minAccuracy: number;
    maxAccuracy: number;
    count: number;
  }[];
  overall: {
    overallAccuracy: number;
    totalForecasts: number;
  };
}

// Legacy types for backward compatibility
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

// ========== FORECAST ENDPOINTS ==========

/**
 * Get daily forecast
 */
export const getDailyForecast = async (date?: string): Promise<DailyForecast> => {
  const response = await api.get('/forecast/daily', { 
    params: date ? { date } : undefined 
  });
  return response.data.data;
};

/**
 * Get weekly forecast
 */
export const getWeeklyForecast = async (startDate?: string): Promise<DailyForecast[]> => {
  const response = await api.get('/forecast/weekly', { 
    params: startDate ? { startDate } : undefined 
  });
  return response.data.data;
};

/**
 * Get forecast accuracy metrics (Management only)
 */
export const getAccuracyMetrics = async (params?: {
  startDate?: string;
  endDate?: string;
  mealType?: string;
}): Promise<AccuracyMetrics> => {
  const response = await api.get('/forecast/accuracy', { params });
  return response.data.data;
};

/**
 * Record actual consumption (Admin only)
 */
export const recordActual = async (
  date: string,
  mealType: string,
  actualCount: number
): Promise<MealForecast> => {
  const response = await api.post('/forecast/record-actual', {
    date,
    mealType,
    actualCount,
  });
  return response.data.data;
};

// ========== LEGACY FUNCTIONS (for backward compatibility) ==========

/**
 * @deprecated Use getDailyForecast instead
 */
export const getForecast = async (data: ForecastInput): Promise<ForecastResponse> => {
  // Map to new format and return in legacy format
  const today = new Date().toISOString().split('T')[0];
  const dailyForecast = await getDailyForecast(today);
  
  const mealForecast = dailyForecast.forecasts.find(
    f => f.mealType === data.Meal_Type.toUpperCase()
  );
  
  return {
    prediction: mealForecast?.predictedCount || 0,
    input: data,
  };
};

/**
 * @deprecated Use getAccuracyMetrics instead
 */
export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const metrics = await getAccuracyMetrics();
  const weekly = await getWeeklyForecast();
  
  // Convert to legacy format
  return {
    total_records: metrics.overall.totalForecasts,
    average_demand: 0, // Not available in new format
    metrics: {
      mape: 100 - (metrics.overall.overallAccuracy || 0),
      rmse: 0, // Not available in new format
    },
    top_drivers: [],
    chart_data: weekly.flatMap(day => 
      day.forecasts.map(f => ({
        day: day.date,
        actual: f.actualCount || 0,
        predicted: f.predictedCount,
      }))
    ),
  };
};

import axios from 'axios';

// OpenWeatherMap API (free tier)
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'demo'; // Set in .env file
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

/**
 * Get current weather for a location (latitude, longitude)
 */
export const getCurrentWeather = async (
  latitude: number = 28.5355, // Default: Delhi, India
  longitude: number = 77.3910,
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      temp: Math.round(data.main.temp),
      condition: capitalizeWords(data.weather[0].main),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    // Return default "Sunny" on failure
    return {
      temp: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      feelsLike: 25,
      description: 'Clear sky',
      icon: '01d',
    };
  }
};

/**
 * Get 5-day weather forecast for a location
 */
export const getWeatherForecast = async (
  latitude: number = 28.5355,
  longitude: number = 77.3910,
): Promise<WeatherForecast[]> => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/forecast`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    // Group by day and take noon readings
    const forecasts: Record<string, WeatherForecast> = {};
    const data = response.data;

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];

      // Only take noon readings
      if (item.dt_txt.includes('12:00:00')) {
        forecasts[date] = {
          date,
          temp: Math.round(item.main.temp),
          condition: capitalizeWords(item.weather[0].main),
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6),
          feelsLike: Math.round(item.main.feels_like),
        };
      }
    });

    return Object.values(forecasts).slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    return [];
  }
};

/**
 * Map weather condition to impact category for demand prediction
 */
export const getWeatherImpactCategory = (condition: string): string => {
  const lower = condition?.toLowerCase() || '';

  if (lower.includes('rain') || lower.includes('thunderstorm') || lower.includes('drizzle')) {
    return 'Rainy';
  }
  if (lower.includes('cloud') || lower.includes('overcast')) {
    return 'Cloudy';
  }
  if (lower.includes('clear') || lower.includes('sunny')) {
    return 'Sunny';
  }
  if (lower.includes('fog') || lower.includes('mist')) {
    return 'Foggy';
  }
  if (lower.includes('snow')) {
    return 'Snowy';
  }

  return 'Unknown';
};

/**
 * Helper: Capitalize words
 */
const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get weather impact multiplier for demand
 * Rainy weather reduces demand, Sunny increases it
 */
export const getWeatherDemandMultiplier = (condition: string): number => {
  const category = getWeatherImpactCategory(condition);
  switch (category) {
    case 'Rainy':
      return 0.85; // 15% reduction
    case 'Cloudy':
      return 0.95; // 5% reduction
    case 'Sunny':
      return 1.1; // 10% increase
    case 'Foggy':
      return 0.9; // 10% reduction
    case 'Snowy':
      return 0.8; // 20% reduction
    default:
      return 1.0;
  }
};

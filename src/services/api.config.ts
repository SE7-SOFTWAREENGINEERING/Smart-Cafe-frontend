export const API_CONFIG = {
  // Main Backend (Node.js)
  MAIN_BACKEND_URL: import.meta.env.VITE_MAIN_BACKEND_URL || 'http://localhost:3000/api',

  // Sustainable Score API (Python/Flask) - Bookings
  BOOKING_API_URL: import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:5000/api',

  // Forecasting API (Python/Flask) - Analytics
  FORECAST_API_URL: import.meta.env.VITE_FORECAST_API_URL || 'http://localhost:5001',
};

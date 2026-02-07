// Services barrel file - export all services
export * as authService from './auth.service';
export * as bookingService from './booking.service';
export * as forecastService from './forecast.service';
export * as menuService from './menu.service';
export * as notificationService from './notification.service';
export * as sustainabilityService from './sustainability.service';
export * as systemService from './system.service';
export * as stockService from './stock.service';
export * as financialService from './financial.service';
export * as canteenService from './canteen.service';
export * as userService from './user.service';

// Re-export api config
export { API_CONFIG, api } from './api.config';

// Re-export commonly used types
export type { Slot, Booking, BookingItem } from './booking.service';
export type { Menu, MenuItem } from './menu.service';
export type { Notification } from './notification.service';
export type { WasteReport, SustainabilityMetrics } from './sustainability.service';
export type { DailyForecast, MealForecast, AccuracyMetrics } from './forecast.service';
export type { SystemSetting } from './system.service';
export type { StockItem, StockTransaction, StockSummary } from './stock.service';
export type { FinancialTransaction, DailySummary, MonthlySummary, SettlementReport } from './financial.service';
export type { Canteen } from './canteen.service';
export type { UserStats, User } from './user.service';

import api from './api.config';

// Types
export interface WasteReport {
  id: string;
  user: string;
  booking?: string;
  date: string;
  wasteAmount: 'None' | 'Little' | 'Some' | 'Most' | 'All';
  reason?: string;
  notes?: string;
  mealType?: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
  createdAt: string;
}

export interface WasteStats {
  byWasteAmount: { _id: string; count: number }[];
  byReason: { _id: string; count: number }[];
  dailyTrend: { _id: string; totalReports: number; highWasteCount: number }[];
  averageEcoScore: number;
  totalReports: number;
}

export interface SustainabilityMetrics {
  currentEcoScore: number;
  previousEcoScore: number;
  improvement: number;
  totalReportsThisMonth: number;
}

// ========== USER ENDPOINTS ==========

/**
 * Submit waste report
 */
export const submitWasteReport = async (data: {
  bookingId?: string;
  wasteAmount: string;
  reason?: string;
  notes?: string;
  mealType?: string;
}): Promise<WasteReport> => {
  const response = await api.post('/sustainability/waste-report', data);
  return response.data.data;
};

/**
 * Get user's waste reports
 */
export const getMyWasteReports = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ reports: WasteReport[]; total: number }> => {
  const response = await api.get('/sustainability/my-reports', { params });
  return response.data.data;
};

// ========== MANAGEMENT ENDPOINTS ==========

/**
 * Get waste statistics (Management only)
 */
export const getWasteStats = async (params?: {
  startDate?: string;
  endDate?: string;
  mealType?: string;
}): Promise<WasteStats> => {
  const response = await api.get('/sustainability/stats', { params });
  return response.data.data;
};

/**
 * Get sustainability metrics (Management only)
 */
export const getSustainabilityMetrics = async (): Promise<SustainabilityMetrics> => {
  const response = await api.get('/sustainability/metrics');
  return response.data.data;
};

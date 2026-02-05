import api from './api.config';

// Types
export interface FinancialTransaction {
  id: string;
  transactionType: 'SALE' | 'REFUND' | 'EXPENSE' | 'PURCHASE' | 'SETTLEMENT' | 'ADJUSTMENT';
  amount: number;
  description: string;
  category: 'BOOKING' | 'REFUND' | 'STOCK_PURCHASE' | 'UTILITY' | 'SALARY' | 'MAINTENANCE' | 'OTHER';
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'BANK_TRANSFER' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  date: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  byType: { _id: string; total: number; count: number }[];
  byCategory: { _id: string; total: number; count: number }[];
  byPaymentMethod: { _id: string; total: number; count: number }[];
}

export interface MonthlySummary {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  dailyTotals: { _id: string; revenue: number; expenses: number }[];
}

export interface SettlementReport {
  period: { startDate: string; endDate: string };
  totalAmount: number;
  byPaymentMethod: { _id: string; totalAmount: number; transactionCount: number }[];
  transactionCount: number;
  transactions: FinancialTransaction[];
}

// ========== FINANCIAL ENDPOINTS ==========

export const getTransactions = async (params?: {
  transactionType?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ transactions: FinancialTransaction[]; total: number }> => {
  const response = await api.get('/financial', { params });
  return response.data.data;
};

export const getTransactionById = async (id: string): Promise<FinancialTransaction> => {
  const response = await api.get(`/financial/${id}`);
  return response.data.data;
};

export const createTransaction = async (data: {
  transactionType: string;
  amount: number;
  description: string;
  category?: string;
  paymentMethod?: string;
}): Promise<FinancialTransaction> => {
  const response = await api.post('/financial', data);
  return response.data.data;
};

export const recordExpense = async (data: {
  amount: number;
  description: string;
  category?: string;
  paymentMethod?: string;
}): Promise<FinancialTransaction> => {
  const response = await api.post('/financial/expense', data);
  return response.data.data;
};

export const getDailySummary = async (params?: { date?: string; canteenId?: string }): Promise<DailySummary> => {
  const response = await api.get('/financial/summary/daily', { params });
  return response.data.data;
};

export const getMonthlySummary = async (year?: number, month?: number): Promise<MonthlySummary> => {
  const response = await api.get('/financial/summary/monthly', { 
    params: { year, month } 
  });
  return response.data.data;
};

export const getSettlementReport = async (
  startDate: string, 
  endDate: string
): Promise<SettlementReport> => {
  const response = await api.get('/financial/settlement', { 
    params: { startDate, endDate } 
  });
  return response.data.data;
};

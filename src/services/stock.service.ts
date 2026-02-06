import api from './api.config';

// Types
export interface StockItem {
  id: string;
  itemName: string;
  category: 'VEGETABLES' | 'GRAINS' | 'DAIRY' | 'SPICES' | 'OILS' | 'PROTEINS' | 'BEVERAGES' | 'OTHER';
  unit: 'KG' | 'LITERS' | 'PIECES' | 'PACKETS' | 'BOXES';
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitPrice: number;
  supplier?: {
    name: string;
    contact: string;
    email: string;
  };
  lastRestocked?: string;
  expiryDate?: string;
  stockStatus: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'NORMAL' | 'OVERSTOCKED';
  canteen?: string | { _id: string; name: string };
}

export interface StockTransaction {
  id: string;
  stockItem: StockItem;
  transactionType: 'RESTOCK' | 'CONSUME' | 'ADJUST' | 'WASTE' | 'RETURN';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}

export interface StockSummary {
  totalInventoryValue: number;
  byCategory: { _id: string; totalItems: number; totalStock: number }[];
  lowStockCount: number;
  outOfStockCount: number;
  totalItems: number;
}

// ========== STOCK ENDPOINTS ==========

export const getStockItems = async (params?: {
  category?: string;
  stockStatus?: string;
}): Promise<{ stockItems: StockItem[]; total: number }> => {
  const response = await api.get('/stock', { params });
  return response.data.data;
};

export const getStockItemById = async (id: string): Promise<StockItem> => {
  const response = await api.get(`/stock/${id}`);
  return response.data.data;
};

export const createStockItem = async (data: Partial<StockItem>): Promise<StockItem> => {
  const response = await api.post('/stock', data);
  return response.data.data;
};

export const updateStockItem = async (id: string, data: Partial<StockItem>): Promise<StockItem> => {
  const response = await api.patch(`/stock/${id}`, data);
  return response.data.data;
};

export const deleteStockItem = async (id: string): Promise<void> => {
  await api.delete(`/stock/${id}`);
};

export const restockItem = async (id: string, data: {
  quantity: number;
  unitPrice?: number;
  referenceNumber?: string;
}): Promise<StockItem> => {
  const response = await api.post(`/stock/${id}/restock`, data);
  return response.data.data;
};

export const consumeStock = async (id: string, data: {
  quantity: number;
  reason?: string;
}): Promise<StockItem> => {
  const response = await api.post(`/stock/${id}/consume`, data);
  return response.data.data;
};

export const adjustStock = async (id: string, data: {
  newQuantity: number;
  reason?: string;
}): Promise<StockItem> => {
  const response = await api.post(`/stock/${id}/adjust`, data);
  return response.data.data;
};

export const getLowStockAlerts = async (): Promise<{
  alerts: StockItem[];
  count: number;
}> => {
  const response = await api.get('/stock/alerts');
  return response.data.data;
};

export const getStockTransactions = async (params?: {
  stockItem?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ transactions: StockTransaction[]; total: number }> => {
  const response = await api.get('/stock/transactions', { params });
  return response.data.data;
};

export const getStockSummary = async (): Promise<StockSummary> => {
  const response = await api.get('/stock/summary');
  return response.data.data;
};

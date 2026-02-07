import api from "./api.config";

// Types
export interface SystemSetting {
  id: string;
  _id?: string;
  settingKey: string;
  settingValue: string;
  dataType: "STRING" | "NUMBER" | "BOOLEAN" | "JSON";
  description?: string;
  category: "BOOKING" | "CAPACITY" | "NOTIFICATION" | "SECURITY" | "GENERAL";
  isEditable: boolean;
  typedValue?: string | number | boolean | object;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  userName?: string;
  userRole?: string;
  resource?: string;
  details?: Record<string, unknown>;
  createdAt?: string;
}

export interface PublicSettings {
  onlineBookingEnabled: boolean;
  walkinEnabled: boolean;
  slotDuration: number;
  operatingSchedule: Array<{
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    isHoliday: boolean;
  }> | null;
  masterBookingEnabled: boolean;
  autoBackupEnabled: boolean;
  tokenExpiryMins: number;
}

// ========== SETTINGS ENDPOINTS ==========

/**
 * Get all settings
 */
export const getAllSettings = async (
  category?: string,
): Promise<SystemSetting[]> => {
  const response = await api.get("/system", {
    params: category ? { category } : undefined,
  });
  return response.data.data?.settings || response.data.data || [];
};

/**
 * Get settings grouped by category
 */
export const getSettingsGrouped = async (): Promise<
  Record<string, SystemSetting[]>
> => {
  const response = await api.get("/system/grouped");
  return response.data.data;
};

/**
 * Get public booking/walk-in settings
 */
export const getPublicSettings = async (): Promise<PublicSettings> => {
  const response = await api.get("/system/public");
  return response.data.data;
};

/**
 * Get a single setting by key
 */
export const getSetting = async (key: string): Promise<SystemSetting> => {
  const response = await api.get(`/system/${key}`);
  return response.data.data;
};

/**
 * Create or update a setting (Admin only)
 */
export const upsertSetting = async (
  data: Partial<SystemSetting> & {
    settingKey: string;
    settingValue: string;
  },
): Promise<SystemSetting> => {
  const response = await api.post("/system", data);
  return response.data.data;
};

/**
 * Quick update setting value (Admin only)
 */
export const updateSettingValue = async (
  key: string,
  value: string | number | boolean,
): Promise<SystemSetting> => {
  const response = await api.patch(`/system/${key}`, { value });
  return response.data.data;
};

/**
 * Run a manual backup (Admin only)
 */
export const runBackup = async (): Promise<{ fileName: string }> => {
  const response = await api.post("/system/backup");
  return response.data.data;
};

/**
 * Get recent audit logs (Admin only)
 */
export const getAuditLogs = async (limit = 10): Promise<AuditLogEntry[]> => {
  const response = await api.get("/system/audit", { params: { limit } });
  return response.data.data || [];
};

/**
 * Delete a setting (Admin only)
 */
export const deleteSetting = async (key: string): Promise<void> => {
  await api.delete(`/system/${key}`);
};

/**
 * Bulk update settings (Admin only)
 */
export const bulkUpdateSettings = async (
  settings: Array<{ key: string; value: string | number | boolean }>,
): Promise<SystemSetting[]> => {
  const response = await api.post("/system/bulk", { settings });
  return response.data.data;
};

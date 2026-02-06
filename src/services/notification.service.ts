import api from "./api.config";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "announcement" | "alert" | "system";
  isRead: boolean;
  isUrgent: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get notifications for the current user
 */
export const getNotifications = async (params?: {
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
}): Promise<Notification[]> => {
  const response = await api.get("/notifications", { params });
  return response.data.data || [];
};

/**
 * Get system alerts for admin dashboard
 */
export const getSystemAlerts = async (limit = 10): Promise<Notification[]> => {
  const response = await api.get("/notifications", {
    params: { limit, unreadOnly: true },
  });
  return response.data.data || [];
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await api.post(`/notifications/${id}/read`);
  return response.data.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ markedCount: number }> => {
  const response = await api.post("/notifications/read-all");
  return response.data.data;
};

/**
 * Get unread count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get("/notifications/unread-count");
  return response.data.data?.unreadCount || 0;
};

/**
 * Send broadcast notification (management only)
 */
export const sendBroadcast = async (data: {
  title: string;
  message: string;
  type?: string;
  roles?: string[];
  isUrgent?: boolean;
}): Promise<{ recipientCount: number }> => {
  const response = await api.post("/notifications/broadcast", data);
  return response.data.data;
};

// Types for admin notification log
export interface NotificationLogEntry {
  title: string;
  message: string;
  sentByName: string | null;
  type: string;
  targetRoles: string[];
  recipientCount: number;
  createdAt: string;
}

/**
 * Get notification log for admin
 */
export const getNotificationLog = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
}): Promise<{ logs: NotificationLogEntry[]; total: number; page: number; limit: number }> => {
  const response = await api.get("/notifications/log", { params });
  return response.data.data;
};

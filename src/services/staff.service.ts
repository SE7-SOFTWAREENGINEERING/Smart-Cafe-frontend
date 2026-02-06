import api from "./api.config";

// ========== TYPES ==========

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Announcement {
  message: string;
  sentAt: string;
  recipientCount: number;
}

export interface QueueSlotStatus {
  slotTime: string;
  mealType: string;
  waiting: number;
  completed: number;
  noShows: number;
}

export interface QueueStatusResponse {
  currentTime: string;
  queueStatus: QueueSlotStatus[];
}

// ========== STAFF ENDPOINTS ==========

const staffService = {
  /**
   * Get all staff members (canteen_staff role)
   */
  getAllStaff: async () => {
    const response = await api.get("/users", {
      params: { role: "canteen_staff" },
    });
    return response.data;
  },

  /**
   * Add a new staff member via registration
   */
  addStaff: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post("/auth/register", {
      fullName: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "canteen_staff",
    });
    return response.data;
  },

  /**
   * Remove a staff member
   */
  removeStaff: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Send announcement to users with active bookings
   */
  sendAnnouncement: async (message: string) => {
    const response = await api.post("/staff/announcement", { message });
    return response.data;
  },

  /**
   * Get announcement history
   */
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await api.get("/staff/announcement");
    return response.data.data;
  },

  /**
   * Get live queue status
   */
  getQueueStatus: async (): Promise<{ data: QueueStatusResponse }> => {
    const response = await api.get("/staff/queue-status");
    return response.data;
  },
};

export default staffService;

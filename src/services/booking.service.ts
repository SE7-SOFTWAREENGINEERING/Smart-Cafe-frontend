import api from "./api.config";

// Types
export interface Slot {
  id: string;
  date: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  startTime: string;
  endTime: string;
  canteenId?: string;
  capacity: number;
  booked: number;
  available: number;
  status: "AVAILABLE" | "FULL" | "CANCELLED";
}

export interface BookingItem {
  menuItem: string;
  quantity: number;
  price: number;
  portionSize?: "Regular" | "Small";
}

export interface Booking {
  id: string;
  user: string;
  slot: Slot;
  tokenNumber: string;
  items: BookingItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  isWalkin?: boolean;
  guestName?: string;
  allocationReason?: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
}

const parseSlotTimeRange = (
  time?: string,
): { startTime: string; endTime: string } => {
  if (!time) {
    return { startTime: "", endTime: "" };
  }
  const delimiter = time.includes("-")
    ? "-"
    : time.includes("–")
      ? "–"
      : time.includes("—")
        ? "—"
        : "";
  if (!delimiter) {
    return { startTime: time, endTime: "" };
  }
  const parts = time
    .split(delimiter)
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    startTime: parts[0] || time,
    endTime: parts[1] || "",
  };
};

const normalizeSlot = (slot: any): Slot => {
  if (!slot) return slot;
  const { startTime, endTime } = parseSlotTimeRange(slot.time);
  return {
    ...slot,
    startTime: slot.startTime || startTime,
    endTime: slot.endTime || endTime,
  } as Slot;
};

const normalizeBooking = (booking: any): Booking => {
  if (!booking) return booking;
  return {
    ...booking,
    slot: booking.slot ? normalizeSlot(booking.slot) : booking.slot,
  } as Booking;
};

// ========== SLOT ENDPOINTS ==========

/**
 * Get today's available slots
 */
export const getTodaySlots = async (): Promise<Slot[]> => {
  const response = await api.get("/slots/today");
  const slots =
    response.data.data?.slots ||
    response.data.data?.items ||
    response.data.data ||
    [];
  return Array.isArray(slots) ? slots.map(normalizeSlot) : [];
};

export const getTodaySlotsByCanteen = async (
  canteenId?: string,
): Promise<Slot[]> => {
  const response = await api.get("/slots/today", {
    params: canteenId ? { canteenId } : undefined,
  });
  const slots =
    response.data.data?.slots ||
    response.data.data?.items ||
    response.data.data ||
    [];
  return Array.isArray(slots) ? slots.map(normalizeSlot) : [];
};

/**
 * Get slots with filters
 */
export const getSlots = async (params?: {
  date?: string;
  mealType?: string;
  status?: string;
  canteenId?: string;
}): Promise<Slot[]> => {
  const response = await api.get("/slots", { params });
  const slots =
    response.data.data?.slots ||
    response.data.data?.items ||
    response.data.data ||
    [];
  return Array.isArray(slots) ? slots.map(normalizeSlot) : [];
};

/**
 * Get slot by ID
 */
export const getSlotById = async (slotId: string): Promise<Slot> => {
  const response = await api.get(`/slots/${slotId}`);
  return normalizeSlot(response.data.data);
};

/**
 * Create a new slot (Management only)
 */
export const createSlot = async (data: {
  date: string;
  time: string;
  capacity: number;
  mealType?: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  canteenId?: string;
}): Promise<Slot> => {
  const response = await api.post("/slots", data);
  return normalizeSlot(response.data.data);
};

/**
 * Update a slot (Management only)
 */
export const updateSlot = async (
  slotId: string,
  data: Partial<{
    date: string;
    time: string;
    capacity: number;
    status: string;
    mealType: string;
  }>,
): Promise<Slot> => {
  const response = await api.patch(`/slots/${slotId}`, data);
  return normalizeSlot(response.data.data);
};

/**
 * Update slot capacity (Management only)
 */
export const updateSlotCapacity = async (
  slotId: string,
  capacity: number,
): Promise<Slot> => {
  const response = await api.patch(`/slots/${slotId}/capacity`, { capacity });
  return normalizeSlot(response.data.data);
};

/**
 * Cancel a slot (Management only)
 */
export const cancelSlotById = async (slotId: string): Promise<Slot> => {
  const response = await api.post(`/slots/${slotId}/cancel`);
  return normalizeSlot(response.data.data);
};

/**
 * Delete a slot (Management only)
 */
export const deleteSlot = async (slotId: string): Promise<void> => {
  await api.delete(`/slots/${slotId}`);
};

// ========== BOOKING ENDPOINTS ==========

/**
 * Get current user's bookings
 */
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/bookings/my");
  const bookings =
    response.data.data?.bookings ||
    response.data.data?.items ||
    response.data.data ||
    [];
  return Array.isArray(bookings) ? bookings.map(normalizeBooking) : [];
};

/**
 * Get all bookings (Management only)
 */
export const getAllBookings = async (params?: {
  date?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: Booking[]; total: number; page: number }> => {
  const response = await api.get("/bookings", { params });
  const data = response.data.data || {};
  const bookings = data.bookings || data.items || [];
  return {
    bookings: Array.isArray(bookings) ? bookings.map(normalizeBooking) : [],
    total: data.pagination?.total || 0,
    page: data.pagination?.page || 1,
  };
};

/**
 * Get scan history (Staff only)
 */
export const getScanHistory = async (params?: {
  date?: string;
  canteenId?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: Booking[]; total: number; page: number }> => {
  const response = await api.get("/bookings/scans", { params });
  const data = response.data.data || {};
  const bookings = data.bookings || data.items || [];
  return {
    bookings: Array.isArray(bookings) ? bookings.map(normalizeBooking) : [],
    total: data.pagination?.total || 0,
    page: data.pagination?.page || 1,
  };
};

/**
 * Create a new booking
 */
export const createBooking = async (data: {
  slotId: string;
  items: { menuItemId: string; quantity: number; portionSize?: string }[];
  notes?: string;
}): Promise<Booking> => {
  const response = await api.post("/bookings", data);
  return normalizeBooking(response.data.data);
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  bookingId: string,
  reason?: string,
): Promise<Booking> => {
  const response = await api.post(`/bookings/${bookingId}/cancel`, { reason });
  return normalizeBooking(response.data.data);
};

/**
 * Complete a booking (Staff only)
 */
export const completeBooking = async (bookingId: string): Promise<Booking> => {
  const response = await api.post(`/bookings/${bookingId}/complete`);
  return normalizeBooking(response.data.data);
};

/**
 * Get booking by token number (Staff only)
 */
export const getBookingByToken = async (
  tokenNumber: string,
): Promise<Booking> => {
  const response = await api.get(`/bookings/token/${tokenNumber}`);
  return normalizeBooking(response.data.data);
};

/**
 * Create walk-in booking (Staff only)
 */
export const createWalkinBooking = async (data: {
  slotId: string;
  guestName: string;
  items: { menuItem: string; quantity: number }[];
}): Promise<Booking> => {
  const response = await api.post("/bookings/walkin", data);
  return normalizeBooking(response.data.data);
};

/**
 * Mark booking as no-show (Staff only)
 */
export const markNoShow = async (bookingId: string): Promise<Booking> => {
  const response = await api.post(`/bookings/${bookingId}/no-show`);
  return normalizeBooking(response.data.data);
};

/**
 * Get booking statistics (Management only)
 */
export const getBookingStats = async (params?: {
  date?: string;
  canteenId?: string;
}): Promise<{
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  pending: number;
  confirmed: number;
  expired: number;
}> => {
  const response = await api.get("/bookings/stats", { params });
  return response.data.data;
};

// Legacy exports for backward compatibility
export const getSlots_legacy = getTodaySlots;
export const bookSlot = createBooking;
export const cancelSlot = cancelBooking;

/**
 * Queue info response from backend
 */
export interface QueueInfo {
  slotId: string;
  totalInQueue: number;
  completed: number;
  position: number;
  peopleAhead: number;
  avgServiceTimeMins: number;
  estimatedWaitMins: number;
}

/**
 * Get real-time queue info for a slot
 */
export const getQueueInfo = async (slotId: string): Promise<QueueInfo> => {
  const response = await api.get(`/bookings/queue-info/${slotId}`);
  return response.data.data;
};

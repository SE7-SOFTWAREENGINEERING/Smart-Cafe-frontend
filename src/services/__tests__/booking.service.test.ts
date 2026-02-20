import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSlots, bookSlot, cancelSlot } from "../booking.service";

import api from "../api.config";

vi.mock("../api.config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, true);

describe("Booking Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSlots", () => {
    it("should fetch available slots successfully", async () => {
      const mockSlots = [
        { id: "1", time: "12:00", capacity: 50, booked: 10 },
        { id: "2", time: "13:00", capacity: 50, booked: 25 },
      ];
      mockedApi.get.mockResolvedValueOnce({ data: { data: mockSlots } } as any);

      const result = await getSlots();

      expect(mockedApi.get).toHaveBeenCalledWith("/slots", {
        params: undefined,
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it("should throw error on fetch failure", async () => {
      mockedApi.get.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getSlots()).rejects.toThrow("Network Error");
    });
  });

  describe("bookSlot", () => {
    it("should book a slot successfully", async () => {
      const mockBooking = { id: "b1", slotId: "slot123" };
      mockedApi.post.mockResolvedValueOnce({
        data: { data: mockBooking },
      } as any);

      const payload = {
        slotId: "slot123",
        items: [{ menuItemId: "item1", quantity: 1 }],
      };
      const result = await bookSlot(payload as any);

      expect(mockedApi.post).toHaveBeenCalledWith("/bookings", payload);
      expect(result).toBeDefined();
    });

    it("should throw error when slot is full", async () => {
      mockedApi.post.mockRejectedValueOnce({
        response: { data: { message: "Slot is full" } },
      } as any);

      await expect(
        bookSlot({
          slotId: "full-slot",
          items: [{ menuItemId: "item1", quantity: 1 }],
        } as any),
      ).rejects.toBeDefined();
    });
  });

  describe("cancelSlot", () => {
    it("should cancel a booking successfully", async () => {
      const mockBooking = { id: "b1", status: "cancelled" };
      mockedApi.post.mockResolvedValueOnce({
        data: { data: mockBooking },
      } as any);

      const result = await cancelSlot("booking123");

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/bookings/booking123/cancel",
        {
          reason: undefined,
        },
      );
      expect(result).toBeDefined();
    });

    it("should handle cancel errors", async () => {
      mockedApi.post.mockRejectedValueOnce(new Error("Cancel failed"));

      await expect(cancelSlot("invalid-booking")).rejects.toThrow(
        "Cancel failed",
      );
    });
  });
});

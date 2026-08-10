import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";

import {
  fetchHolidayTypes,
  fetchHolidays,
  createHolidays,
  fetchHolidaysById,
  updateHolidays,
  deleteHolidays,
} from "../../services/holidayService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("holidayService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchHolidayTypes", () => {
    it("should fetch holiday types", async () => {
      const mockData = [
        { key: "public", label: "Public Holiday" },
        { key: "optional", label: "Optional Holiday" },
      ];

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchHolidayTypes();

      expect(API.get).toHaveBeenCalledWith("/holiday-types/");
      expect(result).toEqual(mockData);
    });
  });

  describe("fetchHolidays", () => {
    it("should fetch holidays with page number", async () => {
      const mockData = {
        results: [
          {
            id: 1,
            name: "Christmas",
          },
        ],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchHolidays(2);

      expect(API.get).toHaveBeenCalledWith("/holidays/?page=2");
      expect(result).toEqual(mockData);
    });

    it("should use page 1 by default", async () => {
      API.get.mockResolvedValue({
        data: {
          results: [],
        },
      });

      await fetchHolidays();

      expect(API.get).toHaveBeenCalledWith("/holidays/?page=1");
    });
  });

  describe("createHolidays", () => {
    it("should create a holiday", async () => {
      const payload = {
        name: "Christmas",
        date: "2026-12-25",
      };

      API.post.mockResolvedValue({
        data: payload,
      });

      const result = await createHolidays(payload);

      expect(API.post).toHaveBeenCalledWith(
        "/holidays/",
        payload
      );
      expect(result).toEqual(payload);
    });
  });

  describe("fetchHolidaysById", () => {
    it("should fetch holiday by id", async () => {
      const mockHoliday = {
        id: 5,
        name: "Onam",
      };

      API.get.mockResolvedValue({
        data: mockHoliday,
      });

      const result = await fetchHolidaysById(5);

      expect(API.get).toHaveBeenCalledWith("/holidays/5/");
      expect(result).toEqual(mockHoliday);
    });
  });

  describe("updateHolidays", () => {
    it("should update holiday", async () => {
      const payload = {
        name: "Updated Holiday",
      };

      API.put.mockResolvedValue({
        data: payload,
      });

      const result = await updateHolidays(3, payload);

      expect(API.put).toHaveBeenCalledWith(
        "/holidays/3/",
        payload
      );

      expect(result).toEqual(payload);
    });
  });

  describe("deleteHolidays", () => {
    it("should delete holiday", async () => {
      API.delete.mockResolvedValue({
        data: {
          success: true,
        },
      });

      const result = await deleteHolidays(7);

      expect(API.delete).toHaveBeenCalledWith("/holidays/7/");

      expect(result).toEqual({
        success: true,
      });
    });
  });

  describe("API failures", () => {
    it("should reject when fetchHolidayTypes fails", async () => {
      API.get.mockRejectedValue(new Error("Network Error"));

      await expect(fetchHolidayTypes()).rejects.toThrow("Network Error");
    });

    it("should reject when createHolidays fails", async () => {
      API.post.mockRejectedValue(new Error("Create Failed"));

      await expect(createHolidays({})).rejects.toThrow("Create Failed");
    });

    it("should reject when updateHolidays fails", async () => {
      API.put.mockRejectedValue(new Error("Update Failed"));

      await expect(updateHolidays(1, {})).rejects.toThrow("Update Failed");
    });

    it("should reject when deleteHolidays fails", async () => {
      API.delete.mockRejectedValue(new Error("Delete Failed"));

      await expect(deleteHolidays(1)).rejects.toThrow("Delete Failed");
    });
  });
});
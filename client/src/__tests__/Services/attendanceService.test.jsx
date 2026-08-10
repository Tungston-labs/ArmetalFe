import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  fetchAttendanceList,
  fetchAttendanceDetail,
  fetchDepartmentsAttendance,
  fetchAttendanceSummary,
} from "../../services/attendanceService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("attendanceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAttendanceList", () => {
    it("should fetch attendance list", async () => {
      const mockData = {
        results: [{ id: 1 }],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchAttendanceList({
        page: 1,
        search: "john",
      });

      expect(API.get).toHaveBeenCalledWith("/admin/attendance/", {
        params: {
          page: 1,
          search: "john",
        },
      });

      expect(result).toEqual(mockData);
    });

    it("should throw error when request fails", async () => {
      API.get.mockRejectedValue(new Error("Network Error"));

      await expect(fetchAttendanceList()).rejects.toThrow(
        "Network Error"
      );
    });
  });

  describe("fetchAttendanceDetail", () => {
    it("should fetch detail with date", async () => {
      API.get.mockResolvedValue({
        data: { id: 10 },
      });

      const result = await fetchAttendanceDetail(
        10,
        "2025-07-10"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/admin/attendance/10/?date=2025-07-10"
      );

      expect(result).toEqual({
        id: 10,
      });
    });

    it("should fetch detail without date", async () => {
      API.get.mockResolvedValue({
        data: { id: 5 },
      });

      await fetchAttendanceDetail(5);

      expect(API.get).toHaveBeenCalledWith(
        "/admin/attendance/5/"
      );
    });

    it("should reject on API error", async () => {
      API.get.mockRejectedValue(new Error("API Error"));

      await expect(fetchAttendanceDetail(1)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("fetchDepartmentsAttendance", () => {
    it("should fetch departments with search and page", async () => {
      const mockData = {
        results: [],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchDepartmentsAttendance({
        page: 2,
        search: "HR",
      });

      expect(API.get).toHaveBeenCalledWith(
        "/dept-attendance/?search=HR&page=2"
      );

      expect(result).toEqual(mockData);
    });

    it("should fetch departments with default params", async () => {
      API.get.mockResolvedValue({
        data: [],
      });

      await fetchDepartmentsAttendance({});

      expect(API.get).toHaveBeenCalledWith(
        "/dept-attendance/?page=1"
      );
    });

    it("should reject when API fails", async () => {
      API.get.mockRejectedValue(new Error("Failed"));

      await expect(
        fetchDepartmentsAttendance({})
      ).rejects.toThrow("Failed");
    });
  });

  describe("fetchAttendanceSummary", () => {
    it("should fetch summary with token", async () => {
      const mockData = {
        results: [],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchAttendanceSummary({
        year: 2025,
        month: 6,
        token: "abc123",
        page: 2,
      });

      expect(API.get).toHaveBeenCalledWith(
        "/employee-attendance/summary/",
        {
          params: {
            year: 2025,
            month: 6,
            page: 2,
            page_size: 20,
          },
          headers: {
            Authorization: "Bearer abc123",
          },
        }
      );

      expect(result).toEqual(mockData);
    });

    it("should fetch summary without token", async () => {
      API.get.mockResolvedValue({
        data: {
          results: [],
        },
      });

      await fetchAttendanceSummary({
        year: 2025,
        month: 7,
      });

      expect(API.get).toHaveBeenCalledWith(
        "/employee-attendance/summary/",
        {
          params: {
            year: 2025,
            month: 7,
            page: 1,
            page_size: 20,
          },
        }
      );
    });

    it("should reject when API fails", async () => {
      API.get.mockRejectedValue(new Error("Summary Error"));

      await expect(
        fetchAttendanceSummary({
          year: 2025,
          month: 6,
        })
      ).rejects.toThrow("Summary Error");
    });
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  fetchAllLeaveRequests,
  fetchLeaveDetailsById,
  updateLeaveStatus,
  fetchOnLeaveEmployees,
} from "../../services/leaveService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("leaveService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAllLeaveRequests", () => {
    it("fetches leave requests with only page", async () => {
      const response = {
        results: [{ id: 1, employee: "John" }],
      };

      API.get.mockResolvedValue({ data: response });

      const result = await fetchAllLeaveRequests({ page: 1 });

      expect(API.get).toHaveBeenCalledWith("/leave/admin/?page=1");
      expect(result).toEqual(response);
    });

    it("fetches leave requests with all filters", async () => {
      const response = {
        results: [{ id: 2 }],
      };

      API.get.mockResolvedValue({ data: response });

      const filters = {
        page: 2,
        status: "approved",
        department_id: 5,
        search: "john",
        month: 7,
        year: 2026,
      };

      const result = await fetchAllLeaveRequests(filters);

      expect(API.get).toHaveBeenCalledWith(
        "/leave/admin/?page=2&status=approved&department_id=5&search=john&month=7&year=2026"
      );

      expect(result).toEqual(response);
    });

    it("throws error when fetchAllLeaveRequests fails", async () => {
      API.get.mockRejectedValue(new Error("Network Error"));

      await expect(
        fetchAllLeaveRequests({ page: 1 })
      ).rejects.toThrow("Network Error");
    });
  });

  describe("fetchLeaveDetailsById", () => {
    it("fetches leave details", async () => {
      const response = {
        id: 10,
        employee: "Alice",
      };

      API.get.mockResolvedValue({ data: response });

      const result = await fetchLeaveDetailsById(10);

      expect(API.get).toHaveBeenCalledWith("/leave/admin/10/");
      expect(result).toEqual(response);
    });

    it("throws error when fetchLeaveDetailsById fails", async () => {
      API.get.mockRejectedValue(new Error("Request Failed"));

      await expect(fetchLeaveDetailsById(10)).rejects.toThrow(
        "Request Failed"
      );
    });
  });

  describe("updateLeaveStatus", () => {
    it("updates leave status", async () => {
      const response = {
        id: 5,
        status: "approved",
      };

      API.patch.mockResolvedValue({ data: response });

      const result = await updateLeaveStatus(5, "approved");

      expect(API.patch).toHaveBeenCalledWith(
        "/leave/admin/5/",
        {
          status: "approved",
        }
      );

      expect(result).toEqual(response);
    });

    it("throws error when updateLeaveStatus fails", async () => {
      API.patch.mockRejectedValue(new Error("Update Failed"));

      await expect(
        updateLeaveStatus(5, "approved")
      ).rejects.toThrow("Update Failed");
    });
  });

  describe("fetchOnLeaveEmployees", () => {
    it("fetches employees currently on leave", async () => {
      const response = [
        {
          id: 1,
          name: "John",
        },
        {
          id: 2,
          name: "Alice",
        },
      ];

      API.get.mockResolvedValue({ data: response });

      const result = await fetchOnLeaveEmployees(3);

      expect(API.get).toHaveBeenCalledWith(
        "/departments/3/on-leave-employees/"
      );

      expect(result).toEqual(response);
    });

    it("throws error when fetchOnLeaveEmployees fails", async () => {
      API.get.mockRejectedValue(new Error("Server Error"));

      await expect(fetchOnLeaveEmployees(3)).rejects.toThrow(
        "Server Error"
      );
    });
  });
});
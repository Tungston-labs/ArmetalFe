import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  getGroupedReimbursements,
  fetchReimbursementsByDepartment,
  updateReimbursementStatus,
  fetchReimbursementDetail,
} from "../../services/reimbursement";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("reimbursementService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGroupedReimbursements", () => {
    it("should fetch grouped reimbursements", async () => {
      const mockData = [
        {
          date: "2026-08-01",
          reimbursements: [],
        },
      ];

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await getGroupedReimbursements();

      expect(API.get).toHaveBeenCalledWith(
        "/reimbursements/grouped/"
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("fetchReimbursementsByDepartment", () => {
    it("should fetch reimbursements by department with default pagination", async () => {
      const mockData = {
        results: [],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchReimbursementsByDepartment(5);

      expect(API.get).toHaveBeenCalledWith(
        "/reimbursements/department/5/?page=1&page_size=20"
      );

      expect(result).toEqual(mockData);
    });

    it("should fetch reimbursements with custom page and page size", async () => {
      const mockData = {
        results: [{ id: 1 }],
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchReimbursementsByDepartment(
        2,
        3,
        50
      );

      expect(API.get).toHaveBeenCalledWith(
        "/reimbursements/department/2/?page=3&page_size=50"
      );

      expect(result).toEqual(mockData);
    });
  });

  describe("updateReimbursementStatus", () => {
    it("should update reimbursement status", async () => {
      const mockResponse = {
        id: 1,
        status: "approved",
      };

      API.patch.mockResolvedValue({
        data: mockResponse,
      });

      const result = await updateReimbursementStatus(
        1,
        "approved"
      );

      expect(API.patch).toHaveBeenCalledWith(
        "/reimbursements/1/",
        {
          status: "approved",
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw API response data on failure", async () => {
      const error = {
        response: {
          data: {
            message: "Update failed",
          },
        },
      };

      API.patch.mockRejectedValue(error);

      await expect(
        updateReimbursementStatus(1, "rejected")
      ).rejects.toEqual({
        message: "Update failed",
      });
    });

    it("should throw message when response is unavailable", async () => {
      API.patch.mockRejectedValue(new Error("Network Error"));

      await expect(
        updateReimbursementStatus(1, "approved")
      ).rejects.toBe("Network Error");
    });
  });

  describe("fetchReimbursementDetail", () => {
    it("should fetch reimbursement detail", async () => {
      const mockData = {
        id: 10,
        amount: 500,
      };

      API.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchReimbursementDetail(10);

      expect(API.get).toHaveBeenCalledWith(
        "/reimbursements/10/"
      );

      expect(result).toEqual(mockData);
    });
  });
});
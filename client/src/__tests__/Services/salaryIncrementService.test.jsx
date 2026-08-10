import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  listSalaryIncrementService,
  addSalaryIncrementService,
} from "../../services/salaryIncrementService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("salaryIncrementService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listSalaryIncrementService", () => {
    it("should fetch salary increments successfully", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 1,
              amount: 5000,
            },
          ],
        },
      };

      API.get.mockResolvedValue(mockResponse);

      const result = await listSalaryIncrementService(10);

      expect(API.get).toHaveBeenCalledWith("/salary-increment/10/");
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error if fetch fails", async () => {
      const error = new Error("Failed to fetch");

      API.get.mockRejectedValue(error);

      await expect(listSalaryIncrementService(10)).rejects.toThrow(
        "Failed to fetch"
      );

      expect(API.get).toHaveBeenCalledWith("/salary-increment/10/");
    });
  });

  describe("addSalaryIncrementService", () => {
    it("should add salary increment successfully", async () => {
      const payload = {
        amount: 2000,
        reason: "Performance",
      };

      const mockResponse = {
        data: {
          id: 2,
          ...payload,
        },
      };

      API.post.mockResolvedValue(mockResponse);

      const result = await addSalaryIncrementService(5, payload);

      expect(API.post).toHaveBeenCalledWith(
        "/salary-increment/5/",
        payload
      );

      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error if create fails", async () => {
      const payload = {
        amount: 3000,
      };

      const error = new Error("Create failed");

      API.post.mockRejectedValue(error);

      await expect(
        addSalaryIncrementService(5, payload)
      ).rejects.toThrow("Create failed");

      expect(API.post).toHaveBeenCalledWith(
        "/salary-increment/5/",
        payload
      );
    });
  });
});
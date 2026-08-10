import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import API from "../../services/api";
import {
  createFinanceService,
  listFinanceService,
  deleteFinanceService,
  createFinanceCategoryService,
  listFinanceCategoryService,
} from "../../services/financeService";

describe("financeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createFinanceService", () => {
    it("creates finance record", async () => {
      const payload = {
        amount: 1000,
        type: "income",
      };

      const response = {
        data: {
          id: 1,
          ...payload,
        },
      };

      API.post.mockResolvedValue(response);

      const result = await createFinanceService(payload);

      expect(API.post).toHaveBeenCalledWith("/finance/", payload);
      expect(result).toEqual(response.data);
    });
  });

  describe("listFinanceService", () => {
    it("fetches finance list with default params", async () => {
      const response = {
        data: {
          results: [],
        },
      };

      API.get.mockResolvedValue(response);

      const result = await listFinanceService();

      expect(API.get).toHaveBeenCalledWith(
        "/finance/?page=1&page_size=20"
      );

      expect(result).toEqual(response.data);
    });

    it("fetches finance list with search", async () => {
      API.get.mockResolvedValue({
        data: { results: [] },
      });

      await listFinanceService(2, 10, "salary");

      expect(API.get).toHaveBeenCalledWith(
        "/finance/?page=2&page_size=10&search=salary"
      );
    });

    it("fetches finance list with payment type", async () => {
      API.get.mockResolvedValue({
        data: { results: [] },
      });

      await listFinanceService(
        3,
        15,
        "",
        "cash"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/finance/?page=3&page_size=15&payment_type=cash"
      );
    });

    it("fetches finance list with search and payment type", async () => {
      API.get.mockResolvedValue({
        data: { results: [] },
      });

      await listFinanceService(
        4,
        25,
        "rent",
        "bank"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/finance/?page=4&page_size=25&search=rent&payment_type=bank"
      );
    });
  });

  describe("deleteFinanceService", () => {
    it("deletes finance record", async () => {
      const response = {
        data: {
          success: true,
        },
      };

      API.delete.mockResolvedValue(response);

      const result = await deleteFinanceService(12);

      expect(API.delete).toHaveBeenCalledWith(
        "/finance/12/"
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("createFinanceCategoryService", () => {
    it("creates finance category", async () => {
      const payload = {
        name: "Office Expense",
      };

      const response = {
        data: {
          id: 1,
          ...payload,
        },
      };

      API.post.mockResolvedValue(response);

      const result =
        await createFinanceCategoryService(payload);

      expect(API.post).toHaveBeenCalledWith(
        "/finance/categories/",
        payload
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("listFinanceCategoryService", () => {
    it("fetches categories without payment type", async () => {
      const response = {
        data: [],
      };

      API.get.mockResolvedValue(response);

      const result =
        await listFinanceCategoryService();

      expect(API.get).toHaveBeenCalledWith(
        "/finance/categories/",
        {
          params: {},
        }
      );

      expect(result).toEqual(response.data);
    });

    it("fetches categories with payment type", async () => {
      API.get.mockResolvedValue({
        data: [],
      });

      await listFinanceCategoryService("cash");

      expect(API.get).toHaveBeenCalledWith(
        "/finance/categories/",
        {
          params: {
            payment_type: "cash",
          },
        }
      );
    });
  });
});
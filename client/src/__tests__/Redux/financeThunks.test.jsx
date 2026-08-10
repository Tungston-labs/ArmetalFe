import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "../../Redux/financeSlice";

import {
  createFinance,
  fetchFinanceList,
  deleteFinance,
  createFinanceCategory,
  fetchFinanceCategoryList,
} from "../../Redux/financeThunks";

import {
  createFinanceService,
  listFinanceService,
  deleteFinanceService,
  createFinanceCategoryService,
  listFinanceCategoryService,
} from "../../services/financeService";

vi.mock("../../services/financeService", () => ({
  createFinanceService: vi.fn(),
  listFinanceService: vi.fn(),
  deleteFinanceService: vi.fn(),
  createFinanceCategoryService: vi.fn(),
  listFinanceCategoryService: vi.fn(),
}));

describe("financeThunks", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        finance: financeReducer,
      },
    });
  });

  describe("createFinance", () => {
    it("dispatches fulfilled", async () => {
      const response = {
        id: 1,
        amount: 1000,
      };

      createFinanceService.mockResolvedValue(response);

      const result = await store.dispatch(
        createFinance({
          amount: 1000,
        })
      );

      expect(result.type).toBe("finance/create/fulfilled");
      expect(result.payload).toEqual(response);
      expect(createFinanceService).toHaveBeenCalledTimes(1);
    });

    it("dispatches rejected", async () => {
      createFinanceService.mockRejectedValue({
        response: {
          data: "Create Failed",
        },
      });

      const result = await store.dispatch(
        createFinance({})
      );

      expect(result.type).toBe("finance/create/rejected");
      expect(result.payload).toBe("Create Failed");
    });
  });

  describe("fetchFinanceList", () => {
    it("dispatches fulfilled", async () => {
      const response = {
        results: [{ id: 1 }],
        total_items: 1,
        total_pages: 1,
        current_page: 1,
      };

      listFinanceService.mockResolvedValue(response);

      const result = await store.dispatch(
        fetchFinanceList({
          page: 2,
          pageSize: 10,
          search: "salary",
          payment_type: "Income",
        })
      );

      expect(result.type).toBe("finance/list/fulfilled");
      expect(result.payload).toEqual(response);

      expect(listFinanceService).toHaveBeenCalledWith(
        2,
        10,
        "salary",
        "Income"
      );
    });

    it("uses default values", async () => {
      listFinanceService.mockResolvedValue({
        results: [],
      });

      await store.dispatch(fetchFinanceList());

      expect(listFinanceService).toHaveBeenCalledWith(
        1,
        20,
        "",
        ""
      );
    });

    it("dispatches rejected", async () => {
      listFinanceService.mockRejectedValue({
        response: {
          data: "Fetch Failed",
        },
      });

      const result = await store.dispatch(
        fetchFinanceList()
      );

      expect(result.type).toBe("finance/list/rejected");
      expect(result.payload).toBe("Fetch Failed");
    });
  });

  describe("deleteFinance", () => {
    it("dispatches fulfilled", async () => {
      deleteFinanceService.mockResolvedValue({});

      const result = await store.dispatch(
        deleteFinance(5)
      );

      expect(result.type).toBe("finance/delete/fulfilled");
      expect(result.payload).toBe(5);

      expect(deleteFinanceService).toHaveBeenCalledWith(5);
    });

    it("dispatches rejected", async () => {
      deleteFinanceService.mockRejectedValue({
        response: {
          data: "Delete Failed",
        },
      });

      const result = await store.dispatch(
        deleteFinance(5)
      );

      expect(result.type).toBe("finance/delete/rejected");
      expect(result.payload).toBe("Delete Failed");
    });
  });

  describe("createFinanceCategory", () => {
    it("dispatches fulfilled", async () => {
      const response = {
        id: 10,
        name: "Travel",
      };

      createFinanceCategoryService.mockResolvedValue(response);

      const result = await store.dispatch(
        createFinanceCategory({
          name: "Travel",
        })
      );

      expect(result.type).toBe(
        "financeCategory/create/fulfilled"
      );
      expect(result.payload).toEqual(response);
    });

    it("dispatches rejected", async () => {
      createFinanceCategoryService.mockRejectedValue({
        response: {
          data: "Category Failed",
        },
      });

      const result = await store.dispatch(
        createFinanceCategory({})
      );

      expect(result.type).toBe(
        "financeCategory/create/rejected"
      );
      expect(result.payload).toBe("Category Failed");
    });
  });

  describe("fetchFinanceCategoryList", () => {
    it("dispatches fulfilled", async () => {
      const response = [
        {
          id: 1,
          name: "Food",
        },
      ];

      listFinanceCategoryService.mockResolvedValue(response);

      const result = await store.dispatch(
        fetchFinanceCategoryList("Expense")
      );

      expect(result.type).toBe(
        "financeCategory/list/fulfilled"
      );

      expect(result.payload).toEqual(response);

      expect(listFinanceCategoryService).toHaveBeenCalledWith(
        "Expense"
      );
    });

    it("uses default payment type", async () => {
      listFinanceCategoryService.mockResolvedValue([]);

      await store.dispatch(fetchFinanceCategoryList());

      expect(listFinanceCategoryService).toHaveBeenCalledWith("");
    });

    it("dispatches rejected", async () => {
      listFinanceCategoryService.mockRejectedValue({
        response: {
          data: "List Failed",
        },
      });

      const result = await store.dispatch(
        fetchFinanceCategoryList()
      );

      expect(result.type).toBe(
        "financeCategory/list/rejected"
      );

      expect(result.payload).toBe("List Failed");
    });
  });
});
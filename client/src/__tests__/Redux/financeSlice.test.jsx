import { describe, it, expect } from "vitest";
import reducer from "../../Redux/financeSlice";
import {
  createFinance,
  fetchFinanceList,
  deleteFinance,
} from "../../Redux/financeThunks";

describe("financeSlice", () => {
  const initialState = {
    list: [],
    pagination: {},
    totalIncome: 0,
    totalExpense: 0,
    cashBalance: 0,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("createFinance", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        createFinance.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const finance = {
        id: 1,
        amount: 1000,
        type: "Income",
      };

      const state = reducer(
        initialState,
        createFinance.fulfilled(finance, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual([finance]);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        createFinance.rejected(
          new Error(),
          "",
          {},
          "Create Failed"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Create Failed");
    });
  });

  describe("fetchFinanceList", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        fetchFinanceList.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          { id: 1, amount: 100 },
          { id: 2, amount: 200 },
        ],
        total_items: 2,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
        total_income: 500,
        total_expense: 300,
        cash_balance: 200,
      };

      const state = reducer(
        initialState,
        fetchFinanceList.fulfilled(payload, "", {})
      );

      expect(state.loading).toBe(false);

      expect(state.list).toEqual(payload.results);

      expect(state.pagination).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        next: null,
        previous: null,
      });

      expect(state.totalIncome).toBe(500);
      expect(state.totalExpense).toBe(300);
      expect(state.cashBalance).toBe(200);
    });

    it("should use zero when totals are missing", () => {
      const payload = {
        results: [],
        total_items: 0,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
      };

      const state = reducer(
        initialState,
        fetchFinanceList.fulfilled(payload, "", {})
      );

      expect(state.totalIncome).toBe(0);
      expect(state.totalExpense).toBe(0);
      expect(state.cashBalance).toBe(0);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        fetchFinanceList.rejected(
          new Error(),
          "",
          {},
          "Fetch Failed"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Fetch Failed");
    });
  });

  describe("deleteFinance", () => {
    const populatedState = {
      ...initialState,
      list: [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 },
        { id: 3, amount: 300 },
      ],
    };

    it("should handle pending", () => {
      const state = reducer(
        populatedState,
        deleteFinance.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("should delete finance record", () => {
      const state = reducer(
        populatedState,
        deleteFinance.fulfilled(2, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual([
        { id: 1, amount: 100 },
        { id: 3, amount: 300 },
      ]);
    });

    it("should do nothing if id is not found", () => {
      const state = reducer(
        populatedState,
        deleteFinance.fulfilled(100, "", {})
      );

      expect(state.list).toEqual(populatedState.list);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        deleteFinance.rejected(
          new Error(),
          "",
          {},
          "Delete Failed"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Delete Failed");
    });
  });
});
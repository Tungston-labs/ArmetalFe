import { describe, it, expect } from "vitest";
import reducer, {
  fetchSalaryIncrements,
  addSalaryIncrement,
  clearIncrementState,
} from "../../Redux/salaryIncrementSlice";

describe("salaryIncrementSlice", () => {
  const initialState = {
    increments: [],
    loading: false,
    error: null,
    success: false,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("clearIncrementState", () => {
    it("should clear loading, error and success", () => {
      const state = reducer(
        {
          increments: [{ id: 1 }],
          loading: true,
          error: "Something went wrong",
          success: true,
        },
        clearIncrementState()
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
      expect(state.increments).toEqual([{ id: 1 }]);
    });
  });

  describe("fetchSalaryIncrements", () => {
    it("should handle pending", () => {
      const state = reducer(initialState, {
        type: fetchSalaryIncrements.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled with results", () => {
      const payload = {
        results: [
          {
            id: 1,
            amount: 500,
          },
          {
            id: 2,
            amount: 1000,
          },
        ],
      };

      const state = reducer(initialState, {
        type: fetchSalaryIncrements.fulfilled.type,
        payload,
      });

      expect(state.loading).toBe(false);
      expect(state.increments).toEqual(payload.results);
    });

    it("should handle fulfilled with empty payload", () => {
      const state = reducer(initialState, {
        type: fetchSalaryIncrements.fulfilled.type,
        payload: {},
      });

      expect(state.loading).toBe(false);
      expect(state.increments).toEqual([]);
    });

    it("should handle rejected", () => {
      const state = reducer(initialState, {
        type: fetchSalaryIncrements.rejected.type,
        payload: "Server Error",
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Server Error");
    });
  });

  describe("addSalaryIncrement", () => {
    it("should handle pending", () => {
      const state = reducer(initialState, {
        type: addSalaryIncrement.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });

    it("should handle fulfilled", () => {
      const existingState = {
        ...initialState,
        increments: [
          {
            id: 1,
            amount: 500,
          },
        ],
      };

      const newIncrement = {
        id: 2,
        amount: 1000,
      };

      const state = reducer(existingState, {
        type: addSalaryIncrement.fulfilled.type,
        payload: newIncrement,
      });

      expect(state.loading).toBe(false);
      expect(state.success).toBe(true);
      expect(state.increments).toEqual([
        newIncrement,
        {
          id: 1,
          amount: 500,
        },
      ]);
    });

    it("should handle rejected", () => {
      const state = reducer(initialState, {
        type: addSalaryIncrement.rejected.type,
        payload: "Validation Error",
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Validation Error");
      expect(state.success).toBe(false);
    });
  });
});
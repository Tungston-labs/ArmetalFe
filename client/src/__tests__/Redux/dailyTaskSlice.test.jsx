import { describe, it, expect } from "vitest";
import reducer, {
  clearTasks,
  getEmployees,
  getTasks,
} from "../../Redux/dailyTaskSlice";

describe("dailyTaskSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return the initial state", () => {
    expect(initialState).toEqual({
      employees: [],
      tasks: [],
      loading: false,
      error: null,
    });
  });

  describe("clearTasks", () => {
    it("should clear all tasks", () => {
      const state = reducer(
        {
          ...initialState,
          tasks: [
            { id: 1, task: "Task 1" },
            { id: 2, task: "Task 2" },
          ],
        },
        clearTasks()
      );

      expect(state.tasks).toEqual([]);
    });
  });

  describe("getEmployees", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getEmployees.pending("", {})
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled with employee array", () => {
      const payload = [
        {
          id: 1,
          name: "John",
        },
        {
          id: 2,
          name: "Alice",
        },
      ];

      const state = reducer(
        initialState,
        getEmployees.fulfilled(payload, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.employees).toEqual(payload);
    });

    it("should handle fulfilled with non-array response", () => {
      const state = reducer(
        initialState,
        getEmployees.fulfilled({}, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.employees).toEqual([]);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getEmployees.rejected(
          null,
          "",
          {},
          "Employee fetch failed"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Employee fetch failed");
    });
  });

  describe("getTasks", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getTasks.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const payload = [
        {
          id: 1,
          title: "Task A",
        },
        {
          id: 2,
          title: "Task B",
        },
      ];

      const state = reducer(
        initialState,
        getTasks.fulfilled(payload, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.tasks).toEqual(payload);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getTasks.rejected(
          null,
          "",
          {},
          "Task fetch failed"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Task fetch failed");
    });
  });
});
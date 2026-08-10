import { describe, it, expect } from "vitest";
import reducer, {
  getLeaveRequests,
  getLeaveDetails,
  getOnLeaveEmployees,
  patchLeaveStatus,
  getEmployeePendingLeaves,
} from "../../Redux/leaveSlice";

describe("leaveSlice reducer", () => {
  const initialState = {
    leaves: [],
    onLeaveEmployees: [],
    leaveDetails: null,
    pendingLeaves: 0,
    loading: false,
    error: null,
    pagination: {
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      total_items: 0,
    },
  };

  it("should return initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("getLeaveRequests", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: getLeaveRequests.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const payload = {
        results: [{ id: 1, employee: "John" }],
        total_pages: 5,
        current_page: 2,
        next: "page3",
        previous: "page1",
        total_items: 50,
      };

      const state = reducer(initialState, {
        type: getLeaveRequests.fulfilled.type,
        payload,
      });

      expect(state.loading).toBe(false);
      expect(state.leaves).toEqual(payload.results);

      expect(state.pagination).toEqual({
        total_pages: 5,
        current_page: 2,
        next: "page3",
        previous: "page1",
        total_items: 50,
      });
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: getLeaveRequests.rejected.type,
        payload: "Network Error",
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network Error");
    });
  });

  describe("getEmployeePendingLeaves", () => {
    it("updates pending leave count", () => {
      const state = reducer(initialState, {
        type: getEmployeePendingLeaves.fulfilled.type,
        payload: 8,
      });

      expect(state.pendingLeaves).toBe(8);
    });
  });

  describe("getLeaveDetails", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: getLeaveDetails.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const details = {
        id: 11,
        reason: "Medical",
      };

      const state = reducer(initialState, {
        type: getLeaveDetails.fulfilled.type,
        payload: details,
      });

      expect(state.loading).toBe(false);
      expect(state.leaveDetails).toEqual(details);
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: getLeaveDetails.rejected.type,
        payload: "Error",
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Error");
    });
  });

  describe("patchLeaveStatus", () => {
    it("updates matching leave", () => {
      const currentState = {
        ...initialState,
        leaves: [
          { id: 1, status: "Pending" },
          { id: 2, status: "Pending" },
        ],
      };

      const updatedLeave = {
        id: 2,
        status: "Approved",
      };

      const state = reducer(currentState, {
        type: patchLeaveStatus.fulfilled.type,
        payload: updatedLeave,
      });

      expect(state.leaves[1]).toEqual(updatedLeave);
    });

    it("does nothing if leave id not found", () => {
      const currentState = {
        ...initialState,
        leaves: [{ id: 1, status: "Pending" }],
      };

      const state = reducer(currentState, {
        type: patchLeaveStatus.fulfilled.type,
        payload: {
          id: 999,
          status: "Rejected",
        },
      });

      expect(state.leaves).toEqual([{ id: 1, status: "Pending" }]);
    });
  });

  describe("getOnLeaveEmployees", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: getOnLeaveEmployees.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const employees = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const state = reducer(initialState, {
        type: getOnLeaveEmployees.fulfilled.type,
        payload: employees,
      });

      expect(state.loading).toBe(false);
      expect(state.onLeaveEmployees).toEqual(employees);
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: getOnLeaveEmployees.rejected.type,
        payload: "Server Error",
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Server Error");
    });
  });
});
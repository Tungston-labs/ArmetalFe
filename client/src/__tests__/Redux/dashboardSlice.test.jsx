import { describe, it, expect } from "vitest";
import reducer, {
  getDashboardSummary,
  getDashCounts,
  getReimbursementCounts,
  getReimbursementMonthwise,
  getDepartmentDashboard,
  getRecentEmployees,
  getContractExpiry,
  getSimpleNotifications,
  getTodayEmployeeStats,
  getHolidaySummary,
  getProjectEmployeeCount,
} from "../../Redux/dashboardSlice";

describe("dashboardSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return initial state", () => {
    expect(initialState).toEqual({
      summary: {},
      counts: {},
      reimbursements: {},
      reimbursementMonthwise: {},
      departmentSummary: {},
      recentEmployees: [],
      contractExpiry: [],
      notifications: [],
      todayStats: {},
      holidaySummary: {},
      projectEmployeeCount: {},
      loading: {
        summary: false,
        counts: false,
        reimbursements: false,
        reimbursementMonthwise: false,
        departmentSummary: false,
        recentEmployees: false,
        contractExpiry: false,
        notifications: false,
        todayStats: false,
        holidaySummary: false,
        projectEmployeeCount: false,
      },
      error: null,
    });
  });

  describe("Dashboard Summary", () => {
    it("handles pending", () => {
      const state = reducer(
        initialState,
        getDashboardSummary.pending("", undefined)
      );

      expect(state.loading.summary).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const payload = { totalEmployees: 50 };

      const state = reducer(
        initialState,
        getDashboardSummary.fulfilled(payload, "", undefined)
      );

      expect(state.loading.summary).toBe(false);
      expect(state.summary).toEqual(payload);
    });

    it("handles rejected", () => {
      const state = reducer(
        initialState,
        getDashboardSummary.rejected(
          null,
          "",
          undefined,
          "Summary Error"
        )
      );

      expect(state.loading.summary).toBe(false);
      expect(state.error).toBe("Summary Error");
    });
  });

  const asyncCases = [
    {
      thunk: getDashCounts,
      key: "counts",
      payload: { employees: 10 },
    },
    {
      thunk: getReimbursementCounts,
      key: "reimbursements",
      payload: { pending: 5 },
    },
    {
      thunk: getReimbursementMonthwise,
      key: "reimbursementMonthwise",
      payload: { January: 1000 },
    },
    {
      thunk: getDepartmentDashboard,
      key: "departmentSummary",
      payload: [{ department: "HR" }],
    },
    {
      thunk: getRecentEmployees,
      key: "recentEmployees",
      payload: [{ id: 1 }],
    },
    {
      thunk: getContractExpiry,
      key: "contractExpiry",
      payload: [{ id: 2 }],
    },
    {
      thunk: getSimpleNotifications,
      key: "notifications",
      payload: [{ id: 3 }],
    },
    {
      thunk: getTodayEmployeeStats,
      key: "todayStats",
      payload: { present: 25 },
    },
    {
      thunk: getHolidaySummary,
      key: "holidaySummary",
      payload: { holidays: 8 },
    },
    {
      thunk: getProjectEmployeeCount,
      key: "projectEmployeeCount",
      payload: { projectA: 20 },
    },
  ];

  describe.each(asyncCases)("$key", ({ thunk, key, payload }) => {
    it("handles pending", () => {
      const state = reducer(
        initialState,
        thunk.pending("", undefined)
      );

      expect(state.loading[key]).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const state = reducer(
        initialState,
        thunk.fulfilled(payload, "", undefined)
      );

      expect(state.loading[key]).toBe(false);
      expect(state[key]).toEqual(payload);
    });

    it("handles rejected", () => {
      const state = reducer(
        initialState,
        thunk.rejected(
          null,
          "",
          undefined,
          `${key} Error`
        )
      );

      expect(state.loading[key]).toBe(false);
      expect(state.error).toBe(`${key} Error`);
    });
  });
});
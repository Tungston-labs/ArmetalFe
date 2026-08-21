import { describe, it, expect, vi, beforeEach } from "vitest";

/* =========================================================
   SERVICE MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  fetchDashboardSummary: vi.fn(),
  fetchDashCounts: vi.fn(),
  fetchReimbursementCounts: vi.fn(),
  fetchReimbursementMonthwise: vi.fn(),
  fetchDepartmentDashboard: vi.fn(),
  fetchRecentEmployees: vi.fn(),
  fetchContractExpiry: vi.fn(),
  fetchSimpleNotifications: vi.fn(),
  fetchTodayEmployeeStats: vi.fn(),
  fetchHolidaySummary: vi.fn(),
  fetchProjectEmployeeCount: vi.fn(),
}));

vi.mock("../../services/dashboardService", () => ({
  fetchDashboardSummary: mocks.fetchDashboardSummary,
  fetchDashCounts: mocks.fetchDashCounts,
  fetchReimbursementCounts: mocks.fetchReimbursementCounts,
  fetchReimbursementMonthwise: mocks.fetchReimbursementMonthwise,
  fetchDepartmentDashboard: mocks.fetchDepartmentDashboard,
  fetchRecentEmployees: mocks.fetchRecentEmployees,
  fetchContractExpiry: mocks.fetchContractExpiry,
  fetchSimpleNotifications: mocks.fetchSimpleNotifications,
  fetchTodayEmployeeStats: mocks.fetchTodayEmployeeStats,
  fetchHolidaySummary: mocks.fetchHolidaySummary,
  fetchProjectEmployeeCount: mocks.fetchProjectEmployeeCount,
}));

/* =========================================================
   REDUX IMPORT
========================================================= */

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

/* =========================================================
   INITIAL STATE
========================================================= */

describe("dashboardSlice", () => {
  const initialState = reducer(undefined, {
    type: "@@INIT",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* =======================================================
     INITIAL STATE
  ======================================================= */

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

  /* =======================================================
     DASHBOARD SUMMARY REDUCER
  ======================================================= */

  describe("Dashboard Summary Reducer", () => {
    it("handles pending", () => {
      const state = reducer(
        initialState,
        getDashboardSummary.pending("", undefined),
      );

      expect(state.loading.summary).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const payload = {
        totalEmployees: 50,
      };

      const state = reducer(
        initialState,
        getDashboardSummary.fulfilled(payload, "", undefined),
      );

      expect(state.loading.summary).toBe(false);
      expect(state.summary).toEqual(payload);
    });

    it("handles rejected with payload", () => {
      const state = reducer(
        initialState,
        getDashboardSummary.rejected(null, "", undefined, "Summary Error"),
      );

      expect(state.loading.summary).toBe(false);
      expect(state.error).toBe("Summary Error");
    });
  });

  /* =======================================================
     OTHER ASYNC REDUCERS
  ======================================================= */

  const asyncCases = [
    {
      name: "getDashCounts",
      thunk: getDashCounts,
      key: "counts",
      payload: {
        employees: 10,
      },
    },
    {
      name: "getReimbursementCounts",
      thunk: getReimbursementCounts,
      key: "reimbursements",
      payload: {
        pending: 5,
      },
    },
    {
      name: "getReimbursementMonthwise",
      thunk: getReimbursementMonthwise,
      key: "reimbursementMonthwise",
      payload: {
        January: 1000,
      },
    },
    {
      name: "getDepartmentDashboard",
      thunk: getDepartmentDashboard,
      key: "departmentSummary",
      payload: [
        {
          department: "HR",
        },
      ],
    },
    {
      name: "getRecentEmployees",
      thunk: getRecentEmployees,
      key: "recentEmployees",
      payload: [
        {
          id: 1,
        },
      ],
    },
    {
      name: "getContractExpiry",
      thunk: getContractExpiry,
      key: "contractExpiry",
      payload: [
        {
          id: 2,
        },
      ],
    },
    {
      name: "getSimpleNotifications",
      thunk: getSimpleNotifications,
      key: "notifications",
      payload: [
        {
          id: 3,
        },
      ],
    },
    {
      name: "getTodayEmployeeStats",
      thunk: getTodayEmployeeStats,
      key: "todayStats",
      payload: {
        present: 25,
      },
    },
    {
      name: "getHolidaySummary",
      thunk: getHolidaySummary,
      key: "holidaySummary",
      payload: {
        holidays: 8,
      },
    },
    {
      name: "getProjectEmployeeCount",
      thunk: getProjectEmployeeCount,
      key: "projectEmployeeCount",
      payload: {
        projectA: 20,
      },
    },
  ];

  describe.each(asyncCases)(
    "$name reducer cases",
    ({ thunk, key, payload }) => {
      it("handles pending", () => {
        const state = reducer(initialState, thunk.pending("", undefined));

        expect(state.loading[key]).toBe(true);
        expect(state.error).toBeNull();
      });

      it("handles fulfilled", () => {
        const state = reducer(
          initialState,
          thunk.fulfilled(payload, "", undefined),
        );

        expect(state.loading[key]).toBe(false);
        expect(state[key]).toEqual(payload);
      });

      it("handles rejected", () => {
        const errorMessage = `${key} Error`;

        const state = reducer(
          initialState,
          thunk.rejected(null, "", undefined, errorMessage),
        );

        expect(state.loading[key]).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    },
  );

  /* =======================================================
     THUNK SUCCESS TESTS
  ======================================================= */

  describe("Async thunk success cases", () => {
    it("getDashboardSummary calls service successfully", async () => {
      const response = {
        totalEmployees: 100,
      };

      mocks.fetchDashboardSummary.mockResolvedValueOnce(response);

      const result = await getDashboardSummary()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchDashboardSummary).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getSummary/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getDashCounts calls service successfully", async () => {
      const response = {
        employees: 20,
      };

      mocks.fetchDashCounts.mockResolvedValueOnce(response);

      const result = await getDashCounts()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchDashCounts).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getDashCounts/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getReimbursementCounts calls service successfully", async () => {
      const response = {
        pending: 10,
        approved: 20,
      };

      mocks.fetchReimbursementCounts.mockResolvedValueOnce(response);

      const result = await getReimbursementCounts()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(mocks.fetchReimbursementCounts).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getReimbursementCounts/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getReimbursementMonthwise calls service successfully", async () => {
      const response = {
        January: 1000,
        February: 1500,
      };

      mocks.fetchReimbursementMonthwise.mockResolvedValueOnce(response);

      const result = await getReimbursementMonthwise()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(mocks.fetchReimbursementMonthwise).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getReimbursementMonthwise/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getDepartmentDashboard calls service successfully", async () => {
      const response = [
        {
          department: "HR",
          employees: 10,
        },
      ];

      mocks.fetchDepartmentDashboard.mockResolvedValueOnce(response);

      const result = await getDepartmentDashboard()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(mocks.fetchDepartmentDashboard).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getDepartmentDashboard/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getRecentEmployees calls service successfully", async () => {
      const response = [
        {
          id: 1,
          name: "John",
        },
      ];

      mocks.fetchRecentEmployees.mockResolvedValueOnce(response);

      const result = await getRecentEmployees()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchRecentEmployees).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getRecentEmployees/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getContractExpiry calls service successfully", async () => {
      const response = [
        {
          id: 2,
          name: "Employee",
        },
      ];

      mocks.fetchContractExpiry.mockResolvedValueOnce(response);

      const result = await getContractExpiry()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchContractExpiry).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getContractExpiry/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getSimpleNotifications calls service successfully", async () => {
      const response = [
        {
          id: 3,
          message: "Test notification",
        },
      ];

      mocks.fetchSimpleNotifications.mockResolvedValueOnce(response);

      const result = await getSimpleNotifications()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(mocks.fetchSimpleNotifications).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getSimpleNotifications/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getTodayEmployeeStats calls service successfully", async () => {
      const response = {
        present: 25,
        absent: 5,
      };

      mocks.fetchTodayEmployeeStats.mockResolvedValueOnce(response);

      const result = await getTodayEmployeeStats()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchTodayEmployeeStats).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getTodayEmployeeStats/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getHolidaySummary calls service successfully", async () => {
      const response = {
        holidays: 8,
      };

      mocks.fetchHolidaySummary.mockResolvedValueOnce(response);

      const result = await getHolidaySummary()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchHolidaySummary).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getHolidaySummary/fulfilled");

      expect(result.payload).toEqual(response);
    });

    it("getProjectEmployeeCount calls service successfully", async () => {
      const response = {
        projectA: 20,
      };

      mocks.fetchProjectEmployeeCount.mockResolvedValueOnce(response);

      const result = await getProjectEmployeeCount()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(mocks.fetchProjectEmployeeCount).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getProjectEmployeeCount/fulfilled");

      expect(result.payload).toEqual(response);
    });
  });

  /* =======================================================
     THUNK ERROR TESTS
  ======================================================= */

  describe("Async thunk error cases", () => {
    it("getDashboardSummary handles service error", async () => {
      const error = {
        response: {
          data: "Summary Error",
        },
      };

      mocks.fetchDashboardSummary.mockRejectedValueOnce(error);

      const result = await getDashboardSummary()(vi.fn(), vi.fn(), undefined);

      expect(mocks.fetchDashboardSummary).toHaveBeenCalledTimes(1);

      expect(result.type).toBe("dashboard/getSummary/rejected");

      expect(result.payload).toBe("Summary Error");
    });

    it("getDashCounts handles service error", async () => {
      const error = {
        response: {
          data: "Counts Error",
        },
      };

      mocks.fetchDashCounts.mockRejectedValueOnce(error);

      const result = await getDashCounts()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getDashCounts/rejected");

      expect(result.payload).toBe("Counts Error");
    });

    it("getReimbursementCounts handles service error", async () => {
      const error = {
        response: {
          data: "Reimbursement Counts Error",
        },
      };

      mocks.fetchReimbursementCounts.mockRejectedValueOnce(error);

      const result = await getReimbursementCounts()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.type).toBe("dashboard/getReimbursementCounts/rejected");

      expect(result.payload).toBe("Reimbursement Counts Error");
    });

    it("getReimbursementMonthwise handles service error", async () => {
      const error = {
        response: {
          data: "Monthwise Error",
        },
      };

      mocks.fetchReimbursementMonthwise.mockRejectedValueOnce(error);

      const result = await getReimbursementMonthwise()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.type).toBe("dashboard/getReimbursementMonthwise/rejected");

      expect(result.payload).toBe("Monthwise Error");
    });

    it("getDepartmentDashboard handles service error", async () => {
      const error = {
        response: {
          data: "Department Error",
        },
      };

      mocks.fetchDepartmentDashboard.mockRejectedValueOnce(error);

      const result = await getDepartmentDashboard()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.type).toBe("dashboard/getDepartmentDashboard/rejected");

      expect(result.payload).toBe("Department Error");
    });

    it("getRecentEmployees handles service error", async () => {
      const error = {
        response: {
          data: "Recent Employees Error",
        },
      };

      mocks.fetchRecentEmployees.mockRejectedValueOnce(error);

      const result = await getRecentEmployees()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getRecentEmployees/rejected");

      expect(result.payload).toBe("Recent Employees Error");
    });

    it("getContractExpiry handles service error", async () => {
      const error = {
        response: {
          data: "Contract Expiry Error",
        },
      };

      mocks.fetchContractExpiry.mockRejectedValueOnce(error);

      const result = await getContractExpiry()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getContractExpiry/rejected");

      expect(result.payload).toBe("Contract Expiry Error");
    });

    it("getSimpleNotifications handles service error", async () => {
      const error = {
        response: {
          data: "Notifications Error",
        },
      };

      mocks.fetchSimpleNotifications.mockRejectedValueOnce(error);

      const result = await getSimpleNotifications()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.type).toBe("dashboard/getSimpleNotifications/rejected");

      expect(result.payload).toBe("Notifications Error");
    });

    it("getTodayEmployeeStats handles service error", async () => {
      const error = {
        response: {
          data: "Today Stats Error",
        },
      };

      mocks.fetchTodayEmployeeStats.mockRejectedValueOnce(error);

      const result = await getTodayEmployeeStats()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getTodayEmployeeStats/rejected");

      expect(result.payload).toBe("Today Stats Error");
    });

    it("getHolidaySummary handles service error", async () => {
      const error = {
        response: {
          data: "Holiday Error",
        },
      };

      mocks.fetchHolidaySummary.mockRejectedValueOnce(error);

      const result = await getHolidaySummary()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getHolidaySummary/rejected");

      expect(result.payload).toBe("Holiday Error");
    });

    it("getProjectEmployeeCount handles service error", async () => {
      const error = {
        response: {
          data: "Project Employee Error",
        },
      };

      mocks.fetchProjectEmployeeCount.mockRejectedValueOnce(error);

      const result = await getProjectEmployeeCount()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.type).toBe("dashboard/getProjectEmployeeCount/rejected");

      expect(result.payload).toBe("Project Employee Error");
    });
  });

  /* =======================================================
     ERROR WITHOUT RESPONSE.DATA
  ======================================================= */

  describe("Thunk errors without response", () => {
    it("getDashboardSummary returns undefined when error has no response", async () => {
      mocks.fetchDashboardSummary.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getDashboardSummary()(vi.fn(), vi.fn(), undefined);

      expect(result.type).toBe("dashboard/getSummary/rejected");

      expect(result.payload).toBeUndefined();
    });

    it("getDashCounts returns undefined when error has no response", async () => {
      mocks.fetchDashCounts.mockRejectedValueOnce(new Error("Network Error"));

      const result = await getDashCounts()(vi.fn(), vi.fn(), undefined);

      expect(result.payload).toBeUndefined();
    });

    it("getReimbursementCounts returns undefined when error has no response", async () => {
      mocks.fetchReimbursementCounts.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getReimbursementCounts()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.payload).toBeUndefined();
    });

    it("getReimbursementMonthwise returns undefined when error has no response", async () => {
      mocks.fetchReimbursementMonthwise.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getReimbursementMonthwise()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.payload).toBeUndefined();
    });

    it("getDepartmentDashboard returns undefined when error has no response", async () => {
      mocks.fetchDepartmentDashboard.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getDepartmentDashboard()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.payload).toBeUndefined();
    });

    it("getRecentEmployees returns undefined when error has no response", async () => {
      mocks.fetchRecentEmployees.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getRecentEmployees()(vi.fn(), vi.fn(), undefined);

      expect(result.payload).toBeUndefined();
    });

    it("getContractExpiry returns undefined when error has no response", async () => {
      mocks.fetchContractExpiry.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getContractExpiry()(vi.fn(), vi.fn(), undefined);

      expect(result.payload).toBeUndefined();
    });

    it("getSimpleNotifications returns undefined when error has no response", async () => {
      mocks.fetchSimpleNotifications.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getSimpleNotifications()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.payload).toBeUndefined();
    });

    it("getTodayEmployeeStats returns undefined when error has no response", async () => {
      mocks.fetchTodayEmployeeStats.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getTodayEmployeeStats()(vi.fn(), vi.fn(), undefined);

      expect(result.payload).toBeUndefined();
    });

    it("getHolidaySummary returns undefined when error has no response", async () => {
      mocks.fetchHolidaySummary.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getHolidaySummary()(vi.fn(), vi.fn(), undefined);

      expect(result.payload).toBeUndefined();
    });

    it("getProjectEmployeeCount returns undefined when error has no response", async () => {
      mocks.fetchProjectEmployeeCount.mockRejectedValueOnce(
        new Error("Network Error"),
      );

      const result = await getProjectEmployeeCount()(
        vi.fn(),
        vi.fn(),
        undefined,
      );

      expect(result.payload).toBeUndefined();
    });
  });
});

import { describe, it, expect } from "vitest";
import reducer, {
  getAttendanceList,
  getAttendanceDetail,
  getDepartments,
  getAttendanceSummary,
} from "../../Redux/attendanceSlice";

describe("attendanceSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return the initial state", () => {
    expect(initialState).toEqual({
      attendanceList: [],
      pagination: {
        total_pages: 1,
        current_page: 1,
        total_items: 0,
        next: null,
        previous: null,
      },
      listLoading: false,

      attendanceDetail: null,
      detailLoading: false,

      departmentsAttendance: [],
      departmentsPagination: {
        total_pages: 1,
        current_page: 1,
        total_items: 0,
        next: null,
        previous: null,
      },
      departmentLoading: false,

      attendanceSummary: null,
      summaryLoading: false,

      error: null,
    });
  });

  describe("Attendance List", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getAttendanceList.pending("", { page: 1 })
      );

      expect(state.listLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          {
            id: 1,
            employee: "John",
          },
        ],
        count: 15,
        next: "next-page",
        previous: null,
      };

      const state = reducer(
        initialState,
        getAttendanceList.fulfilled(payload, "", { page: 2 })
      );

      expect(state.listLoading).toBe(false);
      expect(state.attendanceList).toEqual(payload.results);

      expect(state.pagination).toEqual({
        total_pages: 2,
        current_page: 2,
        total_items: 15,
        next: "next-page",
        previous: null,
      });
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getAttendanceList.rejected(null, "", {}, "API Error")
      );

      expect(state.listLoading).toBe(false);
      expect(state.error).toBe("API Error");
    });
  });

  describe("Attendance Detail", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getAttendanceDetail.pending("", {})
      );

      expect(state.detailLoading).toBe(true);
      expect(state.attendanceDetail).toBeNull();
    });

    it("should handle fulfilled", () => {
      const detail = {
        id: 100,
        employee: "John",
      };

      const state = reducer(
        initialState,
        getAttendanceDetail.fulfilled(detail, "", {})
      );

      expect(state.detailLoading).toBe(false);
      expect(state.attendanceDetail).toEqual(detail);
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getAttendanceDetail.rejected(null, "", {}, "Fetch failed")
      );

      expect(state.detailLoading).toBe(false);
      expect(state.attendanceDetail).toBeNull();
      expect(state.error).toBe("Fetch failed");
    });
  });

  describe("Departments", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getDepartments.pending("", {})
      );

      expect(state.departmentLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          {
            id: 1,
            department: "HR",
          },
        ],
        count: 25,
        next: "next",
        previous: null,
      };

      const state = reducer(
        initialState,
        getDepartments.fulfilled(payload, "", { page: 3 })
      );

      expect(state.departmentLoading).toBe(false);

      expect(state.departmentsAttendance).toEqual(payload.results);

      expect(state.departmentsPagination).toEqual({
        total_pages: 3,
        current_page: 3,
        total_items: 25,
        next: "next",
        previous: null,
      });
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getDepartments.rejected(
          null,
          "",
          {},
          "Department fetch failed"
        )
      );

      expect(state.departmentLoading).toBe(false);

      expect(state.error).toBe(
        "Department fetch failed"
      );
    });
  });

  describe("Attendance Summary", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getAttendanceSummary.pending("", {})
      );

      expect(state.summaryLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          {
            employee: "John",
          },
        ],
        total_pages: 4,
        current_page: 2,
        total_items: 35,
        next: "next",
        previous: "prev",
      };

      const state = reducer(
        initialState,
        getAttendanceSummary.fulfilled(payload, "", {})
      );

      expect(state.summaryLoading).toBe(false);

      expect(state.attendanceSummary).toEqual({
        results: payload.results,
        total_pages: 4,
        current_page: 2,
        total_items: 35,
        next: "next",
        previous: "prev",
      });
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getAttendanceSummary.rejected(
          null,
          "",
          {},
          "Failed to fetch summary"
        )
      );

      expect(state.summaryLoading).toBe(false);
      expect(state.attendanceSummary).toEqual([]);
      expect(state.error).toBe("Failed to fetch summary");
    });
  });
});
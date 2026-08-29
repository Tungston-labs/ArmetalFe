import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttendanceList,
  fetchAttendanceDetail,
  fetchDepartmentsAttendance,
  fetchAttendanceSummary,
  updateAttendance,
  searchEmployees, // NOTE: was called below but never imported — added. Adjust path/name if it actually lives elsewhere.
} from "../services/attendanceService";

export const getAttendanceList = createAsyncThunk(
  "attendance/getList",
  async (params, thunkAPI) => {
    try {
      return await fetchAttendanceList(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "API Error");
    }
  }
);

// Attendance Detail
export const getAttendanceDetail = createAsyncThunk(
  "attendance/getDetail",
  async ({ attendanceId, date }, thunkAPI) => {
    try {
      return await fetchAttendanceDetail(attendanceId, date);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// Departments Attendance
export const getDepartments = createAsyncThunk(
  "attendance/getDepartments",
  async (params, thunkAPI) => {
    try {
      return await fetchDepartmentsAttendance(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Department fetch failed"
      );
    }
  }
);

export const searchAttendanceEmployees = createAsyncThunk(
  "attendance/searchEmployees",
  async (search, { rejectWithValue }) => {
    try {
      const data = await searchEmployees(search);
      return data; // must return list of employees with dept
    } catch (error) {
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

export const getAttendanceSummary = createAsyncThunk(
  "attendance/getSummary",
  async ({ year, month, token, page = 1 }, thunkAPI) => {
    try {
      return await fetchAttendanceSummary({ year, month, token, page });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch attendance summary"
      );
    }
  }
);

export const updateAttendanceThunk = createAsyncThunk(
  "attendance/updateAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await updateAttendance(attendanceData);

      return response;
    } catch (error) {
      console.error("❌ Update attendance error:", error);

      return rejectWithValue(
        error.response?.data || {
          detail: "Failed to update attendance",
        }
      );
    }
  }
);

/* Slice */
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    // Attendance list
    attendanceList: [],
    pagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    listLoading: false,

    // Attendance detail
    attendanceDetail: null,
    detailLoading: false,

    // Departments
    departmentsAttendance: [],
    departmentsPagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    departmentLoading: false,

    // Monthly summary
    attendanceSummary: null,
    summaryLoading: false,

    // Update attendance (single record edit)
    updateLoading: false,
    updateSuccess: false,
    updateError: null,
    updatedAttendance: null,

    // Generic error holder
    error: null,
  },
  reducers: {
    // =================================================
    // CLEAR ATTENDANCE UPDATE STATE
    // Resets loading/success/error/updatedAttendance
    // after a modal closes or before a new edit starts
    // =================================================
    clearAttendanceUpdate: (state) => {
      state.updateLoading = false;
      state.updateSuccess = false;
      state.updateError = null;
      state.updatedAttendance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getAttendanceList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.attendanceList = action.payload.results || [];
        state.pagination = {
          total_pages: Math.ceil((action.payload.count || 0) / 10),
          current_page: action.meta.arg?.page || 1,
          total_items: action.payload.count || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        };
      })
      .addCase(getAttendanceList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || "Failed to fetch attendance data";
      })

      // detail
      .addCase(getAttendanceDetail.pending, (state) => {
        state.detailLoading = true;
        state.attendanceDetail = null;
      })
      .addCase(getAttendanceDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.attendanceDetail = action.payload;
      })
      .addCase(getAttendanceDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.attendanceDetail = null;
        state.error = action.payload;
      })

      // departments
      .addCase(getDepartments.pending, (state) => {
        state.departmentLoading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.departmentLoading = false;
        state.departmentsAttendance = action.payload.results || [];
        state.departmentsPagination = {
          total_pages: Math.ceil((action.payload.count || 0) / 10),
          current_page: action.meta.arg?.page || 1,
          total_items: action.payload.count || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        };
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.departmentLoading = false;
        state.error =
          action.payload || "Failed to fetch department attendance data";
      })

      // summary (monthly)
      .addCase(getAttendanceSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;

        state.attendanceSummary = {
          results: action.payload.results || [],
          total_pages: action.payload.total_pages || 1,
          current_page: action.payload.current_page || 1,
          total_items: action.payload.total_items || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        };
      })
      .addCase(getAttendanceSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.attendanceSummary = [];
        state.error = action.payload || "Failed to fetch summary";
      })

      // =================================================
      // UPDATE ATTENDANCE - PENDING
      // =================================================
      .addCase(updateAttendanceThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.updateError = null;
        state.updatedAttendance = null;
      })

      // =================================================
      // UPDATE ATTENDANCE - SUCCESS
      // =================================================
      .addCase(updateAttendanceThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.updateError = null;
        state.updatedAttendance = action.payload;

        const updatedEmployee = action.payload?.employee;
        const updatedDate = action.payload?.date;

        if (!updatedEmployee || !updatedDate) {
          return;
        }

        // -----------------------------------------------
        // Patch state.attendanceList (flat list view)
        // -----------------------------------------------

        state.attendanceList = state.attendanceList.map((record) => {
          const recordEmployee = record.employee || record.employee_id;
          const recordDate = record.date;

          if (
            String(recordEmployee) === String(updatedEmployee) &&
            recordDate === updatedDate
          ) {
            return {
              ...record,
              ...action.payload,
            };
          }

          return record;
        });

        // -----------------------------------------------
        // Patch state.attendanceSummary.results (nested
        // per-employee daily_records used by the Employee
        // Attendance detail page)
        // -----------------------------------------------
        // Previously this reducer only touched
        // attendanceList, so the detail page — which reads
        // from attendanceSummary — never saw the update in
        // Redux at all. The component was working around
        // this by hand-patching local component state with
        // client-side values (localStorage username, the
        // browser clock), which could show a "successful"
        // edit in the UI even if the server's response
        // differed, and which reverted on refresh since it
        // never touched Redux. Patching directly from
        // `action.payload` — the server's own response to
        // the update call — closes that gap: the summary
        // now reflects exactly what the backend confirmed,
        // immediately, and it survives navigating back to
        // the report page since it's the same slice.
        // -----------------------------------------------

        if (state.attendanceSummary?.results) {
          state.attendanceSummary.results =
            state.attendanceSummary.results.map((emp) => {
              if (String(emp.employee_id) !== String(updatedEmployee)) {
                return emp;
              }

              const dailyRecords = emp.daily_records || [];

              const dateExists = dailyRecords.some(
                (rec) => rec.date === updatedDate
              );

              const updatedDailyRecords = dateExists
                ? dailyRecords.map((rec) =>
                    rec.date === updatedDate
                      ? { ...rec, ...action.payload }
                      : rec
                  )
                : // Defensive: if the summary somehow didn't have
                  // this date yet (e.g. a record just created),
                  // append it rather than silently dropping the
                  // update.
                  [...dailyRecords, action.payload];

              return {
                ...emp,
                daily_records: updatedDailyRecords,
              };
            });
        }
      })

      // =================================================
      // UPDATE ATTENDANCE - FAILED
      // =================================================
      .addCase(updateAttendanceThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.updateError = action.payload || "Failed to update attendance";
        state.updatedAttendance = null;
      });
  },
});

export const { clearAttendanceUpdate } = attendanceSlice.actions;

export default attendanceSlice.reducer;
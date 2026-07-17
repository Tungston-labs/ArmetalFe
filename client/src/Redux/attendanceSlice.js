import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttendanceList,
  fetchAttendanceDetail,
  fetchDepartmentsAttendance,
  fetchAttendanceSummary,
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
      return data;   // must return list of employees with dept
    } catch (error) {
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);


export const getAttendanceSummary = createAsyncThunk(
  "attendance/getSummary",
  async ({ year, month, token ,page = 1}, thunkAPI) => {
    try {
      return await fetchAttendanceSummary({ year, month, token,page });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch attendance summary"
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

    // Generic error holder
    error: null,
  },
  reducers: {},
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
      });

  },
});

export default attendanceSlice.reducer;

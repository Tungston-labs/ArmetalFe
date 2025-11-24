// redux/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAttendanceList, fetchAttendanceDetail,fetchDepartmentsAttendance } from '../services/attendanceService';



// ============================================
// 1️⃣ Get Attendance List
// ============================================
export const getAttendanceList = createAsyncThunk(
  'attendance/getList',
  async (params, thunkAPI) => {
    try {
      const data = await fetchAttendanceList(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'API Error');
    }
  }
);


// ============================================
// 2️⃣ Get Attendance Detail
// ============================================
export const getAttendanceDetail = createAsyncThunk(
  'attendance/getDetail',
  async ({ attendanceId, date }, thunkAPI) => {
    try {
      const data = await fetchAttendanceDetail(attendanceId, date);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);


// ============================================
// 3️⃣ NEW: Get Department List (Attendance View Only)
// ============================================
export const getDepartments = createAsyncThunk(
  'attendance/getDepartments',
  async (params, thunkAPI) => {
    try {
      const data = await fetchDepartmentsAttendance(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Department fetch failed');
    }
  }
);


// ============================================
// Slice
// ============================================
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: [],
    attendanceDetail: null,

    // NEW STATE
    departmentsAttendance: [],
    departmentsPagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },

    loading: false,
    error: null,
    pagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ===================================================
      //  Attendance List
      // ===================================================
      .addCase(getAttendanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceList.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceList = action.payload.results;
        state.pagination = {
          total_pages: Math.ceil(action.payload.count / 10),
          current_page: action.meta.arg.page || 1,
          total_items: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(getAttendanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch attendance data';
      })

      // ===================================================
      //  Attendance Detail
      // ===================================================
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

      // ===================================================
      //  NEW: Department List (for Attendance Page)
      // ===================================================
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentsAttendance = action.payload.results;

        state.departmentsPagination = {
          total_pages: Math.ceil(action.payload.count / 10),
          current_page: action.meta.arg.page || 1,
          total_items: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch department attendance data';
      });
  },
});

export default attendanceSlice.reducer;

// redux/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAttendanceList, fetchAttendanceDetail, searchEmployees } from '../services/attendanceService';

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

export const employeeSearch = createAsyncThunk(
  "employees/search",
  async (params, thunkAPI) => {
    try {
      const data = await searchEmployees(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);


const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: [],
    employees: [],
    searchResults: [],

    attendanceDetail: null,
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
      .addCase(employeeSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employeeSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(employeeSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default attendanceSlice.reducer;

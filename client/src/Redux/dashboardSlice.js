// redux/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDashboardSummary,
  fetchDashCounts,
  fetchReimbursementCounts,
  fetchReimbursementMonthwise,
  fetchDepartmentDashboard,
  fetchRecentEmployees,
  fetchContractExpiry,
  fetchSimpleNotifications,
  fetchTodayEmployeeStats,
  fetchHolidaySummary,
  fetchProjectEmployeeCount
} from '../services/dashboardService';

export const getDashboardSummary = createAsyncThunk(
  'dashboard/getSummary',
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDashCounts = createAsyncThunk(
  'dashboard/getDashCounts',
  async (_, thunkAPI) => {
    try {
      return await fetchDashCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getReimbursementCounts = createAsyncThunk(
  'dashboard/getReimbursementCounts',
  async (_, thunkAPI) => {
    try {
      return await fetchReimbursementCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getReimbursementMonthwise = createAsyncThunk(
  'dashboard/getReimbursementMonthwise',
  async (_, thunkAPI) => {
    try {
      return await fetchReimbursementMonthwise();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getDepartmentDashboard = createAsyncThunk(
  'dashboard/getDepartmentDashboard',
  async (_, thunkAPI) => {
    try {
      return await fetchDepartmentDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getRecentEmployees = createAsyncThunk(
  'dashboard/getRecentEmployees',
  async (_, thunkAPI) => {
    try {
      return await fetchRecentEmployees();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getContractExpiry = createAsyncThunk(
  'dashboard/getContractExpiry',
  async (_, thunkAPI) => {
    try {
      return await fetchContractExpiry();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getSimpleNotifications = createAsyncThunk(
  'dashboard/getSimpleNotifications',
  async (_, thunkAPI) => {
    try {
      return await fetchSimpleNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getTodayEmployeeStats = createAsyncThunk(
  'dashboard/getTodayEmployeeStats',
  async (_, thunkAPI) => {
    try {
      return await fetchTodayEmployeeStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getHolidaySummary = createAsyncThunk(
  'dashboard/getHolidaySummary',
  async (_, thunkAPI) => {
    try {
      return await fetchHolidaySummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getProjectEmployeeCount = createAsyncThunk(
  'dashboard/getProjectEmployeeCount',
  async (_, thunkAPI) => {
    try {
      return await fetchProjectEmployeeCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
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

    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    builder
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.payload;
      });

    addAsync(builder, getDashCounts, "counts");
    addAsync(builder, getReimbursementCounts, "reimbursements");
    addAsync(builder, getReimbursementMonthwise, "reimbursementMonthwise");
    addAsync(builder, getDepartmentDashboard, "departmentSummary");
    addAsync(builder, getRecentEmployees, "recentEmployees");
    addAsync(builder, getContractExpiry, "contractExpiry");
    addAsync(builder, getSimpleNotifications, "notifications");
    addAsync(builder, getTodayEmployeeStats, "todayStats");
    addAsync(builder, getHolidaySummary, "holidaySummary");
    addAsync(builder, getProjectEmployeeCount, "projectEmployeeCount");
  }
});

function addAsync(builder, thunk, key) {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading[key] = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading[key] = false;
      state[key] = action.payload;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading[key] = false;
      state.error = action.payload;
    });
}

export default dashboardSlice.reducer;

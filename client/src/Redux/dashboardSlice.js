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
  fetchProjectEmployeeCount,
  fetchDashboardCounts,
  fetchWeeklyAttendanceStats,
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
  "dashboard/getTodayEmployeeStats",
  async (_, thunkAPI) => {
    try {
      return await fetchTodayEmployeeStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch today's employee stats"
      );
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
export const getDashboardCounts = createAsyncThunk(
  "dashboard/getDashboardCounts",
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch dashboard counts"
      );
    }
  }
);

export const getProjectEmployeeCount = createAsyncThunk(
  "dashboard/getProjectEmployeeCount",
  async (_, thunkAPI) => {
    try {
      return await fetchProjectEmployeeCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch project employee count"
      );
    }
  }
);
export const getWeeklyAttendanceStats = createAsyncThunk(
  "dashboard/getWeeklyAttendanceStats",
  async (_, thunkAPI) => {
    try {
      return await fetchWeeklyAttendanceStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch weekly attendance stats"
      );
    }
  }
);

export const getReimbursementCounts = createAsyncThunk(
  "dashboard/getReimbursementCounts",
  async (_, thunkAPI) => {
    try {
      return await fetchReimbursementCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
        "Failed to fetch reimbursement counts"
      );
    }
  }
);
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {},
    counts: {},
    dashboardCounts: {},
    reimbursements: {},
    reimbursementMonthwise: {},
    departmentSummary: {},
    recentEmployees: [],
    contractExpiry: [],
    notifications: [],
    todayStats: {},
    holidaySummary: {},
    projectEmployeeCount: {},
    weeklyAttendanceStats: {
      week_start: "",
      week_end: "",
      total_employees: 0,
      data: [],
    },
    loading: {
      summary: false,
      counts: false,
      dashboardCounts: false,
      reimbursements: false,
      reimbursementMonthwise: false,
      departmentSummary: false,
      recentEmployees: false,
      contractExpiry: false,
      notifications: false,
      todayStats: false,
      holidaySummary: false,
      projectEmployeeCount: false,
      weeklyAttendanceStats: false,
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
    addAsync(builder, getDashboardCounts, "dashboardCounts");
    addAsync(builder, getReimbursementCounts, "reimbursements");
    addAsync(builder, getReimbursementMonthwise, "reimbursementMonthwise");
    addAsync(builder, getDepartmentDashboard, "departmentSummary");
    addAsync(builder, getRecentEmployees, "recentEmployees");
    addAsync(builder, getContractExpiry, "contractExpiry");
    addAsync(builder, getSimpleNotifications, "notifications");
    addAsync(builder, getTodayEmployeeStats, "todayStats");
    addAsync(builder, getHolidaySummary, "holidaySummary");
    addAsync(builder, getWeeklyAttendanceStats, "weeklyAttendanceStats");
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

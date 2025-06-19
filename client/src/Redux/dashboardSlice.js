// redux/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardSummary } from '../services/dashboardService';

export const getDashboardSummary = createAsyncThunk(
  'dashboard/getSummary',
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {
      total_employees: 0,
      today_attendance: 0,
      today_leave: 0,
      visa_expiring_soon: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export default dashboardSlice.reducer;

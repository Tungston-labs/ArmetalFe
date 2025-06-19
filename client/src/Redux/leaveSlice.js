// src/Redux/leaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllLeaveRequests, fetchLeaveDetailsById,updateLeaveStatus } from '../services/leaveService';

export const getLeaveRequests = createAsyncThunk(
  'leave/getLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllLeaveRequests();
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching leaves');
    }
  }
);

export const getLeaveDetails = createAsyncThunk(
  'leave/getLeaveDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchLeaveDetailsById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching leave details');
    }
  }
);
export const patchLeaveStatus = createAsyncThunk(
    'leave/patchLeaveStatus',
    async ({ leaveId, status }, { rejectWithValue }) => {
      try {
        return await updateLeaveStatus(leaveId, status);
      } catch (err) {
        return rejectWithValue(err.response?.data || 'Error updating status');
      }
    }
  );

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaves: [],
    leaveDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // All leave requests
      .addCase(getLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(getLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single leave details
      .addCase(getLeaveDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveDetails = action.payload;
      })
      .addCase(getLeaveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchLeaveStatus.fulfilled, (state, action) => {
        // Optional: update the status in the state
        const updated = action.payload;
        const index = state.leaves.results?.findIndex(l => l.id === updated.id);
        if (index !== -1) {
          state.leaves.results[index] = updated;
        }
      });
  },
});

export default leaveSlice.reducer;




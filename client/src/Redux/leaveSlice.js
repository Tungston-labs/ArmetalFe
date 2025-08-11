import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllLeaveRequests,
  fetchLeaveDetailsById,
  updateLeaveStatus
} from '../services/leaveService';

export const getLeaveRequests = createAsyncThunk(
  'leave/getLeaveRequests',
  async (filters = {}, thunkAPI) => {
    try {
      return await fetchAllLeaveRequests(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching leave requests');
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
    pagination: {
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      total_items: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.results;
        state.pagination = {
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          next: action.payload.next,
          previous: action.payload.previous,
          total_items: action.payload.total_items,
        };
      })
      .addCase(getLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
        const updated = action.payload;
        const index = state.leaves.findIndex(l => l.id === updated.id);
        if (index !== -1) {
          state.leaves[index] = updated;
        }
      });
  },
});

export default leaveSlice.reducer;

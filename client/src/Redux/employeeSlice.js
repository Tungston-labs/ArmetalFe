import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createEmployee } from '../services/employeeService';

// Async thunk for submitting employee data
export const submitEmployee = createAsyncThunk(
  'employee/submitEmployee',
  async (data, thunkAPI) => {
    try {
      const response = await createEmployee(data);
      return response; // Ensure this contains the employee ID
    } catch (err) {
      let message = 'Something went wrong.';
      if (err.response?.data) {
        if (err.response.data.message) {
          message = err.response.data.message;
        } else if (Array.isArray(err.response.data.errors)) {
          message = err.response.data.errors.join('\n');
        }
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Redux slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    status: 'idle',
    error: null,
    employeeId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeId = action.payload?.id || null;
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create employee';
      });
  },
});

export default employeeSlice.reducer;

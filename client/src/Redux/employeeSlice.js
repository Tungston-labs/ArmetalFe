import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createEmployee, createBankPayment, getBankPayment } from '../services/employeeService';

// --- Thunk: Submit Basic Info ---
export const submitEmployee = createAsyncThunk(
  'employee/submitEmployee',
  async (data, thunkAPI) => {
    try {
      const response = await createEmployee(data);
      return response;
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

// ✅ Thunk: Submit Bank Payment
export const submitBankPayment = createAsyncThunk(
  'employee/submitBankPayment',
  async ({ employeeId, data }, thunkAPI) => {
    try {
      const response = await createBankPayment(employeeId, data);
      return response;
    } catch (err) {
      let message = 'Something went wrong while saving bank details.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Thunk: Fetch Bank Payment
export const fetchBankPayment = createAsyncThunk(
  'employee/fetchBankPayment',
  async (employeeId, thunkAPI) => {
    try {
      const response = await getBankPayment(employeeId);
      return response;
    } catch (err) {
      let message = 'Failed to fetch bank payment data.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Redux Slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    status: 'idle',
    error: null,
    employeeId: null,
    bankPayment: null,
  },
  reducers: {
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Basic Info
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
      })

      // Bank Payment Submission
      .addCase(submitBankPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBankPayment.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBankPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit bank payment';
      })

      // Bank Payment Fetch
      .addCase(fetchBankPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBankPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bankPayment = action.payload;
      })
      .addCase(fetchBankPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch bank payment';
        state.bankPayment = null;
      });
  },
});

export const { setEmployeeId } = employeeSlice.actions;
export default employeeSlice.reducer;

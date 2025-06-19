import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api'; // your axios instance
// src/Redux/employeeSlice.js
import { fetchAllEmployees } from '../services/employeeService';
// ✅ DELETE thunk
export const deleteEmployeeById = createAsyncThunk(
  'employees/deleteEmployeeById',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/employees/${employeeId}/`);
      return employeeId; // Return the deleted ID to update local state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);




export const getAllEmployees = createAsyncThunk(
  'employees/getAll',
  async ({ page, search }, thunkAPI) => {
    try {
      return await fetchAllEmployees(page, search);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Server error');
    }
  }
);





const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    loading: false,
    employeeList: [],
    pagination: { count: 0, next: null, previous: null },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load employees';
      })
      // DELETE employee
      .addCase(deleteEmployeeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = state.employeeList.filter(emp => emp.id !== action.payload);
      })
      
      .addCase(deleteEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Delete failed';
      });
  },
});



export default employeeSlice.reducer;



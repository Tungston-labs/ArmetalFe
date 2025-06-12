// src/redux/slices/departmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentServices";

// Get all departments
export const getDepartments = createAsyncThunk(
  "departments/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDepartments();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get department by ID
export const getDepartmentById = createAsyncThunk(
  "departments/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchDepartmentById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create department
export const createNewDepartment = createAsyncThunk(
  "departments/create",
  async (data, { rejectWithValue }) => {
    try {
        const payload = {
            name: data.name,
            department_code: data.department_code,
            department_head: data.department_head,
          };
      return await createDepartment(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update department
export const updateDepartmentById = createAsyncThunk(
  "departments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateDepartment(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete department
export const deleteDepartmentById = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDepartment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentDepartment(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By ID
      .addCase(getDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((dept) => dept.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((dept) => dept.id !== action.payload);
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;

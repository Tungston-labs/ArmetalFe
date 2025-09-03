import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchEmployeesByDepartment,
} from "../services/departmentServices";

// Get all departments


// export const getDepartments = createAsyncThunk(
//   "departments/getAll",
//   async (search = '', { rejectWithValue }) => {
//     try {
//       return await fetchDepartments(search);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const getDepartments = createAsyncThunk(
  "departments/getAll",
  async ({ page = 1, search = '' }, { rejectWithValue }) => {
    try {
      return await fetchDepartments({ page, search });
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
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        name: data.name,
        department_code: data.department_code,
        department_head: data.department_head,
      };
      const result = await createDepartment(payload);
      // ✅ refresh after success
      dispatch(getDepartments({ page: 1, search: '' }));
      return result;
    } catch (error) {
      // ❌ refresh after failure too
      dispatch(getDepartments({ page: 1, search: '' }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete department
export const deleteDepartmentById = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteDepartment(id);
      // ✅ refresh after success
      dispatch(getDepartments({ page: 1, search: '' }));
      return id;
    } catch (error) {
      // ❌ refresh after failure too
      dispatch(getDepartments({ page: 1, search: '' }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Update department
export const updateDepartmentById = createAsyncThunk(
  "departments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const payload = {
        name: data.name,
        department_code: data.department_code,
        department_head_id: data.department_head_id || null,  // ✅ correct field
      };
      return await updateDepartment(id, payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Get employees by department ID
export const getEmployeesByDepartment = createAsyncThunk(
  "departments/getEmployeesByDepartment",
  async (departmentId, { rejectWithValue }) => {
    try {
      return await fetchEmployeesByDepartment(departmentId);
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
    departmentEmployees: [],
    error: null,
    pagination: { // ✅ ensure it always exists
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      total_items: 0,
    },
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
        state.error = null;
        state.list = Array.isArray(action.payload)
  ? [...action.payload].sort((a, b) => a.name.localeCompare(b.name))
  : [...action.payload.results].sort((a, b) => a.name.localeCompare(b.name));


        // ✅ assign pagination from API
        state.pagination = {
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          next: action.payload.next,
          previous: action.payload.previous,
          total_items: action.payload.total_items,
        };
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
        const index = state.list.findIndex(
          (dept) => dept.id === action.payload.id
        );
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
        state.error = null;
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Employees by Department
      .addCase(getEmployeesByDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentEmployees = action.payload;
      })
      .addCase(getEmployeesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearCurrentDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;

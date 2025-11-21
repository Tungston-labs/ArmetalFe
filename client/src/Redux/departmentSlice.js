import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchEmployeesByDepartment,
  fetchDepartmentMin,   // ⬅️ NEW SERVICE IMPORT
} from "../services/departmentServices";


// -------------------------------------------------------------
// 1️⃣  Minimal Departments (id + name)
// -------------------------------------------------------------
export const getDepartmentsMin = createAsyncThunk(
  "departments/getMin",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDepartmentMin();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// -------------------------------------------------------------
// 2️⃣  Paginated Departments
// -------------------------------------------------------------
export const getDepartments = createAsyncThunk(
  "departments/getAll",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      return await fetchDepartments({ page, search });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// -------------------------------------------------------------
// 3️⃣  Department Detail
// -------------------------------------------------------------
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


// -------------------------------------------------------------
// 4️⃣  Create Department
// -------------------------------------------------------------
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

      dispatch(getDepartments({ page: 1, search: "" }));
      return result;
    } catch (error) {
      dispatch(getDepartments({ page: 1, search: "" }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// -------------------------------------------------------------
// 5️⃣  Update Department
// -------------------------------------------------------------
export const updateDepartmentById = createAsyncThunk(
  "departments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const payload = {
        name: data.name,
        department_code: data.department_code,
        department_head_id: data.department_head_id || null,
      };
      return await updateDepartment(id, payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// -------------------------------------------------------------
// 6️⃣  Delete Department
// -------------------------------------------------------------
export const deleteDepartmentById = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteDepartment(id);
      dispatch(getDepartments({ page: 1, search: "" }));
      return id;
    } catch (error) {
      dispatch(getDepartments({ page: 1, search: "" }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// -------------------------------------------------------------
// 7️⃣  Get Employees By Department
// -------------------------------------------------------------
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


// -------------------------------------------------------------
// Slice
// -------------------------------------------------------------
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    minList: [],       // ⬅️ NEW — minimal list
    current: null,
    loading: false,
    departmentEmployees: [],
    error: null,
    pagination: {
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

      // ---------------------------------------------------------
      // Minimal Department List
      // ---------------------------------------------------------
      .addCase(getDepartmentsMin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentsMin.fulfilled, (state, action) => {
        state.loading = false;
        state.minList = action.payload || [];
        state.error = null;
      })
      .addCase(getDepartmentsMin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------------------------------------------------
      // Full Department List
      // ---------------------------------------------------------
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;

        // Keep sorted list clean
        const departmentData = action.payload.results || [];
        state.list = departmentData.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

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

      // ---------------------------------------------------------
      // Department Detail
      // ---------------------------------------------------------
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

      // ---------------------------------------------------------
      // Create
      // ---------------------------------------------------------
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------------------------------------------------
      // Update
      // ---------------------------------------------------------
      .addCase(updateDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------------------------------------------------
      // Delete
      // ---------------------------------------------------------
      .addCase(deleteDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------------------------------------------------
      // Employees By Department
      // ---------------------------------------------------------
      .addCase(getEmployeesByDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentEmployees = action.payload || [];
      })
      .addCase(getEmployeesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearCurrentDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;

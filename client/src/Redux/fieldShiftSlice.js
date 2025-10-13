// src/features/projects/projectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService, { fieldInfoService } from "../services/fieldShiftService";

// Thunks

export const getProjects = createAsyncThunk(
  "projects/getAll",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    try {
      return await projectService.getProjects(search, page);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectService.createProject(projectData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProjectById = createAsyncThunk(
  "projects/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.getProjectById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await projectService.updateProject({ id, projectData });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getEmployeesNotInProject = createAsyncThunk(
  "projects/getEmployeesNotInProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await projectService.getEmployeesNotInProject(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const assignEmployees = createAsyncThunk(
  "projects/assignEmployees",
  async ({ projectId, employeeIds }, { rejectWithValue }) => {
    try {
      return await projectService.assignEmployees(projectId, employeeIds);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeEmployeeFromProject = createAsyncThunk(
  "projects/removeEmployeeFromProject",
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      return await projectService.removeEmployeeFromProject(projectId, employeeId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getFieldInfo = createAsyncThunk(
  "projects/getFieldInfo",
  async ({ employeeId, date }, { rejectWithValue }) => {
    try {
      return await fieldInfoService(employeeId, date);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Slice
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],        // paginated results
    total_pages: 0,
    current_page: 1,
    total_items: 0,
    project: null,       // single project
    employeesNotInProject: [],
    fieldInfo: null, 
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.project = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload.results;
        state.total_pages = action.payload.total_pages;
        state.current_page = action.payload.current_page;
        state.total_items = action.payload.total_items;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.unshift(action.payload);
        state.total_items += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get by ID
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.map((proj) =>
          proj.id === action.payload.id ? action.payload : proj
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.filter((proj) => proj.id !== action.payload);
        state.total_items -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  .addCase(getEmployeesNotInProject.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(getEmployeesNotInProject.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isSuccess = true;
    state.employeesNotInProject = action.payload;
  })
  .addCase(getEmployeesNotInProject.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload;
  })
  .addCase(removeEmployeeFromProject.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(removeEmployeeFromProject.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isSuccess = true;
  
    // Optionally update local state:
    const { projectId, employeeId } = action.meta.arg;
    const project = state.projects.find((p) => p.id === projectId);
    if (project && project.employees) {
      project.employees = project.employees.filter((emp) => emp.id !== employeeId);
    }
  })
  .addCase(removeEmployeeFromProject.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload;
  })
  .addCase(assignEmployees.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(assignEmployees.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isSuccess = true;
    // Update the single project data (if open)
    state.project = action.payload;

    // Also update inside list if exists
    const updatedProject = action.payload;
    state.projects = state.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
  })
  .addCase(assignEmployees.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload;
  })
  .addCase(getFieldInfo.pending, (state) => {
  state.isLoading = true;
})
.addCase(getFieldInfo.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.fieldInfo = action.payload; 
})
.addCase(getFieldInfo.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
});

  

  },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;

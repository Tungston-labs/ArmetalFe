import { describe, it, expect, vi, beforeEach } from "vitest";
import projectReducer, {
  reset,
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getEmployeesNotInProject,
  assignEmployees,
  removeEmployeeFromProject,
  getFieldInfo,
} from "../../Redux/fieldShiftSlice"; // Adjust path if needed
import projectService, {
  fieldInfoService,
} from "../../services/fieldShiftService";

vi.mock("../../services/fieldShiftService", () => ({
  default: {
    getProjects: vi.fn(),
    createProject: vi.fn(),
    getProjectById: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    getEmployeesNotInProject: vi.fn(),
    assignEmployees: vi.fn(),
    removeEmployeeFromProject: vi.fn(),
  },
  fieldInfoService: vi.fn(),
}));

describe("projectSlice", () => {
  const initialState = {
    projects: [],
    total_pages: 0,
    current_page: 1,
    total_items: 0,
    project: null,
    employeesNotInProject: [],
    fieldInfo: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Reducers Test
  // ---------------------------------------------------------------------------
  describe("Reducers", () => {
    it("should return the initial state when passed an empty action", () => {
      const state = projectReducer(undefined, { type: "" });
      expect(state).toEqual(initialState);
    });

    it("should handle the reset reducer correctly", () => {
      const modifiedState = {
        ...initialState,
        isLoading: true,
        isSuccess: true,
        isError: true,
        message: "Some error",
        project: { id: 1, name: "Test Project" },
      };

      const state = projectReducer(modifiedState, reset());

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.message).toBe("");
      expect(state.project).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Async Thunks Tests
  // ---------------------------------------------------------------------------
  describe("Extra Reducers / Thunks", () => {
    // 1. getProjects
    describe("getProjects", () => {
      it("should handle getProjects.pending", () => {
        const state = projectReducer(
          initialState,
          getProjects.pending("", { search: "", page: 1 }),
        );
        expect(state.isLoading).toBe(true);
      });

      it("should handle getProjects.fulfilled", () => {
        const payload = {
          results: [{ id: 1, name: "Project Alpha" }],
          total_pages: 2,
          current_page: 1,
          total_items: 10,
        };
        const state = projectReducer(
          initialState,
          getProjects.fulfilled(payload, "", { search: "", page: 1 }),
        );

        expect(state.isLoading).toBe(false);
        expect(state.isSuccess).toBe(true);
        expect(state.projects).toEqual(payload.results);
        expect(state.total_pages).toBe(2);
        expect(state.current_page).toBe(1);
        expect(state.total_items).toBe(10);
      });

      it("should handle getProjects.rejected", () => {
        const state = projectReducer(
          initialState,
          getProjects.rejected(
            null,
            "",
            { search: "", page: 1 },
            "Failed to fetch",
          ),
        );

        expect(state.isLoading).toBe(false);
        expect(state.isError).toBe(true);
        expect(state.message).toBe("Failed to fetch");
      });

      it("should call projectService.getProjects when thunk is executed", async () => {
        const mockData = {
          results: [],
          total_pages: 1,
          current_page: 1,
          total_items: 0,
        };
        projectService.getProjects.mockResolvedValueOnce(mockData);

        const dispatch = vi.fn();
        const thunk = getProjects({ search: "test", page: 2 });
        const result = await thunk(dispatch, () => ({}), undefined);

        expect(projectService.getProjects).toHaveBeenCalledWith("test", 2);
        expect(result.payload).toEqual(mockData);
      });
    });

    // 2. createProject
    describe("createProject", () => {
      it("should handle createProject.fulfilled", () => {
        const newProject = { id: 1, name: "New Project" };
        const state = projectReducer(
          initialState,
          createProject.fulfilled(newProject, "", { name: "New Project" }),
        );

        expect(state.isLoading).toBe(false);
        expect(state.isSuccess).toBe(true);
        expect(state.projects).toEqual([newProject]);
        expect(state.total_items).toBe(1);
      });

      it("should dispatch rejectWithValue on service failure", async () => {
        const errorMsg = "Validation failed";
        projectService.createProject.mockRejectedValueOnce({
          response: { data: errorMsg },
        });

        const dispatch = vi.fn();
        const thunk = createProject({ name: "" });
        const result = await thunk(dispatch, () => ({}), undefined);

        expect(result.payload).toBe(errorMsg);
      });
    });

    // 3. getProjectById
    describe("getProjectById", () => {
      it("should handle getProjectById.fulfilled", () => {
        const projectData = { id: 10, name: "Detailed Project" };
        const state = projectReducer(
          initialState,
          getProjectById.fulfilled(projectData, "", 10),
        );

        expect(state.isLoading).toBe(false);
        expect(state.isSuccess).toBe(true);
        expect(state.project).toEqual(projectData);
      });
    });

    // 4. updateProject
    describe("updateProject", () => {
      it("should update project in the projects array on fulfilled", () => {
        const existingState = {
          ...initialState,
          projects: [
            { id: 1, name: "Old Name" },
            { id: 2, name: "Other Project" },
          ],
        };
        const updatedProject = { id: 1, name: "Updated Name" };

        const state = projectReducer(
          existingState,
          updateProject.fulfilled(updatedProject, "", {
            id: 1,
            projectData: updatedProject,
          }),
        );

        expect(state.projects[0].name).toBe("Updated Name");
        expect(state.projects[1].name).toBe("Other Project");
      });
    });

    // 5. deleteProject
    describe("deleteProject", () => {
      it("should filter out deleted project and decrease total_items", () => {
        const existingState = {
          ...initialState,
          projects: [{ id: 1 }, { id: 2 }],
          total_items: 2,
        };

        const state = projectReducer(
          existingState,
          deleteProject.fulfilled(1, "", 1),
        );

        expect(state.projects).toEqual([{ id: 2 }]);
        expect(state.total_items).toBe(1);
      });
    });

    // 6. getEmployeesNotInProject
    describe("getEmployeesNotInProject", () => {
      it("should set employeesNotInProject on fulfilled", () => {
        const mockEmployees = [{ id: 101, name: "John Doe" }];
        const state = projectReducer(
          initialState,
          getEmployeesNotInProject.fulfilled(mockEmployees, "", 1),
        );

        expect(state.employeesNotInProject).toEqual(mockEmployees);
      });
    });

    // 7. removeEmployeeFromProject
    describe("removeEmployeeFromProject", () => {
      it("should remove employee from the project's employee array", () => {
        const existingState = {
          ...initialState,
          projects: [
            {
              id: 1,
              name: "Project A",
              employees: [{ id: 100 }, { id: 200 }],
            },
          ],
        };

        const actionMeta = {
          meta: { arg: { projectId: 1, employeeId: 100 } },
        };

        const state = projectReducer(
          existingState,
          removeEmployeeFromProject.fulfilled(
            undefined,
            "",
            actionMeta.meta.arg,
          ),
        );

        expect(state.projects[0].employees).toEqual([{ id: 200 }]);
      });
    });

    // 8. assignEmployees
    describe("assignEmployees", () => {
      it("should update single project state and project inside list on fulfilled", () => {
        const existingState = {
          ...initialState,
          projects: [{ id: 1, name: "Project 1", employees: [] }],
        };

        const updatedProject = {
          id: 1,
          name: "Project 1",
          employees: [{ id: 101 }],
        };

        const state = projectReducer(
          existingState,
          assignEmployees.fulfilled(updatedProject, "", {
            projectId: 1,
            employeeIds: [101],
          }),
        );

        expect(state.project).toEqual(updatedProject);
        expect(state.projects[0]).toEqual(updatedProject);
      });
    });

    // 9. getFieldInfo
    describe("getFieldInfo", () => {
      it("should update fieldInfo on fulfilled", () => {
        const mockFieldInfo = { shift: "Morning", location: "Site A" };
        const state = projectReducer(
          initialState,
          getFieldInfo.fulfilled(mockFieldInfo, "", {
            employeeId: 1,
            date: "2026-08-07",
          }),
        );

        expect(state.fieldInfo).toEqual(mockFieldInfo);
      });

      it("should execute fieldInfoService thunk correctly", async () => {
        const mockData = { shift: "Night" };
        fieldInfoService.mockResolvedValueOnce(mockData);

        const dispatch = vi.fn();
        const thunk = getFieldInfo({ employeeId: 5, date: "2026-08-07" });
        const result = await thunk(dispatch, () => ({}), undefined);

        expect(fieldInfoService).toHaveBeenCalledWith(5, "2026-08-07");
        expect(result.payload).toEqual(mockData);
      });
    });
  });
});

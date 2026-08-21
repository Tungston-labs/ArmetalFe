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
} from "../../Redux/fieldShiftSlice";

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

describe("fieldShiftSlice / projectSlice", () => {
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

  // ============================================================
  // INITIAL STATE
  // ============================================================

  describe("Initial State", () => {
    it("should return the initial state", () => {
      const state = projectReducer(undefined, { type: "" });

      expect(state).toEqual(initialState);
    });

    it("should ignore unknown actions", () => {
      const state = projectReducer(initialState, {
        type: "unknown/action",
      });

      expect(state).toEqual(initialState);
    });
  });

  // ============================================================
  // RESET
  // ============================================================

  describe("reset reducer", () => {
    it("should reset all status values and project", () => {
      const modifiedState = {
        ...initialState,
        isLoading: true,
        isSuccess: true,
        isError: true,
        message: "Something went wrong",
        project: {
          id: 1,
          name: "Project",
        },
      };

      const state = projectReducer(modifiedState, reset());

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.message).toBe("");
      expect(state.project).toBeNull();
    });

    it("should preserve projects and other data when reset is called", () => {
      const modifiedState = {
        ...initialState,
        projects: [{ id: 1 }],
        total_items: 1,
        total_pages: 2,
        current_page: 2,
        employeesNotInProject: [{ id: 10 }],
        fieldInfo: { shift: "Morning" },
        project: { id: 1 },
        isLoading: true,
        isSuccess: true,
        isError: true,
        message: "Error",
      };

      const state = projectReducer(modifiedState, reset());

      expect(state.projects).toEqual([{ id: 1 }]);
      expect(state.total_items).toBe(1);
      expect(state.total_pages).toBe(2);
      expect(state.current_page).toBe(2);
      expect(state.employeesNotInProject).toEqual([{ id: 10 }]);
      expect(state.fieldInfo).toEqual({ shift: "Morning" });

      expect(state.project).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.message).toBe("");
    });
  });

  // ============================================================
  // getProjects
  // ============================================================

  describe("getProjects", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        getProjects.pending("request-id", {
          search: "",
          page: 1,
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          { id: 1, name: "Project A" },
          { id: 2, name: "Project B" },
        ],
        total_pages: 5,
        current_page: 2,
        total_items: 20,
      };

      const state = projectReducer(
        initialState,
        getProjects.fulfilled(payload, "request-id", {
          search: "Project",
          page: 2,
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.projects).toEqual(payload.results);
      expect(state.total_pages).toBe(5);
      expect(state.current_page).toBe(2);
      expect(state.total_items).toBe(20);
    });

    it("should handle rejected with payload", () => {
      const state = projectReducer(
        initialState,
        getProjects.rejected(
          null,
          "request-id",
          {
            search: "",
            page: 1,
          },
          "Failed to fetch projects",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to fetch projects");
    });

    it("should call service with supplied search and page", async () => {
      const response = {
        results: [],
        total_pages: 1,
        current_page: 2,
        total_items: 0,
      };

      projectService.getProjects.mockResolvedValueOnce(response);

      const thunk = getProjects({
        search: "abc",
        page: 2,
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.getProjects).toHaveBeenCalledTimes(1);
      expect(projectService.getProjects).toHaveBeenCalledWith("abc", 2);

      expect(result.payload).toEqual(response);
    });

    it("should use default search and page", async () => {
      const response = {
        results: [],
        total_pages: 1,
        current_page: 1,
        total_items: 0,
      };

      projectService.getProjects.mockResolvedValueOnce(response);

      const thunk = getProjects();

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.getProjects).toHaveBeenCalledWith("", 1);

      expect(result.payload).toEqual(response);
    });

    it("should use default page when only search is supplied", async () => {
      const response = {
        results: [],
        total_pages: 1,
        current_page: 1,
        total_items: 0,
      };

      projectService.getProjects.mockResolvedValueOnce(response);

      const thunk = getProjects({
        search: "test",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.getProjects).toHaveBeenCalledWith("test", 1);

      expect(result.payload).toEqual(response);
    });

    it("should reject with error.response.data", async () => {
      const error = {
        response: {
          data: "Server error",
        },
      };

      projectService.getProjects.mockRejectedValueOnce(error);

      const thunk = getProjects({
        search: "test",
        page: 1,
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Server error");
    });

    it("should reject with error.message when response data is unavailable", async () => {
      const error = {
        message: "Network error",
      };

      projectService.getProjects.mockRejectedValueOnce(error);

      const thunk = getProjects({
        search: "test",
        page: 1,
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Network error");
    });
  });

  // ============================================================
  // createProject
  // ============================================================

  describe("createProject", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        createProject.pending("request-id", {
          name: "New Project",
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const newProject = {
        id: 1,
        name: "New Project",
      };

      const state = projectReducer(
        initialState,
        createProject.fulfilled(newProject, "request-id", {
          name: "New Project",
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.projects).toEqual([newProject]);
      expect(state.total_items).toBe(1);
    });

    it("should add new project at beginning of existing projects", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 2,
            name: "Existing",
          },
        ],
        total_items: 1,
      };

      const newProject = {
        id: 1,
        name: "New",
      };

      const state = projectReducer(
        existingState,
        createProject.fulfilled(newProject, "request-id", {}),
      );

      expect(state.projects).toEqual([
        newProject,
        {
          id: 2,
          name: "Existing",
        },
      ]);

      expect(state.total_items).toBe(2);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        createProject.rejected(null, "request-id", {}, "Create failed"),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Create failed");
    });

    it("should call createProject service successfully", async () => {
      const data = {
        id: 1,
        name: "Created",
      };

      projectService.createProject.mockResolvedValueOnce(data);

      const projectData = {
        name: "Created",
      };

      const thunk = createProject(projectData);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.createProject).toHaveBeenCalledWith(projectData);

      expect(result.payload).toEqual(data);
    });

    it("should reject with response data", async () => {
      projectService.createProject.mockRejectedValueOnce({
        response: {
          data: "Validation failed",
        },
      });

      const thunk = createProject({
        name: "",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Validation failed");
    });

    it("should reject with error message", async () => {
      projectService.createProject.mockRejectedValueOnce({
        message: "Create network error",
      });

      const thunk = createProject({
        name: "Test",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Create network error");
    });
  });

  // ============================================================
  // getProjectById
  // ============================================================

  describe("getProjectById", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        getProjectById.pending("request-id", 10),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const projectData = {
        id: 10,
        name: "Detailed Project",
      };

      const state = projectReducer(
        initialState,
        getProjectById.fulfilled(projectData, "request-id", 10),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.project).toEqual(projectData);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        getProjectById.rejected(null, "request-id", 10, "Project not found"),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Project not found");
    });

    it("should call getProjectById service", async () => {
      const response = {
        id: 10,
        name: "Project 10",
      };

      projectService.getProjectById.mockResolvedValueOnce(response);

      const thunk = getProjectById(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.getProjectById).toHaveBeenCalledWith(10);

      expect(result.payload).toEqual(response);
    });

    it("should reject with response data", async () => {
      projectService.getProjectById.mockRejectedValueOnce({
        response: {
          data: "Project lookup failed",
        },
      });

      const thunk = getProjectById(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Project lookup failed");
    });

    it("should reject with error message", async () => {
      projectService.getProjectById.mockRejectedValueOnce({
        message: "Network unavailable",
      });

      const thunk = getProjectById(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Network unavailable");
    });
  });

  // ============================================================
  // updateProject
  // ============================================================

  describe("updateProject", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        updateProject.pending("request-id", {
          id: 1,
          projectData: {},
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should update matching project", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            name: "Old",
          },
          {
            id: 2,
            name: "Other",
          },
        ],
      };

      const updatedProject = {
        id: 1,
        name: "Updated",
      };

      const state = projectReducer(
        existingState,
        updateProject.fulfilled(updatedProject, "request-id", {
          id: 1,
          projectData: updatedProject,
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);

      expect(state.projects).toEqual([
        updatedProject,
        {
          id: 2,
          name: "Other",
        },
      ]);
    });

    it("should keep non-matching projects unchanged", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            name: "Project One",
          },
          {
            id: 2,
            name: "Project Two",
          },
        ],
      };

      const updatedProject = {
        id: 99,
        name: "New Project",
      };

      const state = projectReducer(
        existingState,
        updateProject.fulfilled(updatedProject, "request-id", {
          id: 99,
          projectData: updatedProject,
        }),
      );

      expect(state.projects).toEqual([
        {
          id: 1,
          name: "Project One",
        },
        {
          id: 2,
          name: "Project Two",
        },
      ]);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        updateProject.rejected(
          null,
          "request-id",
          {
            id: 1,
            projectData: {},
          },
          "Update failed",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Update failed");
    });

    it("should call updateProject service", async () => {
      const response = {
        id: 1,
        name: "Updated",
      };

      projectService.updateProject.mockResolvedValueOnce(response);

      const data = {
        id: 1,
        projectData: {
          name: "Updated",
        },
      };

      const thunk = updateProject(data);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.updateProject).toHaveBeenCalledWith(data);

      expect(result.payload).toEqual(response);
    });

    it("should reject with response data", async () => {
      projectService.updateProject.mockRejectedValueOnce({
        response: {
          data: "Update validation error",
        },
      });

      const thunk = updateProject({
        id: 1,
        projectData: {},
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Update validation error");
    });

    it("should reject with error message", async () => {
      projectService.updateProject.mockRejectedValueOnce({
        message: "Update network error",
      });

      const thunk = updateProject({
        id: 1,
        projectData: {},
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Update network error");
    });
  });

  // ============================================================
  // deleteProject
  // ============================================================

  describe("deleteProject", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        deleteProject.pending("request-id", 1),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const existingState = {
        ...initialState,
        projects: [{ id: 1 }, { id: 2 }],
        total_items: 2,
      };

      const state = projectReducer(
        existingState,
        deleteProject.fulfilled(1, "request-id", 1),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.projects).toEqual([{ id: 2 }]);
      expect(state.total_items).toBe(1);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        deleteProject.rejected(null, "request-id", 1, "Delete failed"),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Delete failed");
    });

    it("should call deleteProject service and return id", async () => {
      projectService.deleteProject.mockResolvedValueOnce(undefined);

      const thunk = deleteProject(25);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.deleteProject).toHaveBeenCalledWith(25);

      expect(result.payload).toBe(25);
    });

    it("should reject with response data", async () => {
      projectService.deleteProject.mockRejectedValueOnce({
        response: {
          data: "Delete failed from server",
        },
      });

      const thunk = deleteProject(25);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Delete failed from server");
    });

    it("should reject with error message", async () => {
      projectService.deleteProject.mockRejectedValueOnce({
        message: "Delete network error",
      });

      const thunk = deleteProject(25);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Delete network error");
    });
  });

  // ============================================================
  // getEmployeesNotInProject
  // ============================================================

  describe("getEmployeesNotInProject", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        getEmployeesNotInProject.pending("request-id", 1),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const employees = [
        {
          id: 101,
          name: "John",
        },
        {
          id: 102,
          name: "Jane",
        },
      ];

      const state = projectReducer(
        initialState,
        getEmployeesNotInProject.fulfilled(employees, "request-id", 1),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.employeesNotInProject).toEqual(employees);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        getEmployeesNotInProject.rejected(
          null,
          "request-id",
          1,
          "Employees fetch failed",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Employees fetch failed");
    });

    it("should call service successfully", async () => {
      const employees = [{ id: 101 }, { id: 102 }];

      projectService.getEmployeesNotInProject.mockResolvedValueOnce(employees);

      const thunk = getEmployeesNotInProject(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.getEmployeesNotInProject).toHaveBeenCalledWith(10);

      expect(result.payload).toEqual(employees);
    });

    it("should reject with response data", async () => {
      projectService.getEmployeesNotInProject.mockRejectedValueOnce({
        response: {
          data: "Employee fetch failed",
        },
      });

      const thunk = getEmployeesNotInProject(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Employee fetch failed");
    });

    it("should reject with error message", async () => {
      projectService.getEmployeesNotInProject.mockRejectedValueOnce({
        message: "Employee network error",
      });

      const thunk = getEmployeesNotInProject(10);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Employee network error");
    });
  });

  // ============================================================
  // removeEmployeeFromProject
  // ============================================================

  describe("removeEmployeeFromProject", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        removeEmployeeFromProject.pending("request-id", {
          projectId: 1,
          employeeId: 100,
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should remove employee when project and employees exist", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            employees: [
              { id: 100, name: "John" },
              { id: 200, name: "Jane" },
            ],
          },
        ],
      };

      const state = projectReducer(
        existingState,
        removeEmployeeFromProject.fulfilled(undefined, "request-id", {
          projectId: 1,
          employeeId: 100,
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);

      expect(state.projects[0].employees).toEqual([
        {
          id: 200,
          name: "Jane",
        },
      ]);
    });

    it("should not change employees when employee does not exist", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            employees: [{ id: 100 }],
          },
        ],
      };

      const state = projectReducer(
        existingState,
        removeEmployeeFromProject.fulfilled(undefined, "request-id", {
          projectId: 1,
          employeeId: 999,
        }),
      );

      expect(state.projects[0].employees).toEqual([{ id: 100 }]);
    });

    it("should safely handle missing project", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            employees: [{ id: 100 }],
          },
        ],
      };

      const state = projectReducer(
        existingState,
        removeEmployeeFromProject.fulfilled(undefined, "request-id", {
          projectId: 999,
          employeeId: 100,
        }),
      );

      expect(state.projects).toEqual([
        {
          id: 1,
          employees: [{ id: 100 }],
        },
      ]);

      expect(state.isSuccess).toBe(true);
    });

    it("should safely handle project without employees", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            name: "Project",
          },
        ],
      };

      const state = projectReducer(
        existingState,
        removeEmployeeFromProject.fulfilled(undefined, "request-id", {
          projectId: 1,
          employeeId: 100,
        }),
      );

      expect(state.projects[0]).toEqual({
        id: 1,
        name: "Project",
      });

      expect(state.isSuccess).toBe(true);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        removeEmployeeFromProject.rejected(
          null,
          "request-id",
          {
            projectId: 1,
            employeeId: 100,
          },
          "Remove employee failed",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Remove employee failed");
    });

    it("should call service successfully", async () => {
      const response = {
        success: true,
      };

      projectService.removeEmployeeFromProject.mockResolvedValueOnce(response);

      const data = {
        projectId: 10,
        employeeId: 20,
      };

      const thunk = removeEmployeeFromProject(data);

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.removeEmployeeFromProject).toHaveBeenCalledWith(
        10,
        20,
      );

      expect(result.payload).toEqual(response);
    });

    it("should reject with response data", async () => {
      projectService.removeEmployeeFromProject.mockRejectedValueOnce({
        response: {
          data: "Remove failed",
        },
      });

      const thunk = removeEmployeeFromProject({
        projectId: 10,
        employeeId: 20,
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Remove failed");
    });

    it("should reject with error message", async () => {
      projectService.removeEmployeeFromProject.mockRejectedValueOnce({
        message: "Remove network error",
      });

      const thunk = removeEmployeeFromProject({
        projectId: 10,
        employeeId: 20,
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Remove network error");
    });
  });

  // ============================================================
  // assignEmployees
  // ============================================================

  describe("assignEmployees", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        assignEmployees.pending("request-id", {
          projectId: 1,
          employeeIds: [100],
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should update project and matching project in list", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            name: "Old",
            employees: [],
          },
          {
            id: 2,
            name: "Other",
            employees: [],
          },
        ],
      };

      const updatedProject = {
        id: 1,
        name: "Updated",
        employees: [{ id: 100 }],
      };

      const state = projectReducer(
        existingState,
        assignEmployees.fulfilled(updatedProject, "request-id", {
          projectId: 1,
          employeeIds: [100],
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.project).toEqual(updatedProject);

      expect(state.projects).toEqual([
        updatedProject,
        {
          id: 2,
          name: "Other",
          employees: [],
        },
      ]);
    });

    it("should keep non-matching projects unchanged", () => {
      const existingState = {
        ...initialState,
        projects: [
          {
            id: 1,
            name: "Project One",
          },
          {
            id: 2,
            name: "Project Two",
          },
        ],
      };

      const updatedProject = {
        id: 99,
        name: "Project 99",
      };

      const state = projectReducer(
        existingState,
        assignEmployees.fulfilled(updatedProject, "request-id", {
          projectId: 99,
          employeeIds: [100],
        }),
      );

      expect(state.project).toEqual(updatedProject);

      expect(state.projects).toEqual([
        {
          id: 1,
          name: "Project One",
        },
        {
          id: 2,
          name: "Project Two",
        },
      ]);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        assignEmployees.rejected(
          null,
          "request-id",
          {
            projectId: 1,
            employeeIds: [100],
          },
          "Assignment failed",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Assignment failed");
    });

    it("should call assignEmployees service successfully", async () => {
      const response = {
        id: 1,
        employees: [{ id: 100 }],
      };

      projectService.assignEmployees.mockResolvedValueOnce(response);

      const thunk = assignEmployees({
        projectId: 1,
        employeeIds: [100],
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(projectService.assignEmployees).toHaveBeenCalledWith(1, [100]);

      expect(result.payload).toEqual(response);
    });

    it("should reject with response data", async () => {
      projectService.assignEmployees.mockRejectedValueOnce({
        response: {
          data: "Assignment server error",
        },
      });

      const thunk = assignEmployees({
        projectId: 1,
        employeeIds: [100],
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Assignment server error");
    });

    it("should reject with error message", async () => {
      projectService.assignEmployees.mockRejectedValueOnce({
        message: "Assignment network error",
      });

      const thunk = assignEmployees({
        projectId: 1,
        employeeIds: [100],
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Assignment network error");
    });
  });

  // ============================================================
  // getFieldInfo
  // ============================================================

  describe("getFieldInfo", () => {
    it("should handle pending", () => {
      const state = projectReducer(
        initialState,
        getFieldInfo.pending("request-id", {
          employeeId: 1,
          date: "2026-08-07",
        }),
      );

      expect(state.isLoading).toBe(true);
    });

    it("should handle fulfilled", () => {
      const fieldInfo = {
        shift: "Morning",
        location: "Site A",
      };

      const state = projectReducer(
        initialState,
        getFieldInfo.fulfilled(fieldInfo, "request-id", {
          employeeId: 1,
          date: "2026-08-07",
        }),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.fieldInfo).toEqual(fieldInfo);
    });

    it("should handle rejected", () => {
      const state = projectReducer(
        initialState,
        getFieldInfo.rejected(
          null,
          "request-id",
          {
            employeeId: 1,
            date: "2026-08-07",
          },
          "Field info failed",
        ),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Field info failed");
    });

    it("should call fieldInfoService successfully", async () => {
      const response = {
        shift: "Night",
        location: "Site B",
      };

      fieldInfoService.mockResolvedValueOnce(response);

      const thunk = getFieldInfo({
        employeeId: 5,
        date: "2026-08-07",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(fieldInfoService).toHaveBeenCalledWith(5, "2026-08-07");

      expect(result.payload).toEqual(response);
    });

    it("should reject with response data", async () => {
      fieldInfoService.mockRejectedValueOnce({
        response: {
          data: "Field information unavailable",
        },
      });

      const thunk = getFieldInfo({
        employeeId: 5,
        date: "2026-08-07",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Field information unavailable");
    });

    it("should reject with error message", async () => {
      fieldInfoService.mockRejectedValueOnce({
        message: "Field info network error",
      });

      const thunk = getFieldInfo({
        employeeId: 5,
        date: "2026-08-07",
      });

      const result = await thunk(vi.fn(), () => ({}), undefined);

      expect(result.payload).toBe("Field info network error");
    });
  });
});

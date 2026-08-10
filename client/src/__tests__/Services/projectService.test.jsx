import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import API from "../../services/api";
import projectService, {
  fieldInfoService,
} from "../../services/fieldShiftService";

describe("projectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createProject should create a project", async () => {
    const payload = { name: "Project A" };
    const response = { data: { id: 1, ...payload } };

    API.post.mockResolvedValue(response);

    const result = await projectService.createProject(payload);

    expect(API.post).toHaveBeenCalledWith("/project/", payload);
    expect(result).toEqual(response.data);
  });

  it("getProjects should fetch project list", async () => {
    const response = {
      data: {
        results: [{ id: 1, name: "Project A" }],
      },
    };

    API.get.mockResolvedValue(response);

    const result = await projectService.getProjects("Project", 2);

    expect(API.get).toHaveBeenCalledWith("/project/", {
      params: {
        search: "Project",
        page: 2,
      },
    });

    expect(result).toEqual(response.data);
  });

  it("getProjects should use default parameters", async () => {
    API.get.mockResolvedValue({
      data: { results: [] },
    });

    await projectService.getProjects();

    expect(API.get).toHaveBeenCalledWith("/project/", {
      params: {
        search: "",
        page: 1,
      },
    });
  });

  it("getProjectById should fetch one project", async () => {
    const response = {
      data: {
        id: 5,
        name: "Project X",
      },
    };

    API.get.mockResolvedValue(response);

    const result = await projectService.getProjectById(5);

    expect(API.get).toHaveBeenCalledWith("/project/5/");
    expect(result).toEqual(response.data);
  });

  it("updateProject should update project", async () => {
    const payload = {
      id: 10,
      projectData: {
        name: "Updated Project",
      },
    };

    const response = {
      data: {
        id: 10,
        name: "Updated Project",
      },
    };

    API.put.mockResolvedValue(response);

    const result = await projectService.updateProject(payload);

    expect(API.put).toHaveBeenCalledWith(
      "/project/10/",
      payload.projectData
    );

    expect(result).toEqual(response.data);
  });

  it("assignEmployees should assign employees", async () => {
    const response = {
      data: {
        success: true,
      },
    };

    API.patch.mockResolvedValue(response);

    const result = await projectService.assignEmployees(1, [2, 3]);

    expect(API.patch).toHaveBeenCalledWith("/project/1/", {
      employees: [2, 3],
    });

    expect(result).toEqual(response.data);
  });

  it("deleteProject should delete project", async () => {
    const response = {
      data: {
        success: true,
      },
    };

    API.delete.mockResolvedValue(response);

    const result = await projectService.deleteProject(4);

    expect(API.delete).toHaveBeenCalledWith("/project/4/");
    expect(result).toEqual(response.data);
  });

  it("getEmployeesNotInProject should fetch employees", async () => {
    const response = {
      data: [
        {
          id: 1,
          name: "John",
        },
      ],
    };

    API.get.mockResolvedValue(response);

    const result =
      await projectService.getEmployeesNotInProject(8);

    expect(API.get).toHaveBeenCalledWith(
      "/project/8/employees-not-in-project/"
    );

    expect(result).toEqual(response.data);
  });

  it("removeEmployeeFromProject should remove employee", async () => {
    const response = {
      data: {
        success: true,
      },
    };

    API.delete.mockResolvedValue(response);

    const result =
      await projectService.removeEmployeeFromProject(
        5,
        12
      );

    expect(API.delete).toHaveBeenCalledWith(
      "/project/5/remove-employee/12/"
    );

    expect(result).toEqual(response.data);
  });

  it("fieldInfoService should fetch attendance info", async () => {
    const response = {
      data: {
        present: true,
      },
    };

    API.get.mockResolvedValue(response);

    const result = await fieldInfoService(
      20,
      "2026-08-07"
    );

    expect(API.get).toHaveBeenCalledWith(
      "/project/employee/20/attendance/?date=2026-08-07"
    );

    expect(result).toEqual(response.data);
  });
});
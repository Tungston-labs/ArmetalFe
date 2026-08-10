import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import API from "../../services/api";
import {
  fetchDepartments,
  fetchDepartmentMin,
  createDepartment,
  fetchDepartmentById,
  fetchEmployeesByDepartment,
  updateDepartment,
  deleteDepartment,
  fetchEmployeesByDepartmentMini,
} from "../../services/departmentServices";

describe("departmentServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchDepartments", () => {
    it("fetches departments with page and search", async () => {
      const response = {
        data: {
          results: [{ id: 1, name: "HR" }],
          total_pages: 1,
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchDepartments({
        page: 2,
        search: "HR",
      });

      expect(API.get).toHaveBeenCalledWith(
        "/departments/?search=HR&page=2"
      );
      expect(result).toEqual(response.data);
    });

    it("fetches departments without search", async () => {
      API.get.mockResolvedValue({
        data: { results: [] },
      });

      await fetchDepartments({ page: 1 });

      expect(API.get).toHaveBeenCalledWith(
        "/departments/?page=1"
      );
    });
  });

  describe("fetchDepartmentMin", () => {
    it("returns department mini list", async () => {
      const response = {
        data: {
          results: [{ id: 1, name: "Finance" }],
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchDepartmentMin();

      expect(API.get).toHaveBeenCalledWith("/deptlist/");
      expect(result).toEqual(response.data);
    });
  });

  describe("createDepartment", () => {
    it("creates department", async () => {
      const payload = {
        name: "IT",
      };

      const response = {
        data: {
          id: 10,
          ...payload,
        },
      };

      API.post.mockResolvedValue(response);

      const result = await createDepartment(payload);

      expect(API.post).toHaveBeenCalledWith(
        "/departments/",
        payload
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("fetchDepartmentById", () => {
    it("returns department by id", async () => {
      const response = {
        data: {
          id: 5,
          name: "Accounts",
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchDepartmentById(5);

      expect(API.get).toHaveBeenCalledWith(
        "/departments/5/"
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("fetchEmployeesByDepartment", () => {
    it("returns employees", async () => {
      const response = {
        data: [
          { id: 1, name: "John" },
        ],
      };

      API.get.mockResolvedValue(response);

      const result =
        await fetchEmployeesByDepartment(7);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/department/7/"
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("updateDepartment", () => {
    it("updates department", async () => {
      const payload = {
        name: "Updated",
      };

      const response = {
        data: {
          id: 3,
          ...payload,
        },
      };

      API.patch.mockResolvedValue(response);

      const result = await updateDepartment(
        3,
        payload
      );

      expect(API.patch).toHaveBeenCalledWith(
        "/departments/3/",
        payload
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("deleteDepartment", () => {
    it("deletes department", async () => {
      const response = {
        data: {
          success: true,
        },
      };

      API.delete.mockResolvedValue(response);

      const result = await deleteDepartment(8);

      expect(API.delete).toHaveBeenCalledWith(
        "/departments/8/"
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("fetchEmployeesByDepartmentMini", () => {
    it("returns employee mini list", async () => {
      const response = {
        data: [
          {
            id: 1,
            name: "John",
            profile_pic: "pic.jpg",
          },
        ],
      };

      API.get.mockResolvedValue(response);

      const result =
        await fetchEmployeesByDepartmentMini(9);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/dep/9/"
      );

      expect(result).toEqual(response.data);
    });
  });
});
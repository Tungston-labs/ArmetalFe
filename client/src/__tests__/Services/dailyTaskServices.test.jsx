import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  fetchEmployees,
  fetchTasksByEmployeeAndDate,
} from "../../services/dailyTaskServices";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("dailyTaskServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchEmployees", () => {
    it("should fetch employees with params", async () => {
      const employees = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      API.get.mockResolvedValue({
        data: employees,
      });

      const params = { department_id: 5 };

      const result = await fetchEmployees(params);

      expect(API.get).toHaveBeenCalledWith("/employeelist/", {
        params,
      });

      expect(result).toEqual(employees);
    });

    it("should return empty array when API returns null", async () => {
      API.get.mockResolvedValue({
        data: null,
      });

      const result = await fetchEmployees();

      expect(API.get).toHaveBeenCalledWith("/employeelist/", {
        params: {},
      });

      expect(result).toEqual([]);
    });

    it("should call API with empty params by default", async () => {
      API.get.mockResolvedValue({
        data: [],
      });

      await fetchEmployees();

      expect(API.get).toHaveBeenCalledWith("/employeelist/", {
        params: {},
      });
    });

    it("should throw when API request fails", async () => {
      const error = new Error("Network Error");

      API.get.mockRejectedValue(error);

      await expect(fetchEmployees()).rejects.toThrow("Network Error");
    });
  });

  describe("fetchTasksByEmployeeAndDate", () => {
    it("should fetch tasks with date", async () => {
      const tasks = [
        { id: 1, task: "Task A" },
        { id: 2, task: "Task B" },
      ];

      API.get.mockResolvedValue({
        data: {
          results: tasks,
        },
      });

      const result = await fetchTasksByEmployeeAndDate(
        10,
        "2026-08-07"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/admin/tasks/employee/10/",
        {
          params: {
            date: "2026-08-07",
          },
        }
      );

      expect(result).toEqual(tasks);
    });

    it("should fetch tasks without date", async () => {
      const tasks = [
        { id: 1, task: "Task A" },
      ];

      API.get.mockResolvedValue({
        data: {
          results: tasks,
        },
      });

      const result = await fetchTasksByEmployeeAndDate(5);

      expect(API.get).toHaveBeenCalledWith(
        "/admin/tasks/employee/5/",
        {
          params: {},
        }
      );

      expect(result).toEqual(tasks);
    });

    it("should return empty array when results are undefined", async () => {
      API.get.mockResolvedValue({
        data: {},
      });

      const result = await fetchTasksByEmployeeAndDate(5);

      expect(result).toEqual([]);
    });

    it("should throw when API request fails", async () => {
      const error = new Error("Server Error");

      API.get.mockRejectedValue(error);

      await expect(
        fetchTasksByEmployeeAndDate(5)
      ).rejects.toThrow("Server Error");
    });
  });
});
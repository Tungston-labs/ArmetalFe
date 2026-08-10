import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";

import {
  fetchDashboardSummary,
  fetchDashCounts,
  fetchReimbursementCounts,
  fetchReimbursementMonthwise,
  fetchDepartmentDashboard,
  fetchRecentEmployees,
  fetchContractExpiry,
  fetchSimpleNotifications,
  fetchTodayEmployeeStats,
  fetchHolidaySummary,
  fetchProjectEmployeeCount,
} from "../../services/dashboardService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("dashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchDashboardSummary should call correct API", async () => {
    const data = { totalEmployees: 50 };
    API.get.mockResolvedValue({ data });

    const result = await fetchDashboardSummary();

    expect(API.get).toHaveBeenCalledWith("/admin/dashboard-summary/");
    expect(result).toEqual(data);
  });

  it("fetchDashCounts should call correct API", async () => {
    const data = { employees: 100 };
    API.get.mockResolvedValue({ data });

    const result = await fetchDashCounts();

    expect(API.get).toHaveBeenCalledWith("/admindashboard/counts/");
    expect(result).toEqual(data);
  });

  it("fetchReimbursementCounts should call correct API", async () => {
    const data = { approved: 10 };
    API.get.mockResolvedValue({ data });

    const result = await fetchReimbursementCounts();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/reimbursement/counts/"
    );
    expect(result).toEqual(data);
  });

  it("fetchReimbursementMonthwise should call correct API", async () => {
    const data = [{ month: "Jan", amount: 500 }];
    API.get.mockResolvedValue({ data });

    const result = await fetchReimbursementMonthwise();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/reimbursement/monthwise/"
    );
    expect(result).toEqual(data);
  });

  it("fetchDepartmentDashboard should call correct API", async () => {
    const data = [{ name: "HR" }];
    API.get.mockResolvedValue({ data });

    const result = await fetchDepartmentDashboard();

    expect(API.get).toHaveBeenCalledWith("/admindashboard/department/");
    expect(result).toEqual(data);
  });

  it("fetchRecentEmployees should call correct API", async () => {
    const data = [{ id: 1, name: "John" }];
    API.get.mockResolvedValue({ data });

    const result = await fetchRecentEmployees();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/recentemployees/"
    );
    expect(result).toEqual(data);
  });

  it("fetchContractExpiry should call correct API", async () => {
    const data = [{ id: 1 }];
    API.get.mockResolvedValue({ data });

    const result = await fetchContractExpiry();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/contract-expiry/30-days/"
    );
    expect(result).toEqual(data);
  });

  it("fetchSimpleNotifications should call correct API", async () => {
    const data = [{ id: 1, title: "Notification" }];
    API.get.mockResolvedValue({ data });

    const result = await fetchSimpleNotifications();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/simple-notifications/"
    );
    expect(result).toEqual(data);
  });

  it("fetchTodayEmployeeStats should call correct API", async () => {
    const data = { present: 40 };
    API.get.mockResolvedValue({ data });

    const result = await fetchTodayEmployeeStats();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/today-employee-stats/"
    );
    expect(result).toEqual(data);
  });

  it("fetchHolidaySummary should call correct API", async () => {
    const data = { holidays: 12 };
    API.get.mockResolvedValue({ data });

    const result = await fetchHolidaySummary();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/holiday-summary/"
    );
    expect(result).toEqual(data);
  });

  it("fetchProjectEmployeeCount should call correct API", async () => {
    const data = [{ project: "A", employees: 5 }];
    API.get.mockResolvedValue({ data });

    const result = await fetchProjectEmployeeCount();

    expect(API.get).toHaveBeenCalledWith(
      "/admindashboard/project/employee-count/"
    );
    expect(result).toEqual(data);
  });

  it("should propagate API errors", async () => {
    const error = new Error("Network Error");
    API.get.mockRejectedValue(error);

    await expect(fetchDashboardSummary()).rejects.toThrow(
      "Network Error"
    );
  });
});
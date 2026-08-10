import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";

import {
  fetchPayrollData,
  createOrUpdatePayroll,
  verifyPayroll,
  updateEmployeePayrollStatus,
  getPayrollDetailById,
  updateEmployeeIncentive,
  updateEmployeeDeduction,
} from "../../services/payrollService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("payrollService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("fetchPayrollData", () => {
    it("fetches payroll data", async () => {
      const data = { results: [{ id: 1 }] };

      API.get.mockResolvedValue({ data });

      const result = await fetchPayrollData(
        7,
        2026,
        "john",
        2,
        "HR"
      );

      expect(API.get).toHaveBeenCalledWith("/payroll/", {
        params: {
          month: 7,
          year: 2026,
          search: "john",
          page: 2,
          department: "HR",
        },
      });

      expect(result).toEqual(data);
    });

    it("throws API error", async () => {
      API.get.mockRejectedValue({
        response: {
          data: {
            error: "Fetch Failed",
          },
        },
      });

      await expect(
        fetchPayrollData(7, 2026)
      ).rejects.toThrow("Fetch Failed");
    });
  });

  describe("createOrUpdatePayroll", () => {
    it("creates payroll", async () => {
      const payload = {
        month: 7,
        year: 2026,
        employee_ids: [1, 2],
        status: "draft",
      };

      API.post.mockResolvedValue({
        data: payload,
      });

      const result = await createOrUpdatePayroll(payload);

      expect(API.post).toHaveBeenCalledWith(
        "/payroll/",
        payload
      );

      expect(result).toEqual(payload);
    });

    it("throws create error", async () => {
      API.post.mockRejectedValue({
        response: {
          data: {
            error: "Create Failed",
          },
        },
      });

      await expect(
        createOrUpdatePayroll({})
      ).rejects.toThrow("Create Failed");
    });
  });

  describe("verifyPayroll", () => {
    it("verifies payroll", async () => {
      localStorage.setItem("token", "abc123");

      const response = {
        success: true,
      };

      API.post.mockResolvedValue({
        data: response,
      });

      const result = await verifyPayroll({
        employeeId: 5,
        month: 7,
        year: 2026,
      });

      expect(API.post).toHaveBeenCalledWith(
        "/payroll/5/verify/",
        {
          month: 7,
          year: 2026,
        },
        {
          headers: {
            Authorization: "Bearer abc123",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("throws verify error", async () => {
      API.post.mockRejectedValue({
        response: {
          data: {
            error: "Verify Failed",
          },
        },
      });

      await expect(
        verifyPayroll({
          employeeId: 1,
          month: 7,
          year: 2026,
        })
      ).rejects.toThrow("Verify Failed");
    });
  });

  describe("updateEmployeePayrollStatus", () => {
    it("updates payroll status", async () => {
      const response = {
        success: true,
      };

      API.patch.mockResolvedValue({
        data: response,
      });

      const result = await updateEmployeePayrollStatus({
        employeeId: 1,
        month: 7,
        year: 2026,
        status: "approved",
      });

      expect(API.patch).toHaveBeenCalledWith(
        "/payroll/1/status/update/",
        {
          month: 7,
          year: 2026,
          status: "approved",
        }
      );

      expect(result).toEqual(response);
    });

    it("throws status update error", async () => {
      API.patch.mockRejectedValue({
        response: {
          data: {
            error: "Status Failed",
          },
        },
      });

      await expect(
        updateEmployeePayrollStatus({
          employeeId: 1,
          month: 7,
          year: 2026,
          status: "approved",
        })
      ).rejects.toThrow("Status Failed");
    });
  });

  describe("getPayrollDetailById", () => {
    it("gets payroll details", async () => {
      const response = {
        id: 15,
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await getPayrollDetailById(15);

      expect(API.get).toHaveBeenCalledWith(
        "/payroll/record/15/"
      );

      expect(result).toEqual(response);
    });

    it("throws detail error", async () => {
      API.get.mockRejectedValue({
        response: {
          data: {
            error: "Detail Failed",
          },
        },
      });

      await expect(
        getPayrollDetailById(15)
      ).rejects.toThrow("Detail Failed");
    });
  });

  describe("updateEmployeeIncentive", () => {
    it("updates employee incentive", async () => {
      const payload = {
        employeeId: 2,
        month: 7,
        year: 2026,
        incentive_amount: 1000,
        incentive_type: "Bonus",
        incentive_reason: "Excellent Performance",
      };

      API.patch.mockResolvedValue({
        data: payload,
      });

      const result = await updateEmployeeIncentive(payload);

      expect(API.patch).toHaveBeenCalledWith(
        "/payroll/incentive/2/",
        {
          month: 7,
          year: 2026,
          incentive_amount: 1000,
          incentive_type: "Bonus",
          incentive_reason: "Excellent Performance",
        }
      );

      expect(result).toEqual(payload);
    });

    it("throws incentive error", async () => {
      API.patch.mockRejectedValue({
        response: {
          data: {
            error: "Incentive Failed",
          },
        },
      });

      await expect(
        updateEmployeeIncentive({
          employeeId: 2,
        })
      ).rejects.toThrow("Incentive Failed");
    });
  });

  describe("updateEmployeeDeduction", () => {
    it("updates employee deduction", async () => {
      const payload = {
        employeeId: 4,
        month: 7,
        year: 2026,
        deduction_amount: 500,
        deduction_type: "Penalty",
        deduction_reason: "Late Coming",
      };

      API.patch.mockResolvedValue({
        data: payload,
      });

      const result = await updateEmployeeDeduction(payload);

      expect(API.patch).toHaveBeenCalledWith(
        "/payroll/deduction/4/",
        {
          month: 7,
          year: 2026,
          deduction_amount: 500,
          deduction_type: "Penalty",
          deduction_reason: "Late Coming",
        }
      );

      expect(result).toEqual(payload);
    });

    it("throws deduction error", async () => {
      API.patch.mockRejectedValue({
        response: {
          data: {
            error: "Deduction Failed",
          },
        },
      });

      await expect(
        updateEmployeeDeduction({
          employeeId: 4,
        })
      ).rejects.toThrow("Deduction Failed");
    });
  });
});
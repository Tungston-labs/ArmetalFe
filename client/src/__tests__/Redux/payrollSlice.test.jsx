
import { describe, it, expect, vi, beforeEach } from "vitest";
import reducer, {
  resetPayrollState,
  resetSubmitSuccess,
  resetUpdateStatusSuccess,
  resetVerifySuccess,
  resetIncentiveSuccess,
  getPayrollData,
  submitPayrollRecords,
  updatePayrollStatus,
  getPayrollDetail,
  verifyEmployeePayroll,
  updatePayrollIncentive,
  updatePayrollDeduction,
} from "../../Redux/payrollSlice";

import {
  fetchPayrollData,
  createOrUpdatePayroll,
  updateEmployeePayrollStatus,
  getPayrollDetailById,
  verifyPayroll,
  updateEmployeeIncentive,
  updateEmployeeDeduction,
} from "../../services/payrollService";

vi.mock("../../services/payrollService", () => ({
  fetchPayrollData: vi.fn(),
  createOrUpdatePayroll: vi.fn(),
  updateEmployeePayrollStatus: vi.fn(),
  getPayrollDetailById: vi.fn(),
  verifyPayroll: vi.fn(),
  updateEmployeeIncentive: vi.fn(),
  updateEmployeeDeduction: vi.fn(),
}));

const initialState = {
  data: [],
  loading: false,
  error: null,
  totalPages: 1,
  submitSuccess: false,
  updateStatusSuccess: false,
  verifySuccess: false,
  payrollDetail: null,
  incentiveUpdateSuccess: false,
  incentiveError: null,
};

describe("payrollSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================
  // INITIAL STATE
  // =========================================================

  it("should return initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // =========================================================
  // RESET REDUCERS
  // =========================================================

  it("should reset payroll state", () => {
    const state = {
      data: [{ id: 1 }],
      loading: true,
      error: "error",
      totalPages: 5,
      submitSuccess: true,
      updateStatusSuccess: true,
      verifySuccess: true,
      payrollDetail: { id: 10 },
      incentiveUpdateSuccess: true,
      incentiveError: "failed",
    };

    const result = reducer(state, resetPayrollState());

    expect(result).toEqual({
      data: [],
      loading: false,
      error: null,
      totalPages: 1,
      submitSuccess: false,
      updateStatusSuccess: false,
      verifySuccess: false,
      payrollDetail: null,

      // These two are NOT reset by resetPayrollState
      incentiveUpdateSuccess: true,
      incentiveError: "failed",
    });
  });

  it("should reset submit success", () => {
    const state = {
      ...initialState,
      submitSuccess: true,
    };

    const result = reducer(state, resetSubmitSuccess());

    expect(result.submitSuccess).toBe(false);
  });

  it("should reset update status success", () => {
    const state = {
      ...initialState,
      updateStatusSuccess: true,
    };

    const result = reducer(state, resetUpdateStatusSuccess());

    expect(result.updateStatusSuccess).toBe(false);
  });

  it("should reset verify success", () => {
    const state = {
      ...initialState,
      verifySuccess: true,
    };

    const result = reducer(state, resetVerifySuccess());

    expect(result.verifySuccess).toBe(false);
  });

  it("should reset incentive success and incentive error", () => {
    const state = {
      ...initialState,
      incentiveUpdateSuccess: true,
      incentiveError: "Something failed",
    };

    const result = reducer(state, resetIncentiveSuccess());

    expect(result.incentiveUpdateSuccess).toBe(false);
    expect(result.incentiveError).toBe(null);
  });

  // =========================================================
  // getPayrollData THUNK
  // =========================================================

  it("should fetch payroll data successfully with department ID", async () => {
    const mockData = {
      results: [
        { id: 1, employee: 101 },
        { id: 2, employee: 102 },
      ],
      total_pages: 4,
    };

    fetchPayrollData.mockResolvedValue(mockData);

    const dispatch = vi.fn();

    const result = await getPayrollData({
      month: 8,
      year: 2026,
      search: "John",
      page: 2,
      department: "17:1",
    })(dispatch, vi.fn(), {});

    expect(fetchPayrollData).toHaveBeenCalledWith(
      8,
      2026,
      "John",
      2,
      "17"
    );

    expect(result.type).toBe("payroll/getPayrollData/fulfilled");
    expect(result.payload).toEqual(mockData);
  });

  it("should fetch payroll data successfully with empty department", async () => {
    const mockData = {
      data: [{ id: 1 }],
      total_pages: 2,
    };

    fetchPayrollData.mockResolvedValue(mockData);

    const result = await getPayrollData({
      month: 8,
      year: 2026,
      search: "",
      page: 1,
      department: "",
    })(vi.fn(), vi.fn(), {});

    expect(fetchPayrollData).toHaveBeenCalledWith(
      8,
      2026,
      "",
      1,
      ""
    );

    expect(result.payload).toEqual(mockData);
  });

  it("should handle getPayrollData error with response data", async () => {
    fetchPayrollData.mockRejectedValue({
      response: {
        data: {
          detail: "Payroll fetch failed",
        },
      },
    });

    const result = await getPayrollData({
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toBe("payroll/getPayrollData/rejected");

    expect(result.payload).toEqual({
      detail: "Payroll fetch failed",
    });
  });

  it("should handle getPayrollData error without response data", async () => {
    fetchPayrollData.mockRejectedValue(new Error("Network error"));

    const result = await getPayrollData({
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Failed to fetch payroll data");
  });

  // =========================================================
  // getPayrollData REDUCER STATES
  // =========================================================

  it("should handle getPayrollData pending", () => {
    const state = {
      ...initialState,
      error: "old error",
      submitSuccess: true,
      updateStatusSuccess: true,
    };

    const action = {
      type: getPayrollData.pending.type,
    };

    const result = reducer(state, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.submitSuccess).toBe(false);
    expect(result.updateStatusSuccess).toBe(false);
  });

  it("should handle getPayrollData fulfilled with array payload", () => {
    const payrolls = [
      { id: 1, employee: 101 },
      { id: 2, employee: 102 },
    ];

    const result = reducer(
      initialState,
      getPayrollData.fulfilled(payrolls)
    );

    expect(result.loading).toBe(false);
    expect(result.data).toEqual(payrolls);
    expect(result.totalPages).toBe(1);
  });

  it("should handle getPayrollData fulfilled with results payload", () => {
    const payload = {
      results: [{ id: 1 }],
      total_pages: 5,
    };

    const result = reducer(
      initialState,
      getPayrollData.fulfilled(payload)
    );

    expect(result.loading).toBe(false);
    expect(result.data).toEqual(payload.results);
    expect(result.totalPages).toBe(5);
  });

  it("should handle getPayrollData fulfilled with data payload", () => {
    const payload = {
      data: [{ id: 10 }],
    };

    const result = reducer(
      initialState,
      getPayrollData.fulfilled(payload)
    );

    expect(result.data).toEqual(payload.data);
    expect(result.totalPages).toBe(1);
  });

  it("should handle getPayrollData fulfilled with empty object", () => {
    const result = reducer(
      initialState,
      getPayrollData.fulfilled({})
    );

    expect(result.data).toEqual([]);
    expect(result.totalPages).toBe(1);
  });

  it("should handle getPayrollData rejected", () => {
    const result = reducer(
      initialState,
      getPayrollData.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Payroll error"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe("Payroll error");
  });

  // =========================================================
  // submitPayrollRecords THUNK
  // =========================================================

  it("should submit payroll records successfully", async () => {
    const response = {
      message: "Payroll submitted successfully",
    };

    createOrUpdatePayroll.mockResolvedValue(response);

    const result = await submitPayrollRecords({
      month: 8,
      year: 2026,
      employee_ids: [1, 2],
      status: "approved",
    })(vi.fn(), vi.fn(), {});

    expect(createOrUpdatePayroll).toHaveBeenCalledWith({
      month: 8,
      year: 2026,
      employee_ids: [1, 2],
      status: "approved",
    });

    expect(result.type).toBe(
      "payroll/submitPayrollRecords/fulfilled"
    );

    expect(result.payload).toEqual(response);
  });

  it("should handle submit payroll error", async () => {
    createOrUpdatePayroll.mockRejectedValue({
      response: {
        data: {
          detail: "Submit failed",
        },
      },
    });

    const result = await submitPayrollRecords({
      month: 8,
      year: 2026,
      employee_ids: [1],
      status: "pending",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Submit failed",
    });
  });

  it("should handle submit payroll error without response", async () => {
    createOrUpdatePayroll.mockRejectedValue(
      new Error("Network error")
    );

    const result = await submitPayrollRecords({
      month: 8,
      year: 2026,
      employee_ids: [1],
      status: "pending",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to submit payroll records"
    );
  });

  // =========================================================
  // submitPayrollRecords REDUCER
  // =========================================================

  it("should handle submitPayrollRecords pending", () => {
    const state = {
      ...initialState,
      submitSuccess: true,
    };

    const result = reducer(
      state,
      submitPayrollRecords.pending.type
        ? { type: submitPayrollRecords.pending.type }
        : {}
    );

    expect(result.loading).toBe(true);
    expect(result.submitSuccess).toBe(false);
  });

  it("should handle submitPayrollRecords fulfilled and update employee statuses", () => {
    const state = {
      ...initialState,
      data: [
        { id: 1, employee: 101, status: "pending" },
        { id: 2, employee: 102, status: "pending" },
        { id: 3, employee: 103, status: "pending" },
      ],
    };

    const action = submitPayrollRecords.fulfilled(
      { message: "success" },
      "request-id",
      {
        month: 8,
        year: 2026,
        employee_ids: [101, 103],
        status: "approved",
      }
    );

    const result = reducer(state, action);

    expect(result.loading).toBe(false);
    expect(result.submitSuccess).toBe(true);

    expect(result.data).toEqual([
      { id: 1, employee: 101, status: "approved" },
      { id: 2, employee: 102, status: "pending" },
      { id: 3, employee: 103, status: "approved" },
    ]);
  });

  it("should handle submitPayrollRecords fulfilled without employee IDs/status", () => {
    const state = {
      ...initialState,
      data: [{ id: 1, employee: 101, status: "pending" }],
    };

    const action = submitPayrollRecords.fulfilled(
      { message: "success" },
      "request-id",
      {
        month: 8,
        year: 2026,
      }
    );

    const result = reducer(state, action);

    expect(result.loading).toBe(false);
    expect(result.submitSuccess).toBe(true);
    expect(result.data).toEqual(state.data);
  });

  it("should handle submitPayrollRecords rejected", () => {
    const result = reducer(
      initialState,
      submitPayrollRecords.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Submit failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe("Submit failed");
    expect(result.submitSuccess).toBe(false);
  });

  // =========================================================
  // updatePayrollStatus THUNK
  // =========================================================

  it("should update payroll status successfully", async () => {
    const response = {
      status: "approved",
    };

    updateEmployeePayrollStatus.mockResolvedValue(response);

    const result = await updatePayrollStatus({
      employeeId: 10,
      month: 8,
      year: 2026,
      status: "approved",
    })(vi.fn(), vi.fn(), {});

    expect(updateEmployeePayrollStatus).toHaveBeenCalledWith({
      employeeId: 10,
      month: 8,
      year: 2026,
      status: "approved",
    });

    expect(result.payload).toEqual({
      employeeId: 10,
      data: response,
    });
  });

  it("should handle updatePayrollStatus error", async () => {
    updateEmployeePayrollStatus.mockRejectedValue({
      response: {
        data: {
          detail: "Status update failed",
        },
      },
    });

    const result = await updatePayrollStatus({
      employeeId: 10,
      month: 8,
      year: 2026,
      status: "approved",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Status update failed",
    });
  });

  it("should handle updatePayrollStatus error without response", async () => {
    updateEmployeePayrollStatus.mockRejectedValue(
      new Error("Network error")
    );

    const result = await updatePayrollStatus({
      employeeId: 10,
      month: 8,
      year: 2026,
      status: "approved",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to update payroll status"
    );
  });

  it("should handle updatePayrollStatus pending", () => {
    const state = {
      ...initialState,
      updateStatusSuccess: true,
    };

    const result = reducer(
      state,
      updatePayrollStatus.pending()
    );

    expect(result.loading).toBe(true);
    expect(result.updateStatusSuccess).toBe(false);
  });

  it("should handle updatePayrollStatus fulfilled", () => {
    const state = {
      ...initialState,
      data: [
        { id: 10, status: "pending" },
        { id: 20, status: "pending" },
      ],
    };

    const result = reducer(
      state,
      updatePayrollStatus.fulfilled(
        {
          employeeId: 10,
          data: {
            status: "approved",
          },
        }
      )
    );

    expect(result.loading).toBe(false);
    expect(result.updateStatusSuccess).toBe(true);

    expect(result.data).toEqual([
      { id: 10, status: "approved" },
      { id: 20, status: "pending" },
    ]);
  });

  it("should handle updatePayrollStatus rejected", () => {
    const result = reducer(
      initialState,
      updatePayrollStatus.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Status update failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe("Status update failed");
    expect(result.updateStatusSuccess).toBe(false);
  });

  // =========================================================
  // getPayrollDetail THUNK
  // =========================================================

  it("should get payroll detail successfully", async () => {
    const response = {
      id: 100,
      employee: 10,
      salary: 50000,
    };

    getPayrollDetailById.mockResolvedValue(response);

    const result = await getPayrollDetail(100)(
      vi.fn(),
      vi.fn(),
      {}
    );

    expect(getPayrollDetailById).toHaveBeenCalledWith(100);
    expect(result.payload).toEqual(response);
  });

  it("should handle payroll detail error", async () => {
    getPayrollDetailById.mockRejectedValue({
      response: {
        data: {
          detail: "Payroll detail failed",
        },
      },
    });

    const result = await getPayrollDetail(100)(
      vi.fn(),
      vi.fn(),
      {}
    );

    expect(result.payload).toEqual({
      detail: "Payroll detail failed",
    });
  });

  it("should handle payroll detail error without response", async () => {
    getPayrollDetailById.mockRejectedValue(
      new Error("Network error")
    );

    const result = await getPayrollDetail(100)(
      vi.fn(),
      vi.fn(),
      {}
    );

    expect(result.payload).toBe(
      "Failed to fetch payroll detail"
    );
  });

  it("should handle getPayrollDetail pending", () => {
    const state = {
      ...initialState,
      payrollDetail: { id: 1 },
      error: "old error",
    };

    const result = reducer(
      state,
      getPayrollDetail.pending()
    );

    expect(result.loading).toBe(true);
    expect(result.payrollDetail).toBe(null);
    expect(result.error).toBe(null);
  });

  it("should handle getPayrollDetail fulfilled", () => {
    const detail = {
      id: 10,
      employee: 100,
      salary: 50000,
    };

    const result = reducer(
      initialState,
      getPayrollDetail.fulfilled(detail)
    );

    expect(result.loading).toBe(false);
    expect(result.payrollDetail).toEqual(detail);
  });

  it("should handle getPayrollDetail rejected", () => {
    const result = reducer(
      initialState,
      getPayrollDetail.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Detail failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe("Detail failed");
    expect(result.payrollDetail).toBe(null);
  });

  // =========================================================
  // verifyEmployeePayroll THUNK
  // =========================================================

  it("should verify employee payroll successfully", async () => {
    const response = {
      id: 10,
      status: "verified",
    };

    verifyPayroll.mockResolvedValue(response);

    const result = await verifyEmployeePayroll({
      employeeId: 10,
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(verifyPayroll).toHaveBeenCalledWith({
      employeeId: 10,
      month: 8,
      year: 2026,
    });

    expect(result.payload).toEqual({
      employeeId: 10,
      data: response,
    });
  });

  it("should handle verify payroll backend error", async () => {
    verifyPayroll.mockRejectedValue({
      response: {
        data: {
          error: "Already verified",
        },
      },
    });

    const result = await verifyEmployeePayroll({
      employeeId: 10,
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Already verified");
  });

  it("should handle verify payroll error without backend error", async () => {
    verifyPayroll.mockRejectedValue({
      response: {
        data: {},
      },
    });

    const result = await verifyEmployeePayroll({
      employeeId: 10,
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to verify payroll"
    );
  });

  it("should handle verify payroll error without response", async () => {
    verifyPayroll.mockRejectedValue(
      new Error("Network error")
    );

    const result = await verifyEmployeePayroll({
      employeeId: 10,
      month: 8,
      year: 2026,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to verify payroll"
    );
  });

  it("should handle verifyEmployeePayroll pending", () => {
    const state = {
      ...initialState,
      verifySuccess: true,
    };

    const result = reducer(
      state,
      verifyEmployeePayroll.pending()
    );

    expect(result.loading).toBe(true);
    expect(result.verifySuccess).toBe(false);
  });

  it("should handle verifyEmployeePayroll fulfilled", () => {
    const state = {
      ...initialState,
      data: [
        { id: 10, status: "pending" },
        { id: 20, status: "pending" },
      ],
    };

    const response = {
      id: 10,
      status: "verified",
    };

    const result = reducer(
      state,
      verifyEmployeePayroll.fulfilled({
        employeeId: 10,
        data: response,
      })
    );

    expect(result.loading).toBe(false);
    expect(result.verifySuccess).toBe(true);

    expect(result.data).toEqual([
      response,
      { id: 20, status: "pending" },
    ]);
  });

  it("should handle verifyEmployeePayroll rejected", () => {
    const result = reducer(
      initialState,
      verifyEmployeePayroll.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Verification failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.verifySuccess).toBe(false);
    expect(result.error).toBe("Verification failed");
  });

  // =========================================================
  // updatePayrollIncentive THUNK
  // =========================================================

  it("should update payroll incentive successfully", async () => {
    const response = {
      id: 10,
      incentive: 5000,
    };

    updateEmployeeIncentive.mockResolvedValue(response);

    const payload = {
      employeeId: 10,
      month: 8,
      year: 2026,
      incentive_amount: 5000,
      incentive_type: "performance",
      incentive_reason: "Good performance",
    };

    const result = await updatePayrollIncentive(payload)(
      vi.fn(),
      vi.fn(),
      {}
    );

    expect(updateEmployeeIncentive).toHaveBeenCalledWith(payload);

    expect(result.payload).toEqual({
      employeeId: 10,
      data: response,
    });
  });

  it("should handle incentive update error using error.message", async () => {
    updateEmployeeIncentive.mockRejectedValue(
      new Error("Incentive update failed")
    );

    const result = await updatePayrollIncentive({
      employeeId: 10,
      month: 8,
      year: 2026,
      incentive_amount: 5000,
      incentive_type: "performance",
      incentive_reason: "Good work",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Incentive update failed"
    );
  });

  it("should handle incentive update error without message", async () => {
    updateEmployeeIncentive.mockRejectedValue({});

    const result = await updatePayrollIncentive({
      employeeId: 10,
      month: 8,
      year: 2026,
      incentive_amount: 5000,
      incentive_type: "performance",
      incentive_reason: "Good work",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to update incentive"
    );
  });

  it("should handle updatePayrollIncentive pending", () => {
    const state = {
      ...initialState,
      incentiveUpdateSuccess: true,
      incentiveError: "old error",
    };

    const result = reducer(
      state,
      updatePayrollIncentive.pending()
    );

    expect(result.loading).toBe(true);
    expect(result.incentiveUpdateSuccess).toBe(false);
    expect(result.incentiveError).toBe(null);
  });

  it("should handle updatePayrollIncentive fulfilled", () => {
    const state = {
      ...initialState,
      data: [
        { id: 10, incentive: 0 },
        { id: 20, incentive: 1000 },
      ],
    };

    const updatedEmployee = {
      id: 10,
      incentive: 5000,
    };

    const result = reducer(
      state,
      updatePayrollIncentive.fulfilled({
        employeeId: 10,
        data: updatedEmployee,
      })
    );

    expect(result.loading).toBe(false);
    expect(result.incentiveUpdateSuccess).toBe(true);

    expect(result.data).toEqual([
      updatedEmployee,
      { id: 20, incentive: 1000 },
    ]);
  });

  it("should handle updatePayrollIncentive rejected", () => {
    const result = reducer(
      initialState,
      updatePayrollIncentive.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Incentive failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.incentiveUpdateSuccess).toBe(false);
    expect(result.incentiveError).toBe("Incentive failed");
  });

  // =========================================================
  // updatePayrollDeduction THUNK
  // =========================================================

  it("should update payroll deduction successfully", async () => {
    const response = {
      id: 10,
      deduction: 2000,
    };

    updateEmployeeDeduction.mockResolvedValue(response);

    const payload = {
      employeeId: 10,
      month: 8,
      year: 2026,
      deduction_amount: 2000,
      deduction_type: "tax",
      deduction_reason: "Tax deduction",
    };

    const result = await updatePayrollDeduction(payload)(
      vi.fn(),
      vi.fn(),
      {}
    );

    expect(updateEmployeeDeduction).toHaveBeenCalledWith(payload);

    expect(result.payload).toEqual({
      employeeId: 10,
      data: response,
    });
  });

  it("should handle deduction update error using error.message", async () => {
    updateEmployeeDeduction.mockRejectedValue(
      new Error("Deduction update failed")
    );

    const result = await updatePayrollDeduction({
      employeeId: 10,
      month: 8,
      year: 2026,
      deduction_amount: 2000,
      deduction_type: "tax",
      deduction_reason: "Tax",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Deduction update failed"
    );
  });

  it("should handle deduction update error without message", async () => {
    updateEmployeeDeduction.mockRejectedValue({});

    const result = await updatePayrollDeduction({
      employeeId: 10,
      month: 8,
      year: 2026,
      deduction_amount: 2000,
      deduction_type: "tax",
      deduction_reason: "Tax",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(
      "Failed to update deduction"
    );
  });

  it("should handle updatePayrollDeduction pending", () => {
    const state = {
      ...initialState,
      loading: false,
    };

    const result = reducer(
      state,
      updatePayrollDeduction.pending()
    );

    expect(result.loading).toBe(true);
  });

  it("should handle updatePayrollDeduction fulfilled", () => {
    const state = {
      ...initialState,
      data: [
        { id: 10, deduction: 0 },
        { id: 20, deduction: 1000 },
      ],
    };

    const updatedEmployee = {
      id: 10,
      deduction: 2000,
    };

    const result = reducer(
      state,
      updatePayrollDeduction.fulfilled({
        employeeId: 10,
        data: updatedEmployee,
      })
    );

    expect(result.loading).toBe(false);

    expect(result.data).toEqual([
      updatedEmployee,
      { id: 20, deduction: 1000 },
    ]);
  });

  it("should handle updatePayrollDeduction rejected", () => {
    const result = reducer(
      initialState,
      updatePayrollDeduction.rejected(
        new Error("failed"),
        "request-id",
        {},
        "Deduction failed"
      )
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe("Deduction failed");
  });
});


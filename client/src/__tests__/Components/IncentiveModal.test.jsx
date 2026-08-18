import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

// ============================================================
// MOCKS
// ============================================================

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  updatePayrollIncentive: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
}));

vi.mock("../../Redux/payrollSlice.js", () => ({
  updatePayrollIncentive: mocks.updatePayrollIncentive,
}));

// ============================================================
// IMPORT COMPONENT AFTER MOCKS
// ============================================================

import IncentiveModal from "../../Components/payroll/IncentiveModal/IncentiveModal";

// ============================================================
// TEST DATA
// ============================================================

const employee = {
  employee: 101,
  employee_name: "John Doe",
  employee_id: "EMP001",
  department: "IT",
};

const defaultProps = {
  onClose: vi.fn(),
  employee,
  month: "August",
  year: 2026,
};

// ============================================================
// HELPERS
// ============================================================

const renderModal = (props = {}) => {
  return render(<IncentiveModal {...defaultProps} {...props} />);
};

const getAmountInput = () => screen.getByPlaceholderText("e.g. 8000");

const getTypeInput = () => screen.getByPlaceholderText("e.g. Sales Bonus");

const getRemarksInput = () =>
  screen.getByPlaceholderText(
    "Briefly describe the reason for this incentive...",
  );

// ============================================================
// SETUP / CLEANUP
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterEach(() => {
  cleanup();
});

// ============================================================
// RENDERING TESTS
// ============================================================

describe("IncentiveModal", () => {
  it("renders the incentive modal", () => {
    renderModal();

    expect(screen.getByText("Add Incentive")).toBeInTheDocument();

    expect(screen.getByText("Incentive Amount")).toBeInTheDocument();

    expect(screen.getByText("Incentive Type")).toBeInTheDocument();

    expect(screen.getByText("Reason / Remarks")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("renders employee information", () => {
    renderModal();

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText(/EMP001/)).toBeInTheDocument();

    expect(screen.getByText(/IT/)).toBeInTheDocument();
  });

  it("renders employee initials in avatar", () => {
    renderModal();

    expect(screen.getByText("JO")).toBeInTheDocument();
  });

  it("renders N/A when employee department is missing", () => {
    renderModal({
      employee: {
        employee: 101,
        employee_name: "John Doe",
        employee_id: "EMP001",
      },
    });

    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it("renders input fields with correct placeholders", () => {
    renderModal();

    expect(getAmountInput()).toBeInTheDocument();
    expect(getTypeInput()).toBeInTheDocument();
    expect(getRemarksInput()).toBeInTheDocument();
  });

  // ==========================================================
  // CLOSE / CANCEL
  // ==========================================================

  it("calls onClose(false) when close button is clicked", () => {
    const onClose = vi.fn();

    renderModal({ onClose });

    fireEvent.click(
      screen.getByRole("button", {
        name: "✕",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it("calls onClose(false) when Cancel is clicked", () => {
    const onClose = vi.fn();

    renderModal({ onClose });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(false);
  });

  // ==========================================================
  // INPUT TESTS
  // ==========================================================

  it("updates incentive amount", () => {
    renderModal();

    const input = getAmountInput();

    fireEvent.change(input, {
      target: {
        value: "8000",
      },
    });

    expect(input).toHaveValue(8000);
  });

  it("updates incentive type", () => {
    renderModal();

    const input = getTypeInput();

    fireEvent.change(input, {
      target: {
        value: "Sales Bonus",
      },
    });

    expect(input).toHaveValue("Sales Bonus");
  });

  it("updates remarks", () => {
    renderModal();

    const textarea = getRemarksInput();

    fireEvent.change(textarea, {
      target: {
        value: "Excellent performance",
      },
    });

    expect(textarea).toHaveValue("Excellent performance");
  });

  // ==========================================================
  // VALIDATION - AMOUNT
  // ==========================================================

  it("shows amount required validation", async () => {
    renderModal();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(await screen.findByText("Amount is required")).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("shows amount greater than zero validation", async () => {
    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "0",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("shows amount validation for negative amount", async () => {
    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "-500",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // VALIDATION - TYPE
  // ==========================================================

  it("shows incentive type required validation", async () => {
    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Incentive type is required"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("shows incentive type validation when only spaces are entered", async () => {
    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "   ",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Incentive type is required"),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // VALIDATION - REMARKS
  // ==========================================================

  it("shows remarks validation when remarks exceed 200 characters", async () => {
    renderModal();

    const longRemarks = "a".repeat(201);

    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.change(getRemarksInput(), {
      target: {
        value: longRemarks,
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Remarks cannot exceed 200 characters"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("allows remarks with exactly 200 characters", async () => {
    const onClose = vi.fn();

    const dispatchResult = {
      unwrap: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue(dispatchResult);

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.change(getRemarksInput(), {
      target: {
        value: "a".repeat(200),
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalled();
    });

    expect(onClose).toHaveBeenCalledWith(true);
  });

  // ==========================================================
  // VALIDATION - MULTIPLE ERRORS
  // ==========================================================

  it("shows multiple validation errors together", async () => {
    renderModal();

    const longRemarks = "x".repeat(201);

    fireEvent.change(getRemarksInput(), {
      target: {
        value: longRemarks,
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(await screen.findByText("Amount is required")).toBeInTheDocument();

    expect(screen.getByText("Incentive type is required")).toBeInTheDocument();

    expect(
      screen.getByText("Remarks cannot exceed 200 characters"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  // ==========================================================
  // SUCCESSFUL SAVE
  // ==========================================================

  it("dispatches updatePayrollIncentive with correct data", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockResolvedValue({
      success: true,
    });

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.change(getRemarksInput(), {
      target: {
        value: "Excellent performance",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(mocks.updatePayrollIncentive).toHaveBeenCalledWith({
        employeeId: 101,
        month: "August",
        year: 2026,
        incentive_amount: "8000",
        incentive_type: "Sales Bonus",
        incentive_reason: "Excellent performance",
      });
    });

    expect(mocks.dispatch).toHaveBeenCalled();

    expect(unwrap).toHaveBeenCalled();

    expect(onClose).toHaveBeenCalledWith(true);
  });

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  it("shows Saving... while request is pending", async () => {
    const onClose = vi.fn();

    let resolveRequest;

    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    const unwrap = vi.fn().mockReturnValue(pendingPromise);

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByRole("button", {
        name: "Saving...",
      }),
    ).toBeDisabled();

    resolveRequest({
      success: true,
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  // ==========================================================
  // DUPLICATE INCENTIVE ERROR
  // ==========================================================

  it("closes successfully when duplicate incentive error is returned in error property", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockRejectedValue({
      error: "Incentive already added for this employee for this month.",
    });

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  it("closes successfully when duplicate incentive error is returned in message property", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockRejectedValue({
      message: "Incentive already added for this employee for this month.",
    });

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  // ==========================================================
  // OBJECT ERROR
  // ==========================================================

  it("displays object error returned from API", async () => {
    const onClose = vi.fn();

    const apiError = {
      general: "Server validation failed",
    };

    const unwrap = vi.fn().mockRejectedValue(apiError);

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Server validation failed"),
    ).toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalledWith(true);
  });

  it("displays amount error returned from API", async () => {
    const apiError = {
      amount: "Amount exceeds allowed limit",
    };

    const unwrap = vi.fn().mockRejectedValue(apiError);

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "50000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Amount exceeds allowed limit"),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // STRING ERROR
  // ==========================================================

  it("displays string error returned from API", async () => {
    const apiError = "Unable to save incentive";

    const unwrap = vi.fn().mockRejectedValue(apiError);

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(
      await screen.findByText("Unable to save incentive"),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // GENERIC ERROR
  // ==========================================================

  it("displays generic error when empty string is returned", async () => {
    const unwrap = vi.fn().mockRejectedValue("");

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  // ==========================================================
  // LOADING RESET AFTER ERROR
  // ==========================================================

  it("returns button to Save Incentive after request fails", async () => {
    const unwrap = vi.fn().mockRejectedValue({
      general: "Request failed",
    });

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal();

    fireEvent.change(getAmountInput(), {
      target: {
        value: "5000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Performance Bonus",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Save Incentive",
        }),
      ).not.toBeDisabled();
    });

    expect(screen.getByText("Request failed")).toBeInTheDocument();
  });

  // ==========================================================
  // SAVE BUTTON
  // ==========================================================

  it("save button is enabled initially", () => {
    renderModal();

    expect(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    ).not.toBeDisabled();
  });

  // ==========================================================
  // FORM RETRY AFTER VALIDATION ERROR
  // ==========================================================

  it("allows user to correct validation errors and save", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockResolvedValue({
      success: true,
    });

    mocks.updatePayrollIncentive.mockReturnValue({
      type: "payroll/updatePayrollIncentive",
    });

    mocks.dispatch.mockReturnValue({
      unwrap,
    });

    renderModal({ onClose });

    // First submit invalid data
    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    expect(await screen.findByText("Amount is required")).toBeInTheDocument();

    // Correct data
    fireEvent.change(getAmountInput(), {
      target: {
        value: "8000",
      },
    });

    fireEvent.change(getTypeInput(), {
      target: {
        value: "Sales Bonus",
      },
    });

    fireEvent.change(getRemarksInput(), {
      target: {
        value: "Excellent work",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Incentive",
      }),
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });
});

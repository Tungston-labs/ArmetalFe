import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeductionModal from "../../Components/payroll/DeductionModal/DeductionModal";
import * as payrollSlice from "../../Redux/payrollSlice";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  updatePayrollDeduction: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
}));

vi.mock("../../Redux/payrollSlice", () => ({
  updatePayrollDeduction: (...args) => mocks.updatePayrollDeduction(...args),
}));

/* =========================================================
   TEST DATA
========================================================= */

const employee = {
  employee: 101,
  employee_name: "John Doe",
  employee_id: "EMP001",
  department: "Engineering",
};

const defaultProps = {
  onClose: vi.fn(),
  employee,
  month: 8,
  year: 2026,
};

/* =========================================================
   HELPER
========================================================= */

const renderModal = (props = {}) => {
  return render(<DeductionModal {...defaultProps} {...props} />);
};

/* =========================================================
   TESTS
========================================================= */

describe("DeductionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.updatePayrollDeduction.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        success: true,
      }),
    });

    mocks.dispatch.mockImplementation((action) => action);
  });

  /* =======================================================
     RENDERING
  ======================================================= */

  it("renders the deduction modal", () => {
    renderModal();

    expect(screen.getByText("Add Deduction")).toBeInTheDocument();
    expect(screen.getByText("Deduction Amount")).toBeInTheDocument();
    expect(screen.getByText("Deduction Type")).toBeInTheDocument();
    expect(screen.getByText("Reason / Remarks")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Deduction" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders employee information", () => {
    renderModal();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("EMP001 · Engineering")).toBeInTheDocument();
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

    expect(screen.getByText("EMP001 · N/A")).toBeInTheDocument();
  });

  it("renders employee name safely when employee is missing", () => {
    renderModal({
      employee: undefined,
    });

    expect(screen.getByText("Add Deduction")).toBeInTheDocument();
  });

  /* =======================================================
     INPUTS
  ======================================================= */

  it("updates deduction amount input", () => {
    renderModal();

    const amountInput = screen.getByPlaceholderText("e.g. 2000");

    fireEvent.change(amountInput, {
      target: { value: "2500" },
    });

    expect(amountInput).toHaveValue(2500);
  });

  it("updates deduction type input", () => {
    renderModal();

    const typeInput = screen.getByPlaceholderText("e.g. Late Attendance");

    fireEvent.change(typeInput, {
      target: { value: "Late Attendance" },
    });

    expect(typeInput).toHaveValue("Late Attendance");
  });

  it("updates remarks textarea", () => {
    renderModal();

    const textarea = screen.getByPlaceholderText(
      "Briefly describe the reason for this deduction...",
    );

    fireEvent.change(textarea, {
      target: { value: "Employee arrived late multiple times." },
    });

    expect(textarea).toHaveValue("Employee arrived late multiple times.");
  });

  /* =======================================================
     CLOSE / CANCEL
  ======================================================= */

  it("calls onClose(false) when close button is clicked", () => {
    const onClose = vi.fn();

    renderModal({ onClose });

    const closeButton = screen.getByRole("button", { name: "✕" });

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledWith(false);
  });

  it("calls onClose(false) when cancel button is clicked", () => {
    const onClose = vi.fn();

    renderModal({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledWith(false);
  });

  /* =======================================================
     VALIDATION - AMOUNT
  ======================================================= */

  it("shows error when amount is empty", async () => {
    renderModal();

    const typeInput = screen.getByPlaceholderText("e.g. Late Attendance");

    fireEvent.change(typeInput, {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(await screen.findByText("Amount is required")).toBeInTheDocument();
    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("shows error when amount is zero", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "0" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  it("shows error when amount is negative", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "-100" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     VALIDATION - TYPE
  ======================================================= */

  it("shows error when deduction type is empty", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Deduction type is required"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("shows error when deduction type contains only spaces", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Deduction type is required"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     VALIDATION - REMARKS
  ======================================================= */

  it("shows error when remarks exceed 200 characters", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    const longRemarks = "a".repeat(201);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Briefly describe the reason for this deduction...",
      ),
      { target: { value: longRemarks } },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Remarks cannot exceed 200 characters"),
    ).toBeInTheDocument();

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  /* =======================================================
     SUCCESSFUL SAVE
  ======================================================= */

  it("dispatches deduction payload and closes successfully", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockResolvedValue({ success: true });

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "2500" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Briefly describe the reason for this deduction...",
      ),
      { target: { value: "Late attendance deduction" } },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    await waitFor(() => {
      expect(mocks.updatePayrollDeduction).toHaveBeenCalledWith({
        employeeId: 101,
        month: 8,
        year: 2026,
        deduction_amount: "2500",
        deduction_type: "Late Attendance",
        deduction_reason: "Late attendance deduction",
      });
    });

    expect(mocks.dispatch).toHaveBeenCalled();
    expect(unwrap).toHaveBeenCalled();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  /* =======================================================
     LOADING STATE
  ======================================================= */

  it("shows Saving... while request is pending", async () => {
    const onClose = vi.fn();

    let resolveRequest;

    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    const unwrap = vi.fn().mockReturnValue(pendingPromise);

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByRole("button", { name: "Saving..." }),
    ).toBeDisabled();

    resolveRequest({ success: true });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  /* =======================================================
     DUPLICATE DEDUCTION ERROR - error
  ======================================================= */

  it("closes when duplicate deduction error is returned in error property", async () => {
    const onClose = vi.fn();

    const duplicateError = {
      error: "Deduction already added for this employee for this month.",
    };

    const unwrap = vi.fn().mockRejectedValue(duplicateError);

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  /* =======================================================
     DUPLICATE DEDUCTION ERROR - message
  ======================================================= */

  it("closes when duplicate deduction error is returned in message property", async () => {
    const onClose = vi.fn();

    const duplicateError = {
      message: "Deduction already added for this employee for this month.",
    };

    const unwrap = vi.fn().mockRejectedValue(duplicateError);

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  /* =======================================================
     OBJECT ERROR
  ======================================================= */

  it("shows object error when API returns an object error", async () => {
    const apiError = {
      amount: "Amount exceeds allowed salary limit",
    };

    const unwrap = vi.fn().mockRejectedValue(apiError);

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Amount exceeds allowed salary limit"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     STRING ERROR
  ======================================================= */

  it("shows string error when API returns a string", async () => {
    const apiError = "Unable to save deduction";

    const unwrap = vi.fn().mockRejectedValue(apiError);

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(
      await screen.findByText("Unable to save deduction"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     UNKNOWN / EMPTY ERROR
  ======================================================= */

  it("shows fallback error when API returns an empty string", async () => {
    const unwrap = vi.fn().mockRejectedValue("");

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal();

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Late Attendance" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  /* =======================================================
     REMARKS EXACTLY 200 CHARACTERS
  ======================================================= */

  it("allows remarks with exactly 200 characters", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockResolvedValue({ success: true });

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Other Deduction" },
    });

    const remarks = "a".repeat(200);

    fireEvent.change(
      screen.getByPlaceholderText(
        "Briefly describe the reason for this deduction...",
      ),
      { target: { value: remarks } },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    await waitFor(() => {
      expect(mocks.updatePayrollDeduction).toHaveBeenCalled();
    });

    expect(
      screen.queryByText("Remarks cannot exceed 200 characters"),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  /* =======================================================
     VALID FORM WITHOUT REMARKS
  ======================================================= */

  it("allows saving without remarks", async () => {
    const onClose = vi.fn();

    const unwrap = vi.fn().mockResolvedValue({ success: true });

    mocks.updatePayrollDeduction.mockReturnValue({ unwrap });

    mocks.dispatch.mockImplementation((action) => action);

    renderModal({ onClose });

    fireEvent.change(screen.getByPlaceholderText("e.g. 2000"), {
      target: { value: "1500" },
    });

    fireEvent.change(screen.getByPlaceholderText("e.g. Late Attendance"), {
      target: { value: "Salary Deduction" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Deduction" }));

    await waitFor(() => {
      expect(mocks.updatePayrollDeduction).toHaveBeenCalledWith({
        employeeId: 101,
        month: 8,
        year: 2026,
        deduction_amount: "1500",
        deduction_type: "Salary Deduction",
        deduction_reason: "",
      });
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });
});

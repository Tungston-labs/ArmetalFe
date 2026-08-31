import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ReimbursementList from "../../Pages/reimbursement/ReimbursementList"; // adjust path/filename to match your project
import { getDepartments } from "../../Redux/departmentSlice";
import {
  fetchReimbursementsByDepartment,
  updateReimbursementStatus,
} from "../../services/reimbursement";

// ---- Mocks -----------------------------------------------------------

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", async () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn((payload) => ({ type: "departments/get", payload })),
}));

vi.mock("../../services/reimbursement", () => ({
  fetchReimbursementsByDepartment: vi.fn(),
  updateReimbursementStatus: vi.fn(),
}));

vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader" />,
}));
vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => (
    <div data-testid="employee-title">
      <span>{props.title}</span>
      <span>{props.subtitle}</span>

      {props.buttonText && (
        <button onClick={props.onAddClick}>
          {props.buttonText}
        </button>
      )}
    </div>
  ),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <div data-testid="clip-loader" />,
}));

vi.mock("react-icons/fa6", () => ({
  FaAnglesRight: () => <span>Right</span>,
  FaAnglesLeft: () => <span>Left</span>,
}));

vi.mock("../../assets/history.svg", () => ({
  default: "history-icon.svg",
}));

vi.mock("../../assets/remi.svg", () => ({
  default: "remi-icon.svg",
}));

// FIXED: path must match where ReimbursementList.jsx actually imports
// Side_detail from (its own folder), not the test file's folder.
vi.mock("../../Pages/reimbursement/Side_detail", () => ({
  default: (props) => (
    <div data-testid="side-detail">
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

// Styled-components mocked as plain passthrough elements so tests aren't
// coupled to the real styling implementation.
vi.mock("../attendance/AttendanceList.Styles", () => {
  const passthrough = (tag) => (props) =>
    React.createElement(tag, props, props.children);
  return {
    PageContainer: passthrough("div"),
    DepartmentGrid: passthrough("div"),
    DepartmentCard: passthrough("div"),
    DepartmentHeader: passthrough("div"),
    DepartmentName: passthrough("span"),
    EmployeeCount: passthrough("span"),
    DropdownWrapper: passthrough("div"),
    DropdownHeader: passthrough("div"),
    EmployeeList: passthrough("div"),
    EmployeeItem: passthrough("div"),
    EmployeeRow: passthrough("div"),
    EmployeeCell: passthrough("div"),
    PaginationWrapper: passthrough("div"),
    PageButton: (props) => <button {...props}>{props.children}</button>,
    PageInfo: passthrough("span"),
    StatusSelect: (props) => <select {...props}>{props.children}</select>,
    LeftWrapper: passthrough("div"),
    DepartmentIcon: passthrough("span"),
  };
});

// ---- Test data -----------------------------------------------------------

const departments = [
  { id: "d1", name: "Engineering", reimbursement_request_count: 3 },
  { id: "d2", name: "Sales", reimbursement_request_count: 0 },
];

const makeEmployee = (i, overrides = {}) => ({
  id: `emp-${i}`,
  employee_name: `Employee ${i}`,
  employee_id: `E${i}`,
  designation: "Developer",
  amount: 100 * i,
  status: "In Verification",
  ...overrides,
});

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

const setupSelector = ({ list = departments, loading = false } = {}) => {
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({ departments: { list, loading } })
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  useNavigate.mockReturnValue(mockNavigate);
  setupSelector();
});

// ---- Tests ---------------------------------------------------------------

describe("ReimbursementList", () => {
  test("dispatches getDepartments on mount", () => {
    render(<ReimbursementList />);

    expect(getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "departments/get",
      payload: { page: 1, search: "" },
    });
  });

  test("shows the Loader while departments are loading", () => {
    setupSelector({ loading: true });

    render(<ReimbursementList />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
  });

  test("renders a card for every department once loaded", () => {
    render(<ReimbursementList />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("3 Request")).toBeInTheDocument();
    expect(screen.getByText("0 Request")).toBeInTheDocument();
  });

  test("shows 'No departments found.' when the department list is empty", () => {
    setupSelector({ list: [] });

    render(<ReimbursementList />);

    expect(screen.getByText("No departments found.")).toBeInTheDocument();
  });

  test("clicking a department header fetches and expands its reimbursements", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1), makeEmployee(2)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));

    await waitFor(() =>
      expect(fetchReimbursementsByDepartment).toHaveBeenCalledWith("d1", 1)
    );

    expect(await screen.findByText("Employee 1")).toBeInTheDocument();
    expect(screen.getByText("Employee 2")).toBeInTheDocument();
    expect(screen.getByText("Sl No")).toBeInTheDocument();
  });

  test("clicking an already-open department collapses it", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    expect(await screen.findByText("Employee 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Engineering"));
    expect(screen.queryByText("Employee 1")).not.toBeInTheDocument();
  });

  test("does not re-fetch reimbursements when a department is re-opened", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering")); // open (fetches)
    await screen.findByText("Employee 1");
    fireEvent.click(screen.getByText("Engineering")); // close
    fireEvent.click(screen.getByText("Engineering")); // re-open

    await screen.findByText("Employee 1");
    expect(fetchReimbursementsByDepartment).toHaveBeenCalledTimes(1);
  });

  test("shows an empty-state row when a department has no reimbursements", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({ results: [] });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Sales"));

    expect(
      await screen.findByText("No reimbursement records found.")
    ).toBeInTheDocument();
  });

  test("shows an empty list when fetching a department's reimbursements fails", async () => {
    fetchReimbursementsByDepartment.mockRejectedValue(new Error("boom"));

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));

    expect(
      await screen.findByText("No reimbursement records found.")
    ).toBeInTheDocument();
  });

  test("clicking an employee row navigates to its reimbursement detail page", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    const row = await screen.findByText("Employee 1");
    fireEvent.click(row);

    expect(mockNavigate).toHaveBeenCalledWith("/reimbursement_info/emp-1");
  });

  test("clicking the status select does not trigger row navigation", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });
    updateReimbursementStatus.mockResolvedValue({});

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    const select = await screen.findByDisplayValue("In Verification");
    fireEvent.click(select);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("status select is disabled for Approved rows, enabled otherwise", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1, { status: "Approve" }), makeEmployee(2)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    const approvedSelect = await screen.findByDisplayValue("Approved");
    const pendingSelect = await screen.findByDisplayValue("In Verification");

    expect(approvedSelect).toBeDisabled();
    expect(pendingSelect).not.toBeDisabled();
  });

  test("changing status optimistically updates and calls updateReimbursementStatus", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });
    updateReimbursementStatus.mockResolvedValue({});

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    const select = await screen.findByDisplayValue("In Verification");
    fireEvent.change(select, { target: { value: "On Hold" } });

    expect(select.value).toBe("On Hold");
    await waitFor(() =>
      expect(updateReimbursementStatus).toHaveBeenCalledWith("emp-1", "On Hold")
    );
  });

  test("reverts status if updateReimbursementStatus fails", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });
    updateReimbursementStatus.mockRejectedValue(new Error("failed"));

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    const select = await screen.findByDisplayValue("In Verification");
    fireEvent.change(select, { target: { value: "Reject" } });

    expect(select.value).toBe("Reject");
    await waitFor(() => expect(select.value).toBe("In Verification"));
  });

  test("shows the ClipLoader while a department's reimbursements are loading", async () => {
    let resolvePromise;
    fetchReimbursementsByDepartment.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    expect(await screen.findByTestId("clip-loader")).toBeInTheDocument();

    resolvePromise({ results: [] });
    await waitFor(() =>
      expect(screen.queryByTestId("clip-loader")).not.toBeInTheDocument()
    );
  });

  test("paginates employees and hides pagination when under one page", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [makeEmployee(1)],
    });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    await screen.findByText("Employee 1");

    expect(screen.queryByText(/Page \d+ \/ \d+/)).not.toBeInTheDocument();
  });

  test("shows pagination controls and navigates between pages when over one page", async () => {
    const many = Array.from({ length: 15 }, (_, i) => makeEmployee(i + 1));
    fetchReimbursementsByDepartment.mockResolvedValue({ results: many });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    await screen.findByText("Employee 1");

    expect(screen.getByText("Page 1 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Employee 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Right"));

    expect(await screen.findByText("Employee 11")).toBeInTheDocument();
    expect(screen.getByText("Page 2 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Employee 1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Left"));

    expect(await screen.findByText("Employee 1")).toBeInTheDocument();
    expect(screen.getByText("Page 1 / 2")).toBeInTheDocument();
  });

  test("previous-page button is disabled on the first page", async () => {
    const many = Array.from({ length: 15 }, (_, i) => makeEmployee(i + 1));
    fetchReimbursementsByDepartment.mockResolvedValue({ results: many });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    await screen.findByText("Employee 1");

    expect(screen.getByText("Left").closest("button")).toBeDisabled();
    expect(screen.getByText("Right").closest("button")).not.toBeDisabled();
  });

  test("next-page button is disabled on the last page", async () => {
    const many = Array.from({ length: 15 }, (_, i) => makeEmployee(i + 1));
    fetchReimbursementsByDepartment.mockResolvedValue({ results: many });

    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("Engineering"));
    await screen.findByText("Employee 1");
    fireEvent.click(screen.getByText("Right"));
    await screen.findByText("Employee 11");

    expect(screen.getByText("Right").closest("button")).toBeDisabled();
    expect(screen.getByText("Left").closest("button")).not.toBeDisabled();
  });

  test("opens the Side_detail modal when the History button is clicked, and closes it", () => {
    render(<ReimbursementList />);

    fireEvent.click(screen.getByText("History"));
    expect(screen.getByTestId("side-detail")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("side-detail")).not.toBeInTheDocument();
  });
});
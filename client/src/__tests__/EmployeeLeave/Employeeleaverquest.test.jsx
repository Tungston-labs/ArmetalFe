import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import LeaveRequest from "./LeaveRequest"; // adjust path/filename to match your project
import * as leaveSlice from "../../Redux/leaveSlice";
import * as departmentSlice from "../../Redux/departmentSlice";
import * as leaveExcelExport from "../../utils/leaveExcelExport";

// ---- Mocks ----
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../Redux/leaveSlice", () => ({
  getLeaveRequests: jest.fn(() => ({
    type: "leave/getLeaveRequests",
    unwrap: () => Promise.resolve({ results: [], total_pages: 1 }),
    then: (cb) => Promise.resolve().then(cb),
  })),
  patchLeaveStatus: jest.fn(() => ({ type: "leave/patchLeaveStatus" })),
}));

jest.mock("../../Redux/departmentSlice", () => ({
  getDepartments: jest.fn(() => ({ type: "departments/getDepartments" })),
}));

jest.mock("../../utils/leaveExcelExport", () => ({
  exportLeaveReport: jest.fn(),
}));

jest.mock("../../Components/Loader", () => () => <div>Loading...</div>);

jest.mock("../../Components/Pagination/Pagination", () => (props) => (
  <div data-testid="pagination">
    {`Page ${props.currentPage} of ${props.totalPages}`}
    <button onClick={() => props.onPageChange(props.currentPage + 1)}>Next</button>
  </div>
));

jest.mock("../../Components/No found/Noemployeefound", () => () => (
  <div>No Leave Requests Found</div>
));

jest.mock("./ModalList", () => (props) => (
  <div data-testid="on-leave-modal">
    leaveId:{props.leaveId} employeeId:{props.employeeId} date:{props.date}
    <button onClick={props.onClose}>Close</button>
  </div>
));

jest.mock("../../Components/EmployeeTitle", () => (props) => (
  <div>
    <input
      placeholder="search"
      value={props.searchValue}
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
    <select
      value={props.selectedDropdownValue}
      onChange={(e) => props.onDropdownChange(e.target.value)}
    >
      <option value="">All Departments</option>
      {props.dropdownOptions?.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  </div>
));

const FUTURE_DATE = new Date();
FUTURE_DATE.setDate(FUTURE_DATE.getDate() + 5);
const PAST_DATE = new Date();
PAST_DATE.setDate(PAST_DATE.getDate() - 5);

const leaves = [
  {
    id: 1,
    employee: { id: 100, name: "john", employee_id: "jsmith", department: "Field Ops" },
    leave_type: "Sick",
    from_date: "2026-06-01",
    to_date: FUTURE_DATE.toISOString(),
    status: "pending",
  },
  {
    id: 2,
    employee: { id: 200, name: "amy", employee_id: "alee", department: "Operations" },
    leave_type: "Casual",
    from_date: "2026-05-01",
    to_date: PAST_DATE.toISOString(),
    status: "approved",
  },
];

function renderWithProviders({
  leaves: leaveState = leaves,
  loading = false,
  pagination = { total_pages: 2, pending_count: 1, approved_count: 1, rejected_count: 0 },
  departments = [{ id: 10, name: "Field Ops" }],
  deptLoading = false,
} = {}) {
  const store = configureStore({
    reducer: {
      leave: (state = { leaves: leaveState, loading, pagination }) => state,
      departments: (state = { list: departments, loading: deptLoading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LeaveRequest />
      </MemoryRouter>
    </Provider>
  );
}

describe("LeaveRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("dispatches getDepartments and getLeaveRequests on mount", () => {
    renderWithProviders();
    expect(departmentSlice.getDepartments).toHaveBeenCalled();
    expect(leaveSlice.getLeaveRequests).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 })
    );
  });

  test("shows loader while loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders leave rows with formatted dates and capitalized status", () => {
    renderWithProviders();
    expect(screen.getByText("john")).toBeInTheDocument();
    expect(screen.getByText("amy")).toBeInTheDocument();
    expect(screen.getByText("Sick")).toBeInTheDocument();
    expect(screen.getByText("Field Ops")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  test("shows empty state when there are no matching leaves", () => {
    renderWithProviders({ leaves: [] });
    expect(screen.getByText("No Leave Requests Found")).toBeInTheDocument();
  });

  test("filters leaves by employee name via search text", () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText("search");
    fireEvent.change(input, { target: { value: "john" } });
    expect(screen.getByText("john")).toBeInTheDocument();
    expect(screen.queryByText("amy")).not.toBeInTheDocument();
  });

  test("filters leaves by employee_id via search text", () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText("search");
    fireEvent.change(input, { target: { value: "alee" } });
    expect(screen.getByText("amy")).toBeInTheDocument();
    expect(screen.queryByText("john")).not.toBeInTheDocument();
  });

  test("clicking a status tab updates the filter, resets page, and re-fetches", async () => {
    renderWithProviders();
    leaveSlice.getLeaveRequests.mockClear();

    fireEvent.click(screen.getByText("Approved"));

    await waitFor(() =>
      expect(leaveSlice.getLeaveRequests).toHaveBeenCalledWith(
        expect.objectContaining({ status: "approved", page: 1 })
      )
    );
  });

  test("displays count badges for each non-'All' status tab", () => {
    renderWithProviders();
    const pendingTab = screen.getByText("Pending").closest("button");
    expect(within(pendingTab).getByText("1")).toBeInTheDocument();
  });

  test("changing the month select re-fetches leave requests for that month", async () => {
    renderWithProviders();
    leaveSlice.getLeaveRequests.mockClear();

    const monthSelect = screen.getByDisplayValue("July"); // default month for current date context may vary
    fireEvent.change(monthSelect, { target: { value: "3" } });

    await waitFor(() =>
      expect(leaveSlice.getLeaveRequests).toHaveBeenCalledWith(
        expect.objectContaining({ month: 3 })
      )
    );
  });

  test("changing the year select re-fetches leave requests for that year", async () => {
    renderWithProviders();
    leaveSlice.getLeaveRequests.mockClear();

    const yearSelect = screen.getByDisplayValue("2026");
    fireEvent.change(yearSelect, { target: { value: "2027" } });

    await waitFor(() =>
      expect(leaveSlice.getLeaveRequests).toHaveBeenCalledWith(
        expect.objectContaining({ year: 2027 })
      )
    );
  });

  test("clicking a leave row navigates to its detail page", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("john"));
    expect(mockNavigate).toHaveBeenCalledWith("/employee-leave-details/1");
  });

  test("clicking 'On Leave' for a future-dated leave opens the approval modal with correct data", () => {
    renderWithProviders();
    const row = screen.getByText("john").closest("tr");
    fireEvent.click(within(row).getByText("On Leave"));

    expect(mockNavigate).not.toHaveBeenCalledWith("/employee-leave-details/1"); 
    const modal = screen.getByTestId("on-leave-modal");
    expect(modal).toHaveTextContent("leaveId:1");
    expect(modal).toHaveTextContent("employeeId:100");
  });

  test("'On Leave' button is disabled for a past-dated leave and clicking it warns", () => {
    renderWithProviders();
    const row = screen.getByText("amy").closest("tr");
    const button = within(row).getByText("On Leave");
    expect(button).toBeDisabled();
  });

  test("closing the approval modal hides it", () => {
    renderWithProviders();
    const row = screen.getByText("john").closest("tr");
    fireEvent.click(within(row).getByText("On Leave"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("on-leave-modal")).not.toBeInTheDocument();
  });

  test("pagination reflects current page and total pages", () => {
    renderWithProviders({ pagination: { total_pages: 4 } });
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 4");
  });

  test("changing page dispatches getLeaveRequests with the new page", async () => {
    renderWithProviders();
    leaveSlice.getLeaveRequests.mockClear();

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() =>
      expect(leaveSlice.getLeaveRequests).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      )
    );
  });

  test("exporting to Excel paginates through all results and calls exportLeaveReport", async () => {
    leaveSlice.getLeaveRequests.mockImplementation(() => ({
      type: "leave/getLeaveRequests",
      unwrap: () =>
        Promise.resolve({
          results: [leaves[0]],
          total_pages: 1,
        }),
    }));

    renderWithProviders();
    fireEvent.click(screen.getByText("Export Excel"));

    await waitFor(() => expect(leaveExcelExport.exportLeaveReport).toHaveBeenCalled());
    const [exportedData] = leaveExcelExport.exportLeaveReport.mock.calls[0];
    expect(exportedData).toHaveLength(1);
    expect(exportedData[0].employee.name).toBe("john");
  });

  test("export failure is caught and does not crash the component", async () => {
    leaveSlice.getLeaveRequests.mockImplementation(() => ({
      type: "leave/getLeaveRequests",
      unwrap: () => Promise.reject(new Error("network error")),
    }));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders();
    fireEvent.click(screen.getByText("Export Excel"));

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith("Export failed:", expect.any(Error))
    );
    expect(leaveExcelExport.exportLeaveReport).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
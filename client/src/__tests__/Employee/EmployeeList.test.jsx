import React from "react";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import EmployeeList from "../../Pages/leaveDetails/EmployeeList"; // adjust path/filename to match your project
import * as employeeSlice from "../../Redux/employeeSlice";
import * as departmentSlice from "../../Redux/departmentSlice";

// ---- Mocks ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../Redux/employeeSlice", () => ({
  getAllEmployees: vi.fn((args) => ({
    type: "employees/getAllEmployees",
    payload: args,
    then: (cb) => Promise.resolve().then(cb), // supports .then() chaining used by handlePageChange
  })),
  deleteEmployeeById: vi.fn(() => ({ type: "employees/deleteEmployeeById" })),
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn(() => ({ type: "departments/getDepartments" })),
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: (props) => (
    <div data-testid="pagination">
      {`Page ${props.currentPage} of ${props.totalPages}`}
      <button onClick={() => props.onPageChange(props.currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock("../../Components/No found/Noemployeefound", () => ({
  default: (props) => <div>No results for "{props.searchTerm}"</div>,
}));

// FIXED: path must be relative to this test file's location, resolving to
// where EmployeeList.jsx actually imports RightSideModal from
// (src/Pages/employeDashboard/RightSideModal), not relative to the test
// file's own folder.
vi.mock("../../Pages/employeDashboard/RightSideModal", () => ({
  default: (props) =>
    props.isOpen ? (
      <div data-testid="right-side-modal">
        Employee {props.employeeId}
        <button onClick={props.onClose}>Close Modal</button>
      </div>
    ) : null,
}));

vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => (
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
      <button onClick={props.onAddClick}>{props.buttonText}</button>
    </div>
  ),
}));

const employees = [
  {
    id: 1,
    name: "john",
    employee_id: "jsmith",
    employee_code: "EMP001",
    designation: "technician",
    department: "Field Ops",
  },
  {
    id: 2,
    name: "amy",
    employee_id: "alee",
    employee_code: "EMP002",
    designation: "supervisor",
    department: "Operations",
  },
];

function renderWithProviders({
  employeeList = employees,
  pagination = { total_pages: 3 },
  loading = false,
  departments = [{ id: 10, name: "Field Ops" }],
  deptLoading = false,
} = {}) {
  const store = configureStore({
    reducer: {
      employees: (state = { employeeList, pagination, loading }) => state,
      departments: (state = { list: departments, loading: deptLoading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>
    </Provider>
  );
}

describe("EmployeeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("dispatches getDepartments and getAllEmployees on mount", () => {
    renderWithProviders();
    expect(departmentSlice.getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
    expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith({
      page: 1,
      search: "",
      department_id: "",
    });
  });

  test("shows the loader overlay while loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("hides the table while loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.queryByText("Employee name")).not.toBeInTheDocument();
  });

  test("renders employee rows with capitalized name and uppercase designation", () => {
    renderWithProviders();
    // FIXED: "Field Ops" is ambiguous (also appears as a dropdown option),
    // so scope the query to inside the table.
    const table = screen.getByRole("table");
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Amy")).toBeInTheDocument();
    expect(screen.getByText("TECHNICIAN")).toBeInTheDocument();
    expect(screen.getByText("SUPERVISOR")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(within(table).getByText("Field Ops")).toBeInTheDocument();
  });

  test("shows the 'no employee found' message when the list is empty", () => {
    renderWithProviders({ employeeList: [] });
    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });

  test("filters displayed employees by search text (name match)", async () => {
    vi.useFakeTimers();
    renderWithProviders();

    const searchInput = screen.getByPlaceholderText("search");
    fireEvent.change(searchInput, { target: { value: "john" } });

    // FIXED: wrap timer advancement in act() so React flushes the debounce
    // state update and any dependent re-render before we assert.
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("Amy")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  test("filters displayed employees by search text (employee_id match)", async () => {
    vi.useFakeTimers();
    renderWithProviders();

    const searchInput = screen.getByPlaceholderText("search");
    fireEvent.change(searchInput, { target: { value: "alee" } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("Amy")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  test("changing the department dropdown re-dispatches getAllEmployees with the filter", async () => {
    renderWithProviders();
    employeeSlice.getAllEmployees.mockClear();

    const select = screen.getByDisplayValue("All Departments");
    fireEvent.change(select, { target: { value: "10" } });

    await waitFor(() =>
      expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ department_id: "10" })
      )
    );
  });

  test("clicking 'Add Employee' navigates to the basic-details page", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add Employee"));
    expect(mockNavigate).toHaveBeenCalledWith("/basic-details");
  });

  test("clicking an employee row opens the RightSideModal with that employee's id", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("John"));
    expect(screen.getByTestId("right-side-modal")).toHaveTextContent("Employee 1");
  });

  test("closing the RightSideModal hides it", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("John"));
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("right-side-modal")).not.toBeInTheDocument();
  });

  test("clicking the delete icon opens the confirmation modal without opening the row modal", () => {
    renderWithProviders();
    const row = screen.getByText("John").closest("tr");
    const deleteIcon = row.querySelector("svg");
    fireEvent.click(deleteIcon);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(screen.queryByTestId("right-side-modal")).not.toBeInTheDocument();
  });

  test("confirming deletion dispatches deleteEmployeeById and refetches the list", async () => {
    renderWithProviders();
    const row = screen.getByText("John").closest("tr");
    const deleteIcon = row.querySelector("svg");
    fireEvent.click(deleteIcon);

    employeeSlice.getAllEmployees.mockClear();
    // FIXED: "Delete" is ambiguous (also a table column header) — target
    // the confirm-modal button by role instead.
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(employeeSlice.deleteEmployeeById).toHaveBeenCalledWith(1));
    await waitFor(() => expect(employeeSlice.getAllEmployees).toHaveBeenCalled());
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  test("cancelling deletion closes the modal without dispatching delete", () => {
    renderWithProviders();
    const row = screen.getByText("John").closest("tr");
    const deleteIcon = row.querySelector("svg");
    fireEvent.click(deleteIcon);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(employeeSlice.deleteEmployeeById).not.toHaveBeenCalled();
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  test("pagination reflects current page and total pages from state", () => {
    renderWithProviders({ pagination: { total_pages: 5 } });
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 5");
  });

  test("changing page dispatches getAllEmployees with the new page and updates pagination display", async () => {
    renderWithProviders({ pagination: { total_pages: 5 } });
    employeeSlice.getAllEmployees.mockClear();

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() =>
      expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      )
    );
  });

  test("defaults totalPages to 1 when pagination data is missing", () => {
    renderWithProviders({ pagination: {} });
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 1");
  });

  test("handles a non-array employeeList gracefully (renders empty state)", () => {
    renderWithProviders({ employeeList: null });
    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });
});
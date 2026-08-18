import React from "react";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),

  getDepartments: vi.fn(),
  getOnLeaveEmployees: vi.fn(),

  selectorState: {
    departments: {
      list: [],
      loading: false,
    },

    leave: {
      onLeaveEmployees: [],
    },
  },
}));

/* =========================================================
   REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) => selector(mocks.selectorState),
}));

/* =========================================================
   DEPARTMENT SLICE
========================================================= */

vi.mock("../../Redux/departmentSlice.js", () => ({
  getDepartments: mocks.getDepartments,
}));

/* =========================================================
   LEAVE SLICE
========================================================= */

vi.mock("../../Redux/leaveSlice.js", () => ({
  getOnLeaveEmployees: mocks.getOnLeaveEmployees,
}));

/* =========================================================
   EMPLOYEE TITLE
========================================================= */

vi.mock("../../Components/EmployeeTitle.jsx", () => ({
  default: ({
    onSearchChange,
    iconSrc,
    showAddButton,
    showDropdown,
    showBackArrow,
  }) => (
    <div data-testid="employee-title">
      <img src={iconSrc} alt="Employee Icon" />

      <input
        type="text"
        aria-label="Search"
        onChange={(event) => onSearchChange?.(event.target.value)}
      />

      <span data-testid="show-add-button">{String(showAddButton)}</span>

      <span data-testid="show-dropdown">{String(showDropdown)}</span>

      <span data-testid="show-back-arrow">{String(showBackArrow)}</span>
    </div>
  ),
}));

/* =========================================================
   LOADER
========================================================= */

vi.mock("../../Components/Loader.jsx", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

/* =========================================================
   STYLED COMPONENTS
   IMPORTANT:
   The component imports:
   ../attendance/AttendanceList.Styles

   Therefore the test MUST mock:
   ../../Pages/attendance/AttendanceList.Styles

   NOT Attendance.Style.js
========================================================= */

vi.mock("../../Pages/attendance/AttendanceList.Styles", () => ({
  PageContainer: ({ children }) => (
    <div data-testid="page-container">{children}</div>
  ),

  DepartmentGrid: ({ children }) => (
    <div data-testid="department-grid">{children}</div>
  ),

  DepartmentCard: ({ children }) => (
    <div data-testid="department-card">{children}</div>
  ),

  DepartmentHeader: ({ children, onClick }) => (
    <div
      data-testid="department-header"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),

  DepartmentName: ({ children }) => (
    <span data-testid="department-name">{children}</span>
  ),

  EmployeeCount: ({ children }) => (
    <span data-testid="employee-count">{children}</span>
  ),

  DropdownWrapper: ({ children }) => (
    <div data-testid="dropdown-wrapper">{children}</div>
  ),

  EmployeeList: ({ children }) => (
    <div data-testid="employee-list">{children}</div>
  ),

  EmployeeItem: ({ children }) => (
    <div data-testid="employee-item">{children}</div>
  ),

  DropdownHeader: ({ children }) => (
    <div data-testid="dropdown-header">{children}</div>
  ),

  EmployeeCell: ({ children }) => (
    <div data-testid="employee-cell">{children}</div>
  ),

  EmployeeRow: ({ children, ...props }) => (
    <div data-testid="employee-row" {...props}>
      {children}
    </div>
  ),
}));

/* =========================================================
   EMPLOYEE ICON
   IMPORTANT:
   The component imports:
   ../../assets/employeeicon.svg

   Therefore mock the exact path.
========================================================= */

vi.mock("../../assets/employeeicon.svg", () => ({
  default: "mock-employee-icon.svg",
}));

/* =========================================================
   COMPONENT
========================================================= */

import LeaveList from "../../Pages/onLeave/LeaveList";

/* =========================================================
   TEST DATA
========================================================= */

const departments = [
  {
    id: 1,
    name: "Human Resources",
    todays_leave_employee_count: 3,
  },
  {
    id: 2,
    name: "Development",
    todays_leave_employee_count: 5,
  },
  {
    id: 3,
    name: "Finance",
    todays_leave_employee_count: 0,
  },
];

const leaveEmployees = [
  {
    id: 101,
    name: "John Doe",
    employee_id: "EMP001",
    designation: "Developer",
    email: "john@example.com",
  },
  {
    id: 102,
    name: "Jane Smith",
    employee_id: "EMP002",
    designation: "Manager",
    email: "jane@example.com",
  },
];

/* =========================================================
   HELPER
========================================================= */

const renderComponent = () => {
  return render(<LeaveList />);
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  mocks.selectorState.departments = {
    list: departments,
    loading: false,
  };

  mocks.selectorState.leave = {
    onLeaveEmployees: [],
  };

  mocks.getDepartments.mockReturnValue({
    type: "departments/getDepartments",
  });

  mocks.getOnLeaveEmployees.mockReturnValue({
    type: "leave/getOnLeaveEmployees",
  });

  mocks.dispatch.mockReturnValue({});
});

/* =========================================================
   CLEANUP
========================================================= */

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("LeaveList Component", () => {
  /* =======================================================
     1. RENDER COMPONENT
  ======================================================= */

  it("renders the LeaveList component", () => {
    renderComponent();

    expect(screen.getByTestId("page-container")).toBeInTheDocument();

    expect(screen.getByTestId("employee-title")).toBeInTheDocument();

    expect(screen.getByTestId("department-grid")).toBeInTheDocument();
  });

  /* =======================================================
     2. EMPLOYEE TITLE PROPS
  ======================================================= */

  it("renders EmployeeTitle with correct props", () => {
    renderComponent();

    expect(screen.getByTestId("show-add-button")).toHaveTextContent("false");

    expect(screen.getByTestId("show-dropdown")).toHaveTextContent("false");

    expect(screen.getByTestId("show-back-arrow")).toHaveTextContent("false");
  });

  /* =======================================================
     3. FETCH DEPARTMENTS ON MOUNT
  ======================================================= */

  it("fetches departments on mount", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mocks.getDepartments).toHaveBeenCalledWith({
        page: 1,
        search: "",
      });
    });

    expect(mocks.dispatch).toHaveBeenCalled();
  });

  /* =======================================================
     4. RENDER DEPARTMENTS
  ======================================================= */

  it("renders all departments", () => {
    renderComponent();

    expect(screen.getByText("Human Resources")).toBeInTheDocument();

    expect(screen.getByText("Development")).toBeInTheDocument();

    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.getAllByTestId("department-header")).toHaveLength(3);
  });

  /* =======================================================
     5. DEPARTMENT COUNT
  ======================================================= */

  it("renders employee count for each department", () => {
    renderComponent();

    expect(screen.getByText("3 Employees")).toBeInTheDocument();

    expect(screen.getByText("5 Employees")).toBeInTheDocument();

    expect(screen.getByText("0 Employees")).toBeInTheDocument();
  });

  /* =======================================================
     6. LOADING STATE
  ======================================================= */

  it("renders loader when departments are loading", () => {
    mocks.selectorState.departments.loading = true;

    renderComponent();

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    expect(screen.queryByText("Human Resources")).not.toBeInTheDocument();

    expect(screen.queryByTestId("department-header")).not.toBeInTheDocument();
  });

  /* =======================================================
     7. NO DEPARTMENTS
  ======================================================= */

  it("renders no departments message when list is empty", () => {
    mocks.selectorState.departments.list = [];

    renderComponent();

    expect(screen.getByText("No departments found.")).toBeInTheDocument();
  });

  /* =======================================================
     8. NULL DEPARTMENT LIST
  ======================================================= */

  it("renders no departments message when department list is null", () => {
    mocks.selectorState.departments.list = null;

    renderComponent();

    expect(screen.getByText("No departments found.")).toBeInTheDocument();
  });

  /* =======================================================
     9. SEARCH DEPARTMENTS
  ======================================================= */

  it("filters departments using search input", () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "human",
      },
    });

    expect(screen.getByText("Human Resources")).toBeInTheDocument();

    expect(screen.queryByText("Development")).not.toBeInTheDocument();

    expect(screen.queryByText("Finance")).not.toBeInTheDocument();

    expect(screen.getAllByTestId("department-header")).toHaveLength(1);
  });

  /* =======================================================
     10. SEARCH CASE INSENSITIVE
  ======================================================= */

  it("filters departments case insensitively", () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "DEVELOPMENT",
      },
    });

    expect(screen.getByText("Development")).toBeInTheDocument();

    expect(screen.queryByText("Human Resources")).not.toBeInTheDocument();

    expect(screen.queryByText("Finance")).not.toBeInTheDocument();
  });

  /* =======================================================
     11. SEARCH NO RESULTS
  ======================================================= */

  it("shows no departments message when search has no results", () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Unknown Department",
      },
    });

    expect(screen.getByText("No departments found.")).toBeInTheDocument();

    expect(screen.queryByTestId("department-header")).not.toBeInTheDocument();
  });

  /* =======================================================
     12. OPEN DEPARTMENT
  ======================================================= */

  it("opens department when department header is clicked", async () => {
    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    expect(headers).toHaveLength(3);

    fireEvent.click(headers[0]);

    await waitFor(() => {
      expect(mocks.getOnLeaveEmployees).toHaveBeenCalledWith(1);
    });

    expect(mocks.dispatch).toHaveBeenCalled();

    expect(screen.getByTestId("dropdown-wrapper")).toBeInTheDocument();
  });

  /* =======================================================
     13. DROPDOWN HEADERS
  ======================================================= */

  it("renders employee table headers when department is open", () => {
    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Employee ID")).toBeInTheDocument();

    expect(screen.getByText("Designation")).toBeInTheDocument();

    expect(screen.getByText("Email")).toBeInTheDocument();

    expect(screen.getByTestId("dropdown-header")).toBeInTheDocument();
  });

  /* =======================================================
     14. RENDER LEAVE EMPLOYEES
  ======================================================= */

  it("renders employees who are on leave", () => {
    mocks.selectorState.leave.onLeaveEmployees = leaveEmployees;

    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("EMP001")).toBeInTheDocument();

    expect(screen.getByText("Developer")).toBeInTheDocument();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    expect(screen.getByText("EMP002")).toBeInTheDocument();

    expect(screen.getByText("Manager")).toBeInTheDocument();

    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  /* =======================================================
     15. EMPTY LEAVE EMPLOYEES
  ======================================================= */

  it("shows no employees message when no employees are on leave", () => {
    mocks.selectorState.leave.onLeaveEmployees = [];

    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    expect(screen.getByText("No employees on leave")).toBeInTheDocument();

    expect(screen.getByTestId("employee-item")).toBeInTheDocument();
  });

  /* =======================================================
     16. MISSING EMPLOYEE DATA
  ======================================================= */

  it("renders dash for missing employee fields", () => {
    mocks.selectorState.leave.onLeaveEmployees = [
      {
        id: 999,
        name: "",
        employee_id: "",
        designation: "",
        email: "",
      },
    ];

    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    const cells = screen.getAllByTestId("employee-cell");

    expect(cells).toHaveLength(4);

    cells.forEach((cell) => {
      expect(cell).toHaveTextContent("-");
    });
  });

  /* =======================================================
     17. DEPARTMENT NAME FALLBACK
  ======================================================= */

  it("renders Department when department name is missing", () => {
    mocks.selectorState.departments.list = [
      {
        id: 10,
        name: "",
        todays_leave_employee_count: 2,
      },
    ];

    renderComponent();

    expect(screen.getByText("Department")).toBeInTheDocument();

    expect(screen.getByText("2 Employees")).toBeInTheDocument();
  });

  /* =======================================================
     18. EMPLOYEE COUNT FALLBACK
  ======================================================= */

  it("renders zero employees when leave count is missing", () => {
    mocks.selectorState.departments.list = [
      {
        id: 20,
        name: "Testing",
      },
    ];

    renderComponent();

    expect(screen.getByText("Testing")).toBeInTheDocument();

    expect(screen.getByText("0 Employees")).toBeInTheDocument();
  });

  /* =======================================================
     19. TOGGLE SAME DEPARTMENT
  ======================================================= */

  it("closes department when the same department header is clicked again", async () => {
    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-wrapper")).toBeInTheDocument();
    });

    fireEvent.click(headers[0]);

    expect(screen.queryByTestId("dropdown-wrapper")).not.toBeInTheDocument();
  });

  /* =======================================================
     20. SWITCH DEPARTMENT
  ======================================================= */

  it("switches from one department to another", async () => {
    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-wrapper")).toBeInTheDocument();
    });

    expect(mocks.getOnLeaveEmployees).toHaveBeenCalledWith(1);

    fireEvent.click(headers[1]);

    await waitFor(() => {
      expect(mocks.getOnLeaveEmployees).toHaveBeenCalledWith(2);
    });

    expect(screen.getByTestId("dropdown-wrapper")).toBeInTheDocument();

    expect(mocks.getOnLeaveEmployees).toHaveBeenCalledTimes(2);
  });

  /* =======================================================
     21. NO FETCH WHEN CLOSING
  ======================================================= */

  it("does not fetch employees when closing an already open department", async () => {
    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    await waitFor(() => {
      expect(mocks.getOnLeaveEmployees).toHaveBeenCalledWith(1);
    });

    mocks.getOnLeaveEmployees.mockClear();

    fireEvent.click(headers[0]);

    expect(mocks.getOnLeaveEmployees).not.toHaveBeenCalled();

    expect(screen.queryByTestId("dropdown-wrapper")).not.toBeInTheDocument();
  });

  /* =======================================================
     22. EMPLOYEE ROWS
  ======================================================= */

  it("renders an employee row for each employee", () => {
    mocks.selectorState.leave.onLeaveEmployees = leaveEmployees;

    renderComponent();

    const headers = screen.getAllByTestId("department-header");

    fireEvent.click(headers[0]);

    const rows = screen.getAllByTestId("employee-row");

    expect(rows).toHaveLength(2);
  });

  /* =======================================================
     23. SEARCH CLEAR
  ======================================================= */

  it("shows all departments when search is cleared", () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Human",
      },
    });

    expect(screen.getByText("Human Resources")).toBeInTheDocument();

    expect(screen.queryByText("Development")).not.toBeInTheDocument();

    expect(screen.queryByText("Finance")).not.toBeInTheDocument();

    fireEvent.change(searchInput, {
      target: {
        value: "",
      },
    });

    expect(screen.getByText("Human Resources")).toBeInTheDocument();

    expect(screen.getByText("Development")).toBeInTheDocument();

    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.getAllByTestId("department-header")).toHaveLength(3);
  });
});

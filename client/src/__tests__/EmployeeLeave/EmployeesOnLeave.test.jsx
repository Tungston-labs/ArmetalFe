import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmployeesOnLeave from "../../Pages/onLeave/EmployeesOnLeave";

/* =========================================================
   MOCK REDUX
========================================================= */

const mockDispatch = vi.fn();

let mockReduxState;

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockReduxState),
}));

/* =========================================================
   MOCK ROUTER
========================================================= */

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  NavLink: ({ children }) => <a>{children}</a>,
  useLocation: () => ({
    pathname: "/employee-leave",
  }),
  useNavigate: () => mockNavigate,
}));

/* =========================================================
   MOCK REDUX SLICE
========================================================= */

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn((payload) => ({
    type: "departments/getDepartments",
    payload,
  })),
}));

/* =========================================================
   MOCK COMPONENTS
========================================================= */

vi.mock("../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../Components/EmployeeTitle", () => ({
  default: ({ onSearchChange }) => (
    <div data-testid="employee-title">
      <input
        aria-label="Search departments"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  ),
}));

/* =========================================================
   MOCK ASSET
========================================================= */

vi.mock("../../assets/employeeicon.svg", () => ({
  default: "employee-icon.svg",
}));

/* =========================================================
   TESTS
========================================================= */

describe("EmployeesOnLeave", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockReduxState = {
      departments: {
        list: [],
        loading: false,
        error: null,
        pagination: {},
      },
    };
  });

  /* =========================================================
     BASIC RENDER
  ========================================================= */

  it("renders the employee title", () => {
    render(<EmployeesOnLeave />);

    expect(screen.getByTestId("employee-title")).toBeInTheDocument();
  });

  /* =========================================================
     REDUX DISPATCH
  ========================================================= */

  it("dispatches getDepartments when component loads", async () => {
    render(<EmployeesOnLeave />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "departments/getDepartments",
        payload: {
          page: 1,
          search: "",
        },
      }),
    );
  });

  /* =========================================================
     LOADER
  ========================================================= */

  it("shows loader when loading is true", () => {
    mockReduxState = {
      departments: {
        list: [],
        loading: true,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("does not show loader when loading is false", () => {
    render(<EmployeesOnLeave />);

    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  /* =========================================================
     EMPTY LIST
  ========================================================= */

  it("renders without departments when list is empty", () => {
    render(<EmployeesOnLeave />);

    expect(screen.queryByText("Department head")).not.toBeInTheDocument();
  });

  /* =========================================================
     DEPARTMENT WITH COMPLETE DATA
  ========================================================= */

  it("renders department information correctly", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 1,
            name: "Engineering",
            head: {
              name: "John Doe",
              profile_pic: "https://example.com/john.jpg",
            },
            todays_leave_employee_count: 5,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();

    expect(screen.getByText("Department head")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByAltText("head")).toBeInTheDocument();
  });

  /* =========================================================
     DEPARTMENT INITIAL
  ========================================================= */

  it("renders first letter of department name", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 1,
            name: "Finance",
            head: {
              name: "Jane",
            },
            todays_leave_employee_count: 2,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("F")).toBeInTheDocument();
  });

  /* =========================================================
     FALLBACK DEPARTMENT DATA
  ========================================================= */

  it("renders fallback values when department data is missing", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 2,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("D")).toBeInTheDocument();

    expect(screen.getByText("Department")).toBeInTheDocument();

    expect(screen.getByText("N/A")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  /* =========================================================
     DEPARTMENT HEAD WITHOUT PROFILE IMAGE
  ========================================================= */

  it("renders default user icon when profile picture is missing", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 3,
            name: "HR",
            head: {
              name: "Sarah",
            },
            todays_leave_employee_count: 3,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("Sarah")).toBeInTheDocument();

    expect(screen.queryByAltText("head")).not.toBeInTheDocument();
  });

  /* =========================================================
     HEAD NAME FALLBACK
  ========================================================= */

  it("renders N/A when department head name is missing", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 4,
            name: "Operations",
            head: {},
            todays_leave_employee_count: 4,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  /* =========================================================
     HEAD OBJECT MISSING
  ========================================================= */

  it("handles missing department head object", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 5,
            name: "Support",
            todays_leave_employee_count: 1,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("Support")).toBeInTheDocument();

    expect(screen.getByText("N/A")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  /* =========================================================
     LEAVE COUNT FALLBACK
  ========================================================= */

  it("renders 0 when todays leave employee count is missing", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 6,
            name: "Marketing",
            head: {
              name: "Mark",
            },
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  /* =========================================================
     NAVIGATION
  ========================================================= */

  it("navigates to employee leave page when department card is clicked", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 10,
            name: "Development",
            head: {
              name: "Alex",
            },
            todays_leave_employee_count: 7,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    fireEvent.click(screen.getByText("Development"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/employee-leave?departmentId=10",
    );
  });

  /* =========================================================
     MULTIPLE DEPARTMENTS
  ========================================================= */

  it("renders multiple departments", () => {
    mockReduxState = {
      departments: {
        list: [
          {
            id: 1,
            name: "Engineering",
            head: {
              name: "John",
            },
            todays_leave_employee_count: 2,
          },
          {
            id: 2,
            name: "Finance",
            head: {
              name: "Jane",
            },
            todays_leave_employee_count: 4,
          },
          {
            id: 3,
            name: "HR",
            head: {
              name: "David",
            },
            todays_leave_employee_count: 1,
          },
        ],
        loading: false,
        error: null,
        pagination: {},
      },
    };

    render(<EmployeesOnLeave />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();

    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.getByText("HR")).toBeInTheDocument();
  });

  /* =========================================================
     SEARCH
  ========================================================= */

  it("updates search text and resets page when search changes", async () => {
    render(<EmployeesOnLeave />);

    const searchInput = screen.getByLabelText("Search departments");

    fireEvent.change(searchInput, {
      target: {
        value: "Engineering",
      },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "departments/getDepartments",
          payload: {
            page: 1,
            search: "Engineering",
          },
        }),
      );
    });
  });

  /* =========================================================
     EMPLOYEE TITLE PROPS
  ========================================================= */

  it("renders search input from EmployeeTitle", () => {
    render(<EmployeesOnLeave />);

    expect(screen.getByLabelText("Search departments")).toBeInTheDocument();
  });
});

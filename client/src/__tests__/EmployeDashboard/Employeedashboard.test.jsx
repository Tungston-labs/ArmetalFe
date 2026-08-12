import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  fetchEmployeeDash: vi.fn((id) => ({
    type: "auth/fetchEmployeeDash",
    payload: id,
  })),
  selectorState: {
    employeeDashData: null,
    loadingEmployeeDash: false,
    employeeDashError: null,
  },
}));

/* =========================================================
   REACT ROUTER MOCK
========================================================= */

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(() => ({
    employeeId: "101",
  })),
  useNavigate: vi.fn(() => mocks.navigate),
}));

/* =========================================================
   REDUX MOCK
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(() => mocks.dispatch),

  useSelector: vi.fn((selector) =>
    selector({
      auth: mocks.selectorState,
    }),
  ),
}));

/* =========================================================
   AUTH SLICE MOCK
========================================================= */

vi.mock("../../Redux/authSlice.js", () => ({
  fetchEmployeeDash: mocks.fetchEmployeeDash,
}));

/* =========================================================
   API MOCK
========================================================= */

vi.mock("../../services/api.js", () => ({
  BASE_URL: "https://example.com",
}));

/* =========================================================
   ASSET MOCKS
========================================================= */

vi.mock("../../assets/clock.svg", () => ({
  default: "clock.svg",
}));

vi.mock("../../assets/leave.svg", () => ({
  default: "leave.svg",
}));

vi.mock("../../assets/puchtime.svg", () => ({
  default: "puchtime.svg",
}));

/* =========================================================
   REACT ICONS MOCK
========================================================= */

vi.mock("react-icons/fa6", () => ({
  FaRegClock: () => <span data-testid="fa-clock">clock</span>,
  FaArrowUpRightFromSquare: () => <span data-testid="fa-arrow-up">arrow</span>,
}));

vi.mock("react-icons/bi", () => ({
  BiTimeFive: () => <span data-testid="bi-time">time</span>,
  BiSolidRightTopArrowCircle: () => (
    <span data-testid="department-arrow">arrow</span>
  ),
}));

/* =========================================================
   ANT DESIGN MOCK
========================================================= */

vi.mock("antd", () => ({
  Spin: () => <div data-testid="loading-spinner">Loading...</div>,
}));

/* =========================================================
   STYLED COMPONENTS MOCK
========================================================= */

vi.mock("../../Pages/employeDashboard/Employeedashboard.Styles.js", () => {
  const createComponent = (tag = "div") => {
    return ({ children, ...props }) =>
      React.createElement(tag, props, children);
  };

  return {
    Container: createComponent("div"),
    CardGrid: createComponent("div"),
    MainWrapper: createComponent("div"),
    InfoCard: createComponent("div"),
    ScrollableTableWrapper: createComponent("div"),
    CardTitle: createComponent("div"),
    CardSubtitle: createComponent("div"),
    CardLink: createComponent("div"),
    DepartmentBox: createComponent("div"),
    Department: createComponent("div"),
    DepartmentTitleRow: createComponent("div"),
    DepartmentTitle: createComponent("div"),
    DepartmentCount: createComponent("div"),
    SubLabel: createComponent("div"),
    DepartmentHead: createComponent("div"),
    MemberList: createComponent("div"),
    Member: createComponent("div"),
    Avatar: createComponent("img"),
    SvgIcon: createComponent("img"),
    MemberName: createComponent("div"),
    ArrowIcon: createComponent("button"),
    TimeLogContainer: createComponent("div"),
    DateHeading: createComponent("div"),
    Table: createComponent("table"),
    TableRow: createComponent("tr"),
    TableHeader: createComponent("th"),
    TableCell: createComponent("td"),
    Icon: createComponent("span"),
    ArrowButton: createComponent("button"),
  };
});

/* =========================================================
   COMPONENT
========================================================= */

import TimeLogDashboard from "../../Pages/employeDashboard/Employeedashboard";
/* =========================================================
   TEST DATA
========================================================= */

const employeeDashboardData = {
  contract_expiry_date: "15",
  visa_expiry_date: "2026-12-31",

  attendance_summary: {
    monthly_working_hours: "176",
  },

  bank_details: {
    employee: {
      department: "Engineering",
    },
  },

  department_head: {
    name: "John Manager",
  },

  department_employees: {
    employees: [
      {
        name: "Alice",
        profile_pic: "/media/alice.jpg",
      },
      {
        name: "Bob",
        profile_pic: null,
      },
    ],
  },
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  mocks.selectorState.employeeDashData = employeeDashboardData;
  mocks.selectorState.loadingEmployeeDash = false;
  mocks.selectorState.employeeDashError = null;
});

/* =========================================================
   TEST 1
   Renders dashboard with complete employee data
========================================================= */

describe("TimeLogDashboard", () => {
  it("renders employee dashboard data correctly", () => {
    render(<TimeLogDashboard />);

    expect(screen.getByText("Contract Expiry")).toBeInTheDocument();

    expect(screen.getByText("Visa Expiry")).toBeInTheDocument();

    expect(screen.getByText("Pay slip")).toBeInTheDocument();

    expect(screen.getByText("Monthly")).toBeInTheDocument();

    expect(screen.getByText("15")).toBeInTheDocument();

    expect(screen.getByText("2026-12-31")).toBeInTheDocument();

    expect(screen.getByText("176")).toBeInTheDocument();
  });

  /* =======================================================
     TEST 2
     Dispatches employee dashboard request
  ======================================================= */

  it("dispatches fetchEmployeeDash when employeeId exists", () => {
    render(<TimeLogDashboard />);

    expect(mocks.fetchEmployeeDash).toHaveBeenCalledWith("101");

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/fetchEmployeeDash",
      payload: "101",
    });
  });

  /* =======================================================
     TEST 3
     Does not dispatch when employeeId is missing
  ======================================================= */

  it("does not dispatch when employeeId is missing", async () => {
    const router = await import("react-router-dom");

    router.useParams.mockReturnValue({
      employeeId: undefined,
    });

    render(<TimeLogDashboard />);

    expect(mocks.fetchEmployeeDash).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  /* =======================================================
     TEST 4
     Error state
  ======================================================= */

  it("renders error message when employee dashboard request fails", async () => {
    mocks.selectorState.employeeDashError = "Failed to load employee dashboard";

    render(<TimeLogDashboard />);

    expect(
      screen.getByText("Error: Failed to load employee dashboard"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     TEST 5
     Department information
  ======================================================= */

  it("renders department and department head", () => {
    render(<TimeLogDashboard />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();

    expect(screen.getByText("Department head")).toBeInTheDocument();

    expect(screen.getByText("John Manager")).toBeInTheDocument();
  });

  /* =======================================================
     TEST 6
     Renders employees
  ======================================================= */

  it("renders department employees", () => {
    render(<TimeLogDashboard />);

    expect(screen.getByText("Alice")).toBeInTheDocument();

    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  /* =======================================================
     TEST 7
     Profile picture branch
  ======================================================= */

  it("uses BASE_URL when employee has profile picture", () => {
    render(<TimeLogDashboard />);

    const aliceImage = screen.getByAltText("Alice");

    expect(aliceImage).toHaveAttribute(
      "src",
      "https://example.com/media/alice.jpg",
    );
  });

  /* =======================================================
     TEST 8
     Default avatar branch
  ======================================================= */

  it("uses default avatar when profile picture is missing", () => {
    render(<TimeLogDashboard />);

    const bobImage = screen.getByAltText("Bob");

    expect(bobImage).toHaveAttribute("src", "/default-avatar.png");
  });

  /* =======================================================
     TEST 9
     Department navigation
  ======================================================= */

  it("navigates to department when arrow is clicked", () => {
    render(<TimeLogDashboard />);

    const arrow = screen.getByRole("button");

    fireEvent.click(arrow);

    expect(mocks.navigate).toHaveBeenCalledWith("/department");
  });

  /* =======================================================
     TEST 10
     Handles missing employee dashboard data
  ======================================================= */

  it("renders fallback values when employee dashboard data is missing", () => {
    mocks.selectorState.employeeDashData = {
      department_employees: {
        employees: [],
      },
    };

    render(<TimeLogDashboard />);

    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
    expect(screen.getByText("Contract Expiry")).toBeInTheDocument();

    expect(screen.getByText("Visa Expiry")).toBeInTheDocument();

    expect(screen.getByText("Pay slip")).toBeInTheDocument();
  });

  /* =======================================================
     TEST 11
     Empty members array
  ======================================================= */

  it("renders correctly when there are no department employees", () => {
    mocks.selectorState.employeeDashData = {
      ...employeeDashboardData,
      department_employees: {
        employees: [],
      },
    };

    render(<TimeLogDashboard />);

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();

    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  /* =======================================================
     TEST 12
     Missing members object
  ======================================================= */

  it("handles missing department employees safely", () => {
    mocks.selectorState.employeeDashData = {
      contract_expiry_date: "10",
      visa_expiry_date: "2027-01-01",
      attendance_summary: {
        monthly_working_hours: "100",
      },
      bank_details: {
        employee: {
          department: "HR",
        },
      },
      department_head: {
        name: "HR Manager",
      },
    };

    render(<TimeLogDashboard />);

    expect(screen.getByText("HR")).toBeInTheDocument();

    expect(screen.getByText("HR Manager")).toBeInTheDocument();
  });

  /* =======================================================
     TEST 13
     Handles null values
  ======================================================= */

  it("handles null employee dashboard values", () => {
    mocks.selectorState.employeeDashData = {
      contract_expiry_date: null,
      visa_expiry_date: null,
      attendance_summary: {
        monthly_working_hours: null,
      },
      bank_details: {
        employee: {
          department: null,
        },
      },
      department_head: {
        name: null,
      },
      department_employees: {
        employees: [],
      },
    };

    render(<TimeLogDashboard />);

    expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(2);
  });

  /* =======================================================
     TEST 14
     Loading state does not crash component
  ======================================================= */

  it("renders without crashing while loading", () => {
    mocks.selectorState.loadingEmployeeDash = true;

    render(<TimeLogDashboard />);

    expect(screen.getByText("Contract Expiry")).toBeInTheDocument();
  });
});

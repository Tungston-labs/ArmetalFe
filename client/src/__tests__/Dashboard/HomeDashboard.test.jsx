import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  dashboardState: {
    counts: null,
    reimbursements: null,
    reimbursementMonthwise: null,
    departmentSummary: null,
    recentEmployees: null,
    contractExpiry: null,
    holidaySummary: null,
    projectEmployeeCount: null,
    todayStats: null,
  },
}));

/* =========================================================
   REDUX MOCK
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) =>
    selector({
      dashboard: mocks.dashboardState,
    }),
}));

/* =========================================================
   DASHBOARD SLICE MOCK
========================================================= */

vi.mock("../../Redux/dashboardSlice", () => ({
  getDashCounts: vi.fn(() => ({
    type: "dashboard/getDashCounts",
  })),

  getReimbursementCounts: vi.fn(() => ({
    type: "dashboard/getReimbursementCounts",
  })),

  getReimbursementMonthwise: vi.fn(() => ({
    type: "dashboard/getReimbursementMonthwise",
  })),

  getDepartmentDashboard: vi.fn(() => ({
    type: "dashboard/getDepartmentDashboard",
  })),

  getRecentEmployees: vi.fn(() => ({
    type: "dashboard/getRecentEmployees",
  })),

  getContractExpiry: vi.fn(() => ({
    type: "dashboard/getContractExpiry",
  })),

  getHolidaySummary: vi.fn(() => ({
    type: "dashboard/getHolidaySummary",
  })),

  getProjectEmployeeCount: vi.fn(() => ({
    type: "dashboard/getProjectEmployeeCount",
  })),

  getTodayEmployeeStats: vi.fn(() => ({
    type: "dashboard/getTodayEmployeeStats",
  })),
}));

/* =========================================================
   STYLES MOCK
========================================================= */

vi.mock("../../Pages/Dashboard/HomeDashboard.Styles", () => {
  const component = (tag) => {
    return ({ children, ...props }) =>
      React.createElement(tag, props, children);
  };

  return {
    Container: component("div"),
    ContentWrapper: component("div"),
    TwoColumn: component("div"),
    LeftBox: component("div"),
    RightBox: component("div"),
    ThreeBox: component("div"),
    ThreeColumnRow: component("div"),
    TopCard: component("div"),
  };
});

/* =========================================================
   CHILD COMPONENT MOCKS
========================================================= */

vi.mock("../../Components/homepage/HeaderBar", () => ({
  default: ({ onOpen }) => (
    <div data-testid="header-bar">
      <button onClick={onOpen}>Open Dashboard Modal</button>
    </div>
  ),
}));

vi.mock("../../Components/homepage/StatsGrid", () => ({
  default: ({ counts, todayStats }) => (
    <div data-testid="stats-grid">
      <span data-testid="stats-counts">{JSON.stringify(counts)}</span>

      <span data-testid="stats-today">{JSON.stringify(todayStats)}</span>
    </div>
  ),
}));

vi.mock("../../Components/homepage/RightModal", () => ({
  default: ({ open, onClose }) => (
    <div data-testid="right-modal">
      <span>{String(open)}</span>

      <button onClick={onClose}>Close Dashboard Modal</button>
    </div>
  ),
}));

vi.mock("../../Components/homepage/ProjectChart", () => ({
  default: ({ projectEmployeeCount }) => (
    <div data-testid="project-chart">
      {JSON.stringify(projectEmployeeCount)}
    </div>
  ),
}));

vi.mock("../../Components/homepage/ReimbursementSummary", () => ({
  default: ({ reimbursements, reimbursementMonthwise }) => (
    <div data-testid="reimbursement-summary">
      <span>{JSON.stringify(reimbursements)}</span>

      <span>{JSON.stringify(reimbursementMonthwise)}</span>
    </div>
  ),
}));

vi.mock("../../Components/homepage/DepartmentSummary", () => ({
  default: ({ departments }) => (
    <div data-testid="department-summary">{JSON.stringify(departments)}</div>
  ),
}));

vi.mock("../../Components/homepage/UpcomingHolidays", () => ({
  default: ({ holidays, showCount, onViewAll }) => (
    <div data-testid="upcoming-holidays">
      <span data-testid="holidays-data">{JSON.stringify(holidays)}</span>

      <span data-testid="holiday-count">{showCount}</span>

      <button onClick={onViewAll}>View All Holidays</button>
    </div>
  ),
}));

vi.mock("../../Components/homepage/EmployeeContractExpiry", () => ({
  default: ({ employees, showCount }) => (
    <div data-testid="contract-expiry">
      <span data-testid="contract-employees">{JSON.stringify(employees)}</span>

      <span data-testid="contract-count">{showCount}</span>
    </div>
  ),
}));

vi.mock("../../Components/homepage/RecentlyAddedEmployees", () => ({
  default: ({ employees, showCount }) => (
    <div data-testid="recent-employees">
      <span data-testid="recent-employees-data">
        {JSON.stringify(employees)}
      </span>

      <span data-testid="recent-employees-count">{showCount}</span>
    </div>
  ),
}));

/* =========================================================
   COMPONENT IMPORT
========================================================= */

import Dashboard from "../../Pages/Dashboard/HomeDashboard";

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.dashboardState = {
    counts: {
      employees: 100,
      departments: 10,
      projects: 20,
    },

    reimbursements: {
      total: 5000,
      approved: 4000,
    },

    reimbursementMonthwise: {
      January: 1000,
      February: 2000,
    },

    departmentSummary: {
      recent_departments: [
        {
          id: 1,
          name: "IT",
        },
        {
          id: 2,
          name: "HR",
        },
      ],
    },

    recentEmployees: {
      recent_employees: [
        {
          id: 1,
          name: "John Doe",
          employee_id: "EMP001",
          profile_pic: "john.jpg",
          added_date: "2025-01-10",
        },
        {
          id: 2,
          name: "Jane Smith",
          employee_id: "EMP002",
          profile_pic: "jane.jpg",
          added_date: "2025-01-15",
        },
      ],
    },

    contractExpiry: [
      {
        id: 10,
        name: "Employee One",
        expiry_date: "2025-12-31",
      },
    ],

    holidaySummary: {
      upcoming_holidays: [
        {
          description: "Republic Day",
          date: "2025-01-26",
          holiday_type: "Public Holiday",
        },
        {
          description: "Independence Day",
          date: "2025-08-15",
          holiday_type: "Public Holiday",
        },
      ],
    },

    projectEmployeeCount: [
      {
        project: "Project A",
        employees: 10,
      },
    ],

    todayStats: {
      present: 80,
      absent: 20,
    },
  };

  mocks.dispatch.mockImplementation((action) => action);
});

/* =========================================================
   TESTS
========================================================= */

describe("Dashboard", () => {
  it("renders the dashboard successfully", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("header-bar")).toBeInTheDocument();

    expect(screen.getByTestId("stats-grid")).toBeInTheDocument();

    expect(screen.getByTestId("reimbursement-summary")).toBeInTheDocument();

    expect(screen.getByTestId("project-chart")).toBeInTheDocument();

    expect(screen.getByTestId("department-summary")).toBeInTheDocument();

    expect(screen.getByTestId("recent-employees")).toBeInTheDocument();

    expect(screen.getByTestId("contract-expiry")).toBeInTheDocument();

    expect(screen.getByTestId("upcoming-holidays")).toBeInTheDocument();
  });

  it("dispatches all dashboard actions on mount", () => {
    render(<Dashboard />);

    expect(mocks.dispatch).toHaveBeenCalledTimes(9);

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getDashCounts",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getReimbursementCounts",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getReimbursementMonthwise",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getDepartmentDashboard",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getRecentEmployees",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getContractExpiry",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getHolidaySummary",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getProjectEmployeeCount",
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getTodayEmployeeStats",
    });
  });

  it("passes counts and todayStats to StatsGrid", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("stats-counts")).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.counts),
    );

    expect(screen.getByTestId("stats-today")).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.todayStats),
    );
  });

  it("passes reimbursement data to ReimbursementSummary", () => {
    render(<Dashboard />);

    const summary = screen.getByTestId("reimbursement-summary");

    expect(summary).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.reimbursements),
    );

    expect(summary).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.reimbursementMonthwise),
    );
  });

  it("passes project employee count to ProjectChart", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("project-chart")).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.projectEmployeeCount),
    );
  });

  it("passes recent departments to DepartmentSummary", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("department-summary")).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.departmentSummary.recent_departments),
    );
  });

  it("maps recent employees correctly", () => {
    render(<Dashboard />);

    const employees = JSON.parse(
      screen.getByTestId("recent-employees-data").textContent,
    );

    expect(employees).toEqual([
      {
        id: 1,
        name: "John Doe",
        employee_id: "EMP001",
        profile_pic: "john.jpg",
        added_date: "2025-01-10",
        avatar: "john.jpg",
        empId: "EMP001",
        joiningDate: "2025-01-10",
      },
      {
        id: 2,
        name: "Jane Smith",
        employee_id: "EMP002",
        profile_pic: "jane.jpg",
        added_date: "2025-01-15",
        avatar: "jane.jpg",
        empId: "EMP002",
        joiningDate: "2025-01-15",
      },
    ]);
  });

  it("passes contract expiry employees and showCount", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("contract-employees")).toHaveTextContent(
      JSON.stringify(mocks.dashboardState.contractExpiry),
    );

    expect(screen.getByTestId("contract-count")).toHaveTextContent("3");
  });

  it("maps upcoming holidays correctly", () => {
    render(<Dashboard />);

    const holidays = JSON.parse(
      screen.getByTestId("holidays-data").textContent,
    );

    expect(holidays).toEqual([
      {
        name: "Republic Day",
        date: "2025-01-26",
        type: "Public Holiday",
      },
      {
        name: "Independence Day",
        date: "2025-08-15",
        type: "Public Holiday",
      },
    ]);
  });

  it("passes showCount 3 to RecentlyAddedEmployees", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("recent-employees-count")).toHaveTextContent("3");
  });

  it("passes showCount 3 to UpcomingHolidays", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("holiday-count")).toHaveTextContent("3");
  });

  it("opens the right modal when HeaderBar triggers onOpen", () => {
    render(<Dashboard />);

    expect(screen.queryByTestId("right-modal")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open Dashboard Modal",
      }),
    );

    expect(screen.getByTestId("right-modal")).toBeInTheDocument();

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("closes the right modal", () => {
    render(<Dashboard />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open Dashboard Modal",
      }),
    );

    expect(screen.getByTestId("right-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Dashboard Modal",
      }),
    );

    expect(screen.queryByTestId("right-modal")).not.toBeInTheDocument();
  });

  it("handles missing recentEmployees data", () => {
    mocks.dashboardState.recentEmployees = null;

    render(<Dashboard />);

    expect(screen.getByTestId("recent-employees-data")).toHaveTextContent("[]");
  });

  it("handles missing departmentSummary data", () => {
    mocks.dashboardState.departmentSummary = null;

    render(<Dashboard />);

    expect(screen.getByTestId("department-summary")).toHaveTextContent("[]");
  });

  it("handles missing holidaySummary data", () => {
    mocks.dashboardState.holidaySummary = null;

    render(<Dashboard />);

    expect(screen.getByTestId("holidays-data")).toHaveTextContent("[]");
  });

  it("handles missing contractExpiry data", () => {
    mocks.dashboardState.contractExpiry = null;

    render(<Dashboard />);

    expect(screen.getByTestId("contract-employees")).toHaveTextContent("[]");
  });

  it("handles empty recent employee list", () => {
    mocks.dashboardState.recentEmployees = {
      recent_employees: [],
    };

    render(<Dashboard />);

    expect(screen.getByTestId("recent-employees-data")).toHaveTextContent("[]");
  });

  it("handles empty upcoming holiday list", () => {
    mocks.dashboardState.holidaySummary = {
      upcoming_holidays: [],
    };

    render(<Dashboard />);

    expect(screen.getByTestId("holidays-data")).toHaveTextContent("[]");
  });

  it("handles department summary with no recent_departments", () => {
    mocks.dashboardState.departmentSummary = {};

    render(<Dashboard />);

    expect(screen.getByTestId("department-summary")).toHaveTextContent("[]");
  });

  it("passes empty arrays when optional dashboard data is unavailable", () => {
    mocks.dashboardState = {
      counts: undefined,
      reimbursements: undefined,
      reimbursementMonthwise: undefined,
      departmentSummary: undefined,
      recentEmployees: undefined,
      contractExpiry: undefined,
      holidaySummary: undefined,
      projectEmployeeCount: undefined,
      todayStats: undefined,
    };

    render(<Dashboard />);

    expect(screen.getByTestId("recent-employees-data")).toHaveTextContent("[]");

    expect(screen.getByTestId("department-summary")).toHaveTextContent("[]");

    expect(screen.getByTestId("contract-employees")).toHaveTextContent("[]");

    expect(screen.getByTestId("holidays-data")).toHaveTextContent("[]");
  });

  it("calls onViewAll for upcoming holidays", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<Dashboard />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "View All Holidays",
      }),
    );

    expect(consoleSpy).toHaveBeenCalledWith("open holidays page");

    consoleSpy.mockRestore();
  });
});

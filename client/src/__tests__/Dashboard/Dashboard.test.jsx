// src/Components/homepage/DashboardWidgets.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// recharts and react-chartjs-2 render to actual canvas/SVG measurement
// which jsdom doesn't support well, so both are mocked with lightweight
// stand-ins that just render their data as text. react-router-dom's
// useNavigate is mocked globally for this file since every widget uses
// it directly to deep-link into the relevant section.

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart">{JSON.stringify(data)}{children}</div>
  ),
  Bar: () => null,
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart">{JSON.stringify(data)}{children}</div>
  ),
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

vi.mock("react-chartjs-2", () => ({
  Doughnut: ({ data }) => <div data-testid="doughnut">{JSON.stringify(data)}</div>,
}));

vi.mock("chart.js", () => ({
  Chart: { register: vi.fn() },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------
import HeaderBar from "../../Components/homepage/HeaderBar";

describe("HeaderBar", () => {
  test("renders the title and calls onOpen when the menu button is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<HeaderBar onOpen={onOpen} />);

    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test("shows the notification dot by default and hides it when disabled", () => {
    const { container, rerender } = render(<HeaderBar onOpen={() => {}} />);
    expect(container.querySelectorAll("button > *").length).toBeGreaterThan(1);

    rerender(<HeaderBar onOpen={() => {}} hasNotification={false} />);
    // With hasNotification=false only the icon remains inside the button.
    expect(container.querySelector("button").children.length).toBe(1);
  });
});

// ---------------------------------------------------------------------
import StatsGrid from "../../Components/homepage/StatsGrid";

describe("StatsGrid", () => {
  test("shows a loading message when counts is not yet available", () => {
    render(<StatsGrid counts={null} todayStats={null} />);
    expect(screen.getByText("Loading Dashboard...")).toBeInTheDocument();
  });

  test("renders four stat cards with combined visa+contract expiry count", () => {
    render(
      <StatsGrid
        counts={{
          total_employees: 10,
          pending_leave_requests: 2,
          upcoming_visa_expiry: 3,
          upcoming_contract_expiry: 4,
          todays_attendance_count: 8,
        }}
        todayStats={{}}
      />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Total Employees")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument(); // 3 + 4
    expect(screen.getByText("Visa Expiring / Contract Expiring")).toBeInTheDocument();
  });

  test("clicking a stat card navigates to its configured route", async () => {
    const user = userEvent.setup();
    render(<StatsGrid counts={{ total_employees: 5 }} todayStats={{}} />);

    await user.click(screen.getByText("Total Employees").closest("div[class]") || screen.getByText("5"));
    // Fallback: click the card container directly for reliability across styled-components class names
    fireEvent.click(screen.getByText("Total Employees"));
    expect(mockNavigate).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------
import ProjectChart from "../../Components/homepage/ProjectChart";

describe("ProjectChart", () => {
  test("shows a loading message while projectEmployeeCount is not ready", () => {
    render(<ProjectChart projectEmployeeCount={null} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders bar chart data derived from on_site/variant/bench", () => {
    render(
      <ProjectChart projectEmployeeCount={{ on_site: 5, variant: 2, bench: 1 }} />
    );
    const chart = screen.getByTestId("bar-chart");
    expect(chart.textContent).toContain('"name":"On-Site","value":5');
    expect(chart.textContent).toContain('"name":"Variant","value":2');
    expect(chart.textContent).toContain('"name":"Bench","value":1');
  });

  test("navigates to /project when the shortcut icon is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectChart projectEmployeeCount={{ on_site: 1, variant: 1, bench: 1 }} />);
    await user.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/project");
  });
});

// ---------------------------------------------------------------------
import ReimbursementSummary from "../../Components/homepage/ReimbursementSummary";

describe("ReimbursementSummary", () => {
  test("shows a loading message until both reimbursements and monthwise data exist", () => {
    render(<ReimbursementSummary reimbursements={null} reimbursementMonthwise={null} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the four summary counts", () => {
    render(
      <ReimbursementSummary
        reimbursements={{
          total_requests: 10,
          pending_count: 3,
          verified_count: 5,
          rejected_count: 2,
        }}
        reimbursementMonthwise={{}}
      />
    );

    expect(screen.getByText("Total Reimbursement Requests")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Pending Reimbursement")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("defaults every count to 0 when fields are missing", () => {
    render(<ReimbursementSummary reimbursements={{}} reimbursementMonthwise={{}} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(4);
  });
});

// ---------------------------------------------------------------------
import DepartmentSummary from "../../Components/homepage/DepartmentSummary";

describe("DepartmentSummary", () => {
  test("shows total department count and the single most recent department", () => {
    render(
      <DepartmentSummary
        departments={[
          { name: "Sales", created_at: "2025-01-01" },
          { name: "Engineering", created_at: "2026-01-01" },
        ]}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.queryByText("Sales")).not.toBeInTheDocument();
  });

  test("shows a no-data message when there are no departments", () => {
    render(<DepartmentSummary departments={[]} />);
    expect(screen.getByText("No recent departments found")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------
import RecentlyAddedEmployees from "../../Components/homepage/RecentlyAddedEmployees";

describe("RecentlyAddedEmployees", () => {
  const employees = [
    { name: "Older", joiningDate: "2025-01-01", empId: "E1", department: "Sales" },
    { name: "Newer", joiningDate: "2026-01-01", empId: "E2", department: "Eng" },
  ];

  test("sorts by joining date (most recent first) and respects showCount", () => {
    render(<RecentlyAddedEmployees employees={employees} showCount={1} />);
    expect(screen.getByText("Newer")).toBeInTheDocument();
    expect(screen.queryByText("Older")).not.toBeInTheDocument();
  });

  test("shows a fallback avatar icon when no avatar is provided", () => {
    const { container } = render(
      <RecentlyAddedEmployees employees={[{ name: "No Pic" }]} showCount={5} />
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  test("shows an empty-state message with no employees", () => {
    render(<RecentlyAddedEmployees employees={[]} />);
    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------
import EmployeeContractExpiry from "../../Components/homepage/EmployeeContractExpiry";

describe("EmployeeContractExpiry", () => {
  test("sorts employees by soonest contract expiry date first", () => {
    render(
      <EmployeeContractExpiry
        employees={[
          { name: "Later", contract_expiry_date: "2026-06-01", days_left: 90 },
          { name: "Sooner", contract_expiry_date: "2026-02-01", days_left: 4 },
        ]}
        showCount={5}
      />
    );

    const names = screen.getAllByText(/Sooner|Later/).map((n) => n.textContent);
    expect(names[0]).toBe("Sooner");
  });

  test("shows 'Expires Today' when days_left is 0", () => {
    render(
      <EmployeeContractExpiry
        employees={[{ name: "Due", contract_expiry_date: "2026-01-01", days_left: 0 }]}
      />
    );
    expect(screen.getByText("Expires Today")).toBeInTheDocument();
  });

  test("shows a no-data message with no employees", () => {
    render(<EmployeeContractExpiry employees={[]} />);
    expect(screen.getByText("No expiring contracts")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------
import UpcomingHolidays from "../../Components/homepage/UpcomingHolidays";

describe("UpcomingHolidays", () => {
  test("sorts holidays chronologically and respects showCount", () => {
    render(
      <UpcomingHolidays
        holidays={[
          { name: "Later Holiday", date: "2026-12-25", type: "public" },
          { name: "Sooner Holiday", date: "2026-01-26", type: "public" },
        ]}
        showCount={1}
      />
    );
    expect(screen.getByText("Sooner Holiday")).toBeInTheDocument();
    expect(screen.queryByText("Later Holiday")).not.toBeInTheDocument();
  });

  test("shows a no-data message with no holidays", () => {
    render(<UpcomingHolidays holidays={[]} />);
    expect(screen.getByText("No upcoming holidays")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------
import AttendanceCircle from "../../Components/homepage/AttendanceCircle";

describe("AttendanceCircle", () => {
  test("renders present and leave percentages", () => {
    render(<AttendanceCircle present={70} leave={30} />);
    expect(screen.getByText("Present: 70%")).toBeInTheDocument();
    expect(screen.getByText("Leave: 30%")).toBeInTheDocument();
  });

  test("defaults to 0/0 when no props are given", () => {
    render(<AttendanceCircle />);
    expect(screen.getByText("Present: 0%")).toBeInTheDocument();
    expect(screen.getByText("Leave: 0%")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------
import SingleHolidayCalendar from "../../Components/homepage/SingleHolidayCalendar.jsx";

describe("SingleHolidayCalendar", () => {
  test("renders the current month and year by default", () => {
    const now = new Date();
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    render(<SingleHolidayCalendar holidays={[]} />);
    expect(
      screen.getByText(`${monthNames[now.getMonth()]} ${now.getFullYear()}`)
    ).toBeInTheDocument();
  });

  test("navigates to the next and previous month", async () => {
    const user = userEvent.setup();
    render(<SingleHolidayCalendar holidays={[]} />);

    const now = new Date();
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const nextMonthIdx = (now.getMonth() + 1) % 12;

    await user.click(screen.getByText("›"));
    expect(screen.getByText(new RegExp(monthNames[nextMonthIdx]))).toBeInTheDocument();

    await user.click(screen.getByText("‹"));
    expect(
      screen.getByText(`${monthNames[now.getMonth()]} ${now.getFullYear()}`)
    ).toBeInTheDocument();
  });

  test("marks every Sunday as a holiday when a company_off_day entry exists", () => {
    const { container } = render(
      <SingleHolidayCalendar
        holidays={[{ date: "2026-01-01", holiday_type: "company_off_day" }]}
      />
    );
    expect(container.querySelectorAll(".holiday").length).toBeGreaterThan(0);
  });
});
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  useSelector: vi.fn(),
  apiPost: vi.fn(),
}));

/* =========================================================
   REACT ROUTER MOCK
========================================================= */

vi.mock("react-router-dom", () => ({
  useNavigate: mocks.useNavigate,

  useLocation: mocks.useLocation,

  NavLink: ({ children, to, className, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),

  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

/* =========================================================
   REDUX MOCK
========================================================= */

vi.mock("react-redux", () => ({
  useSelector: mocks.useSelector,
}));

/* =========================================================
   API MOCK
========================================================= */

vi.mock("../../services/api", () => ({
  default: {
    post: mocks.apiPost,
  },
}));

/* =========================================================
   ICON MOCKS
========================================================= */

vi.mock("react-icons/ri", () => ({
  RiHome5Line: () => <span data-testid="home-icon" />,
}));

vi.mock("react-icons/fa", () => ({
  FaUsers: () => <span data-testid="users-icon" />,

  FaSitemap: () => <span data-testid="sitemap-icon" />,

  FaTasks: () => <span data-testid="tasks-icon" />,

  FaMoneyCheckAlt: () => <span data-testid="payroll-icon" />,

  FaUmbrellaBeach: () => <span data-testid="holiday-icon" />,

  FaReceipt: () => <span data-testid="receipt-icon" />,
}));

vi.mock("react-icons/md", () => ({
  MdOutlineLaptopChromebook: () => <span data-testid="dashboard-icon" />,

  MdContentPasteSearch: () => <span data-testid="project-icon" />,
}));

vi.mock("react-icons/bs", () => ({
  BsFillBuildingsFill: () => <span data-testid="company-icon" />,
}));

vi.mock("react-icons/fa6", () => ({
  FaAngleRight: () => <span data-testid="angle-right-icon" />,

  FaAngleUp: () => <span data-testid="angle-up-icon" />,
}));

/* =========================================================
   COMPONENT
========================================================= */

import Sidebar from "../../Components/Sidebar";

/* =========================================================
   TEST DATA
========================================================= */

const hrUser = {
  id: 1,
  name: "Test User",

  is_superadmin: false,
  is_hr_admin: true,
  is_hr: false,

  company: {
    logo: "",
  },

  company_modules: {
    dashboard: true,
    employee: true,
    department: true,
    daily_task: true,
    finance: true,
    payroll: true,
    holiday: true,
    reimbursement: true,
    project: true,
  },
};

const hrUserWithCompanyLogo = {
  ...hrUser,

  company: {
    logo: "https://example.com/company-logo.png",
  },
};

const superAdminUser = {
  id: 2,
  name: "Super Admin",

  is_superadmin: true,
  is_hr_admin: false,
  is_hr: false,

  company: {
    logo: "",
  },

  company_modules: {},
};

const normalUser = {
  id: 3,
  name: "Normal User",

  is_superadmin: false,
  is_hr_admin: false,
  is_hr: false,

  company: {
    logo: "",
  },

  company_modules: {},
};

const hrUserWithNoModules = {
  ...hrUser,
  company_modules: {},
};

const hrUserOnlyDashboard = {
  ...hrUser,

  company_modules: {
    dashboard: true,
  },
};

const hrUserOnlyEmployee = {
  ...hrUser,

  company_modules: {
    employee: true,
  },
};

const hrUserOnlyDepartment = {
  ...hrUser,

  company_modules: {
    department: true,
  },
};

const hrUserOnlyDailyTask = {
  ...hrUser,

  company_modules: {
    daily_task: true,
  },
};

const hrUserOnlyFinance = {
  ...hrUser,

  company_modules: {
    finance: true,
  },
};

const hrUserOnlyPayroll = {
  ...hrUser,

  company_modules: {
    payroll: true,
  },
};

const hrUserOnlyHoliday = {
  ...hrUser,

  company_modules: {
    holiday: true,
  },
};

const hrUserOnlyReimbursement = {
  ...hrUser,

  company_modules: {
    reimbursement: true,
  },
};

const hrUserOnlyProject = {
  ...hrUser,

  company_modules: {
    project: true,
  },
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.useNavigate.mockReturnValue(vi.fn());

  mocks.useLocation.mockReturnValue({
    pathname: "/",
  });

  mocks.useSelector.mockReturnValue(hrUser);

  mocks.apiPost.mockResolvedValue({
    data: {
      success: true,
    },
  });

  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe("Sidebar Component", () => {
  /* =======================================================
     USER CONDITIONS
  ======================================================= */

  it("renders nothing when user is not available", () => {
    mocks.useSelector.mockReturnValue(null);

    const { container } = render(<Sidebar />);

    expect(container.firstChild).toBeNull();
  });

  it("renders when redux user is available", () => {
    mocks.useSelector.mockReturnValue(hrUser);

    render(<Sidebar />);

    expect(screen.getByText("Employee")).toBeInTheDocument();
  });

  it("uses stored user fallback when first selector returns null", () => {
    mocks.useSelector
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => hrUser);

    render(<Sidebar />);

    expect(screen.getByText("Employee")).toBeInTheDocument();
  });

  /* =======================================================
     HR CONDITIONS
  ======================================================= */

  it("renders all HR navigation modules", () => {
    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Daily Task")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Payroll")).toBeInTheDocument();
    expect(screen.getByText("Holiday")).toBeInTheDocument();
    expect(screen.getByText("Reimbursement")).toBeInTheDocument();
    expect(screen.getByText("Project")).toBeInTheDocument();
  });

  it("renders HR user when is_hr is true", () => {
    mocks.useSelector.mockReturnValue({
      ...hrUser,
      is_hr_admin: false,
      is_hr: true,
    });

    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
  });

  it("does not render HR modules when user is neither HR nor HR admin", () => {
    mocks.useSelector.mockReturnValue(normalUser);

    render(<Sidebar />);

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();

    expect(screen.queryByText("Department")).not.toBeInTheDocument();

    expect(screen.queryByText("Daily Task")).not.toBeInTheDocument();

    expect(screen.queryByText("Payroll")).not.toBeInTheDocument();
  });

  it("does not render modules when company_modules is empty", () => {
    mocks.useSelector.mockReturnValue(hrUserWithNoModules);

    render(<Sidebar />);

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();

    expect(screen.queryByText("Department")).not.toBeInTheDocument();

    expect(screen.queryByText("Daily Task")).not.toBeInTheDocument();
  });

  /* =======================================================
     ROUTES
  ======================================================= */

  it("renders correct dashboard route", () => {
    render(<Sidebar />);

    const dashboardText = screen.getByText("Dashboard");

    const dashboardLink = dashboardText.closest("a");

    expect(dashboardLink).toHaveAttribute("href", "/");
  });

  it("renders correct employee route", () => {
    render(<Sidebar />);

    const employeeText = screen.getByText("Employee");

    const employeeLink = employeeText.closest("a");

    expect(employeeLink).toHaveAttribute("href", "/employee");
  });

  it("renders correct department route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Department");

    expect(text.closest("a")).toHaveAttribute("href", "/department");
  });

  it("renders correct daily task route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Daily Task");

    expect(text.closest("a")).toHaveAttribute("href", "/daily-task");
  });

  it("renders correct finance route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Finance");

    expect(text.closest("a")).toHaveAttribute("href", "/finance");
  });

  it("renders correct payroll route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Payroll");

    expect(text.closest("a")).toHaveAttribute("href", "/payrolldetails");
  });

  it("renders correct holiday route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Holiday");

    expect(text.closest("a")).toHaveAttribute("href", "/holiday");
  });

  it("renders correct reimbursement route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Reimbursement");

    expect(text.closest("a")).toHaveAttribute("href", "/reimbursement");
  });

  it("renders correct project route", () => {
    render(<Sidebar />);

    const text = screen.getByText("Project");

    expect(text.closest("a")).toHaveAttribute("href", "/project");
  });

  /* =======================================================
     SUPER ADMIN
  ======================================================= */

  it("renders super admin dashboard", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders super admin company link", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    const text = screen.getByText("Companys");

    expect(text).toBeInTheDocument();

    expect(text.closest("a")).toHaveAttribute("href", "/company");
  });

  it("renders super admin finance link", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    const text = screen.getByText("Finance");

    expect(text.closest("a")).toHaveAttribute("href", "/finance");
  });

  it("does not render employee modules for super admin", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();

    expect(screen.queryByText("Department")).not.toBeInTheDocument();
  });

  /* =======================================================
     MODULE PERMISSIONS
  ======================================================= */

  it("renders dashboard only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyDashboard);

    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();
  });

  it("renders employee only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyEmployee);

    render(<Sidebar />);

    expect(screen.getByText("Employee")).toBeInTheDocument();

    expect(screen.queryByText("Department")).not.toBeInTheDocument();
  });

  it("renders department only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyDepartment);

    render(<Sidebar />);

    expect(screen.getByText("Department")).toBeInTheDocument();

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();
  });

  it("renders daily task only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyDailyTask);

    render(<Sidebar />);

    expect(screen.getByText("Daily Task")).toBeInTheDocument();
  });

  it("renders finance only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyFinance);

    render(<Sidebar />);

    expect(screen.getByText("Finance")).toBeInTheDocument();
  });

  it("renders payroll only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyPayroll);

    render(<Sidebar />);

    expect(screen.getByText("Payroll")).toBeInTheDocument();
  });

  it("renders holiday only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyHoliday);

    render(<Sidebar />);

    expect(screen.getByText("Holiday")).toBeInTheDocument();
  });

  it("renders reimbursement only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyReimbursement);

    render(<Sidebar />);

    expect(screen.getByText("Reimbursement")).toBeInTheDocument();
  });

  it("renders project only when enabled", () => {
    mocks.useSelector.mockReturnValue(hrUserOnlyProject);

    render(<Sidebar />);

    expect(screen.getByText("Project")).toBeInTheDocument();
  });

  it("does not render disabled modules", () => {
    mocks.useSelector.mockReturnValue({
      ...hrUser,

      company_modules: {
        dashboard: false,
        employee: false,
        department: false,
        daily_task: false,
        finance: false,
        payroll: false,
        holiday: false,
        reimbursement: false,
        project: false,
      },
    });

    render(<Sidebar />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();

    expect(screen.queryByText("Department")).not.toBeInTheDocument();

    expect(screen.queryByText("Daily Task")).not.toBeInTheDocument();

    expect(screen.queryByText("Finance")).not.toBeInTheDocument();

    expect(screen.queryByText("Payroll")).not.toBeInTheDocument();

    expect(screen.queryByText("Holiday")).not.toBeInTheDocument();

    expect(screen.queryByText("Reimbursement")).not.toBeInTheDocument();

    expect(screen.queryByText("Project")).not.toBeInTheDocument();
  });

  /* =======================================================
     LOGOS
  ======================================================= */

  it("renders default logo when company logo is unavailable", () => {
    render(<Sidebar />);

    const logo = screen.getByAltText("Default Logo");

    expect(logo).toBeInTheDocument();

    expect(logo).toHaveAttribute("src", "/images/logos.png");

    expect(logo).toHaveClass("default-logo");
  });

  it("renders company logo when available", () => {
    mocks.useSelector.mockReturnValue(hrUserWithCompanyLogo);

    render(<Sidebar />);

    const logo = screen.getByAltText("Company Logo");

    expect(logo).toBeInTheDocument();

    expect(logo).toHaveAttribute("src", "https://example.com/company-logo.png");
  });

  /* =======================================================
     COLLAPSE
  ======================================================= */

  it("starts expanded", () => {
    const { container } = render(<Sidebar />);

    expect(container.firstChild).not.toHaveClass("collapsed");

    expect(screen.getByText("REKORY")).toBeInTheDocument();
  });

  it("collapses sidebar when toggle button is clicked", () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.firstChild;

    const toggleButton = container.querySelector("button");

    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("collapsed");

    const rekory = screen.getByText("REKORY");

    expect(rekory.parentElement).toHaveClass("collapsed");
  });

  it("expands sidebar after clicking toggle twice", () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.firstChild;

    const toggleButton = container.querySelector("button");

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("collapsed");

    fireEvent.click(toggleButton);

    expect(sidebar).not.toHaveClass("collapsed");
  });

  it("hides logo when sidebar is collapsed", () => {
    const { container } = render(<Sidebar />);

    const toggleButton = container.querySelector("button");

    fireEvent.click(toggleButton);

    const logoWrapper = container.querySelector(".hidden");

    expect(logoWrapper).toBeInTheDocument();
  });

  it("adds collapsed class to navigation links", () => {
    const { container } = render(<Sidebar />);

    const toggleButton = container.querySelector("button");

    fireEvent.click(toggleButton);

    const dashboardText = screen.getByText("Dashboard");

    const dashboardLink = dashboardText.closest("a");

    expect(dashboardLink).toBeInTheDocument();

    expect(dashboardLink).toHaveClass("collapsed");
  });

  it("toggle button displays menu icon", () => {
    const { container } = render(<Sidebar />);

    const toggleButton = container.querySelector("button");

    expect(toggleButton).toBeInTheDocument();

    expect(toggleButton).toHaveTextContent("☰");
  });

  /* =======================================================
     ACTIVE ROUTES
  ======================================================= */

  const activeRouteTests = [
    ["/", "Dashboard"],
    ["/employee", "Employee"],
    ["/employee/123", "Employee"],
    ["/employee-leave-request/123", "Employee"],
    ["/employee-attendance/123", "Employee"],
    ["/employee-Contract-Visa-Expiry/123", "Employee"],
    ["/employee-attendance-report/123", "Employee"],
    ["/employee-attendance-request/123", "Employee"],
    ["/department/list", "Department"],
    ["/daily-task/details", "Daily Task"],
    ["/finance/details", "Finance"],
    ["/payrolldetails", "Payroll"],
    ["/holiday/list", "Holiday"],
    ["/reimbursement/list", "Reimbursement"],
    ["/project/details", "Project"],
  ];

  it.each(activeRouteTests)(
    "marks %s route active for %s",
    (pathname, label) => {
      mocks.useLocation.mockReturnValue({
        pathname,
      });

      render(<Sidebar />);

      const text = screen.getByText(label);

      const link = text.closest("a");

      expect(link.className).toContain("active");
    },
  );

  it("does not mark dashboard active on another route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/employee",
    });

    render(<Sidebar />);

    const dashboard = screen.getByText("Dashboard");

    const link = dashboard.closest("a");

    expect(link.className).not.toContain("active");
  });

  /* =======================================================
     ICONS
  ======================================================= */

  it("renders dashboard icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
  });

  it("renders employee icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("renders department icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("sitemap-icon")).toBeInTheDocument();
  });

  it("renders daily task icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("tasks-icon")).toBeInTheDocument();
  });

  it("renders payroll icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("payroll-icon")).toBeInTheDocument();
  });

  it("renders holiday icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("holiday-icon")).toBeInTheDocument();
  });

  it("renders receipt icons", () => {
    render(<Sidebar />);

    expect(screen.getAllByTestId("receipt-icon").length).toBeGreaterThan(0);
  });

  it("renders project icon", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("project-icon")).toBeInTheDocument();
  });

  it("renders super admin dashboard icon", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    expect(screen.getByTestId("dashboard-icon")).toBeInTheDocument();
  });

  it("renders company icon for super admin", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    expect(screen.getByTestId("company-icon")).toBeInTheDocument();
  });

  /* =======================================================
     POWERED BY
  ======================================================= */

  it("renders powered by text", () => {
    render(<Sidebar />);

    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();

    expect(screen.getByText("REKORY")).toBeInTheDocument();
  });

  /* =======================================================
     LOGOUT
  ======================================================= */

  it("does not call logout API when refresh token is missing", async () => {
    localStorage.removeItem("refreshToken");

    render(<Sidebar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /logout/i,
      }),
    );

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });

  it("logs out successfully when refresh token exists", async () => {
    const navigate = mocks.useNavigate();

    localStorage.setItem("refreshToken", "test-refresh-token");

    sessionStorage.setItem("sessionValue", "test");

    mocks.apiPost.mockResolvedValueOnce({
      data: {
        success: true,
      },
    });

    render(<Sidebar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /logout/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledTimes(1);

      expect(mocks.apiPost).toHaveBeenCalledWith("/logout/", {
        refresh: "test-refresh-token",
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem("refreshToken")).toBeNull();

      expect(sessionStorage.getItem("sessionValue")).toBeNull();

      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  it("handles logout API error", async () => {
    localStorage.setItem("refreshToken", "test-refresh-token");

    const error = new Error("Logout failed");

    mocks.apiPost.mockRejectedValueOnce(error);

    render(<Sidebar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /logout/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledWith("/logout/", {
        refresh: "test-refresh-token",
      });
    });

    expect(mocks.apiPost).toHaveBeenCalledTimes(1);
  });

  /* =======================================================
     API
  ======================================================= */

  it("keeps API mock untouched during normal rendering", () => {
    render(<Sidebar />);

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });
});

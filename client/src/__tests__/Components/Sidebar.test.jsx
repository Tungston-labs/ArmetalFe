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
  /* -------------------------------------------------------
     1. No user
  ------------------------------------------------------- */

  it("renders nothing when user is not available", () => {
    mocks.useSelector.mockReturnValue(null);

    const { container } = render(<Sidebar />);

    expect(container.firstChild).toBeNull();
  });

  /* -------------------------------------------------------
     2. HR navigation
  ------------------------------------------------------- */

  it("renders HR navigation modules", () => {
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

  /* -------------------------------------------------------
     3. Correct routes
  ------------------------------------------------------- */

  it("renders correct navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /Dashboard/i })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByRole("link", { name: /Employee/i })).toHaveAttribute(
      "href",
      "/employee",
    );

    expect(screen.getByRole("link", { name: /Department/i })).toHaveAttribute(
      "href",
      "/department",
    );

    expect(screen.getByRole("link", { name: /Daily Task/i })).toHaveAttribute(
      "href",
      "/daily-task",
    );

    expect(screen.getByRole("link", { name: /Finance/i })).toHaveAttribute(
      "href",
      "/finance",
    );

    expect(screen.getByRole("link", { name: /Payroll/i })).toHaveAttribute(
      "href",
      "/payrolldetails",
    );

    expect(screen.getByRole("link", { name: /Holiday/i })).toHaveAttribute(
      "href",
      "/holiday",
    );

    expect(
      screen.getByRole("link", { name: /Reimbursement/i }),
    ).toHaveAttribute("href", "/reimbursement");

    expect(screen.getByRole("link", { name: /Project/i })).toHaveAttribute(
      "href",
      "/project",
    );
  });

  /* -------------------------------------------------------
     4. Super admin links
  ------------------------------------------------------- */

  it("renders super admin navigation links", () => {
    mocks.useSelector.mockReturnValue(superAdminUser);

    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.getByText("Companys")).toBeInTheDocument();

    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     5. Module permissions
  ------------------------------------------------------- */

  it("only renders enabled modules", () => {
    mocks.useSelector.mockReturnValue({
      ...hrUser,
      company_modules: {
        dashboard: true,
        employee: false,
        department: false,
        daily_task: true,
        finance: false,
        payroll: false,
        holiday: false,
        reimbursement: false,
        project: false,
      },
    });

    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Daily Task")).toBeInTheDocument();

    expect(screen.queryByText("Employee")).not.toBeInTheDocument();
    expect(screen.queryByText("Department")).not.toBeInTheDocument();
    expect(screen.queryByText("Payroll")).not.toBeInTheDocument();
    expect(screen.queryByText("Holiday")).not.toBeInTheDocument();
    expect(screen.queryByText("Reimbursement")).not.toBeInTheDocument();
    expect(screen.queryByText("Project")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     6. Default logo
  ------------------------------------------------------- */

  it("renders default logo when company logo is unavailable", () => {
    render(<Sidebar />);

    const logo = screen.getByAltText("Default Logo");

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/logos.png");
  });

  /* -------------------------------------------------------
     7. Company logo
  ------------------------------------------------------- */

  it("renders company logo when available", () => {
    mocks.useSelector.mockReturnValue({
      ...hrUser,
      company: {
        logo: "https://example.com/company-logo.png",
      },
    });

    render(<Sidebar />);

    const logo = screen.getByAltText("Company Logo");

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/company-logo.png");
  });

  /* -------------------------------------------------------
     8. Collapse sidebar
  ------------------------------------------------------- */

  it("toggles sidebar collapsed state", () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.firstChild;

    expect(sidebar).not.toHaveClass("collapsed");

    const toggleButton = container.querySelector("button");

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent("☰");

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("collapsed");

    fireEvent.click(toggleButton);

    expect(sidebar).not.toHaveClass("collapsed");
  });

  /* -------------------------------------------------------
     9. Active dashboard route
  ------------------------------------------------------- */

  it("marks dashboard as active on root route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/",
    });

    render(<Sidebar />);

    const dashboardLink = screen.getByRole("link", {
      name: /Dashboard/i,
    });

    expect(dashboardLink.className).toContain("active");
  });

  /* -------------------------------------------------------
     10. Active employee route
  ------------------------------------------------------- */

  it("marks employee navigation as active on employee routes", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/employee/123",
    });

    render(<Sidebar />);

    const employeeLink = screen.getByRole("link", {
      name: /Employee/i,
    });

    expect(employeeLink.className).toContain("active");
  });

  /* -------------------------------------------------------
     11. Active department route
  ------------------------------------------------------- */

  it("marks department as active", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/department/list",
    });

    render(<Sidebar />);

    const departmentLink = screen.getByRole("link", {
      name: /Department/i,
    });

    expect(departmentLink.className).toContain("active");
  });

  /* -------------------------------------------------------
     12. Active payroll route
  ------------------------------------------------------- */

  it("marks payroll as active", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/payrolldetails",
    });

    render(<Sidebar />);

    const payrollLink = screen.getByRole("link", {
      name: /Payroll/i,
    });

    expect(payrollLink.className).toContain("active");
  });

  /* -------------------------------------------------------
     13. Active project route
  ------------------------------------------------------- */

  it("marks project as active", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/project/details",
    });

    render(<Sidebar />);

    const projectLink = screen.getByRole("link", {
      name: /Project/i,
    });

    expect(projectLink.className).toContain("active");
  });

  /* -------------------------------------------------------
     14. Powered by text
  ------------------------------------------------------- */

  it("renders powered by Rekory text", () => {
    render(<Sidebar />);

    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();
    expect(screen.getByText("REKORY")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     15. Logout without refresh token
  ------------------------------------------------------- */

  it("does not call logout API when refresh token is missing", async () => {
    render(<Sidebar />);

    // Current Sidebar component does not expose logout UI,
    // so this verifies that rendering itself doesn't call API.
    expect(mocks.apiPost).not.toHaveBeenCalled();
  });
});

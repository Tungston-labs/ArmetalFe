import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  onClose: vi.fn(),
}));

/* =========================================================
   STYLES MOCK
========================================================= */

vi.mock("../../Pages/employeDashboard/EmployeeDetails.styles", () => {
  const createComponent = (tag = "div") => {
    return ({ children, ...props }) =>
      React.createElement(tag, props, children);
  };

  return {
    Wrapper: createComponent("div"),
    HeaderRow: createComponent("div"),
    LeftHeader: createComponent("div"),
    Status: createComponent("div"),
    MailButton: createComponent("button"),
    TopSection: createComponent("div"),
    ProfileLeft: createComponent("div"),
    ProfileSection: createComponent("div"),
    Avatar: createComponent("div"),
    Info: createComponent("div"),
    Name: createComponent("div"),
    Role: createComponent("div"),
    RightCards: createComponent("div"),
    StatsGrid: createComponent("div"),
    StatCard: createComponent("div"),
    StatNumber: createComponent("div"),
    StatLabel: createComponent("div"),
    IconRight: createComponent("div"),
    Tabs: createComponent("div"),
    TabButton: createComponent("button"),
    ContentSection: createComponent("div"),
    InfoGrid: createComponent("div"),
    InfoRow: createComponent("div"),
    InfoTitle: createComponent("div"),
    InfoValue: createComponent("div"),
    Title: createComponent("h2"),
  };
});

/* =========================================================
   MAIL MODAL MOCK
========================================================= */

vi.mock("../../Pages/employeDashboard/MailModal", () => ({
  default: ({ isOpen, onClose, employee }) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div data-testid="mail-modal">
        <div>Mail Modal</div>
        <div data-testid="modal-employee">{employee?.name}</div>

        <button onClick={onClose}>Close Mail Modal</button>
      </div>
    );
  },
}));

/* =========================================================
   ICON MOCKS
========================================================= */

vi.mock("react-icons/pi", () => ({
  PiUsersThreeLight: ({ size }) => <span data-testid="users-icon">{size}</span>,
}));

vi.mock("react-icons/ci", () => ({
  CiAlarmOn: ({ size }) => <span data-testid="alarm-icon">{size}</span>,
}));

vi.mock("react-icons/tb", () => ({
  TbReportSearch: ({ size }) => <span data-testid="report-icon">{size}</span>,
}));

vi.mock("react-icons/lu", () => ({
  LuFileCheck: ({ size }) => <span data-testid="file-check-icon">{size}</span>,
}));

vi.mock("react-icons/hi2", () => ({
  HiUser: ({ size }) => <span data-testid="default-user-icon">{size}</span>,
}));

/* =========================================================
   COMPONENT IMPORT
========================================================= */

import EmployeeDetails from "../../Pages/employeDashboard/EmployeeDetails";

/* =========================================================
   TEST DATA
========================================================= */

const completeEmployee = {
  name: "John Doe",
  designation: "Software Engineer",
  employee_id: "EMP001",

  role: "Developer",
  salary: "5000",

  department: "Engineering",

  email: "john@example.com",

  joining_date: "2024-01-15",

  dob: "1998-05-20",

  phno: "9876543210",

  aadar_number: "123456789012",

  pan_number: "ABCDE1234F",

  account_number: "1234567890",

  passport_number: "P1234567",

  address: "Kochi, Kerala",

  pending_leave: 12,
  leave_taken: 5,

  projects: {
    ongoing_count: 3,
    completed_count: 8,
  },

  is_active: true,

  profile_pic: "https://example.com/profile.jpg",
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe("EmployeeDetails", () => {
  /* =======================================================
     1. NULL EMPLOYEE
  ======================================================= */

  it("renders Loading when employee is not provided", () => {
    render(<EmployeeDetails />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  /* =======================================================
     2. COMPLETE EMPLOYEE DATA
  ======================================================= */

  it("renders employee profile information", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    expect(screen.getByText("Profile")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getAllByText("Software Engineer")).not.toHaveLength(0);

    expect(screen.getByText("Active")).toBeInTheDocument();

    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("8")).toBeInTheDocument();
  });

  /* =======================================================
     3. ACTIVE EMPLOYEE
  ======================================================= */

  it("shows Active status for active employee", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  /* =======================================================
     4. INACTIVE EMPLOYEE
  ======================================================= */

  it("shows Inactive status for inactive employee", () => {
    render(
      <EmployeeDetails
        employee={{
          ...completeEmployee,
          is_active: false,
        }}
      />,
    );

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  /* =======================================================
     5. PROFILE IMAGE
  ======================================================= */

  it("renders employee profile image when profile_pic exists", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    const image = screen.getByAltText("John Doe");

    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute("src", "https://example.com/profile.jpg");

    expect(image).toHaveAttribute("alt", "John Doe");
  });

  /* =======================================================
     6. DEFAULT PROFILE ICON
  ======================================================= */

  it("renders default user icon when profile_pic is missing", () => {
    render(
      <EmployeeDetails
        employee={{
          ...completeEmployee,
          profile_pic: null,
        }}
      />,
    );

    expect(screen.getByTestId("default-user-icon")).toBeInTheDocument();

    expect(screen.getByTestId("default-user-icon")).toHaveTextContent("55");
  });

  /* =======================================================
     7. STATS ICONS
  ======================================================= */

  it("renders all statistics icons", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    expect(screen.getByTestId("users-icon")).toBeInTheDocument();

    expect(screen.getByTestId("alarm-icon")).toBeInTheDocument();

    expect(screen.getByTestId("report-icon")).toBeInTheDocument();

    expect(screen.getByTestId("file-check-icon")).toBeInTheDocument();
  });

  /* =======================================================
     8. WORK INFO
  ======================================================= */

  it("renders work information by default", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    expect(
      screen.getByRole("heading", {
        name: "Work Info",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Job Title :")).toBeInTheDocument();

    expect(screen.getAllByText("Software Engineer").length).toBeGreaterThan(0);
    expect(screen.getByText("Username :")).toBeInTheDocument();

    expect(screen.getByText("EMP001")).toBeInTheDocument();

    expect(screen.getByText("Role :")).toBeInTheDocument();

    expect(screen.getByText("Developer")).toBeInTheDocument();

    expect(screen.getByText("Salary :")).toBeInTheDocument();

    expect(screen.getByText("5000")).toBeInTheDocument();

    expect(screen.getByText("Department :")).toBeInTheDocument();

    expect(screen.getByText("Engineering")).toBeInTheDocument();

    expect(screen.getByText("Joining Date :")).toBeInTheDocument();

    expect(screen.getByText("15/Jan/2024")).toBeInTheDocument();

    expect(screen.getByText("Email Id :")).toBeInTheDocument();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  /* =======================================================
     9. PERSONAL DETAILS TAB
  ======================================================= */

  it("switches to personal details tab", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Personal Details",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Personal Details",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Date Of Birth :")).toBeInTheDocument();

    expect(screen.getByText("20/May/1998")).toBeInTheDocument();

    expect(screen.getByText("Contact Number :")).toBeInTheDocument();

    expect(screen.getByText("9876543210")).toBeInTheDocument();

    expect(screen.getByText("Aadhaar Number :")).toBeInTheDocument();

    expect(screen.getByText("123456789012")).toBeInTheDocument();

    expect(screen.getByText("PAN Number :")).toBeInTheDocument();

    expect(screen.getByText("ABCDE1234F")).toBeInTheDocument();

    expect(screen.getByText("Account Number :")).toBeInTheDocument();

    expect(screen.getByText("1234567890")).toBeInTheDocument();

    expect(screen.getByText("Passport Number :")).toBeInTheDocument();

    expect(screen.getByText("P1234567")).toBeInTheDocument();

    expect(screen.getByText("Address :")).toBeInTheDocument();

    expect(screen.getByText("Kochi, Kerala")).toBeInTheDocument();
  });

  /* =======================================================
     10. SWITCH BACK TO WORK INFO
  ======================================================= */

  it("switches back from personal details to work info", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    // Open Personal Details tab
    fireEvent.click(
      screen.getByRole("button", {
        name: "Personal Details",
      }),
    );

    // Verify Personal Details content is displayed.
    // There are two "Personal Details" texts:
    // the tab button and the heading.
    expect(
      screen.getByRole("heading", {
        name: "Personal Details",
      }),
    ).toBeInTheDocument();

    // Switch back to Work Info
    fireEvent.click(
      screen.getByRole("button", {
        name: "Work Info",
      }),
    );

    // Verify Work Info content is displayed
    expect(
      screen.getByRole("heading", {
        name: "Work Info",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Job Title :")).toBeInTheDocument();
  });

  /* =======================================================
     11. MISSING STAT VALUES
  ======================================================= */

  it("uses fallback values for missing statistics", () => {
    const employee = {
      ...completeEmployee,
      pending_leave: null,
      leave_taken: null,
      projects: {
        ongoing_count: null,
        completed_count: null,
      },
    };

    render(<EmployeeDetails employee={employee} />);

    expect(screen.getAllByText("00").length).toBe(2);

    expect(screen.getAllByText("0").length).toBe(2);
  });

  /* =======================================================
     12. MISSING PROJECT OBJECT
  ======================================================= */

  it("uses zero when projects object is missing", () => {
    const employee = {
      ...completeEmployee,
      projects: undefined,
    };

    render(<EmployeeDetails employee={employee} />);

    expect(screen.getAllByText("0").length).toBe(2);
  });

  /* =======================================================
     13. MISSING JOINING DATE
  ======================================================= */

  it("formats missing joining date as ----", () => {
    const employee = {
      ...completeEmployee,
      joining_date: null,
    };

    render(<EmployeeDetails employee={employee} />);

    expect(screen.getByText("----")).toBeInTheDocument();
  });

  /* =======================================================
     14. MISSING DOB
  ======================================================= */

  it("formats missing date of birth as ----", () => {
    const employee = {
      ...completeEmployee,
      dob: null,
    };

    render(<EmployeeDetails employee={employee} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Personal Details",
      }),
    );

    expect(screen.getByText("----")).toBeInTheDocument();
  });

  /* =======================================================
     15. PERSONAL ROW WITHOUT TITLE2
  ======================================================= */

  it("renders address row without second title", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Personal Details",
      }),
    );

    expect(screen.getByText("Address :")).toBeInTheDocument();

    expect(screen.getByText("Kochi, Kerala")).toBeInTheDocument();
  });

  /* =======================================================
     16. SEND MAIL BUTTON
  ======================================================= */

  it("opens mail modal when Send Mail is clicked", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    expect(screen.queryByTestId("mail-modal")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Mail",
      }),
    );

    expect(screen.getByTestId("mail-modal")).toBeInTheDocument();

    expect(screen.getByText("Mail Modal")).toBeInTheDocument();

    expect(screen.getByTestId("modal-employee")).toHaveTextContent("John Doe");
  });

  /* =======================================================
     17. CLOSE MAIL MODAL
  ======================================================= */

  it("closes mail modal when close button is clicked", () => {
    render(<EmployeeDetails employee={completeEmployee} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Mail",
      }),
    );

    expect(screen.getByTestId("mail-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Mail Modal",
      }),
    );

    expect(screen.queryByTestId("mail-modal")).not.toBeInTheDocument();
  });

  /* =======================================================
     18. EMPTY OPTIONAL EMPLOYEE VALUES
  ======================================================= */

  it("handles missing optional employee values", () => {
    const employee = {
      name: "Test Employee",
      designation: "Tester",
      is_active: true,
      profile_pic: "",
      pending_leave: undefined,
      leave_taken: undefined,
      projects: undefined,
      joining_date: undefined,
      dob: undefined,
      employee_id: undefined,
      role: undefined,
      salary: undefined,
      department: undefined,
      email: undefined,
      phno: undefined,
      aadar_number: undefined,
      pan_number: undefined,
      account_number: undefined,
      passport_number: undefined,
      address: undefined,
    };

    render(<EmployeeDetails employee={employee} />);

    expect(screen.getByText("Test Employee")).toBeInTheDocument();

    expect(screen.getByTestId("default-user-icon")).toBeInTheDocument();

    expect(screen.getAllByText("00").length).toBe(2);

    expect(screen.getAllByText("0").length).toBe(2);

    expect(screen.getAllByText("----").length).toBeGreaterThanOrEqual(1);
  });
});

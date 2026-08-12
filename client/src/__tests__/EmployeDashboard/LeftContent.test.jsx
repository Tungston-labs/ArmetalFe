import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// =========================================================
// MOCKS
// =========================================================

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  fetchEmployeeDash: vi.fn((id) => ({
    type: "auth/fetchEmployeeDash",
    payload: id,
  })),
  authState: {},
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) =>
    selector({
      auth: mocks.authState,
    }),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({
    employeeId: "EMP001",
  }),
  useNavigate: () => mocks.navigate,
  useLocation: () => ({
    state: {
      from: "fulldashboard",
    },
  }),
}));

vi.mock("../../Redux/authSlice", () => ({
  fetchEmployeeDash: mocks.fetchEmployeeDash,
}));

vi.mock("../../services/api", () => ({
  BASE_URL: "https://example.com",
}));

// =========================================================
// STYLED COMPONENT MOCKS
// =========================================================

vi.mock("../../Pages/employeDashboard/LeftContent.Styles", () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  TopSection: ({ children }) => <div data-testid="top-section">{children}</div>,
  LeftColumn: ({ children }) => <div>{children}</div>,
  SvgImage: (props) => <img {...props} />,
  ProfileCard: ({ children }) => <div>{children}</div>,
  RightColumn: ({ children }) => <div>{children}</div>,
  InfoGrid: ({ children }) => <div>{children}</div>,
  InfoCard: ({ children }) => <div>{children}</div>,
  TimeTrackingCard: ({ children }) => <div>{children}</div>,
  Details: ({ children }) => <div>{children}</div>,
  ImageWrapper: ({ children }) => <div>{children}</div>,
  ProfileCardWrapper: ({ children }) => <div>{children}</div>,
  TitleRow: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
}));

// =========================================================
// ICON MOCKS
// =========================================================

vi.mock("react-icons/fa", () => ({
  FaEdit: ({ onClick, className }) => (
    <button
      type="button"
      aria-label="Edit profile"
      className={className}
      onClick={onClick}
    >
      Edit
    </button>
  ),
}));

// =========================================================
// ASSET MOCKS
// =========================================================

vi.mock("../../assets/clock.svg", () => ({ default: "clock.svg" }));
vi.mock("../../assets/salary.svg", () => ({ default: "salary.svg" }));
vi.mock("../../assets/pending.svg", () => ({ default: "pending.svg" }));
vi.mock("../../assets/leave.svg", () => ({ default: "leave.svg" }));
vi.mock("../../assets/time.svg", () => ({ default: "time.svg" }));

// =========================================================
// IMPORT COMPONENT
// =========================================================

import LeftContent from "../../Pages/employeDashboard/LeftContent";

// =========================================================
// TEST DATA
// =========================================================

const mockEmployee = {
  name: "John Doe",
  designation: "Software Engineer",
  email: "john@example.com",
  profile_pic: "/media/profile.jpg",
  joining_date: "2025-01-15",
  company_days: 200,

  bank_details: {
    basic_salary: 50000,
  },

  leave_summary: {
    pending_leave: 2,
    leave_taken: 5,
  },

  attendance_summary: {
    monthly_days: 22,
    weekly_working_hours: "40:00",
    monthly_working_hours: "160:00",
  },
};

// =========================================================
// SETUP
// =========================================================

beforeEach(() => {
  vi.clearAllMocks();

  mocks.authState = {
    employeeDashData: mockEmployee,
    loadingEmployeeDash: false,
    employeeDashError: null,
  };
});

afterEach(() => {
  cleanup();
});

// =========================================================
// TESTS
// =========================================================

describe("LeftContent", () => {
  it("renders employee information correctly", () => {
    render(<LeftContent />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
    expect(screen.getByText("200 Days")).toBeInTheDocument();

    expect(screen.getByText("50000")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders time tracking information", () => {
    render(<LeftContent />);

    expect(screen.getByText("Time Tracking")).toBeInTheDocument();

    expect(screen.getByText("Monthly Days:")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();

    expect(screen.getByText("Weekly Working Hour:")).toBeInTheDocument();
    expect(screen.getByText("40:00")).toBeInTheDocument();

    expect(screen.getByText("Total Working Hour:")).toBeInTheDocument();
    expect(screen.getByText("160:00")).toBeInTheDocument();
  });

  it("dispatches fetchEmployeeDash when employeeId exists", () => {
    render(<LeftContent />);

    expect(mocks.fetchEmployeeDash).toHaveBeenCalledWith("EMP001");
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/fetchEmployeeDash",
      payload: "EMP001",
    });
  });

  it("navigates to employee profile when edit button is clicked", () => {
    render(<LeftContent />);

    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(mocks.navigate).toHaveBeenCalledWith("/ViewBasic/EMP001", {
      state: {
        from: "fulldashboard",
        employeeId: "EMP001",
      },
    });
  });

  it("shows Loading when employee dashboard is loading", () => {
    mocks.authState = {
      employeeDashData: null,
      loadingEmployeeDash: true,
      employeeDashError: null,
    };

    render(<LeftContent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error when employee dashboard fails", () => {
    mocks.authState = {
      employeeDashData: null,
      loadingEmployeeDash: false,
      employeeDashError: "Failed to load employee",
    };

    render(<LeftContent />);

    expect(
      screen.getByText("Error: Failed to load employee"),
    ).toBeInTheDocument();
  });

  it("uses fallback values when employee data is missing", () => {
    mocks.authState = {
      employeeDashData: {},
      loadingEmployeeDash: false,
      employeeDashError: null,
    };

    render(<LeftContent />);

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("00:00").length).toBeGreaterThan(0);
  });

  it("uses placeholder image when profile picture is missing", () => {
    mocks.authState = {
      employeeDashData: {
        name: "Jane Doe",
        designation: "Manager",
        email: "jane@example.com",
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    };

    render(<LeftContent />);

    const profileImage = screen.getByAltText("profile");

    expect(profileImage).toHaveAttribute(
      "src",
      "https://via.placeholder.com/120",
    );
  });

  it("uses profile image when profile picture exists", () => {
    render(<LeftContent />);

    const profileImage = screen.getByAltText("profile");

    expect(profileImage).toHaveAttribute(
      "src",
      "https://example.com/media/profile.jpg",
    );
  });

  it("renders zero salary when basic salary is missing", () => {
    mocks.authState = {
      employeeDashData: {
        ...mockEmployee,
        bank_details: {},
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    };

    render(<LeftContent />);

    expect(screen.getByRole("button", { name: /Salary/i })).toBeInTheDocument();
  });

  it("renders zero values when leave summary is missing", () => {
    mocks.authState = {
      employeeDashData: {
        ...mockEmployee,
        leave_summary: undefined,
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    };

    render(<LeftContent />);

    expect(screen.getAllByText("Pending Leave").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Leaves Taken").length).toBeGreaterThan(0);
  });

  it("renders fallback attendance values when attendance summary is missing", () => {
    mocks.authState = {
      employeeDashData: {
        ...mockEmployee,
        attendance_summary: undefined,
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    };

    render(<LeftContent />);

    expect(screen.getByText("Monthly Days:")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("00:00").length).toBeGreaterThan(0);
  });
});

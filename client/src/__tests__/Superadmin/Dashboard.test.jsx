import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../../Pages/SuperAdmin/Superadmin_Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanyOverview } from "../../Redux/superAdminSlice";

// -------------------- Mock Redux --------------------

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

// -------------------- Mock Router --------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => (
      <a href={to} data-testid="company-link">
        {children}
      </a>
    ),
  };
});

// -------------------- Mock Components --------------------

vi.mock("../../Components/Navbar", () => ({
  default: () => <div>Navbar</div>,
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loading...</div>,
}));

// -------------------- Mock Redux Action --------------------

vi.mock("../../Redux/superAdminSlice", () => ({
  getCompanyOverview: vi.fn(() => ({
    type: "GET_COMPANY_OVERVIEW",
  })),
}));

describe("Dashboard", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
  });

  it("shows loader when loading", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: true,
          overview: {},
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("dispatches getCompanyOverview on mount", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            companies: [],
            unpaid_companies: [],
            total_companies: 0,
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(dispatch).toHaveBeenCalled();
    expect(getCompanyOverview).toHaveBeenCalled();
  });

  it("renders dashboard heading", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            companies: [],
            unpaid_companies: [],
            total_companies: 0,
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Unifying Teams. Simplifying Operations"),
    ).toBeInTheDocument();
  });

  it("renders company cards", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            total_companies: 1,
            companies: [
              {
                id: 1,
                name: "ABC Pvt Ltd",
                company_id: "CMP001",
                logo_url: "/logo.png",
              },
            ],
            unpaid_companies: [],
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("ABC Pvt Ltd")).toBeInTheDocument();
    expect(screen.getByText("CMP001")).toBeInTheDocument();
  });

  it("renders default logo when logo_url is missing", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            total_companies: 1,
            companies: [
              {
                id: 1,
                name: "ABC",
                company_id: "123",
                logo_url: null,
              },
            ],
            unpaid_companies: [],
          },
        },
      }),
    );

    render(<Dashboard />);

    const image = screen.getByAltText("ABC");

    expect(image).toHaveAttribute("src", "/default-logo.png");
  });

  it("renders total companies count", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            total_companies: 5,
            companies: [],
            unpaid_companies: [],
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders payment table", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            total_companies: 0,
            companies: [],
            unpaid_companies: [
              {
                id: 1,
                name: "XYZ Company",
                address: "Kochi",
                company_id: "CMP009",
                contact_number: "9999999999",
                number_of_employees: 50,
                next_due_date: "2026-09-01",
              },
            ],
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("XYZ Company")).toBeInTheDocument();
    expect(screen.getByText("Kochi")).toBeInTheDocument();
    expect(screen.getByText("9999999999")).toBeInTheDocument();
  });

  it("navigates when payment row is clicked", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            companies: [],
            total_companies: 0,
            unpaid_companies: [
              {
                id: 10,
                name: "XYZ Company",
                address: "Kochi",
                company_id: "CMP100",
                contact_number: "9999999999",
                number_of_employees: 20,
                next_due_date: "2026-09-01",
              },
            ],
          },
        },
      }),
    );

    render(<Dashboard />);

    fireEvent.click(screen.getByText("XYZ Company"));

    expect(mockNavigate).toHaveBeenCalledWith("/superadmin/view/10");
  });

  it("renders company link correctly", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            total_companies: 1,
            companies: [
              {
                id: 22,
                name: "Google",
                company_id: "GO001",
                logo_url: "/logo.png",
              },
            ],
            unpaid_companies: [],
          },
        },
      }),
    );

    render(<Dashboard />);

    const link = screen.getByTestId("company-link");

    expect(link).toHaveAttribute("href", "/superadmin/view/22");
  });

  it("shows placeholder when due date is missing", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          overview: {
            companies: [],
            total_companies: 0,
            unpaid_companies: [
              {
                id: 1,
                name: "ABC",
                address: "Delhi",
                company_id: "C001",
                contact_number: "9876543210",
                number_of_employees: 25,
                next_due_date: null,
              },
            ],
          },
        },
      }),
    );

    render(<Dashboard />);

    expect(screen.getByText("-----")).toBeInTheDocument();
  });
});

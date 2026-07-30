import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../../Pages/superAdmin/Superadmin_Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { getCompanyOverview } from "../../Redux/superAdminSlice";

// Mock redux
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock action
jest.mock("../../Redux/superAdminSlice", () => ({
  getCompanyOverview: jest.fn(() => ({
    type: "superAdmin/getCompanyOverview",
  })),
}));

// Mock Navbar
jest.mock("../../Components/Navbar", () => () => <div>Navbar</div>);

// Mock Loader
jest.mock("../../Components/Loader", () => () => <div>Loading...</div>);

// Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Dashboard Component", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  test("dispatches getCompanyOverview on mount", () => {
    useSelector.mockReturnValue({
      loading: false,
      overview: {
        total_companies: 0,
        companies: [],
        unpaid_companies: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(dispatch).toHaveBeenCalledWith(getCompanyOverview());
  });

  test("shows loader while loading", () => {
    useSelector.mockReturnValue({
      loading: true,
      overview: {},
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders company information", () => {
    useSelector.mockReturnValue({
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
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("ABC Pvt Ltd")).toBeInTheDocument();
    expect(screen.getByText("CMP001")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("renders unpaid companies table", () => {
    useSelector.mockReturnValue({
      loading: false,
      overview: {
        total_companies: 0,
        companies: [],
        unpaid_companies: [
          {
            id: 2,
            name: "XYZ Ltd",
            address: "New York",
            company_id: "CMP002",
            contact_number: "9999999999",
            number_of_employees: 100,
            next_due_date: "2026-08-01",
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText("XYZ Ltd")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("CMP002")).toBeInTheDocument();
    expect(screen.getByText("9999999999")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("2026-08-01")).toBeInTheDocument();
  });

  test("navigates when payment row is clicked", () => {
    useSelector.mockReturnValue({
      loading: false,
      overview: {
        total_companies: 0,
        companies: [],
        unpaid_companies: [
          {
            id: 5,
            name: "Demo Company",
            address: "London",
            company_id: "CMP100",
            contact_number: "1234567890",
            number_of_employees: 50,
            next_due_date: "2026-09-01",
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Demo Company"));

    expect(mockNavigate).toHaveBeenCalledWith("/superadmin/view/5");
  });

  test("renders default due date when next_due_date is null", () => {
    useSelector.mockReturnValue({
      loading: false,
      overview: {
        total_companies: 0,
        companies: [],
        unpaid_companies: [
          {
            id: 8,
            name: "Test Company",
            address: "Dubai",
            company_id: "CMP500",
            contact_number: "9876543210",
            number_of_employees: 10,
            next_due_date: null,
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText("-----")).toBeInTheDocument();
  });
});

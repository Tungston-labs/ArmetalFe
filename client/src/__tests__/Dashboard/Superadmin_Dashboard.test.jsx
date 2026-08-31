import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../Pages/superAdmin/Superadmin_Dashboard";
import { getCompanyOverview } from "../../Redux/superAdminSlice";

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/superAdminSlice", () => ({
  getCompanyOverview: vi.fn(),
}));

vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../Components/Navbar/SuperAdmin/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock styled components
vi.mock("../../Pages/superAdmin/Superadmin_Dashboard.Styles", () => {
  const passthrough = (tag) => (props) =>
    React.createElement(tag, props, props.children);
  return {
    DashboardWrapper: passthrough("div"),
    Header: passthrough("div"),
    Title: passthrough("h1"),
    Subtitle: passthrough("p"),
    BlueBanner: passthrough("div"),
    BannerHeader: passthrough("div"),
    CardContainer: passthrough("div"),
    CompanyCard: passthrough("div"),
    CardTitle: passthrough("span"),
    CardSubtitle: passthrough("span"),
    TableSection: passthrough("div"),
    TableHeader: passthrough("div"),
    TableWrapper: passthrough("div"),
    StyledTable: passthrough("table"),
    CardContent: passthrough("div"),
    CompanyLogo: (props) => <img alt="logo" {...props} />,
    CardSlider: passthrough("div"),
    TopBar: passthrough("div"),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Superadmin_Dashboard", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test("shows loader when loading is true", () => {
    useSelector.mockReturnValue({
      overview: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("dispatches getCompanyOverview on mount", () => {
    useSelector.mockReturnValue({
      overview: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(mockDispatch).toHaveBeenCalledWith(getCompanyOverview());
  });

  test("renders overview data, companies, and unpaid payments list correctly", () => {
    const mockOverview = {
      total_companies: 2,
      companies: [
        { id: 1, name: "Tesla", company_id: "tesla1", logo_url: "tesla.png" },
        { id: 2, name: "SpaceX", company_id: "spacex1", logo_url: "" },
      ],
      unpaid_companies: [
        {
          id: 1,
          name: "Tesla",
          address: "Austin, Texas",
          company_id: "tesla1",
          contact_number: "+123456",
          number_of_employees: 50,
          next_due_date: "2026-09-01",
        },
      ],
    };

    useSelector.mockReturnValue({
      overview: mockOverview,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verify company banner count
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("Tesla")[0]).toBeInTheDocument();
    expect(screen.getByText("SpaceX")).toBeInTheDocument();

    // Verify unpaid count
    expect(screen.getByText("1")).toBeInTheDocument();

    // Verify table row
    expect(screen.getByText("Austin, Texas")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("2026-09-01")).toBeInTheDocument();
  });

  test("navigates to company details view when table row is clicked", () => {
    const mockOverview = {
      total_companies: 1,
      companies: [{ id: 10, name: "Tesla", company_id: "tesla1" }],
      unpaid_companies: [
        {
          id: 10,
          name: "Tesla",
          address: "Austin, Texas",
          company_id: "tesla1",
          contact_number: "+123456",
          number_of_employees: 50,
          next_due_date: "2026-09-01",
        },
      ],
    };

    useSelector.mockReturnValue({
      overview: mockOverview,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const row = screen.getByText("Austin, Texas").closest("tr");
    fireEvent.click(row);

    expect(mockNavigate).toHaveBeenCalledWith("/superadmin/view/10");
  });
});

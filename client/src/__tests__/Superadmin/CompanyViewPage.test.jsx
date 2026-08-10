import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CompanyViewPage from "../../Pages/superAdmin/Viewpage";
import {
  getCompanyById,
  clearSelectedCompany,
  updateCompanyStatusThunk,
} from "../../Redux/superAdminSlice";

// Mock React Router DOM hooks
const mockNavigate = vi.fn();
const mockParams = { id: "123" };

vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

// Mock child components
vi.mock("../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../Components/Plan", () => ({
  default: () => <div data-testid="plan-component">Plan Details</div>,
}));

// Mock Redux Thunks
vi.mock("../../Redux/superAdminSlice", () => ({
  getCompanyById: vi.fn((id) => ({
    type: "superAdmin/getCompanyById",
    payload: id,
  })),
  clearSelectedCompany: vi.fn(() => ({
    type: "superAdmin/clearSelectedCompany",
  })),
  updateCompanyStatusThunk: vi.fn(),
}));

// Helper function to render component wrapped in a Redux store with async thunk dispatch mock support
const renderWithStore = (initialState, dispatchOverride) => {
  const reducer = (state = initialState.superAdmin, action) => {
    switch (action.type) {
      case "superAdmin/clearSelectedCompany":
        return {
          ...state,
          selectedCompany: null,
        };
      default:
        return state;
    }
  };

  const store = configureStore({
    reducer: {
      superAdmin: reducer,
    },
  });

  if (dispatchOverride) {
    store.dispatch = dispatchOverride;
  } else {
    const originalDispatch = store.dispatch;
    store.dispatch = vi.fn((action) => {
      const result = originalDispatch(action);
      return {
        ...result,
        unwrap: () => Promise.resolve({ success: true }),
      };
    });
  }

  return {
    store,
    ...render(
      <Provider store={store}>
        <CompanyViewPage />
      </Provider>,
    ),
  };
};

describe("CompanyViewPage Component (Vitest)", () => {
  const mockCompanyActive = {
    id: "123",
    name: "Acme Corp",
    address: "123 Tech Park",
    email: "contact@acme.com",
    location: "New York",
    contact_number: "+1234567890",
    number_of_employees: 50,
    amount_per_employee: 10,
    initial_payment: 500,
    latitude: "40.7128",
    longitude: "-74.0060",
    is_active: true,
    logo: "http://example.com/logo.png",
    modules: {
      dashboard: true,
      employee: true,
      department: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("should render Loader when selectedCompany is null", () => {
    renderWithStore({
      superAdmin: { selectedCompany: null },
    });

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(getCompanyById).toHaveBeenCalledWith("123");
  });

  it("should dispatch clearSelectedCompany on unmount", () => {
    const { unmount } = renderWithStore({
      superAdmin: { selectedCompany: mockCompanyActive },
    });

    unmount();
    expect(clearSelectedCompany).toHaveBeenCalled();
  });

  it("should navigate back to /company when left arrow is clicked", () => {
    renderWithStore({
      superAdmin: { selectedCompany: mockCompanyActive },
    });

    fireEvent.click(screen.getByTestId("back-arrow"));

    expect(mockNavigate).toHaveBeenCalledWith("/company");
  });

  it("should render active company details, logo, and modules correctly", () => {
    renderWithStore({
      superAdmin: { selectedCompany: mockCompanyActive },
    });

    expect(screen.getByText("Company Active")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme Corp")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Tech Park")).toBeInTheDocument();
    expect(screen.getByDisplayValue("contact@acme.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("40.7128")).toBeInTheDocument();
    expect(screen.getByDisplayValue("-74.0060")).toBeInTheDocument();

    // Check Logo image
    const logoImg = screen.getByAltText("Company Logo");
    expect(logoImg).toHaveAttribute("src", "http://example.com/logo.png");

    // Check Module Checkboxes
    const dashboardCheckbox = screen.getByLabelText("Dashboard");
    const departmentCheckbox = screen.getByLabelText("Department");
    expect(dashboardCheckbox).toBeChecked();
    expect(departmentCheckbox).not.toBeChecked();

    // Check Child Plan Component
    expect(screen.getByTestId("plan-component")).toBeInTheDocument();
  });

  it("should render fallback values when amount_per_employee, initial_payment, or logo are missing", () => {
    const mockCompanyWithoutOptionals = {
      ...mockCompanyActive,
      amount_per_employee: null,
      initial_payment: undefined,
      logo: null,
    };

    renderWithStore({
      superAdmin: { selectedCompany: mockCompanyWithoutOptionals },
    });

    // Check fallback amounts default to "0"
    const inputs = screen.getAllByRole("textbox");
    const amountInput = inputs.find((input) => input.value === "0");
    expect(amountInput).toBeInTheDocument();

    // Check logo fallback text
    expect(screen.getByText("No logo uploaded")).toBeInTheDocument();
  });

  it("should render 'Company Blocked' when company is inactive", () => {
    const blockedCompany = { ...mockCompanyActive, is_active: false };

    renderWithStore({
      superAdmin: { selectedCompany: blockedCompany },
    });

    expect(screen.getByText("Company Blocked")).toBeInTheDocument();
    const switchCheckbox = screen.getAllByRole("checkbox")[0];
    expect(switchCheckbox).toBeChecked(); // isBlocked = !is_active -> true
  });

  it("should successfully freeze company when switch is checked", async () => {
    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });

    renderWithStore(
      { superAdmin: { selectedCompany: mockCompanyActive } },
      mockDispatch,
    );

    const switchInput = screen.getAllByRole("checkbox")[0];
    expect(switchInput).not.toBeChecked();

    fireEvent.click(switchInput);

    await waitFor(() => {
      expect(updateCompanyStatusThunk).toHaveBeenCalledWith({
        companyId: "123",
        action: "freeze",
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(screen.getByText("Company Blocked")).toBeInTheDocument();
  });

  it("should successfully unfreeze company when switch is unchecked", async () => {
    const blockedCompany = {
      ...mockCompanyActive,
      is_active: false,
    };

    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });

    renderWithStore(
      { superAdmin: { selectedCompany: blockedCompany } },
      mockDispatch,
    );

    const switchInput = screen.getAllByRole("checkbox")[0];
    expect(switchInput).toBeChecked();

    fireEvent.click(switchInput);

    await waitFor(() => {
      expect(updateCompanyStatusThunk).toHaveBeenCalledWith({
        companyId: "123",
        action: "unfreeze",
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(screen.getByText("Company Active")).toBeInTheDocument();
  });

  it("should revert status state and alert on thunk failure", async () => {
    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("API Error")),
    });

    renderWithStore(
      { superAdmin: { selectedCompany: mockCompanyActive } },
      mockDispatch,
    );

    const switchInput = screen.getAllByRole("checkbox")[0];

    fireEvent.click(switchInput);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to update company status",
      );
    });

    expect(screen.getByText("Company Active")).toBeInTheDocument();
  });
});

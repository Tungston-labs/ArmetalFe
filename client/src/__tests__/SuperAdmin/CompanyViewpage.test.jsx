import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompanyViewPage from "../../Pages/superAdmin/Viewpage";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyById,
  clearSelectedCompany,
  updateCompanyStatusThunk,
} from "../../Redux/superAdminSlice";

// -------------------- MOCKS --------------------

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../Redux/superAdminSlice", () => ({
  getCompanyById: jest.fn((id) => ({
    type: "GET_COMPANY",
    payload: id,
  })),
  clearSelectedCompany: jest.fn(() => ({
    type: "CLEAR_COMPANY",
  })),
  updateCompanyStatusThunk: jest.fn(),
}));

jest.mock("../../Components/Loader", () => () => (
  <div>Loading...</div>
));

jest.mock("../../Components/Plan", () => () => (
  <div>Plan Component</div>
));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    id: "1",
  }),
}));

// -------------------- TEST DATA --------------------

const company = {
  id: 1,
  name: "ABC Technologies",
  address: "New York",
  email: "abc@test.com",
  amount_per_employee: 150,
  initial_payment: 5000,
  location: "USA",
  contact_number: "9999999999",
  number_of_employees: 50,
  latitude: "10.123",
  longitude: "76.456",
  logo: "logo.png",
  is_active: true,
  modules: {
    dashboard: true,
    employee: true,
    payroll: true,
  },
};

describe("CompanyViewPage", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(dispatch);

    useSelector.mockImplementation((selector) =>
      selector({
        superAdmin: {
          selectedCompany: company,
        },
      })
    );
  });

  test("dispatches getCompanyById on mount", () => {
    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(dispatch).toHaveBeenCalledWith(
      getCompanyById("1")
    );
  });

  test("dispatches clearSelectedCompany on unmount", () => {
    const { unmount } = render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    unmount();

    expect(dispatch).toHaveBeenCalledWith(
      clearSelectedCompany()
    );
  });

  test("shows loader when company is null", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        superAdmin: {
          selectedCompany: null,
        },
      })
    );

    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders company details", () => {
    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue("ABC Technologies")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
    expect(screen.getByDisplayValue("abc@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("150")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  test("renders company logo", () => {
    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(screen.getByAltText("Company Logo")).toBeInTheDocument();
  });

  test("shows no logo uploaded message", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        superAdmin: {
          selectedCompany: {
            ...company,
            logo: null,
          },
        },
      })
    );

    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(
      screen.getByText("No logo uploaded")
    ).toBeInTheDocument();
  });

  test("renders privileges", () => {
    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Dashboard/i)).toBeChecked();
    expect(screen.getByLabelText(/Employee/i)).toBeChecked();
    expect(screen.getByLabelText(/Payroll/i)).toBeChecked();
  });

  test("back button navigates to company list", () => {
    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    const backButton = document.querySelector("svg");

    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/company");
  });

  test("updates company status successfully", async () => {
    dispatch.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });

    updateCompanyStatusThunk.mockReturnValue({
      type: "UPDATE_STATUS",
    });

    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(updateCompanyStatusThunk).toHaveBeenCalled();
    });
  });

  test("handles update status failure", async () => {
    window.alert = jest.fn();

    dispatch.mockReturnValue({
      unwrap: () => Promise.reject("Error"),
    });

    updateCompanyStatusThunk.mockReturnValue({
      type: "UPDATE_STATUS",
    });

    render(
      <BrowserRouter>
        <CompanyViewPage />
      </BrowserRouter>
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to update company status"
      );
    });
  });
});
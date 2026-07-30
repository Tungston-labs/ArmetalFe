import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddCompanyModal from "../";
import { useAddCompany } from "./useAddCompany";

jest.mock("./useAddCompany");

describe("AddCompanyModal Component", () => {
  const mockOnClose = jest.fn();

  const mockHook = {
    formData: {
      name: "",
      address: "",
      email: "",
      amount_per_employee: "",
      initial_payment: "",
      logo: null,
      location: "",
      contact_number: "",
      country_code: "+91",
      country: "",
      latitude: "",
      longitude: "",
      modules: [],
      basic_salary_percent: "",
      house_allowance_percent: "",
      transport_allowance_percent: "",
      special_allowance_percent: "",
      working_hours_per_day: "",
      half_day_hours: "",
    },
    formErrors: {},
    fileInputRef: { current: null },
    logoPreview: null,
    isSubmitting: false,
    handleChange: jest.fn(),
    handleModuleChange: jest.fn(),
    handleLogoChange: jest.fn(),
    removeLogo: jest.fn(),
    handleSubmit: jest.fn((e) => e.preventDefault()),
    totalPercent: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAddCompany.mockReturnValue(mockHook);
  });

  test("renders Add Company heading", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);
    expect(screen.getByText("Add Company")).toBeInTheDocument();
  });

  test("renders Edit Company heading", () => {
    render(<AddCompanyModal onClose={mockOnClose} isEdit={true} />);

    expect(screen.getByText("Edit Company")).toBeInTheDocument();
  });

  test("renders all required input fields", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    expect(screen.getByPlaceholderText("Company name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company E-mail")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter amount per employee"),
    ).toBeInTheDocument();
  });

  test("calls handleChange when typing company name", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText("Company name"), {
      target: {
        value: "ABC Company",
      },
    });

    expect(mockHook.handleChange).toHaveBeenCalled();
  });

  test("calls onClose when Cancel button clicked", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls handleSubmit on form submit", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Save"));

    expect(mockHook.handleSubmit).toHaveBeenCalled();
  });

  test("renders privilege checkboxes", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  test("calls handleModuleChange when privilege selected", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    fireEvent.click(screen.getByLabelText(/Dashboard/i));

    expect(mockHook.handleModuleChange).toHaveBeenCalled();
  });

  test("shows Update button in edit mode", () => {
    render(<AddCompanyModal onClose={mockOnClose} isEdit={true} />);

    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  test("shows Saving... while submitting", () => {
    useAddCompany.mockReturnValue({
      ...mockHook,
      isSubmitting: true,
    });

    render(<AddCompanyModal onClose={mockOnClose} />);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  test("shows Updating... while editing and submitting", () => {
    useAddCompany.mockReturnValue({
      ...mockHook,
      isSubmitting: true,
    });

    render(<AddCompanyModal onClose={mockOnClose} isEdit={true} />);

    expect(screen.getByText("Updating...")).toBeInTheDocument();
  });

  test("displays validation error", () => {
    useAddCompany.mockReturnValue({
      ...mockHook,
      formErrors: {
        name: "Company name is required",
      },
    });

    render(<AddCompanyModal onClose={mockOnClose} />);

    expect(screen.getByText("Company name is required")).toBeInTheDocument();
  });

  test("shows total salary percentage", () => {
    render(<AddCompanyModal onClose={mockOnClose} />);

    expect(screen.getByText("100 %")).toBeInTheDocument();
  });

  test("hides privilege section when showPrivileges=false", () => {
    render(<AddCompanyModal onClose={mockOnClose} showPrivileges={false} />);

    expect(screen.queryByText("Privileges")).not.toBeInTheDocument();
  });
});

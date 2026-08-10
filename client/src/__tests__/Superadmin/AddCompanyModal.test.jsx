import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddCompanyModal from "../../Pages/superAdmin/AddCompany";
import { useAddCompany } from "../../Pages/superAdmin/useAddCompany";

vi.mock("../../Pages/superAdmin/useAddCompany", () => ({
  useAddCompany: vi.fn(),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("react-icons/go", () => ({
  GoArrowLeft: (props) => (
    <svg data-testid="back-icon" {...props}></svg>
  ),
}));

vi.mock("react-icons/fi", () => ({
  FiUpload: () => <svg />,
}));

vi.mock("react-icons/ai", () => ({
  AiOutlineClose: () => <svg />,
}));

describe("AddCompanyModal", () => {
  const onClose = vi.fn();

  const hookData = {
    formData: {
      name: "",
      address: "",
      email: "",
      location: "",
      country: "",
      country_code: "+91",
      contact_number: "",
      latitude: "",
      longitude: "",
      logo: null,
      modules: [],
      amount_per_employee: "",
      initial_payment: "",
      basic_salary_percent: "",
      house_allowance_percent: "",
      transport_allowance_percent: "",
      special_allowance_percent: "",
      working_hours_per_day: "",
      half_day_hours: "",
    },

    formErrors: {},

    fileInputRef: {
      current: {
        click: vi.fn(),
      },
    },

    logoPreview: null,

    isSubmitting: false,

    handleChange: vi.fn(),

    handleModuleChange: vi.fn(),

    handleLogoChange: vi.fn(),

    removeLogo: vi.fn(),

    handleSubmit: vi.fn((e) => e.preventDefault()),

    totalPercent: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useAddCompany.mockReturnValue(hookData);
  });

  it("renders Add Company title", () => {
    render(<AddCompanyModal onClose={onClose} />);

    expect(screen.getByText("Add Company")).toBeInTheDocument();
  });

  it("renders Edit Company title", () => {
    render(
      <AddCompanyModal
        onClose={onClose}
        isEdit
      />,
    );

    expect(screen.getByText("Edit Company")).toBeInTheDocument();
  });

  it("calls onClose when back arrow clicked", () => {
    render(<AddCompanyModal onClose={onClose} />);

    fireEvent.click(screen.getByTestId("back-icon"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Cancel clicked", () => {
    render(<AddCompanyModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders all company fields", () => {
    render(<AddCompanyModal onClose={onClose} />);

    expect(screen.getByPlaceholderText("Company name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Company Address")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Company E-mail")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter amount per employee"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter advance amount (optional)"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Location"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Phone number"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter company latitude"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter company longitude"),
    ).toBeInTheDocument();
  });

  it("calls handleChange when typing", () => {
    render(<AddCompanyModal onClose={onClose} />);

    fireEvent.change(
      screen.getByPlaceholderText("Company name"),
      {
        target: {
          value: "ABC Company",
        },
      },
    );

    expect(hookData.handleChange).toHaveBeenCalled();
  });

  it("renders privilege section", () => {
    render(<AddCompanyModal onClose={onClose} />);

    expect(
      screen.getByText("Privileges"),
    ).toBeInTheDocument();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.getByText("Employee")).toBeInTheDocument();

    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("does not render privilege section", () => {
    render(
      <AddCompanyModal
        onClose={onClose}
        showPrivileges={false}
      />,
    );

    expect(
      screen.queryByText("Privileges"),
    ).not.toBeInTheDocument();
  });

  it("calls handleModuleChange", () => {
    render(<AddCompanyModal onClose={onClose} />);

    fireEvent.click(screen.getByLabelText("Dashboard"));

    expect(hookData.handleModuleChange).toHaveBeenCalled();
  });
});
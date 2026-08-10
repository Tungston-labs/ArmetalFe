// import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useAddCompany } from "../../Pages/superAdmin/useAddCompany";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";

// Mock React-Redux
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

// Mock SweetAlert2
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock Redux Async Actions
vi.mock("../../Redux/superAdminSlice", () => ({
  addCompany: vi.fn(),
  editCompany: vi.fn(),
}));

describe("useAddCompany Custom Hook (Vitest)", () => {
  let mockDispatch;
  const mockOnClose = vi.fn();
  const mockAllModules = ["Payroll", "HR", "Attendance"];

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch = vi.fn();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);

    // Mock window / global URL methods for file handling
    globalThis.URL.createObjectURL = vi.fn(() => "mocked-blob-url");
  });

  const validCompanyData = {
    name: "Acme Corp",
    address: "123 Main St",
    email: "test@company.com",
    location: "Dubai",
    country: "UAE",
    country_code: "+971",
    contact_number: "501234567",
    amount_per_employee: "100",
    latitude: "25.2048",
    longitude: "55.2708",
    basic_salary_percent: "50",
    house_allowance_percent: "20",
    transport_allowance_percent: "15",
    special_allowance_percent: "15",
    working_hours_per_day: "8",
    half_day_hours: "4",
    modules: ["Payroll"],
  };

  it("should initialize with default empty form state", () => {
    const { result } = renderHook(() =>
      useAddCompany({
        isEdit: false,
        selectedCompany: null,
        onClose: mockOnClose,
        allModules: mockAllModules,
      }),
    );

    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.country_code).toBe("+971");
    expect(result.current.logoPreview).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should populate form state when editing a selected company with matched country code", () => {
    const selectedCompany = {
      id: "123",
      name: "Existing Co",
      address: "456 Side St",
      email: "info@existing.com",
      location: "Riyadh",
      country: "KSA",
      contact_number: "+966509876543",
      modules: { Payroll: true },
      logo: "http://example.com/logo.png",
      latitude: 24.7136,
      longitude: 46.6753,
      amount_per_employee: 150,
      initial_payment: 500,
      basic_salary_percent: 40,
      house_allowance_percent: 30,
      transport_allowance_percent: 15,
      special_allowance_percent: 15,
      working_hours_per_day: 9,
      half_day_hours: 4.5,
    };

    const { result } = renderHook(() =>
      useAddCompany({
        isEdit: true,
        selectedCompany,
        onClose: mockOnClose,
        allModules: mockAllModules,
      }),
    );

    expect(result.current.formData.name).toBe("Existing Co");
    expect(result.current.formData.country_code).toBe("+966");
    expect(result.current.formData.contact_number).toBe("509876543");
    expect(result.current.formData.modules).toEqual(["Payroll"]);
    expect(result.current.logoPreview).toBe("http://example.com/logo.png");
  });

  it("should handle nullish/unmatched country code fallbacks during edit mode", () => {
    const selectedCompany = {
      id: "124",
      contact_number: "9876543210", // Unmatched country code
    };

    const { result } = renderHook(() =>
      useAddCompany({
        isEdit: true,
        selectedCompany,
        onClose: mockOnClose,
        allModules: null,
      }),
    );

    expect(result.current.formData.country_code).toBe("+971");
    expect(result.current.formData.contact_number).toBe("9876543210");
    expect(result.current.formData.modules).toEqual([]);
    expect(result.current.logoPreview).toBeNull();
  });

  it("should update input state on handleChange call", () => {
    const { result } = renderHook(() =>
      useAddCompany({
        isEdit: false,
        selectedCompany: null,
        onClose: mockOnClose,
        allModules: mockAllModules,
      }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "New Corp" },
      });
    });

    expect(result.current.formData.name).toBe("New Corp");
  });

  it("should toggle modules on and off using handleModuleChange", () => {
    const { result } = renderHook(() =>
      useAddCompany({
        isEdit: false,
        selectedCompany: null,
        onClose: mockOnClose,
        allModules: mockAllModules,
      }),
    );

    act(() => {
      result.current.handleModuleChange("Payroll");
    });
    expect(result.current.formData.modules).toEqual(["Payroll"]);

    act(() => {
      result.current.handleModuleChange("Payroll");
    });
    expect(result.current.formData.modules).toEqual([]);
  });

  describe("Logo File Handling", () => {
    it("should exit early if handleLogoChange is triggered without a file", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleLogoChange({ target: { files: [] } });
      });

      expect(result.current.logoPreview).toBeNull();
    });

    it("should show SweetAlert error for unsupported file extensions", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      const invalidFile = new File(["dummy"], "doc.pdf", {
        type: "application/pdf",
      });

      act(() => {
        result.current.handleLogoChange({ target: { files: [invalidFile] } });
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        "Invalid file",
        "Only PNG or SVG allowed",
        "error",
      );
    });

    it("should show SweetAlert error for files exceeding 2MB", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      const largeFile = new File([""], "logo.png", { type: "image/png" });
      Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1024 });

      act(() => {
        result.current.handleLogoChange({ target: { files: [largeFile] } });
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        "File too large",
        "Logo must be under 2MB",
        "error",
      );
    });

    it("should accept valid PNG/SVG images and update preview", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      const validFile = new File(["dummy"], "logo.png", { type: "image/png" });
      Object.defineProperty(validFile, "size", { value: 1 * 1024 * 1024 });

      act(() => {
        result.current.handleLogoChange({ target: { files: [validFile] } });
      });

      expect(result.current.formData.logo).toBe(validFile);
      expect(result.current.logoPreview).toBe("mocked-blob-url");
    });

    it("should clear logo state when removeLogo is invoked", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.removeLogo();
      });

      expect(result.current.formData.logo).toBeNull();
      expect(result.current.logoPreview).toBeNull();
    });
  });

  describe("Validation Scenarios", () => {
    it("should automatically set form error when total percent exceeds 100", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleChange({
          target: { name: "basic_salary_percent", value: "80" },
        });
        result.current.handleChange({
          target: { name: "house_allowance_percent", value: "30" },
        });
      });

      expect(result.current.formErrors.salary).toBe(
        "Total percentage cannot exceed 100%",
      );
    });

    it("should clear total percent error when values drop back to <= 100", () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleChange({
          target: { name: "basic_salary_percent", value: "50" },
        });
        result.current.handleChange({
          target: { name: "house_allowance_percent", value: "50" },
        });
      });

      expect(result.current.formErrors.salary).toBe("");
    });

    it("should fail validation on empty submit and set required error messages", async () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.formErrors.name).toBe("Company name is required");
      expect(result.current.formErrors.address).toBe("Address is required");
      expect(result.current.formErrors.email).toBe("Email is required");
      expect(result.current.formErrors.location).toBe("Location is required");
      expect(result.current.formErrors.amount_per_employee).toBe(
        "Amount per employee is required",
      );
      expect(result.current.formErrors.logo).toBe("Company logo is required");
      expect(result.current.formErrors.contact_number).toBe(
        "Contact number is required",
      );
      expect(result.current.formErrors.country).toBe("Please select a country");
      expect(result.current.formErrors.latitude).toBe("Latitude is required");
      expect(result.current.formErrors.longitude).toBe("Longitude is required");
      expect(result.current.formErrors.modules).toBe(
        "Select at least one module",
      );
      expect(result.current.formErrors.working_hours_per_day).toBe(
        "Working hours per day is required",
      );
      expect(result.current.formErrors.half_day_hours).toBe(
        "Half day hours is required",
      );
    });

    it("should validate specific invalid input formats and ranges", async () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleChange({ target: { name: "name", value: "A" } });
        result.current.handleChange({
          target: { name: "email", value: "not-an-email" },
        });
        result.current.handleChange({
          target: { name: "amount_per_employee", value: "-5" },
        });
        result.current.handleChange({
          target: { name: "country_code", value: "+91" },
        });
        result.current.handleChange({
          target: { name: "contact_number", value: "12345" },
        });
        result.current.handleChange({
          target: { name: "latitude", value: "95" },
        });
        result.current.handleChange({
          target: { name: "longitude", value: "190" },
        });
        result.current.handleChange({
          target: { name: "basic_salary_percent", value: "120" },
        });
        result.current.handleChange({
          target: { name: "working_hours_per_day", value: "25" },
        });
        result.current.handleChange({
          target: { name: "half_day_hours", value: "-2" },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.formErrors.name).toBe(
        "Company name must be at least 2 characters",
      );
      expect(result.current.formErrors.email).toBe(
        "Enter a valid email address",
      );
      expect(result.current.formErrors.amount_per_employee).toBe(
        "Enter a valid amount greater than 0",
      );
      expect(result.current.formErrors.contact_number).toBe(
        "Enter a valid 10-digit phone number",
      );
      expect(result.current.formErrors.latitude).toBe(
        "Latitude must be between -90 and 90",
      );
      expect(result.current.formErrors.longitude).toBe(
        "Longitude must be between -180 and 180",
      );
      expect(result.current.formErrors.basic_salary_percent).toBe(
        "Basic % must be between 0 and 100",
      );
      expect(result.current.formErrors.working_hours_per_day).toBe(
        "Working hours must be between 1 and 24",
      );
      expect(result.current.formErrors.half_day_hours).toBe(
        "Half day hours must be greater than 0",
      );
    });

    it("should validate non-+91 phone digits and ensure half_day_hours < working_hours_per_day", async () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleChange({
          target: { name: "country_code", value: "+971" },
        });
        result.current.handleChange({
          target: { name: "contact_number", value: "123" },
        });
        result.current.handleChange({
          target: { name: "working_hours_per_day", value: "8" },
        });
        result.current.handleChange({
          target: { name: "half_day_hours", value: "8" },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.formErrors.contact_number).toBe(
        "Enter a valid phone number (7–15 digits)",
      );
      expect(result.current.formErrors.half_day_hours).toBe(
        "Half day hours must be less than working hours per day",
      );
    });

    it("should flag salary total error if all salary percentage fields are valid but sum != 100%", async () => {
      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        result.current.handleChange({
          target: { name: "basic_salary_percent", value: "30" },
        });
        result.current.handleChange({
          target: { name: "house_allowance_percent", value: "20" },
        });
        result.current.handleChange({
          target: { name: "transport_allowance_percent", value: "10" },
        });
        result.current.handleChange({
          target: { name: "special_allowance_percent", value: "10" },
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.formErrors.salary).toBe(
        "Percentages must total 100% (currently 70%)",
      );
    });
  });

  describe("API Submission Operations", () => {
    it("should dispatch addCompany successfully on valid new company submission", async () => {
      const unwrapMock = vi.fn().mockResolvedValue({});
      mockDispatch.mockReturnValue({ unwrap: unwrapMock });

      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        Object.entries(validCompanyData).forEach(([key, value]) => {
          if (key === "modules") {
            result.current.handleModuleChange(value[0]);
          } else {
            result.current.handleChange({ target: { name: key, value } });
          }
        });
      });

      const validFile = new File(["dummy"], "logo.png", { type: "image/png" });
      act(() => {
        result.current.handleLogoChange({ target: { files: [validFile] } });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(addCompany).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        "Created!",
        "Company created successfully.",
        "success",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should dispatch editCompany successfully on valid edit submission", async () => {
      const unwrapMock = vi.fn().mockResolvedValue({});
      mockDispatch.mockReturnValue({ unwrap: unwrapMock });

      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: true,
          selectedCompany: {
            id: "company-101",
            logo: "http://example.com/logo.png",
          },
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        Object.entries(validCompanyData).forEach(([key, value]) => {
          if (key === "modules") {
            result.current.handleModuleChange(value[0]);
          } else {
            result.current.handleChange({ target: { name: key, value } });
          }
        });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(editCompany).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "company-101",
        }),
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        "Updated!",
        "Company updated successfully.",
        "success",
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should set duplicate email error when backend returns email collision", async () => {
      const apiError = {
        response: {
          data: {
            email: "Email already exists",
          },
        },
      };

      const unwrapMock = vi.fn().mockRejectedValue(apiError);
      mockDispatch.mockReturnValue({ unwrap: unwrapMock });

      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        Object.entries(validCompanyData).forEach(([key, value]) => {
          if (key === "modules") {
            result.current.handleModuleChange(value[0]);
          } else {
            result.current.handleChange({ target: { name: key, value } });
          }
        });
      });

      const validFile = new File(["dummy"], "logo.png", { type: "image/png" });
      act(() => {
        result.current.handleLogoChange({ target: { files: [validFile] } });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.formErrors.email).toBe("Email already exists");
    });

    it("should present generic failure alert when request fails with unexpected error", async () => {
      const apiError = new Error("Network Disconnected");
      const unwrapMock = vi.fn().mockRejectedValue(apiError);
      mockDispatch.mockReturnValue({ unwrap: unwrapMock });

      const { result } = renderHook(() =>
        useAddCompany({
          isEdit: false,
          selectedCompany: null,
          onClose: mockOnClose,
          allModules: mockAllModules,
        }),
      );

      act(() => {
        Object.entries(validCompanyData).forEach(([key, value]) => {
          if (key === "modules") {
            result.current.handleModuleChange(value[0]);
          } else {
            result.current.handleChange({ target: { name: key, value } });
          }
        });
      });

      const validFile = new File(["dummy"], "logo.png", { type: "image/png" });
      act(() => {
        result.current.handleLogoChange({ target: { files: [validFile] } });
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    });
  });
});

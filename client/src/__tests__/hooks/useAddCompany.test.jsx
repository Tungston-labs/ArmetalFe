import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAddCompany } from "../../Pages/superAdmin/useAddCompany";
import Swal from "sweetalert2";

const dispatchMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

vi.mock("../../Redux/superAdminSlice", () => ({
  addCompany: vi.fn((payload) => ({
    type: "addCompany",
    payload,
  })),
  editCompany: vi.fn((payload) => ({
    type: "editCompany",
    payload,
  })),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

global.URL.createObjectURL = vi.fn(() => "blob:test");

describe("useAddCompany", () => {
  const props = {
    isEdit: false,
    selectedCompany: null,
    onClose: vi.fn(),
    allModules: ["attendance", "leave", "payroll"],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    dispatchMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
  });

  it("should initialize default values", () => {
    const { result } = renderHook(() => useAddCompany(props));

    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.country_code).toBe("+971");
    expect(result.current.logoPreview).toBe(null);
    expect(result.current.totalPercent).toBe(0);
  });

  it("should populate form in edit mode", async () => {
    const company = {
      id: 1,
      name: "ABC",
      address: "Dubai",
      email: "abc@test.com",
      location: "Dubai",
      country: "UAE",
      contact_number: "+919876543210",
      modules: {
        attendance: true,
      },
      latitude: "10",
      longitude: "20",
      logo: "logo.png",
      amount_per_employee: 100,
      initial_payment: 50,
      basic_salary_percent: 70,
      house_allowance_percent: 20,
      transport_allowance_percent: 5,
      special_allowance_percent: 5,
      working_hours_per_day: 8,
      half_day_hours: 4,
    };

    const { result } = renderHook(() =>
      useAddCompany({
        ...props,
        isEdit: true,
        selectedCompany: company,
      })
    );

    await waitFor(() => {
      expect(result.current.formData.name).toBe("ABC");
      expect(result.current.formData.country_code).toBe("+91");
      expect(result.current.formData.contact_number).toBe("9876543210");
      expect(result.current.logoPreview).toBe("logo.png");
    });
  });

  it("should update text field", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleChange({
        target: {
          name: "name",
          value: "My Company",
        },
      });
    });

    expect(result.current.formData.name).toBe("My Company");
  });

  it("should toggle module", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleModuleChange("attendance");
    });

    expect(result.current.formData.modules).toContain("attendance");

    act(() => {
      result.current.handleModuleChange("attendance");
    });

    expect(result.current.formData.modules).toEqual([]);
  });

  it("should accept valid logo", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["hello"], "logo.png", {
      type: "image/png",
    });

    act(() => {
      result.current.handleLogoChange({
        target: {
          files: [file],
        },
      });
    });

    expect(result.current.formData.logo).toEqual(file);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("should reject invalid file type", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["abc"], "test.jpg", {
      type: "image/jpeg",
    });

    act(() => {
      result.current.handleLogoChange({
        target: {
          files: [file],
        },
      });
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "Invalid file",
      "Only PNG or SVG allowed",
      "error"
    );
  });

  it("should reject large logo", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["a"], "logo.png", {
      type: "image/png",
    });

    Object.defineProperty(file, "size", {
      value: 3 * 1024 * 1024,
    });

    act(() => {
      result.current.handleLogoChange({
        target: {
          files: [file],
        },
      });
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "File too large",
      "Logo must be under 2MB",
      "error"
    );
  });

  it("should remove logo", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["a"], "logo.png", {
      type: "image/png",
    });

    act(() => {
      result.current.handleLogoChange({
        target: {
          files: [file],
        },
      });
    });

    act(() => {
      result.current.removeLogo();
    });

    expect(result.current.formData.logo).toBe(null);
    expect(result.current.logoPreview).toBe(null);
  });

  it("should fail validation for empty submit", async () => {
    const { result } = renderHook(() => useAddCompany(props));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      });
    });

    expect(result.current.formErrors.name).toBeDefined();
    expect(result.current.formErrors.email).toBeDefined();
    expect(result.current.formErrors.modules).toBeDefined();
  });

  it("should create company successfully", async () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["a"], "logo.png", {
      type: "image/png",
    });

    act(() => {
      result.current.handleLogoChange({
        target: { files: [file] },
      });
    });

    const values = {
      name: "ABC",
      address: "Dubai",
      email: "abc@test.com",
      location: "Dubai",
      country: "UAE",
      contact_number: "9876543210",
      amount_per_employee: "100",
      latitude: "10",
      longitude: "20",
      basic_salary_percent: "70",
      house_allowance_percent: "20",
      transport_allowance_percent: "5",
      special_allowance_percent: "5",
      working_hours_per_day: "8",
      half_day_hours: "4",
    };

    Object.entries(values).forEach(([name, value]) => {
      act(() => {
        result.current.handleChange({
          target: { name, value },
        });
      });
    });

    act(() => {
      result.current.handleModuleChange("attendance");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      });
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      "Created!",
      "Company created successfully.",
      "success"
    );
  });

  it("should update company successfully", async () => {
    dispatchMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    const company = {
      id: 10,
      name: "ABC",
      address: "Dubai",
      email: "abc@test.com",
      location: "Dubai",
      country: "UAE",
      contact_number: "+919876543210",
      modules: {
        attendance: true,
      },
      latitude: "10",
      longitude: "20",
      logo: "logo.png",
      amount_per_employee: 100,
      basic_salary_percent: 70,
      house_allowance_percent: 20,
      transport_allowance_percent: 5,
      special_allowance_percent: 5,
      working_hours_per_day: 8,
      half_day_hours: 4,
    };

    const { result } = renderHook(() =>
      useAddCompany({
        ...props,
        isEdit: true,
        selectedCompany: company,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      });
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      "Updated!",
      "Company updated successfully.",
      "success"
    );
  });

  it("should handle duplicate email error", async () => {
    dispatchMock.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        response: {
          data: {
            email: ["exists"],
          },
        },
      }),
    });

    const company = {
      id: 1,
      name: "ABC",
      address: "Dubai",
      email: "abc@test.com",
      location: "Dubai",
      country: "UAE",
      contact_number: "+919876543210",
      modules: { attendance: true },
      latitude: "10",
      longitude: "20",
      logo: "logo.png",
      amount_per_employee: 100,
      basic_salary_percent: 70,
      house_allowance_percent: 20,
      transport_allowance_percent: 5,
      special_allowance_percent: 5,
      working_hours_per_day: 8,
      half_day_hours: 4,
    };

    const { result } = renderHook(() =>
      useAddCompany({
        ...props,
        isEdit: true,
        selectedCompany: company,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      });
    });

    expect(result.current.formErrors.email).toBe("Email already exists");
  });

  it("should show generic api error", async () => {
    dispatchMock.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({}),
    });

    const company = {
      id: 1,
      name: "ABC",
      address: "Dubai",
      email: "abc@test.com",
      location: "Dubai",
      country: "UAE",
      contact_number: "+919876543210",
      modules: { attendance: true },
      latitude: "10",
      longitude: "20",
      logo: "logo.png",
      amount_per_employee: 100,
      basic_salary_percent: 70,
      house_allowance_percent: 20,
      transport_allowance_percent: 5,
      special_allowance_percent: 5,
      working_hours_per_day: 8,
      half_day_hours: 4,
    };

    const { result } = renderHook(() =>
      useAddCompany({
        ...props,
        isEdit: true,
        selectedCompany: company,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      });
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Error",
      text: "Something went wrong.",
    });
  });

  it("should detect salary percentage greater than 100", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleChange({
        target: {
          name: "basic_salary_percent",
          value: "80",
        },
      });

      result.current.handleChange({
        target: {
          name: "house_allowance_percent",
          value: "30",
        },
      });
    });

    expect(result.current.totalPercent).toBe(110);
  });
});
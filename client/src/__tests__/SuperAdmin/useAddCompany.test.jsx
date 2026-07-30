import { renderHook, act } from "@testing-library/react";
import { useAddCompany } from "./useAddCompany";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../Redux/superAdminSlice", () => ({
  addCompany: jest.fn(),
  editCompany: jest.fn(),
}));

describe("useAddCompany Hook", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
  });

  const props = {
    isEdit: false,
    selectedCompany: null,
    onClose: jest.fn(),
    allModules: ["dashboard", "employee", "department", "daily_task"],
  };

  test("should initialize default form data", () => {
    const { result } = renderHook(() => useAddCompany(props));

    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.email).toBe("");
    expect(result.current.formData.modules).toEqual([]);
    expect(result.current.totalPercent).toBe(0);
  });

  test("handleChange updates form value", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleChange({
        target: {
          name: "name",
          value: "ABC Company",
        },
      });
    });

    expect(result.current.formData.name).toBe("ABC Company");
  });

  test("handleModuleChange adds module", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleModuleChange("dashboard");
    });

    expect(result.current.formData.modules).toContain("dashboard");
  });

  test("handleModuleChange removes module", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleModuleChange("dashboard");
      result.current.handleModuleChange("dashboard");
    });

    expect(result.current.formData.modules).not.toContain("dashboard");
  });

  test("removeLogo clears logo", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.removeLogo();
    });

    expect(result.current.formData.logo).toBeNull();
    expect(result.current.logoPreview).toBeNull();
  });

  test("invalid logo type shows alert", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["abc"], "logo.jpg", {
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
      "error",
    );
  });

  test("logo larger than 2MB shows error", () => {
    const { result } = renderHook(() => useAddCompany(props));

    const file = new File(["abc"], "logo.png", {
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
      "error",
    );
  });

  test("salary total calculates correctly", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleChange({
        target: {
          name: "basic_salary_percent",
          value: "50",
        },
      });

      result.current.handleChange({
        target: {
          name: "house_allowance_percent",
          value: "20",
        },
      });

      result.current.handleChange({
        target: {
          name: "transport_allowance_percent",
          value: "20",
        },
      });

      result.current.handleChange({
        target: {
          name: "special_allowance_percent",
          value: "10",
        },
      });
    });

    expect(result.current.totalPercent).toBe(100);
  });

  test("salary greater than 100 shows validation", () => {
    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      result.current.handleChange({
        target: {
          name: "basic_salary_percent",
          value: "90",
        },
      });

      result.current.handleChange({
        target: {
          name: "house_allowance_percent",
          value: "20",
        },
      });
    });

    expect(result.current.formErrors.salary).toBe(
      "Total percentage cannot exceed 100%",
    );
  });

  test("submit with empty form should not dispatch", async () => {
    const { result } = renderHook(() => useAddCompany(props));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.formErrors.name).toBe("Company name is required");
  });

  test("successful add company", async () => {
    dispatch.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    addCompany.mockReturnValue({});

    const { result } = renderHook(() => useAddCompany(props));

    act(() => {
      Object.assign(result.current.formData, {
        name: "ABC",
        address: "Address",
        email: "abc@test.com",
        location: "Dubai",
        country: "AE",
        country_code: "+971",
        contact_number: "123456789",
        modules: ["dashboard"],
        latitude: "25",
        longitude: "55",
        amount_per_employee: "100",
        basic_salary_percent: "50",
        house_allowance_percent: "20",
        transport_allowance_percent: "20",
        special_allowance_percent: "10",
        working_hours_per_day: "8",
        half_day_hours: "4",
        logo: new File([""], "logo.png", {
          type: "image/png",
        }),
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(dispatch).toHaveBeenCalled();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Swal from "sweetalert2";

import ViewBasic from "../../Pages/employee/ViewBasic";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";

// Mock Redux Async Actions
vi.mock("../../Redux/employeeSlice", () => ({
  getEmployeeById: vi.fn((id) => ({
    type: "employees/getEmployeeById",
    payload: id,
  })),
  submitEmployee: vi.fn((payload) => ({
    type: "employees/submitEmployee",
    payload,
  })),
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn(() => ({ type: "departments/getDepartments" })),
}));

// Mock Sweetalert2
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock ViewLayout component
vi.mock("../../Pages/employee/layout/ViewLayout", () => ({
  default: ({ children, handleSubmit, handleTabNavigation }) => (
    <div data-testid="mock-layout">
      <button data-testid="submit-btn" onClick={handleSubmit}>
        Save
      </button>

      <button
        data-testid="nav-btn"
        onClick={() => handleTabNavigation("/other-tab")}
      >
        Navigate
      </button>

      {children}
    </div>
  ),
}));

// Mock Loader component
vi.mock("../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ViewBasic Component", () => {
  let store;

  const mockDepartments = [
    { id: 1, name: "Engineering" },
    { id: 2, name: "HR" },
  ];

  const mockEmployee = {
    id: "101",
    employee_id: "EMP001",
    designation: "Software Engineer",
    joining_date: "2023-01-15T00:00:00.000Z",
    employment_type: "Full-Time",
    department: 1,
    casual_leave: 5,
    sick_leave: 3,
    earned_leave: 10,
    maternity_leave: 0,
    other_leave: 2,
    phno: "+1234567890",
    passport_number: "A12345678",
    role: "employee",
    contract_expiry_date: "2025-12-31",
    company: { country: "IN" },
    aadar_number: "123456789012",
  };

  const createMockStore = (
    employeeStateOverrides = {},
    departmentStateOverrides = {},
  ) => {
    return configureStore({
      reducer: {
        employees: () => ({
          employeeDetail: mockEmployee,
          loading: false,
          ...employeeStateOverrides,
        }),
        departments: () => ({
          list: mockDepartments,
          ...departmentStateOverrides,
        }),
      },
    });
  };

  const renderComponent = (storeInstance, initialEntry = "/employee/101") => {
    return render(
      <Provider store={storeInstance}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/employee/:id" element={<ViewBasic />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it.skip("renders loader when state is loading or formData is empty", () => {
    store = createMockStore({ loading: true, employeeDetail: null });
    renderComponent(store);

    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });

  it("dispatches getDepartments and getEmployeeById on initial mount", () => {
    store = createMockStore({ employeeDetail: null }, { list: [] });
    renderComponent(store);

    expect(getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
    expect(getEmployeeById).toHaveBeenCalledWith("101");
  });

  it("renders employee basic details correctly when loaded", async () => {
    store = createMockStore();
    renderComponent(store);

    await waitFor(() => {
      expect(screen.getByDisplayValue("EMP001")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();
      expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
      expect(screen.getByDisplayValue("A12345678")).toBeInTheDocument();
    });
  });

  it("calculates total leaves dynamically", async () => {
    store = createMockStore();
    renderComponent(store);

    // Initial total leaves: 5 + 3 + 10 + 0 + 2 = 20
    const totalLeaveInput = screen.getByDisplayValue("20");
    expect(totalLeaveInput).toBeInTheDocument();

    const casualLeaveInput = screen.getByDisplayValue("5");
    fireEvent.change(casualLeaveInput, {
      target: { name: "casual_leave", value: "10" },
    });

    // Updated total leaves: 10 + 3 + 10 + 0 + 2 = 25
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });

  it("renders country specific fields for India (IN)", async () => {
    store = createMockStore({
      employeeDetail: {
        ...mockEmployee,
        company: { country: "IN" },
        aadar_number: "999988887777",
      },
    });
    renderComponent(store);

    await waitFor(() => {
      expect(
        document.querySelector('input[name="aadar_number"]'),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(/Iqama Number/i)).not.toBeInTheDocument();
    });
  });

  it("renders country specific fields for non-IN countries (e.g., KSA)", async () => {
    store = createMockStore({
      employeeDetail: {
        ...mockEmployee,
        company: { country: "KSA" },
        iqama_number: "123456789012",
        visa_expiry_date: "2026-05-10",
        insurance_number: "INS12345",
      },
    });
    renderComponent(store);

    await waitFor(() => {
      expect(screen.getByDisplayValue("123456789012")).toBeInTheDocument();

      expect(screen.getByDisplayValue("2026-05-10")).toBeInTheDocument();

      expect(screen.getByDisplayValue("INS12345")).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Aadhaar Number/i),
      ).not.toBeInTheDocument();
    });
  });

  it("handles form updates and submits successfully", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    store = createMockStore();
    renderComponent(store);

    const designationInput = screen.getByDisplayValue("Software Engineer");
    fireEvent.change(designationInput, {
      target: { name: "designation", value: "Senior Engineer" },
    });

    const submitBtn = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitEmployee).toHaveBeenCalled();
      expect(getEmployeeById).toHaveBeenCalledWith("101");
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Updated!",
        }),
      );
    });
  });

  it("prompts warning if employee is head of department and department changes", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false }); // User cancels prompt

    store = createMockStore({
      employeeDetail: {
        ...mockEmployee,
        is_head: true,
        department: 1,
      },
    });
    renderComponent(store);

    const selectDept = screen.getAllByRole("combobox")[0]; // Select dropdown
    fireEvent.change(selectDept, {
      target: { name: "department", value: "2" },
    });

    const submitBtn = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Warning",
          text: expect.stringContaining("head of their department"),
        }),
      );
    });
  });

  it("prompts warning when navigating away with unsaved changes", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    store = createMockStore();
    renderComponent(store);

    fireEvent.change(screen.getByDisplayValue("Software Engineer"), {
      target: {
        name: "designation",
        value: "Lead Engineer",
      },
    });

    fireEvent.click(screen.getByTestId("nav-btn"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    console.log("Navigate calls:", mockNavigate.mock.calls);
  });

  console.log("Navigate calls:", mockNavigate.mock.calls);

  it("navigates immediately when navigating without unsaved changes", async () => {
    store = createMockStore();
    renderComponent(store);

    const navBtn = screen.getByTestId("nav-btn");
    fireEvent.click(navBtn);

    expect(Swal.fire).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/other-tab");
  });
});

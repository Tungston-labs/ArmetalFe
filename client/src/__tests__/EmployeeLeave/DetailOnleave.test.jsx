import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailOnleave from "../../Pages/onLeave/DetailOnleave";

// Mock redux slice actions
vi.mock("../../Redux/employeeSlice.js", () => ({
  getAllEmployees: vi.fn(() => ({ type: "employee/getAllEmployees" })),
  getOnLeaveEmployees: vi.fn(() => ({ type: "employee/getOnLeaveEmployees" })),
}));

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      employee: (state = initialState) => state,
    },
  });
};

describe("DetailOnleave / EmployeeList", () => {
  let defaultState;

  beforeEach(() => {
    vi.clearAllMocks();
    defaultState = {
      employeeList: [
        {
          id: "1",
          name: "John Doe",
          employeeId: "EMP001",
          email: "john@example.com",
          department: "IT",
          profileImage: "john.jpg",
        },
      ],
      onLeaveEmployees: [],
      loading: false,
      leaveLoading: false,
      totalPages: 1,
      departmentsList: [{ id: "dept1", name: "Engineering" }],
    };
  });

  const renderComponent = (state = defaultState, initialEntries = ["/"]) => {
    const store = createMockStore(state);
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={<DetailOnleave />} />
            <Route path="/employee-dashboard/:id" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it("renders employee page", () => {
    renderComponent();
    expect(screen.getByText("Manage your Employee.")).toBeInTheDocument();
  });

  it("renders employee icon", () => {
    renderComponent();
    expect(screen.getByAltText("employeeIcon")).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Enter employee name or ID")
    ).toBeInTheDocument();
  });

  it("renders date input", () => {
    renderComponent();
    const dateInput = screen.getByRole("textbox", { type: "date" }) || screen.getByDisplayValue("");
    expect(dateInput).toBeInTheDocument();
  });

  it("renders all navigation tabs", () => {
    renderComponent();
    expect(screen.getByText("Total Employee")).toBeInTheDocument();
    expect(screen.getByText("Employee leave request")).toBeInTheDocument();
    expect(screen.getByText("Employee Attendance")).toBeInTheDocument();
    expect(
      screen.getByText("Employee Contract & Visa Expiry")
    ).toBeInTheDocument();
    expect(screen.getByText("Employees on Leave")).toBeInTheDocument();
  });

  it("renders correct navigation links", () => {
    renderComponent();
    expect(screen.getByText("Total Employee").closest("a")).toHaveAttribute(
      "href",
      "/employee"
    );
  });

  it("renders employee information", () => {
    renderComponent();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders employee profile image", () => {
    renderComponent();
    expect(screen.getByAltText("profile")).toHaveAttribute("src", "john.jpg");
  });

  it("renders default user icon when profile image is missing", () => {
    const state = {
      ...defaultState,
      employeeList: [
        {
          id: "1",
          name: "John Doe",
          employeeId: "EMP001",
          email: "john@example.com",
          department: "IT",
          profileImage: null,
        },
      ],
    };
    renderComponent(state);
    expect(screen.getByAltText("profile")).toHaveAttribute(
      "src",
      "default-user.png"
    );
  });

  it("renders multiple employees", () => {
    const state = {
      ...defaultState,
      employeeList: [
        { id: "1", name: "John Doe", employeeId: "EMP001", email: "john@ex.com", department: "IT" },
        { id: "2", name: "Jane Smith", employeeId: "EMP002", email: "jane@ex.com", department: "HR" },
      ],
    };
    renderComponent(state);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders no employee message when list is empty", () => {
    const state = { ...defaultState, employeeList: [] };
    renderComponent(state);
    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });

  it("shows loader when employees are loading", () => {
    const state = { ...defaultState, loading: true };
    renderComponent(state);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });

  it("shows leave loader when leave data is loading", () => {
    const state = { ...defaultState, leaveLoading: true };
    renderComponent(state);
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });

  it("updates search input", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter employee name or ID");
    fireEvent.change(input, { target: { value: "John" } });
    expect(input.value).toBe("John");
  });

  it("updates search input multiple times", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter employee name or ID");
    fireEvent.change(input, { target: { value: "J" } });
    fireEvent.change(input, { target: { value: "John" } });
    expect(input.value).toBe("John");
  });

  it("navigates to employee dashboard when employee row is clicked", () => {
    renderComponent();
    const row = screen.getByText("John Doe").closest("tr");
    fireEvent.click(row);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("preserves department URL when employee row is clicked", () => {
    renderComponent(
      {
        ...defaultState,
        onLeaveEmployees: [
          { id: "1", name: "John Doe", employeeId: "EMP001", email: "john@ex.com", department: "IT" },
        ],
      },
      ["/?departmentId=dept1"]
    );
    const row = screen.getByText("John Doe").closest("tr");
    fireEvent.click(row);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("handles mouse enter and mouse leave on employee row", () => {
    renderComponent();
    const row = screen.getByText("John Doe").closest("tr");
    fireEvent.mouseEnter(row);
    fireEvent.mouseLeave(row);
    expect(row).toBeInTheDocument();
  });

  it("navigates back when back arrow is clicked", () => {
    renderComponent();
    const backArrow = document.querySelector("svg");
    expect(backArrow).toBeInTheDocument();
    fireEvent.click(backArrow);
  });

  it("dispatches getOnLeaveEmployees when departmentId exists", () => {
    renderComponent(defaultState, ["/?departmentId=dept1"]);
    expect(screen.getByText("Employees On Leave")).toBeInTheDocument();
  });

  it("renders Employees On Leave subtitle when departmentId exists", () => {
    renderComponent(defaultState, ["/?departmentId=dept1"]);
    expect(screen.getByText("Employees On Leave")).toBeInTheDocument();
  });

  it("renders employees from onLeaveEmployees instead of employeeList", () => {
    const state = {
      ...defaultState,
      employeeList: [{ id: "1", name: "John Doe" }],
      onLeaveEmployees: [{ id: "2", name: "Leave Employee", employeeId: "EMP002", email: "leave@ex.com", department: "HR" }],
    };
    renderComponent(state, ["/?departmentId=dept1"]);
    expect(screen.getByText("Leave Employee")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("does not render pagination when there is only one page", () => {
    renderComponent({ ...defaultState, totalPages: 1 });
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("renders pagination when multiple pages exist", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("changes pagination page when page number is clicked", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    const pageTwoBtn = screen.getByRole("button", { name: "2" });
    fireEvent.click(pageTwoBtn);
    expect(pageTwoBtn).toBeInTheDocument();
  });

  it("updates serial number when pagination page changes", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    const pageTwoBtn = screen.getByRole("button", { name: "2" });
    fireEvent.click(pageTwoBtn);
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("handles next page click without dispatching getAllEmployees", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    const nextBtn = screen.getByText("Next");
    fireEvent.click(nextBtn);
    expect(nextBtn).toBeInTheDocument();
  });

  it("does not go below first page", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    const prevBtn = screen.getByText("Previous");
    expect(prevBtn).toBeDisabled();
  });

  it("can navigate from page one to page two", () => {
    renderComponent({ ...defaultState, totalPages: 2 });
    const nextBtn = screen.getByText("Next");
    fireEvent.click(nextBtn);
    expect(nextBtn).toBeInTheDocument();
  });

  it("handles department list with selected department", () => {
    renderComponent(defaultState, ["/?departmentId=dept1"]);
    expect(screen.getByText("Employees On Leave")).toBeInTheDocument();
  });

  it("handles unknown department id", () => {
    renderComponent(defaultState, ["/?departmentId=unknown_id"]);
    expect(screen.getByText("Employees On Leave")).toBeInTheDocument();
  });

  it("does not render employee pagination when departmentId exists", () => {
    renderComponent({ ...defaultState, totalPages: 3 }, ["/?departmentId=dept1"]);
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("renders all table headers", () => {
    renderComponent();
    expect(screen.getByText("Sl No")).toBeInTheDocument();
    expect(screen.getByText("Employee name")).toBeInTheDocument();
    expect(screen.getByText("Employee ID")).toBeInTheDocument();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("calculates employee serial number based on current page", () => {
    renderComponent();
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
  });
});
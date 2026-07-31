import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import PayrollDetails from "../../Pages/payroll/PayrollDetailsContainer"; // adjust path/filename to match your project
import * as payrollSlice from "../../Redux/payrollSlice";

// Mock the async thunk so it doesn't hit the real API
vi.mock("../../Redux/payrollSlice", async () => {
  const actual = await vi.importActual("../../Redux/payrollSlice");
  return {
    ...actual,
    getPayrollDetail: vi.fn(() => ({ type: "payroll/getPayrollDetail" })),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const basePayroll = {
  employee_id: "EMP001",
  employee_name: "Jane Doe",
  department: "Engineering",
  designation: "Software Engineer",
  working_days: 22,
  joining_date: "2022-01-15",
  days_present: 20,
  gross_earnings: 50000,
  total_deductions: 5000,
  net_pay: 45000,
  account_number: "1234567890",
  status: "Paid",
  earnings: [{ label: "HRA", amount: 5000 }],
  deductions: [{ label: "PF", value: 2000 }],
  lop_days: 1,
  lop_amount: 1000,
  company: {
    name: "Acme Corp",
    address: "123 Main St",
    email: "hr@acme.com",
    contact_number: "9999999999",
    logo_url: "https://example.com/logo.png",
  },
  basic_salary: 40000,
  total_increment_amount: 2000,
  month: 6,
  year: 2026,
};

function renderWithProviders(preloadedState, route = "/payrolldetails/1") {
  const store = configureStore({
    reducer: {
      payroll: (state = preloadedState, action) => state,
    },
    preloadedState: { payroll: preloadedState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/payrolldetails/:id" element={<PayrollDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("PayrollDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.print = vi.fn();
  });

  test("dispatches getPayrollDetail with the route id on mount", () => {
    renderWithProviders({ payrollDetail: null, loading: false, error: null });
    expect(payrollSlice.getPayrollDetail).toHaveBeenCalledWith("1");
  });

  test("shows loading state", () => {
    renderWithProviders({ payrollDetail: null, loading: true, error: null });
    expect(screen.getByText(/loading payroll details/i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    renderWithProviders({
      payrollDetail: null,
      loading: false,
      error: "Network error",
    });
    expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
  });

  test("shows 'no data found' when payrollDetail is missing", () => {
    renderWithProviders({ payrollDetail: null, loading: false, error: null });
    expect(screen.getByText(/no payroll data found/i)).toBeInTheDocument();
  });

 test("renders employee info, company header, and pay summary correctly", () => {
    renderWithProviders({
      payrollDetail: basePayroll,
      loading: false,
      error: null,
    });

    // Company header
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("hr@acme.com")).toBeInTheDocument();

    // Title with correct month name
    expect(screen.getByText(/payslip.*june 2026/i)).toBeInTheDocument();

    // Employee info
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();

    // Joining date formatted as DD/Mon/YYYY
    expect(screen.getByText("15/Jan/2022")).toBeInTheDocument();

    // Earnings table: basic salary + increment + dynamic earning row
    expect(screen.getByText("40000.00")).toBeInTheDocument(); // basic salary

    const incrementRow = screen.getByText("Increment").closest("tr");
    expect(within(incrementRow).getByText("2000.00")).toBeInTheDocument();

    expect(screen.getByText("HRA")).toBeInTheDocument();
    const hraRow = screen.getByText("HRA").closest("tr");
    expect(within(hraRow).getByText("5000.00")).toBeInTheDocument(); // HRA amount

    // Work summary
    expect(screen.getByText("22 Days")).toBeInTheDocument();
    expect(screen.getByText("20 Days")).toBeInTheDocument();
    expect(screen.getByText(/1000\.00 \(1 day\)/)).toBeInTheDocument();

    // Deduction breakdown
    expect(screen.getByText("PF")).toBeInTheDocument();

    // Pay summary
    expect(screen.getByText("50000.00")).toBeInTheDocument(); // gross
    expect(screen.getByText("45000.00")).toBeInTheDocument(); // net pay
  });

  test("falls back to '----' when joining_date is missing", () => {
    renderWithProviders({
      payrollDetail: { ...basePayroll, joining_date: null },
      loading: false,
      error: null,
    });
    expect(screen.getByText("----")).toBeInTheDocument();
  });

  test("pluralizes 'days' correctly when lop_days > 1", () => {
    renderWithProviders({
      payrollDetail: { ...basePayroll, lop_days: 3, lop_amount: 300 },
      loading: false,
      error: null,
    });
    expect(screen.getByText(/300\.00 \(3 days\)/)).toBeInTheDocument();
  });

  test("does not show day count when lop_days is 0", () => {
    renderWithProviders({
      payrollDetail: { ...basePayroll, lop_days: 0, lop_amount: 0 },
      loading: false,
      error: null,
    });
    // Should show plain amount without any "(x days)" suffix
    expect(screen.queryByText(/\(0 days?\)/)).not.toBeInTheDocument();
  });

  test("clicking back navigates to /payrolldetails", () => {
    renderWithProviders({
      payrollDetail: basePayroll,
      loading: false,
      error: null,
    });
    // FIXED: no role="presentation" exists; the back arrow is simply the
    // first <svg> on the page.
    const backIcon = document.querySelectorAll("svg")[0];
    fireEvent.click(backIcon);
    expect(mockNavigate).toHaveBeenCalledWith("/payrolldetails");
  });

  test("clicking the print icon calls window.print", () => {
    renderWithProviders({
      payrollDetail: basePayroll,
      loading: false,
      error: null,
    });
    // FIXED: document.querySelector("svg") grabbed the back arrow (first
    // svg on the page). The print icon is the second svg, inside the
    // fixed "no-print" panel.
    const printIcon = document.querySelectorAll("svg")[1];
    fireEvent.click(printIcon.closest("span"));
    expect(window.print).toHaveBeenCalled();
  });

  test("does not render company header when company is absent", () => {
    renderWithProviders({
      payrollDetail: { ...basePayroll, company: null },
      loading: false,
      error: null,
    });
    expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument();
  });
});
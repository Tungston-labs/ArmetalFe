import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Swal from "sweetalert2";

import PayrollTable from "../../Pages/payroll/PayrollTable"; 
import * as payrollSlice from "../../Redux/payrollSlice";
import * as departmentSlice from "../../Redux/departmentSlice";

// ---- Mocks ----
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({})),
  },
}));

vi.mock("../../Redux/payrollSlice", async () => {
    const actual = await vi.importActual("../../Redux/payrollSlice");
    return {
        ...actual,
        getPayrollData: vi.fn(() => {
            const thunk = () => Promise.resolve({});
            thunk.unwrap = () => Promise.resolve({});
            return { type: "payroll/getPayrollData", unwrap: () => Promise.resolve({}) };
        }),
        submitPayrollRecords: vi.fn(() => ({
            type: "payroll/submitPayrollRecords",
            unwrap: () => Promise.resolve({}),
        })),
        updatePayrollStatus: vi.fn(() => ({
            type: "payroll/updatePayrollStatus",
            unwrap: () => Promise.resolve({}),
        })),
        verifyEmployeePayroll: vi.fn(() => ({
            type: "payroll/verifyEmployeePayroll",
            unwrap: () => Promise.resolve({}),
        })),
    };
});

vi.mock("../../Redux/departmentSlice", () => ({
    getDepartments: vi.fn(() => ({ type: "departments/getDepartments" })),
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: (props) => (
    <div data-testid="pagination">{`Page ${props.currentPage} of ${props.totalPages}`}</div>
  ),
}));

vi.mock("../../Components/No found/Noemployeefound", () => ({
  default: (props) => <div>{props.label}</div>,
}));

vi.mock("../../Components/VerificationCircle", () => ({
  default: (props) => (
    <div data-testid={`verification-${props.emp.id}`}>
      <button
        onClick={(e) => props.handleCircleClick(e, props.emp, "first")}
        data-testid={`verify-first-${props.emp.id}`}
      >
        First
      </button>
      <button
        onClick={(e) => props.handleCircleClick(e, props.emp, "second")}
        data-testid={`verify-second-${props.emp.id}`}
      >
        Second
      </button>
    </div>
  ),
}));

vi.mock("../../Components/payroll/IncentiveModal/IncentiveModal", () => ({
  default: (props) => (
    <div data-testid="incentive-modal">
      <button onClick={() => props.onClose(true)}>Save Incentive</button>
    </div>
  ),
}));

vi.mock("../../Components/payroll/DeductionModal/DeductionModal", () => ({
  default: (props) => (
    <div data-testid="deduction-modal">
      <button onClick={() => props.onClose(true)}>Save Deduction</button>
    </div>
  ),
}));

const employees = [
    {
        id: 1,
        employee: "e1",
        employee_id: "EMP001",
        employee_name: "Bravo",
        joining_date: "2021-05-10",
        basic_salary: 30000,
        incentive_amount: 0,
        deduction_amount: 0,
        hr1_verified_by: null,
        hr2_verified_by: null,
        status: "Pending",
    },
    {
        id: 2,
        employee: "e2",
        employee_id: "EMP002",
        employee_name: "Alpha",
        joining_date: "2020-03-01",
        basic_salary: 40000,
        incentive_amount: 0,
        deduction_amount: 0,
        hr1_verified_by: "hr1",
        hr2_verified_by: "hr2",
        status: "Paid",
    },
];

function renderWithProviders({
    data = employees,
    loading = false,
    error = null,
    totalPages = 1,
    departments = [{ id: 10, name: "Engineering" }],
} = {}) {
    const store = configureStore({
        reducer: {
            payroll: (state = { data, loading, error, totalPages }) => state,
            departments: (state = { list: departments }) => state,
        },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <PayrollTable />
            </MemoryRouter>
        </Provider>
    );
}

describe("PayrollTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    test("dispatches getDepartments and getPayrollData on mount", () => {
        renderWithProviders();
        expect(departmentSlice.getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
        expect(payrollSlice.getPayrollData).toHaveBeenCalled();
    });

    test("renders table headers", () => {
        renderWithProviders();
        [
            "Sl No",
            "Name",
            "Employee ID",
            "Joining Date",
            "Salary",
            "Incentive",
            "Deduction",
            "Info",
            "Verification",
            "Status",
        ].forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    test("shows loader while loading", () => {
        renderWithProviders({ loading: true });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("shows 'no records found' message when data is empty", () => {
        renderWithProviders({ data: [] });
        expect(screen.getByText(/no payroll records found/i)).toBeInTheDocument();
    });

    test("sorts employees alphabetically by name", () => {
        renderWithProviders();
        const rows = screen.getAllByRole("row").slice(1); // skip header row
        expect(within(rows[0]).getByText("Alpha")).toBeInTheDocument();
        expect(within(rows[1]).getByText("Bravo")).toBeInTheDocument();
    });

    test("typing in search input updates search term and resets page", () => {
        renderWithProviders();
        const input = screen.getByPlaceholderText(/search by employee id/i);
        fireEvent.change(input, { target: { value: "EMP002" } });
        expect(input.value).toBe("EMP002");
    });

    test("selecting a department dispatches a new payroll fetch", async () => {
        renderWithProviders();
        payrollSlice.getPayrollData.mockClear();
        const deptSelect = screen.getByDisplayValue("Select Department");
        fireEvent.change(deptSelect, { target: { value: "10" } });
        await waitFor(() => expect(payrollSlice.getPayrollData).toHaveBeenCalled());
    });

    test("select all checkbox selects and deselects every employee", () => {
        renderWithProviders();
        const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
        fireEvent.click(selectAllCheckbox);
        expect(screen.getByText(/selected 2 employees/i)).toBeInTheDocument();
        fireEvent.click(selectAllCheckbox);
        expect(screen.getByText(/selected 0 employees/i)).toBeInTheDocument();
    });

    test("bulk status update warns if any selected employee is unverified", async () => {
        renderWithProviders();
        const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
        fireEvent.click(selectAllCheckbox); // selects both Alpha (verified) and Bravo (unverified)

        const bulkSelect = screen.getByDisplayValue("Select");
        fireEvent.change(bulkSelect, { target: { value: "Paid" } });

        await waitFor(() =>
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: "warning", title: "Verification Pending" })
            )
        );
        expect(payrollSlice.submitPayrollRecords).not.toHaveBeenCalled();
    });

    test("bulk status update submits when all selected employees are verified", async () => {
        renderWithProviders({ data: [employees[1]] }); // only the verified employee
        const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
        fireEvent.click(selectAllCheckbox);

        const bulkSelect = screen.getByDisplayValue("Select");
        fireEvent.change(bulkSelect, { target: { value: "Paid" } });

        await waitFor(() =>
            expect(payrollSlice.submitPayrollRecords).toHaveBeenCalledWith(
                expect.objectContaining({ status: "Paid", employee_ids: ["e2"] })
            )
        );
    });

    test("single status change warns when employee is not fully verified", async () => {
        renderWithProviders();
        const row = screen.getByText("Bravo").closest("tr");
        const statusSelect = within(row).getByDisplayValue("Pending");
        fireEvent.change(statusSelect, { target: { value: "Paid" } });

        await waitFor(() =>
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: "warning", title: "Verification Pending" })
            )
        );
        expect(payrollSlice.updatePayrollStatus).not.toHaveBeenCalled();
    });

    test("single status change succeeds when employee is fully verified", async () => {
        renderWithProviders();
        const row = screen.getByText("Alpha").closest("tr");
        const statusSelect = within(row).getByDisplayValue("Paid");
        fireEvent.change(statusSelect, { target: { value: "OnHold" } });

        await waitFor(() =>
            expect(payrollSlice.updatePayrollStatus).toHaveBeenCalledWith(
                expect.objectContaining({ employeeId: "e2", status: "OnHold" })
            )
        );
    });

    test("verification click without a logged-in user does nothing", () => {
        renderWithProviders();
        fireEvent.click(screen.getByTestId("verify-first-1"));
        expect(payrollSlice.verifyEmployeePayroll).not.toHaveBeenCalled();
    });

    test("verification click with a logged-in user dispatches verifyEmployeePayroll", async () => {
        localStorage.setItem("user", JSON.stringify({ username: "hrX" }));
        renderWithProviders();
        fireEvent.click(screen.getByTestId("verify-first-1"));

        await waitFor(() =>
            expect(payrollSlice.verifyEmployeePayroll).toHaveBeenCalledWith(
                expect.objectContaining({ employeeId: "e1" })
            )
        );
    });

   test("verification click blocked if the same HR already verified this employee", () => {
    localStorage.setItem("user", JSON.stringify({ username: "hr1" }));
    renderWithProviders(); // Alpha's hr1_verified_by === "hr1"
    fireEvent.click(screen.getByTestId("verify-second-2"));
    expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: "info", title: "Already Verified" })
    );
    expect(payrollSlice.verifyEmployeePayroll).not.toHaveBeenCalled();
});

    test("opening the incentive modal and saving marks the employee as added", async () => {
        renderWithProviders();
        const row = screen.getByText("Bravo").closest("tr");
        const addButtons = within(row).getAllByText("+ Add");
        fireEvent.click(addButtons[0]); // incentive add button

        expect(screen.getByTestId("incentive-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Save Incentive"));

        await waitFor(() =>
            expect(screen.queryByTestId("incentive-modal")).not.toBeInTheDocument()
        );
    });

    test("opening the deduction modal and saving marks the employee as added", async () => {
        renderWithProviders();
        const row = screen.getByText("Bravo").closest("tr");
        const addButtons = within(row).getAllByText("+ Add");
        fireEvent.click(addButtons[1]); // deduction add button

        expect(screen.getByTestId("deduction-modal")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Save Deduction"));

        await waitFor(() =>
            expect(screen.queryByTestId("deduction-modal")).not.toBeInTheDocument()
        );
    });

    test("pagination component receives current page and total pages", () => {
        renderWithProviders({ totalPages: 5 });
        expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 5");
    });
});
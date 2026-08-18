import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),

  unwrap: vi.fn(),

  swalFire: vi.fn(),

  getEmployeeById: vi.fn(),
  fetchAllBankPaymentsThunk: vi.fn(),
  submitBankPayment: vi.fn(),

  useParams: vi.fn(),

  selectorState: {
    employeeDetail: null,
    employeeBankPayments: {
      results: [],
    },
    loading: false,
  },
}));

/* =========================================================
   REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) => {
    return selector({
      employees: {
        employeeDetail: mocks.selectorState.employeeDetail,
        employeeBankPayments: mocks.selectorState.employeeBankPayments,
        loading: mocks.selectorState.loading,
      },
    });
  },
}));

/* =========================================================
   REACT ROUTER
========================================================= */

vi.mock("react-router-dom", () => ({
  useParams: () => mocks.useParams(),
}));

/* =========================================================
   SWEETALERT
========================================================= */

vi.mock("sweetalert2", () => ({
  default: {
    fire: mocks.swalFire,
  },
}));

/* =========================================================
   EMPLOYEE SLICE
========================================================= */

vi.mock("../../Redux/employeeSlice", () => ({
  getEmployeeById: mocks.getEmployeeById,
  fetchAllBankPaymentsThunk: mocks.fetchAllBankPaymentsThunk,
  submitBankPayment: mocks.submitBankPayment,
}));

/* =========================================================
   LOADER
========================================================= */

vi.mock("../../Components/Loder", () => ({
  default: () => <div data-testid="sync-loader">Loading...</div>,
}));

/* =========================================================
   VIEW BASIC LAYOUT

   IMPORTANT:
   Actual component uses handleSubmit,
   not onSave.
========================================================= */

vi.mock("../../Pages/employee/layout/ViewLayout", () => ({
  default: ({ children, handleSubmit }) => (
    <div data-testid="view-basic-layout">
      <button type="button" onClick={handleSubmit}>
        Save Bank Details
      </button>

      {children}
    </div>
  ),
}));

/* =========================================================
   VIEW TABLE BANK

   IMPORTANT:
   Actual component uses setter props,
   not onChange.
========================================================= */

vi.mock("../../Pages/employee/ViewTableBank", () => ({
  default: ({
    country,
    isEditMode,

    bankName,
    setBankName,

    ifscCode,
    setIfscCode,

    swiftCode,
    setSwiftCode,

    accountNumber,
    setAccountNumber,

    basicSalary,
    setBasicSalary,

    uanNumber,
    setUanNumber,

    panNumber,
    setPanNumber,

    taxRegime,
    setTaxRegime,

    tdsAmount,
    setTdsAmount,

    declaration80C,
    setDeclaration80C,

    salaryIncrement,
    setSalaryIncrement,

    housingAllowance,
    setHousingAllowance,

    transportation,
    setTransportation,

    errors,
  }) => (
    <div data-testid="view-table-bank">
      {/* Country */}
      <div data-testid="country">{country}</div>

      {/* Edit mode */}
      <div data-testid="edit-mode">{String(isEditMode)}</div>

      {/* Current form values */}
      <div data-testid="bank-name">{bankName}</div>

      <div data-testid="account-number">{accountNumber}</div>

      <div data-testid="basic-salary">{basicSalary}</div>

      <div data-testid="ifsc-code">{ifscCode}</div>

      <div data-testid="swift-code">{swiftCode}</div>

      <div data-testid="uan-number">{uanNumber}</div>

      <div data-testid="pan-number">{panNumber}</div>

      <div data-testid="tax-regime">{taxRegime}</div>

      <div data-testid="tds-amount">{tdsAmount}</div>

      <div data-testid="declaration-80c">{declaration80C}</div>

      <div data-testid="salary-increment">{salaryIncrement}</div>

      <div data-testid="housing-allowance">{housingAllowance}</div>

      <div data-testid="transportation">{transportation}</div>

      {/* Error values */}
      <div data-testid="bank-name-error">{errors?.bankName}</div>

      <div data-testid="account-number-error">{errors?.accountNumber}</div>

      <div data-testid="basic-salary-error">{errors?.basicSalary}</div>

      {/* Setter buttons */}

      <button type="button" onClick={() => setBankName?.("Test Bank")}>
        Set Bank Name
      </button>

      <button type="button" onClick={() => setAccountNumber?.("1234567890")}>
        Set Account Number
      </button>

      <button type="button" onClick={() => setBasicSalary?.("50000")}>
        Set Basic Salary
      </button>

      <button type="button" onClick={() => setIfscCode?.("SBIN0001234")}>
        Set IFSC
      </button>

      <button type="button" onClick={() => setSwiftCode?.("TESTSWIFT")}>
        Set Swift
      </button>

      <button type="button" onClick={() => setUanNumber?.("UAN123")}>
        Set UAN
      </button>

      <button type="button" onClick={() => setPanNumber?.("ABCDE1234F")}>
        Set PAN
      </button>

      <button type="button" onClick={() => setTaxRegime?.("Old")}>
        Set Tax Regime
      </button>

      <button type="button" onClick={() => setTdsAmount?.("1000")}>
        Set TDS
      </button>

      <button type="button" onClick={() => setDeclaration80C?.("150000")}>
        Set 80C
      </button>

      <button type="button" onClick={() => setSalaryIncrement?.("5000")}>
        Set Salary Increment
      </button>

      <button type="button" onClick={() => setHousingAllowance?.("10000")}>
        Set Housing
      </button>

      <button type="button" onClick={() => setTransportation?.("5000")}>
        Set Transportation
      </button>
    </div>
  ),
}));

/* =========================================================
   IMPORT COMPONENT AFTER MOCKS
========================================================= */

import ViewBankPayment from "../../Pages/employee/ViewBankpayment";

/* =========================================================
   TEST DATA
========================================================= */

const employee = {
  id: "101",
  employee_id: "101",
  country: "IN",
  first_name: "John",
  last_name: "Doe",
};

const existingBankPayment = {
  id: 55,

  bank_name: "State Bank",

  account_number: "9876543210",

  uan_epf_number: "UAN987",

  pan_number: "ABCDE1234F",

  tax_regime: "Old",

  tds_deduction_amount: "2000",

  declaration_80c: 150000,

  basic_salary: "45000",

  salary_increment: "5000",

  housing_allowance: "10000",

  transportation: "5000",

  swift_code: "SBIN0001111",
};

/* =========================================================
   HELPERS
========================================================= */

const renderComponent = () => {
  return render(<ViewBankPayment />);
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  /* Route params */

  mocks.useParams.mockReturnValue({
    id: "101",
  });

  /* Redux state */

  mocks.selectorState.employeeDetail = employee;

  mocks.selectorState.employeeBankPayments = {
    results: [],
  };

  mocks.selectorState.loading = false;

  /* Redux actions */

  mocks.getEmployeeById.mockReturnValue({
    type: "employees/getEmployeeById",
  });

  mocks.fetchAllBankPaymentsThunk.mockReturnValue({
    type: "employees/fetchAllBankPayments",
  });

  mocks.submitBankPayment.mockReturnValue({
    type: "employees/submitBankPayment",
  });

  /* dispatch(...).unwrap() */

  mocks.unwrap.mockResolvedValue({
    success: true,
  });

  mocks.dispatch.mockReturnValue({
    unwrap: mocks.unwrap,
  });

  /* SweetAlert */

  mocks.swalFire.mockResolvedValue({
    isConfirmed: true,
  });
});

afterEach(() => {
  cleanup();

  vi.clearAllMocks();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("ViewBankPayment Component", () => {
  /* =======================================================
     1. BASIC RENDER
  ======================================================= */

  it("renders the ViewBankPayment component", () => {
    renderComponent();

    expect(screen.getByTestId("view-basic-layout")).toBeInTheDocument();

    expect(screen.getByTestId("view-table-bank")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     2. ROUTE PARAM
  ======================================================= */

  it("gets employee id from route params", () => {
    mocks.useParams.mockReturnValue({
      id: "555",
    });

    renderComponent();

    expect(mocks.useParams).toHaveBeenCalled();
  });

  /* =======================================================
     3. FETCH DATA ON MOUNT
  ======================================================= */

  it("dispatches employee and bank payment requests on mount", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mocks.getEmployeeById).toHaveBeenCalledWith("101");

      expect(mocks.fetchAllBankPaymentsThunk).toHaveBeenCalledWith("101");
    });

    expect(mocks.dispatch).toHaveBeenCalled();
  });

  /* =======================================================
     4. LOADER TRUE
  ======================================================= */

  it("renders loader when loading is true", () => {
    mocks.selectorState.loading = true;

    renderComponent();

    expect(screen.getByTestId("sync-loader")).toBeInTheDocument();
  });

  /* =======================================================
     5. LOADER FALSE
  ======================================================= */

  it("does not render loader when loading is false", () => {
    mocks.selectorState.loading = false;

    renderComponent();

    expect(screen.queryByTestId("sync-loader")).not.toBeInTheDocument();
  });

  /* =======================================================
     6. INDIA COUNTRY
  ======================================================= */

  it("passes India country to ViewTableBank", () => {
    mocks.selectorState.employeeDetail = {
      ...employee,
      country: "IN",
    };

    renderComponent();

    expect(screen.getByTestId("country")).toHaveTextContent("IN");
  });

  /* =======================================================
     7. EDIT MODE
  ======================================================= */

  it("passes edit mode to ViewTableBank", () => {
    renderComponent();

    expect(screen.getByTestId("edit-mode")).toHaveTextContent("true");
  });

  /* =======================================================
     8. DEFAULT COUNTRY
  ======================================================= */

  it("uses IN as the default country when employee country is missing", () => {
    mocks.selectorState.employeeDetail = {
      ...employee,
      country: undefined,
    };

    renderComponent();

    expect(screen.getByTestId("country")).toHaveTextContent("IN");
  });

  /* =======================================================
     9. EXISTING BANK PAYMENT
  ======================================================= */

  it("populates form from existing bank payment", async () => {
    mocks.selectorState.employeeBankPayments = {
      results: [existingBankPayment],
    };

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("bank-name")).toHaveTextContent("State Bank");

      expect(screen.getByTestId("account-number")).toHaveTextContent(
        "9876543210",
      );

      expect(screen.getByTestId("basic-salary")).toHaveTextContent("45000");
    });
  });

  /* =======================================================
     10. INDIA IFSC
  ======================================================= */

  it("uses swift_code as IFSC for India", async () => {
    mocks.selectorState.employeeDetail = {
      ...employee,
      country: "IN",
    };

    mocks.selectorState.employeeBankPayments = {
      results: [
        {
          ...existingBankPayment,
          swift_code: "SBIN0001111",
        },
      ],
    };

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("ifsc-code")).toHaveTextContent("SBIN0001111");

      expect(screen.getByTestId("swift-code")).toHaveTextContent("");
    });
  });

  /* =======================================================
     11. NON INDIA SWIFT
  ======================================================= */

  it("uses swift_code as Swift for non-India countries", async () => {
    mocks.selectorState.employeeDetail = {
      ...employee,
      country: "AE",
    };

    mocks.selectorState.employeeBankPayments = {
      results: [
        {
          ...existingBankPayment,
          swift_code: "TESTSWIFT",
        },
      ],
    };

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("country")).toHaveTextContent("AE");

      expect(screen.getByTestId("swift-code")).toHaveTextContent("TESTSWIFT");

      expect(screen.getByTestId("ifsc-code")).toHaveTextContent("");
    });
  });

  /* =======================================================
     12. VALIDATION
  ======================================================= */

  it("shows validation errors when required fields are empty", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("bank-name-error")).toHaveTextContent(
        "Bank Name is required",
      );

      expect(screen.getByTestId("account-number-error")).toHaveTextContent(
        "Account Number is required",
      );

      expect(screen.getByTestId("basic-salary-error")).toHaveTextContent(
        "Basic Salary is required",
      );
    });

    expect(mocks.submitBankPayment).not.toHaveBeenCalled();
  });

  /* =======================================================
     13. ENTER REQUIRED FIELDS
  ======================================================= */

  it("allows required bank fields to be entered", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("bank-name")).toHaveTextContent("Test Bank");

      expect(screen.getByTestId("account-number")).toHaveTextContent(
        "1234567890",
      );

      expect(screen.getByTestId("basic-salary")).toHaveTextContent("50000");
    });
  });

  /* =======================================================
     14. SUCCESSFUL SUBMIT
  ======================================================= */

  it("submits bank payment successfully", async () => {
    mocks.unwrap.mockResolvedValue({
      success: true,
    });

    renderComponent();

    /* Fill required fields */

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    /* Save */

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.submitBankPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: "101",
          paymentId: null,
          data: expect.any(FormData),
          bankProofImage: null,
        }),
      );
    });
  });

  /* =======================================================
     15. SUCCESS ALERT
  ======================================================= */

  it("shows success alert after successful save", async () => {
    mocks.unwrap.mockResolvedValue({
      success: true,
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Saved!",
          text: "Bank details saved successfully.",
        }),
      );
    });
  });

  /* =======================================================
     16. REFRESH BANK PAYMENTS
  ======================================================= */

  it("fetches bank payments again after successful save", async () => {
    mocks.unwrap.mockResolvedValue({
      success: true,
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.fetchAllBankPaymentsThunk).toHaveBeenCalledWith("101");
    });
  });

  /* =======================================================
     17. ERROR ALERT
  ======================================================= */

  it("shows error alert when save fails", async () => {
    mocks.unwrap.mockRejectedValue({
      detail: "Bank payment failed",
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error",
          text: "Bank payment failed",
        }),
      );
    });
  });

  /* =======================================================
     18. GENERIC ERROR
  ======================================================= */

  it("shows generic error message when API error has no detail", async () => {
    mocks.unwrap.mockRejectedValue({});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error",
          text: "Something went wrong.",
        }),
      );
    });
  });

  /* =======================================================
     19. UPDATE EXISTING PAYMENT
  ======================================================= */

  it("shows Updated alert when an existing payment is updated", async () => {
    mocks.selectorState.employeeBankPayments = {
      results: [existingBankPayment],
    };

    mocks.unwrap.mockResolvedValue({
      success: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("bank-name")).toHaveTextContent("State Bank");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /set bank name/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set account number/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set basic salary/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /set ifsc/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /save bank details/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.submitBankPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: "101",
          paymentId: 55,
        }),
      );

      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Updated!",
        }),
      );
    });
  });

  /* =======================================================
     20. CORRECT EMPLOYEE ID
  ======================================================= */

  it("uses the correct employee id when fetching data", async () => {
    mocks.useParams.mockReturnValue({
      id: "777",
    });

    renderComponent();

    await waitFor(() => {
      expect(mocks.getEmployeeById).toHaveBeenCalledWith("777");

      expect(mocks.fetchAllBankPaymentsThunk).toHaveBeenCalledWith("777");
    });
  });
});

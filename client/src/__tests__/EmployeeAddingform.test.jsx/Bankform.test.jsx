import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import BankPaymentForm from "../../Pages/employee/BankPayment";
import Table from "../../Components/Table";

vi.mock("../../assets/employeeicon.svg", () => ({ default: "employee-icon.svg" }));
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", async () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../Components/Multistep", () => ({
  default: () => <div data-testid="multistep" />,
}));
vi.mock("../../Components/EmployeeTitle", () => ({
  default: () => null,
}));
vi.mock("../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
/* ============================================================
 * PAGE: BankPaymentForm
 * ============================================================
 * Table is left un-mocked: it's a thin presentational component,
 * so exercising it "for real" through BankPaymentForm gives good
 * coverage of the actual rendered fields and error messages.
 * ============================================================ */
describe("BankPaymentForm (page)", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  const setUser = (country = "IN") => {
    localStorage.setItem("user", JSON.stringify({ company: { country } }));
  };

  const baseState = {
    employee: {
      employeeId: 55,
      bankPayment: null,
      formData: { bank: null },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((selectorFn) => selectorFn(baseState));

    // submitBankPayment / fetchAllBankPaymentsThunk are createAsyncThunk calls (functions).
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });
  });

  const fillMinimumValidForm = async (country = "IN") => {
    await userEvent.type(screen.getByPlaceholderText(/enter bank name/i), "HDFC Bank");
    await userEvent.type(screen.getByPlaceholderText(/enter account number/i), "1234567890");
    await userEvent.type(
      screen.getByPlaceholderText(country === "IN" ? /enter ifsc code/i : /enter swift code/i),
      country === "IN" ? "HDFC0001234" : "HDFCUS33"
    );
    if (country === "IN") {
      await userEvent.type(screen.getByPlaceholderText(/enter pan number/i), "ABCDE1234F");
    }
    await userEvent.type(screen.getByPlaceholderText(/enter basic salary/i), "50000");
    fireEvent.change(document.querySelectorAll("select")[0], { target: { value: "old" } });
  };

  test("renders IFSC/PAN fields for India and fetches saved bank payment when none is cached in redux", () => {
    setUser("IN");
    render(<BankPaymentForm />);
    expect(screen.getByText(/ifsc code/i)).toBeInTheDocument();
    expect(screen.getByText(/pan number/i)).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalled(); // fetchAllBankPaymentsThunk
  });

  test("renders SWIFT/UAN fields for non-India companies", () => {
    setUser("SA");
    render(<BankPaymentForm />);
    expect(screen.getByText(/swift code/i)).toBeInTheDocument();
    expect(screen.getByText(/uan \/ epf number/i)).toBeInTheDocument();
    expect(screen.queryByText(/pan number/i)).not.toBeInTheDocument();
  });

  test("shows validation errors when required fields are missing", async () => {
    setUser("IN");
    render(<BankPaymentForm />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/bank name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/pan number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/ifsc code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/tax regime is required/i)).toBeInTheDocument();
    });
  });

  test("rejects a salary value with more than two decimal places", async () => {
    setUser("IN");
    render(<BankPaymentForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter basic salary/i), {
      target: { value: "50000.123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/basic salary must be a valid number/i)).toBeInTheDocument();
    });
  });

  test("submits successfully and navigates to /documents", async () => {
    setUser("IN");
    render(<BankPaymentForm />);
    await fillMinimumValidForm("IN");

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/documents");
    });
  });

  test("shows an error if employeeId is missing on submit", async () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ employee: { employeeId: null, bankPayment: null, formData: { bank: null } } })
    );
    setUser("IN");
    render(<BankPaymentForm />);
    await fillMinimumValidForm("IN");

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/employee id not found\. please go back and submit the basic info first\./i)
      ).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("pre-fills the form from a previously saved bank form in redux", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        employee: {
          employeeId: 55,
          bankPayment: null,
          formData: {
            bank: {
              bank_name: "ICICI Bank",
              swift_code: "ICIC0009999",
              account_number: "999888777",
              basic_salary: 45000,
            },
          },
        },
      })
    );
    setUser("IN");
    render(<BankPaymentForm />);
    expect(screen.getByDisplayValue("ICICI Bank")).toBeInTheDocument();
    expect(screen.getByDisplayValue("999888777")).toBeInTheDocument();
  });

  // NOTE: BankPaymentForm passes a `handlePrevious` prop down to <Table />, but
  // Table.jsx currently only renders the Next button - there's no "Previous"
  // button wired into the UI yet, so handlePrevious is unreachable from a
  // user's perspective. Once a Previous button is added to Table, add a test
  // asserting navigate("/basic-details").
});

/* ============================================================
 * SUB-COMPONENT: Table (rendered inside the Bank form)
 * ============================================================ */
describe("Table (sub-component)", () => {
  const noop = () => {};

  const baseProps = {
    bankName: "",
    setBankName: noop,
    swiftCode: "",
    setSwiftCode: noop,
    ifscCode: "",
    setIfscCode: noop,
    accountNumber: "",
    setAccountNumber: noop,
    uanNumber: "",
    setUanNumber: noop,
    panNumber: "",
    setPanNumber: noop,
    taxRegime: "",
    setTaxRegime: noop,
    tdsAmount: "",
    setTdsAmount: noop,
    declaration80C: "",
    setDeclaration80C: noop,
    basicSalary: "",
    setBasicSalary: noop,
    salaryIncrement: "",
    setSalaryIncrement: noop,
    housingAllowance: "",
    setHousingAllowance: noop,
    transportation: "",
    setTransportation: noop,
  };

  test("shows IFSC and PAN fields for India", () => {
    render(<Table {...baseProps} country="IN" />);
    expect(screen.getByText(/ifsc code/i)).toBeInTheDocument();
    expect(screen.getByText(/pan number/i)).toBeInTheDocument();
    expect(screen.queryByText(/swift code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/uan \/ epf number/i)).not.toBeInTheDocument();
  });

  test("shows SWIFT and UAN fields for non-India companies", () => {
    render(<Table {...baseProps} country="SA" />);
    expect(screen.getByText(/swift code/i)).toBeInTheDocument();
    expect(screen.getByText(/uan \/ epf number/i)).toBeInTheDocument();
    expect(screen.queryByText(/ifsc code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pan number/i)).not.toBeInTheDocument();
  });

  test("does not render a Next button unless showNextButton is true", () => {
    render(<Table {...baseProps} country="IN" />);
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  test("renders the Next button and fires handleNext when showNextButton is true", () => {
    const handleNext = vi.fn();
    render(<Table {...baseProps} country="IN" showNextButton handleNext={handleNext} />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  test("displays field-level error messages", () => {
    render(
      <Table
        {...baseProps}
        country="IN"
        errors={{ bankName: "Bank Name is required.", panNumber: "PAN Number is required." }}
      />
    );
    expect(screen.getByText("Bank Name is required.")).toBeInTheDocument();
    expect(screen.getByText("PAN Number is required.")).toBeInTheDocument();
  });

  test("calls the appropriate setter for a text field", () => {
    const setBankName = vi.fn();
    render(<Table {...baseProps} country="IN" setBankName={setBankName} />);
    fireEvent.change(screen.getByPlaceholderText(/enter bank name/i), {
      target: { value: "Test Bank" },
    });
    expect(setBankName).toHaveBeenCalledWith("Test Bank");
  });

  test("calls setIfscCode for India but setSwiftCode for other countries on the equivalent field", () => {
    const setIfscCode = vi.fn();
    const setSwiftCode = vi.fn();

    const { rerender } = render(
      <Table {...baseProps} country="IN" setIfscCode={setIfscCode} setSwiftCode={setSwiftCode} />
    );
    fireEvent.change(screen.getByPlaceholderText(/enter ifsc code/i), {
      target: { value: "HDFC0001234" },
    });
    expect(setIfscCode).toHaveBeenCalledWith("HDFC0001234");
    expect(setSwiftCode).not.toHaveBeenCalled();

    rerender(
      <Table {...baseProps} country="SA" setIfscCode={setIfscCode} setSwiftCode={setSwiftCode} />
    );
    fireEvent.change(screen.getByPlaceholderText(/enter swift code/i), {
      target: { value: "HDFCUS33" },
    });
    expect(setSwiftCode).toHaveBeenCalledWith("HDFCUS33");
  });
});
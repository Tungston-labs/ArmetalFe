import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

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

  fetchSalaryIncrements: vi.fn((employeeId) => ({
    type: "salaryIncrement/fetchSalaryIncrements",
    payload: employeeId,
  })),

  addSalaryIncrement: vi.fn(),

  shouldFailAdd: false,

  selectorState: {
    salaryIncrement: {
      increments: [],
    },
  },
}));

/* =========================================================
   MOCK REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) => selector(mocks.selectorState),
}));

/* =========================================================
   MOCK REDUX SLICE
   IMPORTANT:
   This path must match the component import:
   ../../Redux/salaryIncrementSlice
========================================================= */

vi.mock("../../Redux/salaryIncrementSlice", () => ({
  fetchSalaryIncrements: mocks.fetchSalaryIncrements,

  addSalaryIncrement: (...args) => mocks.addSalaryIncrement(...args),
}));

/* =========================================================
   MOCK STYLES
   IMPORTANT:
   This path must match the component location.
========================================================= */

vi.mock("../../Pages/employee/ViewTableBank.Styles", () => {
  const React = require("react");

  const createComponent = (tag = "div") =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ...props, ref }, children),
    );

  return {
    Card: createComponent(),
    CardHeader: createComponent("h2"),
    CardBody: createComponent(),
    Grid2: createComponent(),
    Input: createComponent("input"),
    Label: createComponent("label"),
    ErrorText: createComponent("span"),
    Container: createComponent(),
    TableWrapper: createComponent(),
    Table: createComponent("table"),
    Th: createComponent("th"),
    Td: createComponent("td"),
    AddButton: createComponent("button"),
    Select: createComponent("select"),
    SaveBtn: createComponent("button"),
  };
});

/* =========================================================
   IMPORT COMPONENT
========================================================= */

import ViewTableBank from "../../Pages/employee/ViewTableBank";

/* =========================================================
   DEFAULT PROPS
========================================================= */

const defaultProps = {
  employeeId: 10,
  country: "IN",

  bankName: "HDFC Bank",
  setBankName: vi.fn(),

  swiftCode: "HDFCINBB",
  setSwiftCode: vi.fn(),

  ifscCode: "HDFC0001234",
  setIfscCode: vi.fn(),

  accountNumber: "1234567890",
  setAccountNumber: vi.fn(),

  uanNumber: "100200300",
  setUanNumber: vi.fn(),

  panNumber: "ABCDE1234F",
  setPanNumber: vi.fn(),

  taxRegime: "old",
  setTaxRegime: vi.fn(),

  tdsAmount: "5000",
  setTdsAmount: vi.fn(),

  declaration80C: "100000",
  setDeclaration80C: vi.fn(),

  basicSalary: "50000",
  setBasicSalary: vi.fn(),

  salaryIncrement: "5000",
  setSalaryIncrement: vi.fn(),

  housingAllowance: "10000",
  setHousingAllowance: vi.fn(),

  transportation: "5000",
  setTransportation: vi.fn(),

  errors: {},
};

const renderComponent = (props = {}) =>
  render(<ViewTableBank {...defaultProps} {...props} />);

/* =========================================================
   TESTS
========================================================= */

describe("ViewTableBank", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.shouldFailAdd = false;

    mocks.selectorState = {
      salaryIncrement: {
        increments: [],
      },
    };

    mocks.addSalaryIncrement.mockImplementation((payload) => ({
      type: "salaryIncrement/addSalaryIncrement",
      payload,
    }));

    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "salaryIncrement/addSalaryIncrement") {
        if (mocks.shouldFailAdd) {
          return {
            unwrap: () => Promise.reject(new Error("Failed to add increment")),
          };
        }

        return {
          unwrap: () =>
            Promise.resolve({
              success: true,
            }),
        };
      }

      return action;
    });
  });

  afterEach(() => {
    cleanup();
  });

  /* =========================================================
     BASIC RENDERING
  ========================================================= */

  it("renders bank and payment details section", () => {
    renderComponent();

    expect(screen.getByText("Bank & Payment Details")).toBeInTheDocument();

    expect(screen.getByText("Bank Name")).toBeInTheDocument();
    expect(screen.getByText("IFSC Code")).toBeInTheDocument();
    expect(screen.getByText("Basic Salary")).toBeInTheDocument();
    expect(screen.getByText("Account Number")).toBeInTheDocument();
    expect(screen.getByText("PAN Number")).toBeInTheDocument();
    expect(screen.getByText("Tax Regime")).toBeInTheDocument();
    expect(screen.getByText("TDS Amount")).toBeInTheDocument();
  });

  it("renders salary increment history section", () => {
    renderComponent();

    expect(screen.getByText("Salary Increment History")).toBeInTheDocument();

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Increment Amount")).toBeInTheDocument();
    expect(screen.getByText("Total Salary")).toBeInTheDocument();
  });

  it("renders no increments message when increment list is empty", () => {
    renderComponent();

    expect(screen.getByText("No increments added")).toBeInTheDocument();
  });

  /* =========================================================
     FETCH
  ========================================================= */

  it("fetches salary increments when employeeId exists", () => {
    renderComponent({
      employeeId: 25,
    });

    expect(mocks.fetchSalaryIncrements).toHaveBeenCalledWith(25);

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "salaryIncrement/fetchSalaryIncrements",
      payload: 25,
    });
  });

  it("does not fetch salary increments when employeeId is missing", () => {
    renderComponent({
      employeeId: null,
    });

    expect(mocks.fetchSalaryIncrements).not.toHaveBeenCalled();
  });

  /* =========================================================
     BANK NAME
  ========================================================= */

  it("calls setBankName when bank name changes", () => {
    renderComponent();

    fireEvent.change(screen.getByDisplayValue("HDFC Bank"), {
      target: {
        value: "ICICI Bank",
      },
    });

    expect(defaultProps.setBankName).toHaveBeenCalledWith("ICICI Bank");
  });

  /* =========================================================
     INDIA / IFSC
  ========================================================= */

  it("renders IFSC for India", () => {
    renderComponent({
      country: "IN",
    });

    expect(screen.getByText("IFSC Code")).toBeInTheDocument();

    expect(screen.queryByText("SWIFT Code")).not.toBeInTheDocument();
  });

  it("converts IFSC code to uppercase", () => {
    renderComponent({
      country: "IN",
    });

    fireEvent.change(screen.getByDisplayValue("HDFC0001234"), {
      target: {
        value: "abcd0001234",
      },
    });

    expect(defaultProps.setIfscCode).toHaveBeenCalledWith("ABCD0001234");
  });

  /* =========================================================
     NON INDIA / SWIFT
  ========================================================= */

  it("renders SWIFT for non-India country", () => {
    renderComponent({
      country: "AE",
      swiftCode: "ABCDEFGH",
    });

    expect(screen.getByText("SWIFT Code")).toBeInTheDocument();

    expect(screen.queryByText("IFSC Code")).not.toBeInTheDocument();
  });

  it("converts SWIFT code to uppercase", () => {
    renderComponent({
      country: "AE",
      swiftCode: "ABCDEFGH",
    });

    fireEvent.change(screen.getByDisplayValue("ABCDEFGH"), {
      target: {
        value: "abcdefgh",
      },
    });

    expect(defaultProps.setSwiftCode).toHaveBeenCalledWith("ABCDEFGH");
  });

  /* =========================================================
     OTHER INPUTS
  ========================================================= */

  it("calls setBasicSalary when salary changes", () => {
    renderComponent();

    fireEvent.change(screen.getByDisplayValue("50000"), {
      target: {
        value: "60000",
      },
    });

    expect(defaultProps.setBasicSalary).toHaveBeenCalledWith("60000");
  });

  it("calls setAccountNumber when account changes", () => {
    renderComponent();

    fireEvent.change(screen.getByDisplayValue("1234567890"), {
      target: {
        value: "9999999999",
      },
    });

    expect(defaultProps.setAccountNumber).toHaveBeenCalledWith("9999999999");
  });

  it("calls setPanNumber when PAN changes", () => {
    renderComponent();

    fireEvent.change(screen.getByDisplayValue("ABCDE1234F"), {
      target: {
        value: "ABCDE9999F",
      },
    });

    expect(defaultProps.setPanNumber).toHaveBeenCalledWith("ABCDE9999F");
  });

  it("changes tax regime", () => {
    renderComponent();

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: {
        value: "new",
      },
    });

    expect(defaultProps.setTaxRegime).toHaveBeenCalledWith("new");
  });

  it("changes TDS amount", () => {
    renderComponent();

    fireEvent.change(screen.getByDisplayValue("5000"), {
      target: {
        value: "7500",
      },
    });

    expect(defaultProps.setTdsAmount).toHaveBeenCalledWith("7500");
  });

  /* =========================================================
     ERROR MESSAGES
  ========================================================= */

  it("renders validation errors", () => {
    renderComponent({
      errors: {
        bankName: "Bank name is required",
        ifscCode: "IFSC is required",
        basicSalary: "Basic salary is required",
        accountNumber: "Account number is required",
        panNumber: "PAN is required",
      },
    });

    expect(screen.getByText("Bank name is required")).toBeInTheDocument();

    expect(screen.getByText("IFSC is required")).toBeInTheDocument();

    expect(screen.getByText("Basic salary is required")).toBeInTheDocument();

    expect(screen.getByText("Account number is required")).toBeInTheDocument();

    expect(screen.getByText("PAN is required")).toBeInTheDocument();
  });

  /* =========================================================
     ADD INCREMENT ROW
  ========================================================= */

  it("opens new increment row", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    expect(screen.getByPlaceholderText("Increment Amount")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });

  it("updates increment date", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    const dateInput = document.querySelector('input[type="date"]');

    fireEvent.change(dateInput, {
      target: {
        value: "2026-08-11",
      },
    });

    expect(dateInput).toHaveValue("2026-08-11");
  });

  it("updates increment amount", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    const amountInput = screen.getByPlaceholderText("Increment Amount");

    fireEvent.change(amountInput, {
      target: {
        value: "5000",
      },
    });

    expect(amountInput).toHaveValue(5000);
  });

  /* =========================================================
     VALIDATION
  ========================================================= */

  it("shows alert when date is missing", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    fireEvent.change(screen.getByPlaceholderText("Increment Amount"), {
      target: {
        value: "5000",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(alertMock).toHaveBeenCalledWith(
      "Please enter date and increment amount",
    );

    expect(mocks.addSalaryIncrement).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it("shows alert when increment amount is missing", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    const dateInput = document.querySelector('input[type="date"]');

    fireEvent.change(dateInput, {
      target: {
        value: "2026-08-11",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(alertMock).toHaveBeenCalledWith(
      "Please enter date and increment amount",
    );

    expect(mocks.addSalaryIncrement).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  /* =========================================================
     SUCCESSFUL SAVE
  ========================================================= */

  it("successfully saves a new salary increment", async () => {
    renderComponent({
      employeeId: 50,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    const dateInput = document.querySelector('input[type="date"]');

    const amountInput = screen.getByPlaceholderText("Increment Amount");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-08-11",
      },
    });

    fireEvent.change(amountInput, {
      target: {
        value: "7500",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(mocks.addSalaryIncrement).toHaveBeenCalledWith({
        employeeId: 50,
        data: {
          employee: 50,
          date: "2026-08-11",
          increment_amount: 7500,
        },
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Increment Amount"),
      ).not.toBeInTheDocument();
    });

    expect(mocks.fetchSalaryIncrements).toHaveBeenCalledWith(50);
  });

  /* =========================================================
     FAILED SAVE
  ========================================================= */

  it("handles failed salary increment save", async () => {
    const consoleMock = vi.spyOn(console, "log").mockImplementation(() => {});

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    mocks.shouldFailAdd = true;

    renderComponent({
      employeeId: 75,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Add Increment",
      }),
    );

    const dateInput = document.querySelector('input[type="date"]');

    const amountInput = screen.getByPlaceholderText("Increment Amount");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-08-11",
      },
    });

    fireEvent.change(amountInput, {
      target: {
        value: "8000",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to add increment");
    });

    expect(consoleMock).toHaveBeenCalled();

    expect(screen.getByPlaceholderText("Increment Amount")).toBeInTheDocument();

    consoleMock.mockRestore();
    alertMock.mockRestore();
  });

  /* =========================================================
     POPULATED HISTORY
  ========================================================= */

  it("renders salary increment history rows", () => {
    mocks.selectorState = {
      salaryIncrement: {
        increments: [
          {
            id: 1,
            date: "2026-01-01",
            increment_amount: 5000,
            total_salary: 55000,
          },
          {
            id: 2,
            date: "2026-06-01",
            increment_amount: 7000,
            total_salary: 62000,
          },
        ],
      },
    };

    renderComponent();

    expect(screen.getByText("2026-01-01")).toBeInTheDocument();

    expect(screen.getByText("2026-06-01")).toBeInTheDocument();

    expect(screen.getByText("55000")).toBeInTheDocument();

    expect(screen.getByText("62000")).toBeInTheDocument();

    expect(screen.queryByText("No increments added")).not.toBeInTheDocument();
  });

  /* =========================================================
     TAX REGIME
  ========================================================= */

  it("renders tax regime options", () => {
    renderComponent();

    expect(
      screen.getByRole("option", {
        name: "Select Tax Regime",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Old Regime",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "New Regime",
      }),
    ).toBeInTheDocument();
  });

  /* =========================================================
     MAX LENGTH
  ========================================================= */

  it("uses 11 character maxLength for IFSC", () => {
    renderComponent({
      country: "IN",
    });

    expect(screen.getByDisplayValue("HDFC0001234")).toHaveAttribute(
      "maxLength",
      "11",
    );
  });

  it("uses 20 character maxLength for SWIFT", () => {
    renderComponent({
      country: "AE",
      swiftCode: "ABCDEFGH",
    });

    expect(screen.getByDisplayValue("ABCDEFGH")).toHaveAttribute(
      "maxLength",
      "20",
    );
  });

  /* =========================================================
     DEFAULT ERRORS
  ========================================================= */

  it("renders when errors prop is omitted", () => {
    const props = {
      ...defaultProps,
    };

    delete props.errors;

    render(<ViewTableBank {...props} />);

    expect(screen.getByText("Bank & Payment Details")).toBeInTheDocument();

    expect(screen.getByText("Salary Increment History")).toBeInTheDocument();
  });
});

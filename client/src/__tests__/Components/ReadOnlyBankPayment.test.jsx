import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReadOnlyBankPayment from "../../Components/ReadOnlyBankPayment";

describe("ReadOnlyBankPayment Component", () => {
  // =========================================================
  // 1. Renders empty state when data is not provided
  // =========================================================
  it("renders empty state when data is not provided", () => {
    render(<ReadOnlyBankPayment />);

    expect(
      screen.getByText("No bank/payment data available.")
    ).toBeInTheDocument();
  });

  // =========================================================
  // 2. Renders empty state when data is null
  // =========================================================
  it("renders empty state when data is null", () => {
    render(<ReadOnlyBankPayment data={null} />);

    expect(
      screen.getByText("No bank/payment data available.")
    ).toBeInTheDocument();
  });

  // =========================================================
  // 3. Renders table and all bank/payment data
  // =========================================================
  it("renders the bank and payment details correctly", () => {
    const data = {
      bank_name: "State Bank",
      account_number: "1234567890",
      payment_mode: "Bank Transfer",
      basic_salary: "50000",
      tax_regime: "New Regime",
      pan_number: "ABCDE1234F",
      uan_number: "100123456789",
    };

    render(<ReadOnlyBankPayment data={data} />);

    expect(
      screen.getByText("Bank & Payment Summary")
    ).toBeInTheDocument();

    expect(screen.getByText("Bank Name")).toBeInTheDocument();
    expect(screen.getByText("Account Number")).toBeInTheDocument();
    expect(screen.getByText("Payment Mode")).toBeInTheDocument();
    expect(screen.getByText("Basic Salary")).toBeInTheDocument();
    expect(screen.getByText("Tax Regime")).toBeInTheDocument();
    expect(screen.getByText("Pan No")).toBeInTheDocument();
    expect(screen.getByText("UAN No")).toBeInTheDocument();

    expect(screen.getByText("State Bank")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
    expect(screen.getByText("50000")).toBeInTheDocument();
    expect(screen.getByText("New Regime")).toBeInTheDocument();
    expect(screen.getByText("ABCDE1234F")).toBeInTheDocument();
    expect(screen.getByText("100123456789")).toBeInTheDocument();
  });

  // =========================================================
  // 4. Renders "-" for missing fields
  // =========================================================
  it("renders '-' for missing bank/payment fields", () => {
    const data = {
      bank_name: "",
      account_number: "",
      payment_mode: "",
      basic_salary: "",
      tax_regime: "",
      pan_number: "",
      uan_number: "",
    };

    render(<ReadOnlyBankPayment data={data} />);

    const emptyValues = screen.getAllByText("-");

    expect(emptyValues).toHaveLength(7);
  });

  // =========================================================
  // 5. Renders "-" for undefined fields
  // =========================================================
  it("renders '-' when fields are undefined", () => {
    const data = {
      bank_name: undefined,
      account_number: undefined,
      payment_mode: undefined,
      basic_salary: undefined,
      tax_regime: undefined,
      pan_number: undefined,
      uan_number: undefined,
    };

    render(<ReadOnlyBankPayment data={data} />);

    expect(screen.getAllByText("-")).toHaveLength(7);
  });

  // =========================================================
  // 6. Renders partial data with fallback values
  // =========================================================
  it("renders available data and fallback values together", () => {
    const data = {
      bank_name: "HDFC Bank",
      account_number: "",
      payment_mode: "Cash",
      basic_salary: "40000",
      tax_regime: "",
      pan_number: "ABCDE1234F",
      uan_number: "",
    };

    render(<ReadOnlyBankPayment data={data} />);

    expect(screen.getByText("HDFC Bank")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("40000")).toBeInTheDocument();
    expect(screen.getByText("ABCDE1234F")).toBeInTheDocument();

    expect(screen.getAllByText("-")).toHaveLength(3);
  });
});
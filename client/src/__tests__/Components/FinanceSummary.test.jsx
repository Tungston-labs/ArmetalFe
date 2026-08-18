import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import FinanceSummary from "../../Components/finance/FinanceSummary";

describe("FinanceSummary Component", () => {
  // =========================================================
  // RENDERING
  // =========================================================

  it("renders all three summary labels", () => {
    render(<FinanceSummary />);

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Total Expense")).toBeInTheDocument();
    expect(screen.getByText("Cash Balance")).toBeInTheDocument();
  });

  it("renders three summary values", () => {
    render(<FinanceSummary />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  // =========================================================
  // DEFAULT VALUES
  // =========================================================

  it("renders 0.00 for all values when no props are provided", () => {
    render(<FinanceSummary />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  it("uses default income value when income is undefined", () => {
    render(<FinanceSummary expense={100} cashBalance={200} />);

    expect(screen.getAllByText("0.00")).toHaveLength(1);
  });

  it("uses default expense value when expense is undefined", () => {
    render(<FinanceSummary income={100} cashBalance={200} />);

    expect(screen.getAllByText("0.00")).toHaveLength(1);
  });

  it("uses default cash balance when cashBalance is undefined", () => {
    render(<FinanceSummary income={100} expense={200} />);

    expect(screen.getAllByText("0.00")).toHaveLength(1);
  });

  // =========================================================
  // INCOME
  // =========================================================

  it("formats income with two decimal places", () => {
    render(<FinanceSummary income={1234.5} />);

    expect(screen.getByText("1,234.50")).toBeInTheDocument();
  });

  it("formats integer income correctly", () => {
    render(<FinanceSummary income={5000} />);

    expect(screen.getByText("5,000.00")).toBeInTheDocument();
  });

  it("rounds income to two decimal places", () => {
    render(<FinanceSummary income={1234.567} />);

    expect(screen.getByText("1,234.57")).toBeInTheDocument();
  });

  it("formats large income according to the current locale", () => {
    render(<FinanceSummary income={1000000} />);

    const expected = Number(1000000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  // =========================================================
  // EXPENSE
  // =========================================================

  it("formats expense with two decimal places", () => {
    render(<FinanceSummary expense={9876.5} />);

    expect(screen.getByText("9,876.50")).toBeInTheDocument();
  });

  it("formats integer expense correctly", () => {
    render(<FinanceSummary expense={2500} />);

    expect(screen.getByText("2,500.00")).toBeInTheDocument();
  });

  it("rounds expense to two decimal places", () => {
    render(<FinanceSummary expense={999.999} />);

    expect(screen.getByText("1,000.00")).toBeInTheDocument();
  });

  it("formats large expense according to the current locale", () => {
    render(<FinanceSummary expense={2500000.5} />);

    const expected = Number(2500000.5).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  // =========================================================
  // CASH BALANCE
  // =========================================================

  it("formats positive cash balance correctly", () => {
    render(<FinanceSummary cashBalance={1500.75} />);

    expect(screen.getByText("1,500.75")).toBeInTheDocument();
  });

  it("formats negative cash balance correctly", () => {
    render(<FinanceSummary cashBalance={-500.25} />);

    expect(screen.getByText("-500.25")).toBeInTheDocument();
  });

  it("formats zero cash balance correctly", () => {
    render(<FinanceSummary cashBalance={0} />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  it("formats large negative cash balance according to the current locale", () => {
    render(<FinanceSummary cashBalance={-5000000.75} />);

    const expected = Number(-5000000.75).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  // =========================================================
  // CASH BALANCE COLOR
  // =========================================================

  it("uses green color for positive cash balance", () => {
    render(<FinanceSummary cashBalance={1000} />);

    const value = screen.getByText("1,000.00");

    expect(value).toHaveStyle({
      color: "#0b6623",
    });
  });

  it("uses green color when cash balance is zero", () => {
    render(<FinanceSummary cashBalance={0} />);

    const values = screen.getAllByText("0.00");

    // Third value belongs to Cash Balance
    const cashBalanceValue = values[2];

    expect(cashBalanceValue).toHaveStyle({
      color: "#0b6623",
    });
  });

  it("uses red color for negative cash balance", () => {
    render(<FinanceSummary cashBalance={-1000} />);

    const value = screen.getByText("-1,000.00");

    expect(value).toHaveStyle({
      color: "#b91c1c",
    });
  });

  // =========================================================
  // STRING VALUES
  // =========================================================

  it("handles numeric string values", () => {
    render(
      <FinanceSummary income="1500" expense="2500.5" cashBalance="3000" />,
    );

    expect(screen.getByText("1,500.00")).toBeInTheDocument();
    expect(screen.getByText("2,500.50")).toBeInTheDocument();
    expect(screen.getByText("3,000.00")).toBeInTheDocument();
  });

  // =========================================================
  // NULL VALUES
  // =========================================================

  it("handles null values as zero", () => {
    render(<FinanceSummary income={null} expense={null} cashBalance={null} />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  // =========================================================
  // ZERO / FALSY VALUES
  // =========================================================

  it("handles zero income correctly", () => {
    render(<FinanceSummary income={0} />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  it("handles zero expense correctly", () => {
    render(<FinanceSummary expense={0} />);

    const values = screen.getAllByText("0.00");

    expect(values).toHaveLength(3);
  });

  // =========================================================
  // ALL VALUES TOGETHER
  // =========================================================

  it("renders income, expense and cash balance together", () => {
    render(
      <FinanceSummary
        income={12500.75}
        expense={4500.25}
        cashBalance={8000.5}
      />,
    );

    expect(screen.getByText("12,500.75")).toBeInTheDocument();
    expect(screen.getByText("4,500.25")).toBeInTheDocument();
    expect(screen.getByText("8,000.50")).toBeInTheDocument();
  });

  // =========================================================
  // DIFFERENT VALUES
  // =========================================================

  it("renders different values independently", () => {
    render(<FinanceSummary income={1000} expense={500} cashBalance={500} />);

    expect(screen.getByText("1,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("500.00")).toHaveLength(2);
  });
});

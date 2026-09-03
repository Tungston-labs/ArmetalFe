import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  getFinanceColumns,
  getStatCards,
} from "../../Pages/finance/FinanceColumns";

// Mock formatCurrency so these tests focus only on FinanceColumns logic.
vi.mock("../../utils/FormatCurrency", () => ({
  formatCurrency: vi.fn((amount, currencyCode) => {
    return `${currencyCode} ${amount}`;
  }),
}));

import { formatCurrency } from "../../utils/FormatCurrency";

describe("FinanceColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getFinanceColumns
  // ---------------------------------------------------------------------------

  describe("getFinanceColumns", () => {
    const defaultProps = {
      page: 1,
      pageSize: 10,
      currencyCode: "INR",
    };

    it("returns all finance columns", () => {
      const columns = getFinanceColumns(defaultProps);

      expect(columns).toHaveLength(7);

      expect(columns.map((column) => column.header)).toEqual([
        "Sl No",
        "Date",
        "Category",
        "Note",
        "Income",
        "Expense",
        "Status",
      ]);
    });

    it("returns the correct accessors", () => {
      const columns = getFinanceColumns(defaultProps);

      expect(columns.map((column) => column.accessor)).toEqual([
        "slNo",
        "date",
        "category_name",
        "note",
        "income",
        "expense",
        "payment_type",
      ]);
    });

    // -------------------------------------------------------------------------
    // Sl No
    // -------------------------------------------------------------------------

    describe("Sl No column", () => {
      it("calculates serial number correctly on the first page", () => {
        const columns = getFinanceColumns({
          page: 1,
          pageSize: 10,
          currencyCode: "INR",
        });

        const slNoColumn = columns[0];

        expect(slNoColumn.render({}, 0)).toBe(1);
        expect(slNoColumn.render({}, 1)).toBe(2);
        expect(slNoColumn.render({}, 9)).toBe(10);
      });

      it("calculates serial number correctly on later pages", () => {
        const columns = getFinanceColumns({
          page: 2,
          pageSize: 10,
          currencyCode: "INR",
        });

        const slNoColumn = columns[0];

        expect(slNoColumn.render({}, 0)).toBe(11);
        expect(slNoColumn.render({}, 4)).toBe(15);
        expect(slNoColumn.render({}, 9)).toBe(20);
      });

      it("calculates serial number correctly with a different page size", () => {
        const columns = getFinanceColumns({
          page: 3,
          pageSize: 25,
          currencyCode: "INR",
        });

        const slNoColumn = columns[0];

        expect(slNoColumn.render({}, 0)).toBe(51);
        expect(slNoColumn.render({}, 9)).toBe(60);
      });

      it("marks Sl No as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[0].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Date
    // -------------------------------------------------------------------------

    describe("Date column", () => {
      it("formats a valid date correctly", () => {
        const columns = getFinanceColumns(defaultProps);

        const dateColumn = columns[1];

        expect(
          dateColumn.render({
            date: "2025-01-15T00:00:00",
          }),
        ).toMatch(/15\/Jan\/2025/);
      });

      it("formats another valid date correctly", () => {
        const columns = getFinanceColumns(defaultProps);

        const dateColumn = columns[1];

        expect(
          dateColumn.render({
            date: "2024-12-05T00:00:00",
          }),
        ).toMatch(/05\/Dec\/2024/);
      });

      it("returns fallback when date is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const dateColumn = columns[1];

        expect(dateColumn.render({ date: null })).toBe("----");
        expect(dateColumn.render({ date: undefined })).toBe("----");
        expect(dateColumn.render({})).toBe("----");
      });
    });

    // -------------------------------------------------------------------------
    // Category
    // -------------------------------------------------------------------------

    describe("Category column", () => {
      it("renders category name when available", () => {
        const columns = getFinanceColumns(defaultProps);

        const categoryColumn = columns[2];

        expect(
          categoryColumn.render({
            category_name: "Salary",
          }),
        ).toBe("Salary");
      });

      it("returns fallback when category name is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const categoryColumn = columns[2];

        expect(categoryColumn.render({ category_name: "" })).toBe("----");
        expect(categoryColumn.render({ category_name: null })).toBe("----");
        expect(categoryColumn.render({ category_name: undefined })).toBe(
          "----",
        );
      });
    });

    // -------------------------------------------------------------------------
    // Note
    // -------------------------------------------------------------------------

    describe("Note column", () => {
      it("renders the note text", () => {
        const columns = getFinanceColumns(defaultProps);

        const noteColumn = columns[3];

        render(
          <div>
            {noteColumn.render({
              note: "Monthly salary payment",
            })}
          </div>,
        );

        expect(screen.getByText("Monthly salary payment")).toBeInTheDocument();
      });

      it("sets the note as the title attribute", () => {
        const columns = getFinanceColumns(defaultProps);

        const noteColumn = columns[3];

        render(
          <div>
            {noteColumn.render({
              note: "Monthly salary payment",
            })}
          </div>,
        );

        const noteElement = screen.getByTitle("Monthly salary payment");

        expect(noteElement).toBeInTheDocument();
        expect(noteElement).toHaveTextContent("Monthly salary payment");
      });

      it("uses fallback when note is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const noteColumn = columns[3];

        render(
          <div>
            {noteColumn.render({
              note: null,
            })}
          </div>,
        );

        expect(screen.getByTitle("----")).toBeInTheDocument();
        expect(screen.getByText("----")).toBeInTheDocument();
      });

      it("uses fallback when note is an empty string", () => {
        const columns = getFinanceColumns(defaultProps);

        const noteColumn = columns[3];

        render(
          <div>
            {noteColumn.render({
              note: "",
            })}
          </div>,
        );

        expect(screen.getByTitle("----")).toBeInTheDocument();
      });

      it("contains the expected truncation styles", () => {
        const columns = getFinanceColumns(defaultProps);

        const noteColumn = columns[3];

        render(
          <div>
            {noteColumn.render({
              note: "A long finance note",
            })}
          </div>,
        );

        const noteElement = screen.getByTitle("A long finance note");

        expect(noteElement).toHaveStyle({
          display: "inline-block",
          maxWidth: "180px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "default",
        });
      });
    });

    // -------------------------------------------------------------------------
    // Income
    // -------------------------------------------------------------------------

    describe("Income column", () => {
      it("renders formatted amount for IN payment", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "IN",
            amount: 50000,
          }),
        ).toBe("INR 50000");

        expect(formatCurrency).toHaveBeenCalledWith(50000, "INR");
      });

      it("returns fallback when IN payment has null amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "IN",
            amount: null,
          }),
        ).toBe("----");
      });

      it("returns fallback when IN payment has undefined amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "IN",
          }),
        ).toBe("----");
      });

      it("returns -- when payment type is OUT", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "OUT",
            amount: 2500,
          }),
        ).toBe("--");
      });

      it("returns -- when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            amount: 2500,
          }),
        ).toBe("--");
      });

      it("uses the provided currency code", () => {
        const columns = getFinanceColumns({
          page: 1,
          pageSize: 10,
          currencyCode: "AED",
        });

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "IN",
            amount: 1000,
          }),
        ).toBe("AED 1000");

        expect(formatCurrency).toHaveBeenCalledWith(1000, "AED");
      });

      it("allows zero as a valid amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const incomeColumn = columns[4];

        expect(
          incomeColumn.render({
            payment_type: "IN",
            amount: 0,
          }),
        ).toBe("INR 0");
      });

      it("marks Income as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[4].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Expense
    // -------------------------------------------------------------------------

    describe("Expense column", () => {
      it("renders formatted amount for OUT payment", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "OUT",
            amount: 15000,
          }),
        ).toBe("INR 15000");

        expect(formatCurrency).toHaveBeenCalledWith(15000, "INR");
      });

      it("returns fallback when OUT payment has null amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "OUT",
            amount: null,
          }),
        ).toBe("----");
      });

      it("returns fallback when OUT payment has undefined amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "OUT",
          }),
        ).toBe("----");
      });

      it("returns -- when payment type is IN", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "IN",
            amount: 5000,
          }),
        ).toBe("--");
      });

      it("returns -- when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            amount: 5000,
          }),
        ).toBe("--");
      });

      it("uses the provided currency code", () => {
        const columns = getFinanceColumns({
          page: 1,
          pageSize: 10,
          currencyCode: "USD",
        });

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "OUT",
            amount: 250,
          }),
        ).toBe("USD 250");

        expect(formatCurrency).toHaveBeenCalledWith(250, "USD");
      });

      it("allows zero as a valid amount", () => {
        const columns = getFinanceColumns(defaultProps);

        const expenseColumn = columns[5];

        expect(
          expenseColumn.render({
            payment_type: "OUT",
            amount: 0,
          }),
        ).toBe("INR 0");
      });

      it("marks Expense as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[5].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    describe("Status column", () => {
      it("renders Income for IN payment", () => {
        const columns = getFinanceColumns(defaultProps);

        const statusColumn = columns[6];

        render(
          <div>
            {statusColumn.render({
              payment_type: "IN",
            })}
          </div>,
        );

        const status = screen.getByText("Income");

        expect(status).toBeInTheDocument();
        expect(status).toHaveStyle({
          color: "#16a34a",
          backgroundColor: "#d3f3e0",
        });
      });

      it("renders Expense for OUT payment", () => {
        const columns = getFinanceColumns(defaultProps);

        const statusColumn = columns[6];

        render(
          <div>
            {statusColumn.render({
              payment_type: "OUT",
            })}
          </div>,
        );

        const status = screen.getByText("Expense");

        expect(status).toBeInTheDocument();
        expect(status).toHaveStyle({
          color: "#dc2626",
          backgroundColor: "#fbdcdc",
        });
      });

      it("renders Expense when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        const statusColumn = columns[6];

        render(<div>{statusColumn.render({})}</div>);

        expect(screen.getByText("Expense")).toBeInTheDocument();
      });

      it("marks Status as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[6].sortable).toBe(false);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // getStatCards
  // ---------------------------------------------------------------------------

  describe("getStatCards", () => {
    const defaultStats = {
      totalIncome: 100000,
      totalExpense: 35000,
      cashBalance: 65000,
      currencyCode: "INR",
    };

    it("returns four stat cards", () => {
      const cards = getStatCards(defaultStats);

      expect(cards).toHaveLength(4);
    });

    it("returns the correct card titles", () => {
      const cards = getStatCards(defaultStats);

      expect(cards.map((card) => card.title)).toEqual([
        "Total Records",
        "Total Income",
        "Total Expense",
        "Cash Balance",
      ]);
    });

    it("formats Total Records using total income", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].count).toBe("INR 100000");
      expect(formatCurrency).toHaveBeenCalledWith(100000, "INR");
    });

    it("formats Total Income correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[1].count).toBe("INR 100000");
      expect(formatCurrency).toHaveBeenCalledWith(100000, "INR");
    });

    it("formats Total Expense correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[2].count).toBe("INR 35000");
      expect(formatCurrency).toHaveBeenCalledWith(35000, "INR");
    });

    it("formats Cash Balance correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[3].count).toBe("INR 65000");
      expect(formatCurrency).toHaveBeenCalledWith(65000, "INR");
    });

    it("passes the correct currency code to every card", () => {
      getStatCards({
        totalIncome: 1000,
        totalExpense: 400,
        cashBalance: 600,
        currencyCode: "AED",
      });

      expect(formatCurrency).toHaveBeenNthCalledWith(1, 1000, "AED");
      expect(formatCurrency).toHaveBeenNthCalledWith(2, 1000, "AED");
      expect(formatCurrency).toHaveBeenNthCalledWith(3, 400, "AED");
      expect(formatCurrency).toHaveBeenNthCalledWith(4, 600, "AED");
    });

    it("has the correct icon colors", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].iconColor).toBe("#157baa");
      expect(cards[1].iconColor).toBe("#22c55e");
      expect(cards[2].iconColor).toBe("#ef4444");
      expect(cards[3].iconColor).toBe("#6366f1");
    });

    it("has the correct background colors", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].backgroundColor).toBe("#e3f5f7");
      expect(cards[1].backgroundColor).toBe("#d3f3e0");
      expect(cards[2].backgroundColor).toBe("#fbdcdc");
      expect(cards[3].backgroundColor).toBe("#e0e7ff");
    });

    it("creates a React element for every icon", () => {
      const cards = getStatCards(defaultStats);

      cards.forEach((card) => {
        expect(React.isValidElement(card.icon)).toBe(true);
      });
    });

    it("uses the expected icon component for each card", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].icon.type.name).toBe("FaRegMessage");
      expect(cards[1].icon.type.name).toBe("FiTrendingUp");
      expect(cards[2].icon.type.name).toBe("FiTrendingDown");
      expect(cards[3].icon.type.name).toBe("FiDollarSign");
    });

    it("handles zero totals correctly", () => {
      const cards = getStatCards({
        totalIncome: 0,
        totalExpense: 0,
        cashBalance: 0,
        currencyCode: "INR",
      });

      expect(cards[0].count).toBe("INR 0");
      expect(cards[1].count).toBe("INR 0");
      expect(cards[2].count).toBe("INR 0");
      expect(cards[3].count).toBe("INR 0");
    });

    it("handles negative cash balance", () => {
      const cards = getStatCards({
        totalIncome: 1000,
        totalExpense: 1500,
        cashBalance: -500,
        currencyCode: "INR",
      });

      expect(cards[3].count).toBe("INR -500");
    });

    it("handles decimal amounts", () => {
      const cards = getStatCards({
        totalIncome: 1000.5,
        totalExpense: 250.75,
        cashBalance: 749.75,
        currencyCode: "USD",
      });

      expect(cards[0].count).toBe("USD 1000.5");
      expect(cards[1].count).toBe("USD 1000.5");
      expect(cards[2].count).toBe("USD 250.75");
      expect(cards[3].count).toBe("USD 749.75");
    });
  });
});

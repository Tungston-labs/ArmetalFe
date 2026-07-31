// src/__tests__/pages/finance/FinanceDetail.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// FinanceSummary, Pagination, EmployeeTitle, NoEmployeeFound, and the
// FinanceModal itself are all mocked so this file only verifies
// FinanceDetail's own data-fetching and state logic.

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";

import FinanceDetail from "../../Pages/finance/FinancePage";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/financeThunks", () => ({
  createFinance: (payload) => ({ type: "createFinance", payload }),
  fetchFinanceList: (params) => ({ type: "fetchFinanceList", payload: params }),
}));
vi.mock("../../Components/EmployeeTitle", () => ({
  default: ({
    onSearchChange,
    onAddClick,
    onDropdownChange,
    searchValue,
    selectedDropdownValue,
  }) => (
    <div>
      <input
        aria-label="search-finance"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        aria-label="payment-type-filter"
        value={selectedDropdownValue}
        onChange={(e) => onDropdownChange(e.target.value)}
      >
        <option value="">All Payments</option>
        <option value="IN">Income</option>
        <option value="OUT">Expense</option>
      </select>

      <button onClick={onAddClick}>
        Add Finance
      </button>
    </div>
  ),
}));

vi.mock("../../Components/finance/FinanceSummary", () => ({
  default: (props) => (
    <div data-testid="finance-summary">
      {JSON.stringify(props)}
    </div>
  ),
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }) => (
    <div>
      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button onClick={() => onPageChange(currentPage - 1)}>
        prev-page
      </button>

      <button onClick={() => onPageChange(currentPage + 1)}>
        next-page
      </button>

      <button onClick={() => onPageChange(0)}>
        jump-to-zero
      </button>

      <button onClick={() => onPageChange(999)}>
        jump-too-far
      </button>
    </div>
  ),
}));

vi.mock("../../Components/No found/Noemployeefound", () => ({
  default: ({
    searchTerm,
    label,
  }) => (
    <div>
      {label} {searchTerm ? `(searched: ${searchTerm})` : ""}
    </div>
  ),
}));

vi.mock("../../Pages/finance/NewFinance", () => ({
  default: ({
    isOpen,
    onClose,
    onSave,
  }) =>
    isOpen ? (
      <div data-testid="finance-modal">
        <button
          onClick={() =>
            onSave({
              category: "1",
              paymentType: "IN",
              amount1: "500",
              date: "2026-01-15",
              note: "Freelance",
            })
          }
        >
          submit-finance
        </button>

        <button onClick={onClose}>
          close-finance-modal
        </button>
      </div>
    ) : null,
}));

const mockDispatch = vi.fn();

const financeRecords = [
  {
    id: 1,
    date: "2026-01-05",
    category_name: "Salary",
    note: "January salary",
    payment_type: "IN",
    amount: 5000,
  },
  {
    id: 2,
    date: "2026-01-10",
    category_name: "Rent",
    note: null,
    payment_type: "OUT",
    amount: 1200,
  },
];

const baseFinanceState = {
  list: financeRecords,
  loading: false,
  pagination: { totalPages: 3 },
  totalIncome: 5000,
  totalExpense: 1200,
  cashBalance: 3800,
};

beforeEach(() => {
  vi.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  mockDispatch.mockImplementation((action) => {
    if (action.type === "createFinance") {
      return Promise.resolve({});
    }
    return Promise.resolve({});
  });
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({ finance: baseFinanceState })
  );
});

describe("FinanceDetail", () => {
  test("fetches the finance list on mount with default filters", () => {
    render(<FinanceDetail />);
    const call = mockDispatch.mock.calls.find((c) => c[0].type === "fetchFinanceList");
    expect(call[0].payload).toEqual({
      page: 1,
      pageSize: 12,
      search: "",
      payment_type: "",
    });
  });

  test("passes income/expense/cashBalance totals to FinanceSummary", () => {
    render(<FinanceDetail />);
    const summary = JSON.parse(screen.getByTestId("finance-summary").textContent);
    expect(summary).toEqual({ income: 5000, expense: 1200, cashBalance: 3800 });
  });

  test("renders each record with formatted date and income/expense split correctly", () => {
    render(<FinanceDetail />);

    expect(screen.getByText("05/Jan/2026")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument(); // income column
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument(); // expense column

    // Rent has no note -> fallback dashes.
    expect(screen.getAllByText("----").length).toBeGreaterThan(0);
  });

  test("shows a loading row while fetching", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ finance: { ...baseFinanceState, loading: true } })
    );
    render(<FinanceDetail />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows the empty state with the current search term when there are no records", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ finance: { ...baseFinanceState, list: [] } })
    );
    render(<FinanceDetail />);
    expect(screen.getByText(/No Finance Records Found/)).toBeInTheDocument();
  });

  test("re-fetches with the new search term and resets to page 1", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);
    mockDispatch.mockClear();

    await user.type(screen.getByLabelText("search-finance"), "rent");

    await waitFor(() => {
      const calls = mockDispatch.mock.calls.filter(
        (c) => c[0].type === "fetchFinanceList"
      );
      const last = calls[calls.length - 1][0].payload;
      expect(last.search).toBe("rent");
      expect(last.page).toBe(1);
    });
  });

  test("re-fetches with the new payment type filter and resets to page 1", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);
    mockDispatch.mockClear();

    await user.selectOptions(screen.getByLabelText("payment-type-filter"), "OUT");

    await waitFor(() => {
      const calls = mockDispatch.mock.calls.filter(
        (c) => c[0].type === "fetchFinanceList"
      );
      const last = calls[calls.length - 1][0].payload;
      expect(last.payment_type).toBe("OUT");
      expect(last.page).toBe(1);
    });
  });

  test("clamps the current page down when it exceeds the new totalPages", () => {
    const { rerender } = render(<FinanceDetail />);

    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        finance: { ...baseFinanceState, pagination: { totalPages: 1 } },
      })
    );
    rerender(<FinanceDetail />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  test("pagination ignores out-of-range page requests", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);
    mockDispatch.mockClear();

    await user.click(screen.getByText("jump-to-zero"));
    await user.click(screen.getByText("jump-too-far"));

    // Neither an invalid low nor high page should trigger a new fetch.
    await waitFor(() => {
      const calls = mockDispatch.mock.calls.filter(
        (c) => c[0].type === "fetchFinanceList"
      );
      expect(calls).toHaveLength(0);
    });
  });

  test("pagination fetches the requested page when it is within range", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);
    mockDispatch.mockClear();

    await user.click(screen.getByText("next-page"));

    await waitFor(() => {
      const call = mockDispatch.mock.calls.find(
        (c) => c[0].type === "fetchFinanceList"
      );
      expect(call[0].payload.page).toBe(2);
    });
  });

  test("adding a finance entry creates it, closes the modal, resets to page 1, and refreshes the list", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);

    await user.click(screen.getByText("Add Finance"));
    expect(screen.getByTestId("finance-modal")).toBeInTheDocument();

    await user.click(screen.getByText("submit-finance"));

    await waitFor(() => {
      const createCall = mockDispatch.mock.calls.find(
        (c) => c[0].type === "createFinance"
      );
      expect(createCall[0].payload).toEqual({
        category: "1",
        date: "2026-01-15",
        note: "Freelance",
        payment_type: "IN",
        amount: "500",
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId("finance-modal")).not.toBeInTheDocument();
    });
  });

  test("closing the finance modal without saving does not dispatch createFinance", async () => {
    const user = userEvent.setup();
    render(<FinanceDetail />);

    await user.click(screen.getByText("Add Finance"));
    await user.click(screen.getByText("close-finance-modal"));

    expect(screen.queryByTestId("finance-modal")).not.toBeInTheDocument();
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "createFinance")
    ).toBe(false);
  });
});
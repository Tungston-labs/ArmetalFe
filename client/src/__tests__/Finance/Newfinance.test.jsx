// src/__tests__/pages/finance/NewFinance.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// The component calls `await dispatch(thunk)` directly and reads
// `res.meta.requestStatus` / `res.payload` (the standard createAsyncThunk
// shape), so dispatch is mocked to resolve to that same shape rather than
// needing a separate `.unwrap()`.

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";

import FinanceModal from "../../../pages/finance/NewFinance";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../../../Redux/financeThunks", () => ({
  createFinanceCategory: (args) => ({ type: "createFinanceCategory", payload: args }),
  fetchFinanceCategoryList: (paymentType) => ({
    type: "fetchFinanceCategoryList",
    payload: paymentType,
  }),
}));

const mockDispatch = jest.fn();
const mockOnClose = jest.fn();
const mockOnSave = jest.fn().mockResolvedValue(undefined);

const incomeCategories = [
  { id: 1, name: "salary" },
  { id: 2, name: "bonus" },
];

beforeEach(() => {
  jest.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  mockDispatch.mockImplementation((action) => {
    if (action.type === "fetchFinanceCategoryList") {
      return Promise.resolve({
        meta: { requestStatus: "fulfilled" },
        payload: { results: incomeCategories },
      });
    }
    return Promise.resolve({ meta: { requestStatus: "fulfilled" }, payload: {} });
  });
});

describe("FinanceModal", () => {
  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <FinanceModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders the form with today's date pre-filled when open", () => {
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText("New Finance Entry")).toBeInTheDocument();

    const today = new Date().toISOString().split("T")[0];
    expect(screen.getByDisplayValue(today)).toBeInTheDocument();
  });

  test("loads categories for the selected payment type and resets category on change", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    const paymentSelect = screen.getByDisplayValue("Select Payment Type");
    await user.selectOptions(paymentSelect, "IN");

    await waitFor(() => {
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "fetchFinanceCategoryList")
      ).toBe(true);
    });

    const categorySelect = screen.getByDisplayValue("Select Category");
    expect(within(categorySelect).getByText("salary")).toBeInTheDocument();
    expect(within(categorySelect).getByText("bonus")).toBeInTheDocument();
  });

  test("clears category options when payment type is cleared back to blank", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    const paymentSelect = screen.getByDisplayValue("Select Payment Type");
    await user.selectOptions(paymentSelect, "IN");
    await waitFor(() =>
      expect(screen.queryByText("salary")).toBeInTheDocument()
    );

    await user.selectOptions(paymentSelect, "");
    await waitFor(() => expect(screen.queryByText("salary")).not.toBeInTheDocument());
  });

  test("shows a text input for a new category when '+ Add New Category' is selected", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await waitFor(() => screen.getByText("salary"));
    await user.selectOptions(screen.getByDisplayValue("Select Category"), "ADD_NEW");

    expect(screen.getByPlaceholderText("Enter new category")).toBeInTheDocument();
  });

  test("shows validation errors for missing category, payment type, and amount", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(screen.getByText("Payment type is required")).toBeInTheDocument();
    expect(screen.getByText("Amount is required")).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("shows an error when the amount is zero or negative", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await waitFor(() => screen.getByText("salary"));
    await user.selectOptions(screen.getByDisplayValue("Select Category"), "1");
    await user.type(screen.getByRole("spinbutton"), "-5");

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText("Amount must be greater than 0")).toBeInTheDocument();
  });

  test("requires a name before creating a new category", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await waitFor(() => screen.getByText("salary"));
    await user.selectOptions(screen.getByDisplayValue("Select Category"), "ADD_NEW");
    await user.type(screen.getByRole("spinbutton"), "100");

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText("Enter category name")).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("creating a new category dispatches create + refetch, then saves using the new id", async () => {
    const user = userEvent.setup();
    mockDispatch.mockImplementation((action) => {
      if (action.type === "fetchFinanceCategoryList") {
        return Promise.resolve({
          meta: { requestStatus: "fulfilled" },
          payload: { results: incomeCategories },
        });
      }
      if (action.type === "createFinanceCategory") {
        return Promise.resolve({
          meta: { requestStatus: "fulfilled" },
          payload: { id: 99, name: "travel" },
        });
      }
      return Promise.resolve({ meta: { requestStatus: "fulfilled" }, payload: {} });
    });

    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);
    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await waitFor(() => screen.getByText("salary"));
    await user.selectOptions(screen.getByDisplayValue("Select Category"), "ADD_NEW");
    await user.type(screen.getByPlaceholderText("Enter new category"), "Travel");
    await user.type(screen.getByRole("spinbutton"), "250");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ category: 99, paymentType: "IN", amount1: "250" })
      );
    });

    const createCall = mockDispatch.mock.calls.find(
      (c) => c[0].type === "createFinanceCategory"
    );
    expect(createCall[0].payload).toEqual({ name: "travel", payment_type: "IN" });
  });

  test("submits an existing category with the mapped payload and resets the form", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await waitFor(() => screen.getByText("salary"));
    await user.selectOptions(screen.getByDisplayValue("Select Category"), "1");
    await user.type(screen.getByRole("spinbutton"), "500");
    await user.type(document.querySelector("textarea[name='note']"), "Groceries");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ category: "1", paymentType: "IN", amount1: "500" })
      );
    });

    // Form resets after a successful save.
    expect(screen.getByDisplayValue("Select Payment Type")).toBeInTheDocument();
  });

  test("Cancel resets the form and calls onClose", async () => {
    const user = userEvent.setup();
    render(<FinanceModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    await user.selectOptions(screen.getByDisplayValue("Select Payment Type"), "IN");
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
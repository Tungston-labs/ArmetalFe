import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";

import EmployeeList from "./Visa"; // adjust path/filename to match your project
import * as employeeSlice from "../../Redux/employeeSlice";

// ---- Mocks ----
jest.mock("../../Redux/employeeSlice", () => ({
  getAllEmployees: jest.fn(() => ({ type: "employees/getAllEmployees" })),
  deleteEmployeeById: jest.fn(() => ({ type: "employees/deleteEmployeeById" })),
  getUpcomingExpiryEmployees: jest.fn(() => ({
    type: "employees/getUpcomingExpiryEmployees",
  })),
}));

jest.mock("../../Components/Loader", () => () => <div>Spinner...</div>);

// Capture the latest onPageChange handler so tests can invoke it directly
// with arbitrary (including invalid) values.
let latestOnPageChange = null;
jest.mock("../../Components/Pagination/Pagination", () => (props) => {
  latestOnPageChange = props.onPageChange;
  return (
    <div data-testid="pagination">
      {`Page ${props.currentPage} of ${props.totalPages}`}
      <button onClick={() => props.onPageChange(props.currentPage + 1)}>Next</button>
    </div>
  );
});

jest.mock("../../Components/No found/Noemployeefound", () => (props) => (
  <div>No results for "{props.searchTerm}"</div>
));

jest.mock("../../Components/EmployeeTitle", () => (props) => (
  <div>
    <input
      placeholder="search"
      value={props.searchValue}
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
    <select
      value={props.selectedDropdownValue}
      onChange={(e) => props.onDropdownChange(e.target.value)}
    >
      <option value="">None</option>
      {props.dropdownOptions?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
));

const employees = [
  {
    id: 1,
    name: "john",
    employee_id: "EMP001",
    email: "john@example.com",
    contract_expiry_date: "2026-08-15",
    visa_expiry_date: "2026-09-01",
  },
  {
    id: 2,
    name: "amy",
    employee_id: "EMP002",
    email: "amy@example.com",
    contract_expiry_date: "2026-08-20",
    visa_expiry_date: "2026-09-10",
  },
];

function renderWithProviders({
  employeeList = employees,
  loading = false,
  pagination = { total_pages: 3, current_page: 1 },
} = {}) {
  const store = configureStore({
    reducer: {
      employees: (state = { employeeList, loading, pagination }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <EmployeeList />
    </Provider>
  );
}

describe("EmployeeList (visa/contract expiry)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("dispatches getAllEmployees by default (no expiry filter) on mount", () => {
    renderWithProviders();
    expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith({ page: 1, search: "" });
    expect(employeeSlice.getUpcomingExpiryEmployees).not.toHaveBeenCalled();
  });

  test("shows loader overlay while loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Spinner...")).toBeInTheDocument();
  });

  test("shows 'Loading...' text row inside the table body while loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders employee rows with capitalized name and 'Contract Expiry Date' header for IN users", () => {
    localStorage.setItem("user", JSON.stringify({ company: { country: "IN" } }));
    renderWithProviders();

    expect(screen.getByText("Contract Expiry Date")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Amy")).toBeInTheDocument();
    expect(screen.getByText("15/Aug/2026")).toBeInTheDocument();
  });

  test("defaults to 'IN' (contract expiry) when no user is stored", () => {
    renderWithProviders();
    expect(screen.getByText("Contract Expiry Date")).toBeInTheDocument();
  });

  test("shows 'Visa Expiry Date' header and visa dates for non-IN users", () => {
    localStorage.setItem("user", JSON.stringify({ company: { country: "US" } }));
    renderWithProviders();

    expect(screen.getByText("Visa Expiry Date")).toBeInTheDocument();
    expect(screen.getByText("01/Sep/2026")).toBeInTheDocument();
  });

  test("reads user from sessionStorage when localStorage has no user", () => {
    sessionStorage.setItem("user", JSON.stringify({ company: { country: "US" } }));
    renderWithProviders();
    expect(screen.getByText("Visa Expiry Date")).toBeInTheDocument();
  });

  test("shows empty state when there are no employees", () => {
    renderWithProviders({ employeeList: [] });
    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });

  test("debounces search input before dispatching getAllEmployees", () => {
    renderWithProviders();
    employeeSlice.getAllEmployees.mockClear();

    const input = screen.getByPlaceholderText("search");
    fireEvent.change(input, { target: { value: "john" } });

    // Not yet dispatched before debounce window elapses
    expect(employeeSlice.getAllEmployees).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ search: "john", page: 1 })
    );
  });

  test("resets page to 1 immediately when the user types a new search", () => {
    renderWithProviders({ pagination: { total_pages: 3, current_page: 2 } });
    const input = screen.getByPlaceholderText("search");
    fireEvent.change(input, { target: { value: "a" } });
    jest.advanceTimersByTime(500);

    expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 })
    );
  });

  test("selecting the visa expiry dropdown dispatches getUpcomingExpiryEmployees instead", async () => {
    renderWithProviders();
    employeeSlice.getAllEmployees.mockClear();

    const select = screen.getByDisplayValue("None");
    fireEvent.change(select, { target: { value: "visa" } });

    expect(employeeSlice.getUpcomingExpiryEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ expiryType: "visa", page: 1 })
    );
    expect(employeeSlice.getAllEmployees).not.toHaveBeenCalled();
  });

  test("selecting the contract expiry dropdown dispatches getUpcomingExpiryEmployees with 'contract'", () => {
    renderWithProviders();
    const select = screen.getByDisplayValue("None");
    fireEvent.change(select, { target: { value: "contract" } });

    expect(employeeSlice.getUpcomingExpiryEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ expiryType: "contract" })
    );
  });

  test("clearing the expiry filter switches back to getAllEmployees", () => {
    renderWithProviders();
    const select = screen.getByDisplayValue("None");
    fireEvent.change(select, { target: { value: "visa" } });
    employeeSlice.getAllEmployees.mockClear();
    employeeSlice.getUpcomingExpiryEmployees.mockClear();

    fireEvent.change(select, { target: { value: "" } });

    expect(employeeSlice.getAllEmployees).toHaveBeenCalled();
    expect(employeeSlice.getUpcomingExpiryEmployees).not.toHaveBeenCalled();
  });

  test("pagination reflects current_page and total_pages from redux state", () => {
    renderWithProviders({ pagination: { total_pages: 4, current_page: 2 } });
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 2 of 4");
  });

  test("changing the page via Pagination triggers a re-fetch for the new page", () => {
    renderWithProviders();
    employeeSlice.getAllEmployees.mockClear();

    fireEvent.click(screen.getByText("Next"));

    expect(employeeSlice.getAllEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  test("ignores invalid page changes (0 or negative)", () => {
    renderWithProviders();
    employeeSlice.getAllEmployees.mockClear();

    // Invoke the real onPageChange handler directly with invalid values.
    latestOnPageChange(0);
    latestOnPageChange(-1);
    latestOnPageChange(null);

    expect(employeeSlice.getAllEmployees).not.toHaveBeenCalled();
  });
});
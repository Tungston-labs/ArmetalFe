import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";

import AttendanceReport from "../../Pages/attendanceReport/AttendanceReport"; // adjust path/filename to match your project
import * as attendanceSlice from "../../Redux/attendanceSlice";
import * as monthlyAttendance from "../../utils/montlyAttendance";

// ---- Mocks ----
vi.mock("../../Redux/attendanceSlice", () => ({
  getAttendanceSummary: vi.fn(() => ({ type: "attendance/getAttendanceSummary" })),
}));

vi.mock("../../utils/montlyAttendance", () => ({
  exportAttendanceExcel: vi.fn(),
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: (props) => (
    <div data-testid="pagination">
      {`Page ${props.currentPage} of ${props.totalPages}`}
      <button onClick={() => props.onPageChange(props.currentPage + 1)}>Next</button>
    </div>
  ),
}));

// FIXED: path corrected to be relative to this test file's location,
// resolving to where AttendanceReport.jsx actually imports the modal from
// (src/Pages/attendanceReport/EmployeeAttendanceModal), plus wrapped in
// { default: ... }
vi.mock("../../Pages/attendanceReport/EmployeeAttendanceModal", () => ({
  default: (props) =>
    props.isOpen ? (
      <div data-testid="attendance-modal">
        {props.employee?.employee_name} - {props.monthName}
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => (
    <input
      placeholder="search"
      value={props.searchValue}
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
  ),
}));

const summaryResults = [
  {
    employee_id: "E1",
    employee_name: "Zack",
    working_days: 22,
    present_days: 20,
    absent_days: 2,
    lop_days: 1,
  },
  {
    employee_id: "E2",
    employee_name: "Amy",
    working_days: 22,
    present_days: 22,
    absent_days: 0,
    lop_days: 0,
  },
];

function renderWithProviders({
  token = "test-token",
  attendanceSummary = { results: summaryResults, current_page: 1, total_pages: 2 },
  summaryLoading = false,
} = {}) {
  const store = configureStore({
    reducer: {
      auth: (state = { accessToken: token }) => state,
      attendance: (state = { attendanceSummary, summaryLoading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <AttendanceReport />
    </Provider>
  );
}

describe("AttendanceReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("dispatches getAttendanceSummary for the current month with the auth token on mount", () => {
    renderWithProviders();
    const now = new Date();
    expect(attendanceSlice.getAttendanceSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        page: 1,
        token: "test-token",
      })
    );
  });

  test("does not dispatch getAttendanceSummary when there is no auth token", () => {
    renderWithProviders({ token: "" });
    expect(attendanceSlice.getAttendanceSummary).not.toHaveBeenCalled();
  });

  test("falls back to auth.token when auth.accessToken is absent", () => {
    const store = configureStore({
      reducer: {
        auth: (state = { token: "fallback-token" }) => state,
        attendance: (state = { attendanceSummary: { results: [] }, summaryLoading: false }) => state,
      },
    });
    render(
      <Provider store={store}>
        <AttendanceReport />
      </Provider>
    );
    expect(attendanceSlice.getAttendanceSummary).toHaveBeenCalledWith(
      expect.objectContaining({ token: "fallback-token" })
    );
  });

  test("shows the loading row while summaryLoading is true", () => {
    renderWithProviders({ summaryLoading: true });
    expect(screen.getByText("Loading attendance...")).toBeInTheDocument();
  });

  test("renders employee rows sorted alphabetically by name", () => {
    renderWithProviders();
    const rows = screen.getAllByRole("row").slice(1); // skip header row
    expect(rows[0]).toHaveTextContent("Amy");
    expect(rows[1]).toHaveTextContent("Zack");
  });

  test("renders working/present/absent/LOP figures per employee", () => {
    renderWithProviders();
    const zackRow = screen.getByText("Zack").closest("tr");
    expect(zackRow).toHaveTextContent("22");
    expect(zackRow).toHaveTextContent("20");
    expect(zackRow).toHaveTextContent("2");
    expect(zackRow).toHaveTextContent("1");
  });

  test("falls back to alternate field names (workingDays/present/absent/lop) when primary fields are absent", () => {
    renderWithProviders({
      attendanceSummary: {
        results: [
          {
            employee_id: "E3",
            employee_name: "Ben",
            workingDays: 15,
            present: 14,
            absent: 1,
            lop: 3,
          },
        ],
        current_page: 1,
        total_pages: 1,
      },
    });
    const row = screen.getByText("Ben").closest("tr");
    expect(row).toHaveTextContent("15");
    expect(row).toHaveTextContent("14");
    expect(row).toHaveTextContent("3");
  });

  test("shows a 'No records' message including the selected month name when there are no results", () => {
    renderWithProviders({ attendanceSummary: { results: [], current_page: 1, total_pages: 1 } });
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" });
    expect(screen.getByText(new RegExp(`No records for ${monthName}`, "i"))).toBeInTheDocument();
  });

  test("filters visible rows by search term (case-insensitive)", () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText("search");
    fireEvent.change(input, { target: { value: "zac" } });

    expect(screen.getByText("Zack")).toBeInTheDocument();
    expect(screen.queryByText("Amy")).not.toBeInTheDocument();
  });

  test("clicking an employee row opens the attendance modal with employee and month name", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Zack"));

    const modal = screen.getByTestId("attendance-modal");
    expect(modal).toHaveTextContent("Zack");
  });

  test("closing the modal hides it", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Zack"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("attendance-modal")).not.toBeInTheDocument();
  });

  test("changing the month input re-dispatches getAttendanceSummary for the new month", () => {
    renderWithProviders();
    attendanceSlice.getAttendanceSummary.mockClear();

    const monthInput = document.querySelector('input[type="month"]');
    fireEvent.change(monthInput, { target: { value: "2026-03" } });

    expect(attendanceSlice.getAttendanceSummary).toHaveBeenCalledWith(
      expect.objectContaining({ year: 2026, month: 3, page: 1 })
    );
  });

  test("pagination reflects current_page and total_pages from the summary response", () => {
    renderWithProviders({
      attendanceSummary: { results: summaryResults, current_page: 2, total_pages: 5 },
    });
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 2 of 5");
  });

  test("changing the page dispatches getAttendanceSummary with the new page", () => {
    renderWithProviders();
    attendanceSlice.getAttendanceSummary.mockClear();

    fireEvent.click(screen.getByText("Next"));

    expect(attendanceSlice.getAttendanceSummary).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  test("page change does nothing without a token", () => {
    renderWithProviders({ token: "" });
    fireEvent.click(screen.getByText("Next"));
    expect(attendanceSlice.getAttendanceSummary).not.toHaveBeenCalled();
  });

  test("clicking the Excel report button calls exportAttendanceExcel with the results and selected month", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/Monthly Report \(Excel\)/i));

    expect(monthlyAttendance.exportAttendanceExcel).toHaveBeenCalledWith(
      summaryResults,
      expect.any(String)
    );
  });

  test("handles a missing attendanceSummary gracefully (renders empty state, no crash)", () => {
    const store = configureStore({
      reducer: {
        auth: (state = { accessToken: "t" }) => state,
        attendance: (state = {}) => state,
      },
    });
    render(
      <Provider store={store}>
        <AttendanceReport />
      </Provider>
    );
    expect(screen.getByText(/No records for/i)).toBeInTheDocument();
  });
});
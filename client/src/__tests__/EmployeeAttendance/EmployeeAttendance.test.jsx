import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import AttendanceList from "../../Pages/attendance/AttendanceList"; // adjust path/filename to match your project
import * as departmentSlice from "../../Redux/departmentSlice";
import * as attendanceSlice from "../../Redux/attendanceSlice";

// ---- Mocks ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartmentsMin: vi.fn(() => ({ type: "departments/getDepartmentsMin" })),
}));

const defaultAttendanceResults = [
  {
    employee: 1,
    employee_name: "John Smith",
    employee_id: "EMP001",
    date: "2026-07-20",
    first_swipe_in: "09:00 AM",
    last_swipe_out: "05:00 PM",
    attendance_today: true,
    sessions: [{ time_in: "2026-07-20T09:00:00Z", time_out: "2026-07-20T17:00:00Z" }],
  },
];

vi.mock("../../Redux/attendanceSlice", () => ({
  getAttendanceList: vi.fn(() => ({
    type: "attendance/getAttendanceList",
    payload: { results: [] },
  })),
}));

// FIXED: all three mocks below now return { default: ... }
vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <div>Dept Loading...</div>,
}));

vi.mock("../../Components/No found/Noemployeefound", () => ({
  default: (props) => <div>No results for "{props.searchTerm}"</div>,
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

const departments = [
  {
    id: 1,
    name: "Engineering",
    swiped_employee_count: 8,
    total_employee_count: 10,
  },
  {
    id: 2,
    name: "Sales",
    swiped_employee_count: 3,
    total_employee_count: 5,
  },
];

function renderWithProviders({ departmentList = departments, loading = false } = {}) {
  const store = configureStore({
    reducer: {
      departments: (state = { minList: departmentList, loading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AttendanceList />
      </MemoryRouter>
    </Provider>
  );
}

describe("AttendanceList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: [] },
    }));
  });

  test("dispatches getDepartmentsMin on mount", () => {
    renderWithProviders();
    expect(departmentSlice.getDepartmentsMin).toHaveBeenCalledWith({ page: 1, search: "" });
  });

  test("shows the loader while departments are loading", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders a card for each department with swiped/total counts", () => {
    renderWithProviders();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("8 / 10 Swiped")).toBeInTheDocument();
    expect(screen.getByText("3 / 5 Swiped")).toBeInTheDocument();
  });

  test("shows empty state when no department matches the search", () => {
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText("search"), {
      target: { value: "nonexistent" },
    });
    expect(screen.getByText(/no results for "nonexistent"/i)).toBeInTheDocument();
  });

  test("filters department cards by search text", () => {
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText("search"), {
      target: { value: "eng" },
    });
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.queryByText("Sales")).not.toBeInTheDocument();
  });

  test("clicking a department header expands it and fetches attendance data", async () => {
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: defaultAttendanceResults },
    }));

    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));

    await waitFor(() => expect(screen.getByText("John Smith")).toBeInTheDocument());
    expect(attendanceSlice.getAttendanceList).toHaveBeenCalledWith({ department_id: 1 });
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("09:00 AM")).toBeInTheDocument();
    expect(screen.getByText("05:00 PM")).toBeInTheDocument();
  });

  test("clicking an expanded department header again collapses it", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Sl No")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Engineering"));
    expect(screen.queryByText("Sl No")).not.toBeInTheDocument();
  });

  test("shows 'No attendance found.' when the expanded department has no records", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("No attendance found.")).toBeInTheDocument());
  });

test("formats the in-date column and falls back to '-' for a missing date", async () => {
  attendanceSlice.getAttendanceList.mockImplementation(() => ({
    type: "attendance/getAttendanceList",
    payload: {
      results: [{ ...defaultAttendanceResults[0], date: null }],
    },
  }));
  renderWithProviders();
  fireEvent.click(screen.getByText("Engineering"));

  await waitFor(() => expect(screen.getByText("John Smith")).toBeInTheDocument());
  expect(screen.getByText("-")).toBeInTheDocument();
});

test("clicking an employee row navigates to that employee's attendance detail page", async () => {
  attendanceSlice.getAttendanceList.mockImplementation(() => ({
    type: "attendance/getAttendanceList",
    payload: { results: defaultAttendanceResults },
  }));
  renderWithProviders();
  fireEvent.click(screen.getByText("Engineering"));

  await waitFor(() => expect(screen.getByText("John Smith")).toBeInTheDocument());
  fireEvent.click(screen.getByText("John Smith"));
  expect(mockNavigate).toHaveBeenCalledWith("/employee-attendance/detail/1");
});

  test("shows pagination controls only when a department has more than one page of employees", async () => {
    const manyEmployees = Array.from({ length: 15 }, (_, i) => ({
      employee: i + 1,
      employee_name: `Employee ${i + 1}`,
      employee_id: `EMP${i + 1}`,
      date: "2026-07-20",
      sessions: [],
    }));
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: manyEmployees },
    }));

    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));

    await waitFor(() => expect(screen.getByText("Employee 1")).toBeInTheDocument());
    expect(screen.getByText("Page 1 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Employee 11")).not.toBeInTheDocument();
  });

  test("does not show pagination controls when there are 10 or fewer employees", async () => {
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: defaultAttendanceResults },
    }));
    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));

    await waitFor(() => expect(screen.getByText("John Smith")).toBeInTheDocument());
    expect(screen.queryByText(/Page \d+ \/ \d+/)).not.toBeInTheDocument();
  });

  test("clicking next page shows the next set of employees for that department", async () => {
    const manyEmployees = Array.from({ length: 15 }, (_, i) => ({
      employee: i + 1,
      employee_name: `Employee ${i + 1}`,
      employee_id: `EMP${i + 1}`,
      date: "2026-07-20",
      sessions: [],
    }));
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: manyEmployees },
    }));

    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Employee 1")).toBeInTheDocument());

    const nextButton = screen.getAllByRole("button").find((btn) => !btn.disabled && btn !== screen.queryByText("Page 1 / 2"));
    // Fallback: pagination buttons are the two rendered without visible text (icon-only)
    const buttons = screen.getByText("Page 1 / 2").parentElement.querySelectorAll("button");
    fireEvent.click(buttons[1]); // next button is the second one

    await waitFor(() => expect(screen.getByText("Employee 11")).toBeInTheDocument());
    expect(screen.getByText("Page 2 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Employee 1")).not.toBeInTheDocument();
  });

  test("previous page button is disabled on page 1 and next is disabled on the last page", async () => {
    const manyEmployees = Array.from({ length: 15 }, (_, i) => ({
      employee: i + 1,
      employee_name: `Employee ${i + 1}`,
      employee_id: `EMP${i + 1}`,
      date: "2026-07-20",
      sessions: [],
    }));
    attendanceSlice.getAttendanceList.mockImplementation(() => ({
      type: "attendance/getAttendanceList",
      payload: { results: manyEmployees },
    }));

    renderWithProviders();
    fireEvent.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Employee 1")).toBeInTheDocument());

    const buttons = screen.getByText("Page 1 / 2").parentElement.querySelectorAll("button");
    expect(buttons[0]).toBeDisabled(); // prev
    expect(buttons[1]).not.toBeDisabled(); // next

    fireEvent.click(buttons[1]);
    await waitFor(() => expect(screen.getByText("Page 2 / 2")).toBeInTheDocument());

    const buttonsPage2 = screen.getByText("Page 2 / 2").parentElement.querySelectorAll("button");
    expect(buttonsPage2[1]).toBeDisabled(); // next disabled on last page
  });
});
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import TrackingList from "../../Pages/Attendance/TrackingList";
import * as attendanceSlice from "../../Redux/attendanceSlice";

// ---- Mocks ----
vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        results: [
          {
            logged_at: "2026-09-01 12:00:00",
            location_name: "Client Site",
          },
        ],
      },
    }),
  },
}));

vi.mock("../../Redux/attendanceSlice", () => ({
  getAttendanceDetail: vi.fn((payload) => ({
    type: "attendance/getDetail",
    payload,
  })),
}));

vi.mock("../../hooks/useAccessToken", () => ({
  getAccessToken: vi.fn().mockResolvedValue("test-token"),
}));

vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../Components/header/EmployeeHeader", () => ({
  default: ({ employee }) => (
    <div data-testid="employee-header">
      <span>{employee?.name || "No Name"}</span>
      <span>{employee?.employee_id || "No ID"}</span>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, breadcrumbs }) => (
    <div data-testid="reusable-header">
      <h2>{title}</h2>
      <span>{breadcrumbs?.join(" > ")}</span>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data, loading }) => (
    <div data-testid="reusable-table">
      {loading && <div data-testid="table-loading">Loading locations...</div>}
      <div data-testid="rows-count">{data?.length || 0} rows</div>
      <ul>
        {(data || []).map((row, idx) => (
          <li key={row.id || idx}>
            {row.action} - {row.time} - {row.location || "no loc"}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

const mockAttendanceDetail = {
  id: 2647,
  date: "2026-09-01",
  total_hours: "0.00",
  total_hours_formatted: "00:00",
  weekly_hours_formatted: "10:30",
  monthly_hours_formatted: "45:00",
  today_first_punch_in: "08:30",
  today_last_punch_out: "17:00",
  employee: {
    id: 343,
    name: "Ajay kumar",
    email: "ajaytungstonlabs@gmail.com",
    employee_id: "TUNDEVT1V",
    designation: "Software Developer",
  },
  sessions: [
    {
      id: 4300,
      time_in: "2026-09-01 08:30:00",
      time_out: "2026-09-01 17:00:00",
      punch_in_location: "Office Front",
      punch_out_location: "Office Exit",
    },
  ],
};

function renderWithProviders({
  attendanceDetailState = mockAttendanceDetail,
  detailLoading = false,
  error = null,
  route = "/employee-attendance-tracking/343",
  props = {},
} = {}) {
  const store = configureStore({
    reducer: {
      attendance: (
        state = {
          attendanceDetail: attendanceDetailState,
          detailLoading,
          error,
        }
      ) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/employee-attendance-tracking/:id"
            element={<TrackingList {...props} />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("TrackingList Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("dispatches getAttendanceDetail on mount with route param id", () => {
    renderWithProviders();
    expect(attendanceSlice.getAttendanceDetail).toHaveBeenCalledWith({
      attendanceId: "343",
      date: "",
    });
  });

  test("shows Loader when detailLoading is true and attendanceDetail is null", () => {
    renderWithProviders({
      attendanceDetailState: null,
      detailLoading: true,
    });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-header")).not.toBeInTheDocument();
  });

  test("renders EmployeeHeader with employee details", () => {
    renderWithProviders();
    expect(screen.getByTestId("employee-header")).toHaveTextContent("Ajay kumar");
    expect(screen.getByTestId("employee-header")).toHaveTextContent("TUNDEVT1V");
  });

  test("renders summary cards with correct attendance information", () => {
    renderWithProviders();
    expect(screen.getByText("Today Punch In")).toBeInTheDocument();
    expect(screen.getByText("Today Punch Out")).toBeInTheDocument();
    expect(screen.getByText("Weekly Hours")).toBeInTheDocument();
    expect(screen.getByText("10:30")).toBeInTheDocument();
    expect(screen.getByText("Monthly Hours")).toBeInTheDocument();
    expect(screen.getByText("45:00")).toBeInTheDocument();
  });

  test("allows changing date and re-dispatches getAttendanceDetail", async () => {
    renderWithProviders();
    const dateInput = screen.getByDisplayValue("2026-09-01");
    fireEvent.change(dateInput, { target: { value: "2026-09-02" } });

    await waitFor(() => {
      expect(attendanceSlice.getAttendanceDetail).toHaveBeenCalledWith({
        attendanceId: "343",
        date: "2026-09-02",
      });
    });
  });

  test("renders session events and live tracking events in table", async () => {
    renderWithProviders();
    const table = await screen.findByTestId("reusable-table");
    await waitFor(() => {
      expect(within(table).getByText(/Live Tracking/)).toBeInTheDocument();
    });
    expect(within(table).getByText(/Punch In/)).toBeInTheDocument();
    expect(within(table).getByText(/Punch Out/)).toBeInTheDocument();
  });

  test("renders custom prop cardList when provided", () => {
    const customCards = [
      { title: "Custom Stat 1", value: "100" },
      { title: "Custom Stat 2", value: "200" },
    ];
    renderWithProviders({ props: { cardList: customCards } });
    expect(screen.getByText("Custom Stat 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  test("displays error message if error is present in state", () => {
    renderWithProviders({ error: "Failed to load attendance" });
    expect(screen.getByText("Failed to load attendance")).toBeInTheDocument();
  });
});

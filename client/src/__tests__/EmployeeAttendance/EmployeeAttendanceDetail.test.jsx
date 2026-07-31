import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import TimesheetPage from "../../Pages/attendance/Attendance"; // adjust path/filename to match your project
import * as attendanceSlice from "../../Redux/attendanceSlice";

// ---- Mocks ----
vi.mock("../../Redux/attendanceSlice", () => ({
  getAttendanceDetail: vi.fn(() => ({ type: "attendance/getAttendanceDetail" })),
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("../../Components/EmployeeTitle", () => ({
  default: () => <div>Title Bar</div>,
}));

vi.mock("../../Components/header/EmployeeHeader", () => ({
  default: (props) => (
    <div data-testid="employee-header">
      {props.employee?.name || "No Employee"} - editable:{String(props.editable)}
    </div>
  ),
}));

vi.mock("../../Components/attendance/AttendanceDetailsContainer", () => ({
  default: (props) => (
    <div data-testid="attendance-details">
      date:{props.selectedDate}
      <button onClick={() => props.setSelectedDate("2026-08-05")}>Change Date</button>
    </div>
  ),
}));

const attendanceDetail = {
  date: "2026-08-01",
  employee: { id: 1, name: "John Smith" },
  sessions: [{ time_in: "09:00", time_out: "17:00" }],
};

function renderWithProviders({
  attendanceDetailState = attendanceDetail,
  detailLoading = false,
  route = "/employee-attendance/detail/42",
  locationState = undefined,
} = {}) {
  const store = configureStore({
    reducer: {
      attendance: (state = { attendanceDetail: attendanceDetailState, detailLoading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: route.split("/detail/")[0] + "/detail/42", state: locationState }]}
      >
        <Routes>
          <Route path="/employee-attendance/detail/:id" element={<TimesheetPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("TimesheetPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("dispatches getAttendanceDetail with the route id and empty selectedDate on mount", () => {
    renderWithProviders();
    expect(attendanceSlice.getAttendanceDetail).toHaveBeenCalledWith({
      attendanceId: "42",
      date: "",
    });
  });

  test("shows the loader and nothing else while detailLoading is true", () => {
    renderWithProviders({ detailLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("attendance-details")).not.toBeInTheDocument();
  });

  test("renders the employee header with the fetched employee, non-editable", () => {
    renderWithProviders();
    expect(screen.getByTestId("employee-header")).toHaveTextContent("John Smith");
    expect(screen.getByTestId("employee-header")).toHaveTextContent("editable:false");
  });

  test("defaults employee to an empty object when attendanceDetail is missing", () => {
    renderWithProviders({ attendanceDetailState: null });
    expect(screen.getByTestId("employee-header")).toHaveTextContent("No Employee");
  });

  test("passes attendanceDetail and selectedDate down to AttendanceDetailsContainer", async () => {
    renderWithProviders();
    // The second effect syncs selectedDate from attendanceDetail.date once it loads.
    await waitFor(() =>
      expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-01")
    );
  });

  test("auto-populates selectedDate from attendanceDetail.date only when selectedDate is still empty", async () => {
    attendanceSlice.getAttendanceDetail.mockClear();
    renderWithProviders();

    await waitFor(() =>
      expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-01")
    );
    // Once populated, this second effect should have triggered a re-fetch
    // via the [id, selectedDate, dispatch] effect as selectedDate changed.
    expect(attendanceSlice.getAttendanceDetail).toHaveBeenCalledWith({
      attendanceId: "42",
      date: "2026-08-01",
    });
  });

  test("changing the selected date via the child re-dispatches getAttendanceDetail with the new date", async () => {
    renderWithProviders();
    await waitFor(() =>
      expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-01")
    );
    attendanceSlice.getAttendanceDetail.mockClear();

    fireEvent.click(screen.getByText("Change Date"));

    await waitFor(() =>
      expect(attendanceSlice.getAttendanceDetail).toHaveBeenCalledWith({
        attendanceId: "42",
        date: "2026-08-05",
      })
    );
    expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-05");
  });

  test("does not overwrite a manually-changed selectedDate with attendanceDetail.date on refetch", async () => {
    renderWithProviders();
    await waitFor(() =>
      expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-01")
    );

    fireEvent.click(screen.getByText("Change Date")); // sets selectedDate to 2026-08-05
    await waitFor(() =>
      expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-05")
    );

    // Even if attendanceDetail.date is still 2026-08-01 in the store, the
    // sync effect only runs when selectedDate is falsy, so it should remain 08-05.
    expect(screen.getByTestId("attendance-details")).toHaveTextContent("date:2026-08-05");
  });

  test("does not dispatch when there is no id in the route", () => {
    attendanceSlice.getAttendanceDetail.mockClear();
    const store = configureStore({
      reducer: {
        attendance: (state = { attendanceDetail: null, detailLoading: false }) => state,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/employee-attendance/detail/"]}>
          <Routes>
            <Route path="/employee-attendance/detail/:id?" element={<TimesheetPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(attendanceSlice.getAttendanceDetail).not.toHaveBeenCalled();
  });
});
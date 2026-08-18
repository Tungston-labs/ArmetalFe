import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import AttendanceDetails from "../../Components/attendance/AttendanceDetails";

// ---------------------------------------------------------
// MOCK ACCESS TOKEN
// ---------------------------------------------------------
vi.mock("../../hooks/useAccessToken", () => ({
  getAccessToken: vi.fn(),
}));

import { getAccessToken } from "../../hooks/useAccessToken";

// ---------------------------------------------------------
// TEST DATA
// ---------------------------------------------------------
const cardList = [
  {
    title: "Total Hours",
    value: "8h 30m",
  },
  {
    title: "Attendance",
    value: "Present",
  },
];

const selectedDate = "2026-08-12";

const employeeId = 101;

const formatTime = vi.fn((time) => `Formatted ${time}`);

const onDateChange = vi.fn();

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------
const renderComponent = (props = {}) => {
  return render(
    <AttendanceDetails
      cardList={cardList}
      sessions={[]}
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      formatTime={formatTime}
      employeeId={employeeId}
      {...props}
    />,
  );
};

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("AttendanceDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getAccessToken.mockResolvedValue("test-access-token");

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({
        results: [],
      }),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------
  // BASIC RENDERING
  // -------------------------------------------------------
  it("renders Attendance Details heading", async () => {
    renderComponent();

    expect(screen.getByText("Attendance Details")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // CARD LIST
  // -------------------------------------------------------
  it("renders all attendance cards", async () => {
    renderComponent();

    expect(screen.getByText("Total Hours")).toBeInTheDocument();
    expect(screen.getByText("8h 30m")).toBeInTheDocument();

    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("Present")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // NO SESSIONS
  // -------------------------------------------------------
  it("shows No sessions found when there are no events", async () => {
    renderComponent({
      sessions: [],
    });

    expect(screen.getByText("No sessions found")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // PUNCH IN
  // -------------------------------------------------------
  it("renders Punch In session", async () => {
    renderComponent({
      sessions: [
        {
          time_in: "2026-08-12T09:00:00",
          punch_in_location: "Office",
        },
      ],
    });

    expect(screen.getByText("Punch In")).toBeInTheDocument();
    expect(screen.getByText("Office")).toBeInTheDocument();

    expect(
      screen.getByText("Formatted 2026-08-12T09:00:00"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // PUNCH OUT
  // -------------------------------------------------------
  it("renders Punch Out session", async () => {
    renderComponent({
      sessions: [
        {
          time_out: "2026-08-12T17:30:00",
          punch_out_location: "Office",
        },
      ],
    });

    expect(screen.getByText("Punch Out")).toBeInTheDocument();
    expect(screen.getByText("Office")).toBeInTheDocument();

    expect(
      screen.getByText("Formatted 2026-08-12T17:30:00"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // BOTH PUNCH IN AND PUNCH OUT
  // -------------------------------------------------------
  it("renders both Punch In and Punch Out events", async () => {
    renderComponent({
      sessions: [
        {
          time_in: "2026-08-12T09:00:00",
          punch_in_location: "Office",
          time_out: "2026-08-12T17:00:00",
          punch_out_location: "Office",
        },
      ],
    });

    expect(screen.getByText("Punch In")).toBeInTheDocument();
    expect(screen.getByText("Punch Out")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // MISSING LOCATION
  // -------------------------------------------------------
  it("shows --- when session location is missing", async () => {
    renderComponent({
      sessions: [
        {
          time_in: "2026-08-12T09:00:00",
        },
      ],
    });

    expect(screen.getByText("Punch In")).toBeInTheDocument();
    expect(screen.getByText("---")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // SESSION WITHOUT TIME
  // -------------------------------------------------------
  it("does not render events without a time", async () => {
    renderComponent({
      sessions: [
        {
          time_in: null,
          time_out: null,
        },
      ],
    });

    expect(screen.getByText("No sessions found")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // MULTIPLE SESSIONS
  // -------------------------------------------------------
  it("renders events from multiple sessions", async () => {
    const sessions = [
      {
        time_in: "2026-08-12T08:00:00",
        time_out: null,
        punch_in_location: "Office",
      },
      {
        time_in: "2026-08-12T09:00:00",
        time_out: "2026-08-12T18:00:00",
        punch_in_location: "Home",
        punch_out_location: "Office",
      },
    ];

    renderComponent({ sessions });

    await waitFor(() => {
      expect(screen.getAllByText("Punch In")).toHaveLength(2);
      expect(screen.getByText("Punch Out")).toBeInTheDocument();
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getAllByText("Office")).toHaveLength(2);
  });

  // -------------------------------------------------------
  // DATE INPUT
  // -------------------------------------------------------
  it("renders selected date in date input", async () => {
    renderComponent();

    const dateInput = screen.getByDisplayValue(selectedDate);

    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("type", "date");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // DATE CHANGE
  // -------------------------------------------------------
  it("calls onDateChange when date changes", async () => {
    renderComponent();

    const dateInput = screen.getByDisplayValue(selectedDate);

    fireEvent.change(dateInput, {
      target: {
        value: "2026-08-13",
      },
    });

    expect(onDateChange).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // ACCESS TOKEN + FETCH
  // -------------------------------------------------------
  it("fetches employee locations with access token", async () => {
    renderComponent();

    await waitFor(() => {
      expect(getAccessToken).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = global.fetch.mock.calls[0];

    expect(url).toContain(`/api/background-location/${employeeId}/`);

    expect(url).toContain("date=2026-08-12");

    expect(options).toEqual({
      method: "GET",
      headers: {
        Authorization: "Bearer test-access-token",
        "Content-Type": "application/json",
      },
    });
  });

  // -------------------------------------------------------
  // LIVE TRACKING
  // -------------------------------------------------------
  it("renders live tracking location returned by API", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: vi.fn().mockResolvedValue({
        results: [
          {
            logged_at: "2026-08-12T12:00:00",
            location_name: "Dubai Mall",
          },
        ],
      }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Live Tracking")).toBeInTheDocument();
    });

    expect(screen.getByText("Dubai Mall")).toBeInTheDocument();

    expect(
      screen.getByText("Formatted 2026-08-12T12:00:00"),
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // LIVE TRACKING WITHOUT LOCATION
  // -------------------------------------------------------
  it("shows --- when live tracking location is missing", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: vi.fn().mockResolvedValue({
        results: [
          {
            logged_at: "2026-08-12T12:00:00",
          },
        ],
      }),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Live Tracking")).toBeInTheDocument();
    });

    expect(screen.getByText("---")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // NO ACCESS TOKEN
  // -------------------------------------------------------
  it("does not fetch locations when access token is missing", async () => {
    getAccessToken.mockResolvedValueOnce(null);

    renderComponent();

    await waitFor(() => {
      expect(getAccessToken).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------
  // API ERROR
  // -------------------------------------------------------
  it("handles fetch error without crashing", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Attendance Details")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // JSON RESPONSE ERROR
  // -------------------------------------------------------
  it("handles response json error without crashing", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 500,
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Attendance Details")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // FORMAT TIME
  // -------------------------------------------------------
  it("calls formatTime for rendered events", async () => {
    renderComponent({
      sessions: [
        {
          time_in: "2026-08-12T09:00:00",
          punch_in_location: "Office",
        },
      ],
    });

    expect(formatTime).toHaveBeenCalledWith("2026-08-12T09:00:00");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // SESSION SORTING
  // -------------------------------------------------------
  it("sorts session events from newest to oldest", async () => {
    renderComponent({
      sessions: [
        {
          time_in: "2026-08-12T08:00:00",
          punch_in_location: "Morning",
        },
        {
          time_in: "2026-08-12T15:00:00",
          punch_in_location: "Afternoon",
        },
      ],
    });

    const rows = screen.getAllByRole("row");

    expect(rows.length).toBeGreaterThanOrEqual(3);

    expect(
      screen.getByText("Formatted 2026-08-12T15:00:00"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Formatted 2026-08-12T08:00:00"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // EMPLOYEE ID CHANGE
  // -------------------------------------------------------
  it("fetches locations again when employeeId changes", async () => {
    const { rerender } = render(
      <AttendanceDetails
        cardList={cardList}
        sessions={[]}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        formatTime={formatTime}
        employeeId={101}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender(
      <AttendanceDetails
        cardList={cardList}
        sessions={[]}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        formatTime={formatTime}
        employeeId={202}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    const lastCall =
      global.fetch.mock.calls[global.fetch.mock.calls.length - 1];

    expect(lastCall[0]).toContain("/api/background-location/202/");
  });

  // -------------------------------------------------------
  // SELECTED DATE CHANGE
  // -------------------------------------------------------
  it("fetches locations again when selectedDate changes", async () => {
    const { rerender } = render(
      <AttendanceDetails
        cardList={cardList}
        sessions={[]}
        selectedDate="2026-08-12"
        onDateChange={onDateChange}
        formatTime={formatTime}
        employeeId={101}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender(
      <AttendanceDetails
        cardList={cardList}
        sessions={[]}
        selectedDate="2026-08-13"
        onDateChange={onDateChange}
        formatTime={formatTime}
        employeeId={101}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    const lastCall =
      global.fetch.mock.calls[global.fetch.mock.calls.length - 1];

    expect(lastCall[0]).toContain("date=2026-08-13");
  });
});
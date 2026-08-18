import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import AttendanceDetailsContainer from "../../Components/attendance/AttendanceDetailsContainer";

/* =========================================================
   MOCK AttendanceDetails
   ========================================================= */

vi.mock("../../Components/attendance/AttendanceDetails", () => ({
  default: ({
    cardList,
    sessions,
    selectedDate,
    onDateChange,
    formatTime,
    employeeId,
  }) => (
    <div data-testid="attendance-details">
      <div data-testid="selected-date">{selectedDate || ""}</div>

      <div data-testid="sessions-count">{sessions?.length ?? 0}</div>

      <div data-testid="employee-id">{employeeId ?? ""}</div>

      <div data-testid="card-list">
        {cardList.map((card) => (
          <div key={card.title} data-testid={`card-${card.title}`}>
            <span>{card.title}</span>
            <span>{card.value}</span>
          </div>
        ))}
      </div>

      <button
        data-testid="change-date"
        onClick={() =>
          onDateChange({
            target: {
              value: "2026-08-15",
            },
          })
        }
      >
        Change Date
      </button>

      <div data-testid="formatted-time">
        {formatTime("2026-08-13 17:30:00")}
      </div>
    </div>
  ),
}));

/* =========================================================
   HELPERS
   ========================================================= */

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const createAttendanceDetail = (overrides = {}) => ({
  sessions: [],
  weekly_hours_formatted: "40:00",
  monthly_hours_formatted: "160:00",
  employee: {
    id: 101,
  },
  ...overrides,
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    attendanceDetail: createAttendanceDetail(),
    selectedDate: "2026-08-13",
    setSelectedDate: vi.fn(),
  };

  return render(<AttendanceDetailsContainer {...defaultProps} {...props} />);
};

/* =========================================================
   TESTS
   ========================================================= */

describe("AttendanceDetailsContainer", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  /* -------------------------------------------------------
     1. Default values
     ------------------------------------------------------- */

  it("renders default values when attendanceDetail is not provided", () => {
    renderComponent({
      attendanceDetail: undefined,
    });

    expect(screen.getByTestId("attendance-details")).toBeInTheDocument();

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent("---");

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent("---");

    expect(screen.getByTestId("card-Weekly Hours")).toHaveTextContent("00:00");

    expect(screen.getByTestId("card-Monthly Hours")).toHaveTextContent("00:00");

    expect(screen.getByTestId("sessions-count")).toHaveTextContent("0");
  });

  /* -------------------------------------------------------
     2. First punch in and last punch out
     ------------------------------------------------------- */

  it("calculates today's first punch in and last punch out", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 09:00:00`,
          time_out: `${today} 12:00:00`,
        },
        {
          time_in: `${today} 13:00:00`,
          time_out: `${today} 17:30:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "9:00 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "5:30 PM",
    );
  });

  /* -------------------------------------------------------
     3. Ignore sessions from other dates
     ------------------------------------------------------- */

  it("ignores sessions that do not belong to today", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: "2020-01-01 08:00:00",
          time_out: "2020-01-01 17:00:00",
        },
        {
          time_in: `${today} 10:00:00`,
          time_out: `${today} 18:00:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "10:00 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "6:00 PM",
    );
  });

  /* -------------------------------------------------------
     4. Ignore sessions without time_in
     ------------------------------------------------------- */

  it("ignores sessions without time_in", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: null,
          time_out: `${today} 17:00:00`,
        },
        {
          time_in: `${today} 09:30:00`,
          time_out: `${today} 18:00:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "9:30 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "6:00 PM",
    );
  });

  /* -------------------------------------------------------
     5. Missing time_out
     ------------------------------------------------------- */

  it("shows --- when today's last session has no time_out", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 09:00:00`,
          time_out: `${today} 12:00:00`,
        },
        {
          time_in: `${today} 13:00:00`,
          time_out: null,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "9:00 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent("---");
  });

  /* -------------------------------------------------------
     6. Sorting
     ------------------------------------------------------- */

  it("sorts today's sessions by time_in before calculating punch times", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 13:00:00`,
          time_out: `${today} 17:30:00`,
        },
        {
          time_in: `${today} 08:30:00`,
          time_out: `${today} 12:00:00`,
        },
        {
          time_in: `${today} 10:00:00`,
          time_out: `${today} 13:00:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    /*
      Sorted order:

      08:30
      10:00
      13:00

      Therefore:
      First Punch In  = 8:30 AM
      Last Punch Out  = 5:30 PM
    */

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "8:30 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "5:30 PM",
    );
  });

  /* -------------------------------------------------------
     7. Default weekly/monthly hours
     ------------------------------------------------------- */

  it("uses default weekly and monthly hours when values are missing", () => {
    const attendanceDetail = createAttendanceDetail({
      weekly_hours_formatted: undefined,
      monthly_hours_formatted: undefined,
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Weekly Hours")).toHaveTextContent("00:00");

    expect(screen.getByTestId("card-Monthly Hours")).toHaveTextContent("00:00");
  });

  /* -------------------------------------------------------
     8. Custom weekly/monthly hours
     ------------------------------------------------------- */

  it("renders provided weekly and monthly hours", () => {
    const attendanceDetail = createAttendanceDetail({
      weekly_hours_formatted: "38:45",
      monthly_hours_formatted: "152:30",
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Weekly Hours")).toHaveTextContent("38:45");

    expect(screen.getByTestId("card-Monthly Hours")).toHaveTextContent(
      "152:30",
    );
  });

  /* -------------------------------------------------------
     9. Passes all sessions
     ------------------------------------------------------- */

  it("passes all sessions to AttendanceDetails", () => {
    const today = getToday();

    const sessions = [
      {
        time_in: `${today} 09:00:00`,
        time_out: `${today} 17:00:00`,
      },
      {
        time_in: "2026-08-10 09:00:00",
        time_out: "2026-08-10 17:00:00",
      },
      {
        time_in: `${today} 18:00:00`,
        time_out: null,
      },
    ];

    const attendanceDetail = createAttendanceDetail({
      sessions,
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("sessions-count")).toHaveTextContent("3");
  });

  /* -------------------------------------------------------
     10. Employee ID
     ------------------------------------------------------- */

  it("passes employee id to AttendanceDetails", () => {
    const attendanceDetail = createAttendanceDetail({
      employee: {
        id: 555,
      },
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("employee-id")).toHaveTextContent("555");
  });

  /* -------------------------------------------------------
     11. Missing employee
     ------------------------------------------------------- */

  it("handles missing employee information", () => {
    const attendanceDetail = createAttendanceDetail({
      employee: undefined,
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("employee-id")).toHaveTextContent("");
  });

  /* -------------------------------------------------------
     12. Selected date
     ------------------------------------------------------- */

  it("passes selectedDate to AttendanceDetails", () => {
    renderComponent({
      selectedDate: "2026-08-20",
    });

    expect(screen.getByTestId("selected-date")).toHaveTextContent("2026-08-20");
  });

  /* -------------------------------------------------------
     13. Date change callback
     ------------------------------------------------------- */

  it("calls setSelectedDate when the date changes", () => {
    const setSelectedDate = vi.fn();

    renderComponent({
      setSelectedDate,
    });

    fireEvent.click(screen.getByTestId("change-date"));

    expect(setSelectedDate).toHaveBeenCalledTimes(1);
    expect(setSelectedDate).toHaveBeenCalledWith("2026-08-15");
  });

  /* -------------------------------------------------------
     14. Time formatting - AM
     ------------------------------------------------------- */

  it("formats morning time correctly", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 08:05:00`,
          time_out: `${today} 12:15:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "8:05 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "12:15 PM",
    );
  });

  /* -------------------------------------------------------
     15. Time formatting - PM
     ------------------------------------------------------- */

  it("formats afternoon time correctly using 12-hour format", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 13:30:00`,
          time_out: `${today} 17:45:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "1:30 PM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "5:45 PM",
    );
  });

  /* -------------------------------------------------------
     16. Midnight formatting
     ------------------------------------------------------- */

  it("formats midnight correctly", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        {
          time_in: `${today} 00:00:00`,
          time_out: `${today} 01:00:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "12:00 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "1:00 AM",
    );
  });

  /* -------------------------------------------------------
     17. Empty sessions
     ------------------------------------------------------- */

  it("shows default punch values when sessions array is empty", () => {
    const attendanceDetail = createAttendanceDetail({
      sessions: [],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent("---");

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent("---");
  });

  /* -------------------------------------------------------
     18. Null sessions
     ------------------------------------------------------- */

  it("handles missing sessions property", () => {
    const attendanceDetail = {
      weekly_hours_formatted: "20:00",
      monthly_hours_formatted: "80:00",
      employee: {
        id: 99,
      },
    };

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("sessions-count")).toHaveTextContent("0");

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent("---");

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent("---");
  });

  /* -------------------------------------------------------
     19. Invalid/missing session object
     ------------------------------------------------------- */

  it("ignores invalid session entries without time_in", () => {
    const today = getToday();

    const attendanceDetail = createAttendanceDetail({
      sessions: [
        null,
        {},
        {
          time_in: null,
          time_out: `${today} 10:00:00`,
        },
        {
          time_in: `${today} 11:00:00`,
          time_out: `${today} 19:00:00`,
        },
      ],
    });

    renderComponent({
      attendanceDetail,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "11:00 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "7:00 PM",
    );
  });

  /* -------------------------------------------------------
     20. Full data flow
     ------------------------------------------------------- */

  it("renders complete attendance information correctly", () => {
    const today = getToday();

    const attendanceDetail = {
      sessions: [
        {
          time_in: `${today} 08:45:00`,
          time_out: `${today} 12:30:00`,
        },
        {
          time_in: `${today} 13:15:00`,
          time_out: `${today} 18:20:00`,
        },
      ],
      weekly_hours_formatted: "42:15",
      monthly_hours_formatted: "168:30",
      employee: {
        id: 777,
      },
    };

    renderComponent({
      attendanceDetail,
      selectedDate: today,
    });

    expect(screen.getByTestId("card-Today Punch In")).toHaveTextContent(
      "8:45 AM",
    );

    expect(screen.getByTestId("card-Today Punch Out")).toHaveTextContent(
      "6:20 PM",
    );

    expect(screen.getByTestId("card-Weekly Hours")).toHaveTextContent("42:15");

    expect(screen.getByTestId("card-Monthly Hours")).toHaveTextContent(
      "168:30",
    );

    expect(screen.getByTestId("employee-id")).toHaveTextContent("777");

    expect(screen.getByTestId("sessions-count")).toHaveTextContent("2");

    expect(screen.getByTestId("selected-date")).toHaveTextContent(today);
  });
});

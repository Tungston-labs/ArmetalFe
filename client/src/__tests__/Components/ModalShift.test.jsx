import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import ActivityLogModal from "../../Components/ModalShift";

// Mock react-calendar
vi.mock("react-calendar", () => ({
  default: ({ onChange, value }) => (
    <div data-testid="calendar">
      <span data-testid="calendar-value">{value?.toISOString?.() || ""}</span>

      <button
        data-testid="calendar-date"
        onClick={() => onChange(new Date("2025-05-20T00:00:00"))}
      >
        Select Date
      </button>
    </div>
  ),
}));

describe("ActivityLogModal", () => {
  let onClose;
  let onDateChange;

  beforeEach(() => {
    onClose = vi.fn();
    onDateChange = vi.fn();

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-15T12:00:00"));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // =========================================================
  // BASIC RENDER
  // =========================================================

  it("renders modal with heading and close button", () => {
    render(<ActivityLogModal onClose={onClose} />);

    expect(screen.getByText("Hourly Activity Log")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<ActivityLogModal />);

    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
  });

  // =========================================================
  // EMPTY DATA
  // =========================================================

  it("renders no location data message when there is no data", () => {
    render(
      <ActivityLogModal
        data={[]}
        hourlyLocationData={[]}
        liveLocationData={[]}
      />,
    );

    expect(screen.getByText("No location data available.")).toBeInTheDocument();
  });

  it("renders no location data when hourlyLocationData is not an array", () => {
    render(
      <ActivityLogModal hourlyLocationData={null} liveLocationData={null} />,
    );

    expect(screen.getByText("No location data available.")).toBeInTheDocument();
  });

  // =========================================================
  // DATE
  // =========================================================

  it("does not render date section when date is missing", () => {
    render(<ActivityLogModal date={undefined} />);

    expect(screen.queryByText("Hourly Activity Log")).toBeInTheDocument();

    expect(screen.queryByTestId("calendar-icon")).not.toBeInTheDocument();
  });

  it("renders date section when valid date is provided", () => {
    render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    expect(screen.getByText("15")).toBeInTheDocument();

    expect(screen.getByText("May")).toBeInTheDocument();

    expect(screen.getByText("Thursday")).toBeInTheDocument();
  });

  it("parses date containing a space instead of T", () => {
    render(<ActivityLogModal date="2025-05-15 12:00:00" />);

    expect(screen.getByText("15")).toBeInTheDocument();

    expect(screen.getByText("May")).toBeInTheDocument();
  });

  it("does not render date section for invalid date", () => {
    render(<ActivityLogModal date="invalid-date" />);

    expect(screen.queryByText("May")).not.toBeInTheDocument();

    expect(screen.queryByText("Thursday")).not.toBeInTheDocument();
  });

  // =========================================================
  // HOURLY LOCATION DATA
  // =========================================================

  it("renders hourly location data using location_name", () => {
    const hourlyLocationData = [
      {
        logged_at: "2025-05-15T10:30:00",
        location_name: "Kochi Office",
        latitude: 9.9312,
        longitude: 76.2673,
      },
    ];

    render(<ActivityLogModal hourlyLocationData={hourlyLocationData} />);

    expect(screen.getByText("Kochi Office")).toBeInTheDocument();
  });

  it("uses latitude and longitude when location_name is missing", () => {
    const hourlyLocationData = [
      {
        logged_at: "2025-05-15T10:30:00",
        latitude: 9.9312345,
        longitude: 76.2673456,
      },
    ];

    render(<ActivityLogModal hourlyLocationData={hourlyLocationData} />);

    expect(screen.getByText("Lat: 9.93123, Lon: 76.26735")).toBeInTheDocument();
  });

  it("handles non-array hourlyLocationData", () => {
    render(<ActivityLogModal hourlyLocationData="invalid" />);

    expect(screen.getByText("No location data available.")).toBeInTheDocument();
  });

  // =========================================================
  // LIVE LOCATION DATA
  // =========================================================

  it("renders live location data with LIVE label", () => {
    const liveLocationData = [
      {
        timestamp: "2025-05-15T11:30:00",
        location_name: "Live Office",
      },
    ];

    render(<ActivityLogModal liveLocationData={liveLocationData} />);

    expect(screen.getByText(/Live Office/)).toBeInTheDocument();

    expect(screen.getByText(/\(LIVE\)/)).toBeInTheDocument();
  });

  it("uses logged_at when live timestamp is missing", () => {
    const liveLocationData = [
      {
        logged_at: "2025-05-15T11:30:00",
        location_name: "Live Location",
      },
    ];

    render(<ActivityLogModal liveLocationData={liveLocationData} />);

    expect(screen.getByText("Live Location")).toBeInTheDocument();

    expect(screen.getByText(/\(LIVE\)/)).toBeInTheDocument();
  });

  it("uses coordinates for live location when location_name is missing", () => {
    const liveLocationData = [
      {
        timestamp: "2025-05-15T11:30:00",
        latitude: 10.1234567,
        longitude: 76.7654321,
      },
    ];

    render(<ActivityLogModal liveLocationData={liveLocationData} />);

    expect(
      screen.getByText("Lat: 10.12346, Lon: 76.76543"),
    ).toBeInTheDocument();
  });

  it("handles non-array liveLocationData", () => {
    render(<ActivityLogModal liveLocationData="invalid" />);

    expect(screen.getByText("No location data available.")).toBeInTheDocument();
  });

  // =========================================================
  // MERGING AND SORTING
  // =========================================================

  it("merges live and hourly location data", () => {
    const hourlyLocationData = [
      {
        logged_at: "2025-05-15T09:00:00",
        location_name: "Morning Office",
      },
    ];

    const liveLocationData = [
      {
        timestamp: "2025-05-15T11:00:00",
        location_name: "Live Office",
      },
    ];

    render(
      <ActivityLogModal
        hourlyLocationData={hourlyLocationData}
        liveLocationData={liveLocationData}
      />,
    );

    expect(screen.getByText("Morning Office")).toBeInTheDocument();

    expect(screen.getByText("Live Office")).toBeInTheDocument();
  });

  it("sorts locations from newest to oldest", () => {
    const hourlyLocationData = [
      {
        logged_at: "2025-05-15T08:00:00",
        location_name: "Old Location",
      },
      {
        logged_at: "2025-05-15T10:00:00",
        location_name: "New Location",
      },
    ];

    render(<ActivityLogModal hourlyLocationData={hourlyLocationData} />);

    const newLocation = screen.getByText("New Location");
    const oldLocation = screen.getByText("Old Location");

    expect(
      newLocation.compareDocumentPosition(oldLocation) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("removes duplicate locations based on time", () => {
    const hourlyLocationData = [
      {
        logged_at: "2025-05-15T10:00:00",
        location_name: "Location A",
      },
      {
        logged_at: "2025-05-15T10:00:00",
        location_name: "Location B",
      },
      {
        logged_at: "2025-05-15T11:00:00",
        location_name: "Location C",
      },
    ];

    render(
      <ActivityLogModal
        date="2025-05-15"
        hourlyLocationData={hourlyLocationData}
        liveLocationData={[]}
        onClose={vi.fn()}
        onDateChange={vi.fn()}
      />,
    );

    // Same formatted time should appear only once.
    expect(screen.getByText("Location A")).toBeInTheDocument();
    expect(screen.queryByText("Location B")).not.toBeInTheDocument();
    expect(screen.getByText("Location C")).toBeInTheDocument();
  });

  // =========================================================
  // CLOSE BUTTON
  // =========================================================

  it("calls onClose when Close button is clicked", () => {
    render(<ActivityLogModal onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // =========================================================
  // OVERLAY
  // =========================================================

  it("calls onClose when overlay itself is clicked", () => {
    const { container } = render(<ActivityLogModal onClose={onClose} />);

    const overlay = container.firstChild;

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close modal when modal content is clicked", () => {
    render(<ActivityLogModal onClose={onClose} />);

    fireEvent.click(screen.getByText("Hourly Activity Log"));

    expect(onClose).not.toHaveBeenCalled();
  });

  // =========================================================
  // CALENDAR
  // =========================================================

  it("opens calendar when calendar icon is clicked", () => {
    render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    const calendarIconWrapper = screen.getByTestId("calendar-icon");

    expect(calendarIconWrapper).toBeInTheDocument();

    fireEvent.click(calendarIconWrapper);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });

  it("closes calendar when calendar icon is clicked again", () => {
    render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    const calendarIconWrapper = screen.getByTestId("calendar-icon");

    fireEvent.click(calendarIconWrapper);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();

    fireEvent.click(calendarIconWrapper);

    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });

  it("changes date and closes calendar when a calendar date is selected", () => {
    render(
      <ActivityLogModal
        date="2025-05-15T12:00:00"
        onDateChange={onDateChange}
      />,
    );

    const calendarIconWrapper = screen.getByTestId("calendar-icon");

    fireEvent.click(calendarIconWrapper);

    fireEvent.click(screen.getByTestId("calendar-date"));

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith("2025-05-20");

    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });

  // =========================================================
  // OUTSIDE CLICK
  // =========================================================

  it("closes calendar when clicking outside calendar", () => {
    render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    const calendarIconWrapper = screen.getByTestId("calendar-icon");

    fireEvent.click(calendarIconWrapper);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });

  it("does not close calendar when clicking inside calendar", () => {
    render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    const calendarIconWrapper = screen.getByTestId("calendar-icon");

    fireEvent.click(calendarIconWrapper);

    const calendar = screen.getByTestId("calendar");

    fireEvent.mouseDown(calendar);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });

  // =========================================================
  // CLEANUP / UNMOUNT
  // =========================================================

  it("removes outside click listener when unmounted", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<ActivityLogModal date="2025-05-15T12:00:00" />);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));

    removeSpy.mockRestore();
  });
});
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import AttendanceRequestList from "../../Pages/attendanceRequest/AttendanceRequest";

// Mock EmployeeTitle because this test is focused on AttendanceRequestList
vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => (
    <div data-testid="employee-title">
      EmployeeTitle
      <span data-testid="show-search">
        {String(props.showSearch)}
      </span>
      <span data-testid="show-back-arrow">
        {String(props.showBackArrow)}
      </span>
      <span data-testid="show-tabs">
        {String(props.showTabs)}
      </span>
      <span data-testid="show-dropdown">
        {String(props.showDropdown)}
      </span>
      <span data-testid="show-add-button">
        {String(props.showAddButton)}
      </span>
      <span data-testid="show-report-button">
        {String(props.showReportButton)}
      </span>
    </div>
  ),
}));

describe("AttendanceRequestList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // --------------------------------------------------
  // 1. Basic rendering
  // --------------------------------------------------

  it("renders the Attendance Requests title", () => {
    render(<AttendanceRequestList />);

    expect(
      screen.getByText("Attendance Requests"),
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 2. EmployeeTitle renders
  // --------------------------------------------------

  it("renders EmployeeTitle component", () => {
    render(<AttendanceRequestList />);

    expect(
      screen.getByTestId("employee-title"),
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 3. EmployeeTitle props
  // --------------------------------------------------

  it("passes the correct props to EmployeeTitle", () => {
    render(<AttendanceRequestList />);

    expect(screen.getByTestId("show-search")).toHaveTextContent(
      "true",
    );

    expect(
      screen.getByTestId("show-back-arrow"),
    ).toHaveTextContent("false");

    expect(screen.getByTestId("show-tabs")).toHaveTextContent(
      "false",
    );

    expect(
      screen.getByTestId("show-dropdown"),
    ).toHaveTextContent("false");

    expect(
      screen.getByTestId("show-add-button"),
    ).toHaveTextContent("false");

    expect(
      screen.getByTestId("show-report-button"),
    ).toHaveTextContent("false");
  });

  // --------------------------------------------------
  // 4. Table headers
  // --------------------------------------------------

  it("renders all table headers", () => {
    render(<AttendanceRequestList />);

    expect(screen.getByText("Sl no.")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Employee ID")).toBeInTheDocument();
    expect(screen.getByText("Request Type")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Reason")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 5. First employee
  // --------------------------------------------------

  it("renders the first attendance request correctly", () => {
    render(<AttendanceRequestList />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("Late Coming")).toBeInTheDocument();
    expect(screen.getByText("22-06-2026")).toBeInTheDocument();
    expect(
      screen.getByText("Traffic delay due to heavy rain."),
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 6. Second employee
  // --------------------------------------------------

  it("renders the second attendance request correctly", () => {
    render(<AttendanceRequestList />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("EMP002")).toBeInTheDocument();
    expect(
      screen.getByText("Missed Punch Out"),
    ).toBeInTheDocument();
    expect(screen.getByText("21-06-2026")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Forgot to punch out after an urgent client meeting.",
      ),
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 7. Status values
  // --------------------------------------------------

  it("renders both Pending and Approved statuses", () => {
    render(<AttendanceRequestList />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 8. Approve button
  // --------------------------------------------------

  it("renders Approve button only for pending requests", () => {
    render(<AttendanceRequestList />);

    const approveButton = screen.getByRole("button", {
      name: "Approve",
    });

    expect(approveButton).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 9. Reject button
  // --------------------------------------------------

  it("renders Reject button only for pending requests", () => {
    render(<AttendanceRequestList />);

    const rejectButton = screen.getByRole("button", {
      name: "Reject",
    });

    expect(rejectButton).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 10. Approved request has no action buttons
  // --------------------------------------------------

  it("does not render action buttons for the approved request", () => {
    render(<AttendanceRequestList />);

    const approveButtons = screen.getAllByRole("button", {
      name: "Approve",
    });

    const rejectButtons = screen.getAllByRole("button", {
      name: "Reject",
    });

    expect(approveButtons).toHaveLength(1);
    expect(rejectButtons).toHaveLength(1);
  });

  // --------------------------------------------------
  // 11. Serial numbers
  // --------------------------------------------------

  it("renders correct serial numbers for attendance requests", () => {
    render(<AttendanceRequestList />);

    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(2);

    expect(rows[0]).toHaveTextContent("1");
    expect(rows[1]).toHaveTextContent("2");
  });

  // --------------------------------------------------
  // 12. Correct number of employee rows
  // --------------------------------------------------

  it("renders two attendance request rows", () => {
    render(<AttendanceRequestList />);

    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(2);
  });

  // --------------------------------------------------
  // 13. Pending row contains both actions
  // --------------------------------------------------

  it("renders both Approve and Reject actions for pending request", () => {
    render(<AttendanceRequestList />);

    const approveButton = screen.getByRole("button", {
      name: "Approve",
    });

    const rejectButton = screen.getByRole("button", {
      name: "Reject",
    });

    expect(approveButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 14. Approved row does not contain action buttons
  // --------------------------------------------------

  it("does not render Approve or Reject buttons for approved request", () => {
    render(<AttendanceRequestList />);

    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");

    // First row is Pending
    expect(
      rows[0].querySelectorAll("button"),
    ).toHaveLength(2);

    // Second row is Approved
    expect(
      rows[1].querySelectorAll("button"),
    ).toHaveLength(0);
  });
});
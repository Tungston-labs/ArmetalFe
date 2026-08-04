import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeAttendanceModal from "../../Pages/attendanceReport/EmployeeAttendanceModal.jsx";
import { vi } from "vitest";

const mockPrint = vi.fn();

vi.mock("react-to-print", () => ({
  useReactToPrint: () => mockPrint,
}));

const onClose = vi.fn();

const employee = {
  employee_name: "John Doe",
  working_days: 22,
  present_days: 18,
  absent_days: 2,
  lop_days: 2,
  daily_records: [],
};

describe("EmployeeAttendanceModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen={false}
        onClose={onClose}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when employee is null", () => {
    const { container } = render(
      <EmployeeAttendanceModal
        employee={null}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders employee details", () => {
    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Attendance Summary/i)).toBeInTheDocument();
  });

  test("renders summary cards", () => {
    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    expect(screen.getByText("Working Days")).toBeInTheDocument();
    expect(screen.getByText("Present")).toBeInTheDocument();
    expect(screen.getByText("Absent")).toBeInTheDocument();
    expect(screen.getByText("LOP")).toBeInTheDocument();

    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  test("shows 'No records available' when daily_records is empty", () => {
    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    expect(screen.getByText(/No records available/i)).toBeInTheDocument();
  });

  test("clicking overlay calls onClose", () => {
    const { container } = render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    fireEvent.click(container.firstChild);

    expect(onClose).toHaveBeenCalled();
  });

  test("clicking inside modal does not close it", () => {
    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("John Doe"));

    expect(onClose).not.toHaveBeenCalled();
  });

  test("close button calls onClose", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    await user.click(screen.getByText("✕"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking print button calls print handler", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeAttendanceModal
        employee={employee}
        monthName="July"
        isOpen
        onClose={onClose}
      />
    );

    await user.click(screen.getByText("Print"));

    expect(mockPrint).toHaveBeenCalled();
  });

  test.each([
    ["present", "Present"],
    ["active", "Working"],
    ["half_day", "Half Day"],
    ["leave", "Leave"],
    ["holiday", "Holiday"],
    ["off", "Company Off Day"],
    ["company off day", "Company Off Day"],
    ["second saturday", "Second Saturday"],
    ["missed_punchout", "Missed Punch Out"],
    ["absent", "Absent"],
    ["Christmas", "Christmas"],
  ])("renders status %s correctly", (status, expected) => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-10",
              status,
              first_punch_in: "09:00",
              last_punch_out: "18:00",
              total_hours: 8,
            },
          ],
        }}
      />
    );

    expect(screen.getAllByText(expected)[0]).toBeInTheDocument();
  });

  test("formats date correctly", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-05",
              status: "present",
              first_punch_in: "09:00",
              last_punch_out: "18:00",
              total_hours: 8,
            },
          ],
        }}
      />
    );

    expect(screen.getByText("05 Jul")).toBeInTheDocument();
  });

  test("shows dash when date is missing", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: null,
              status: "present",
              first_punch_in: "09:00",
              last_punch_out: "18:00",
              total_hours: 8,
            },
          ],
        }}
      />
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("shows dash when punch times are null", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-05",
              status: "present",
              first_punch_in: null,
              last_punch_out: "null",
              total_hours: 8,
            },
          ],
        }}
      />
    );

    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });

  test("trims punch times", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-05",
              status: "present",
              first_punch_in: " 09:00 ",
              last_punch_out: " 18:00 ",
              total_hours: 8,
            },
          ],
        }}
      />
    );

    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
  });

  test("formats total hours with two decimals", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-05",
              status: "present",
              first_punch_in: "09:00",
              last_punch_out: "18:00",
              total_hours: 7,
            },
          ],
        }}
      />
    );

    expect(screen.getByText("7.00h")).toBeInTheDocument();
  });

  test("defaults total hours to 0.00h", () => {
    render(
      <EmployeeAttendanceModal
        isOpen
        monthName="July"
        onClose={onClose}
        employee={{
          ...employee,
          daily_records: [
            {
              date: "2025-07-05",
              status: "present",
              first_punch_in: "09:00",
              last_punch_out: "18:00",
            },
          ],
        }}
      />
    );

    expect(screen.getByText("0.00h")).toBeInTheDocument();
  });
});
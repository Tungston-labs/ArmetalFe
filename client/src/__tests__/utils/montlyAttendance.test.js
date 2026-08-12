import { describe, it, expect, beforeEach, vi } from "vitest";
import XLSX from "xlsx-js-style";

import { exportAttendanceExcel } from "../../utils/montlyAttendance";

describe("exportAttendanceExcel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create and export an attendance Excel file", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: "EMP001",
        department: "IT",
        working_days: 22,
        present_days: 20,
        absent_days: 2,
        lop_days: 1,
        daily_records: [
          {
            date: "2026-08-01",
            status: "Present",
            first_punch_in: "09:00 AM",
            last_punch_out: "06:00 PM",
            total_hours: "9:00",
          },
          {
            date: "2026-08-02",
            status: "Absent",
            first_punch_in: "-",
            last_punch_out: "-",
            total_hours: "-",
          },
        ],
      },
    ];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    exportAttendanceExcel(employees, "August 2026");

    expect(writeFileSpy).toHaveBeenCalledTimes(1);

    expect(writeFileSpy).toHaveBeenCalledWith(
      expect.any(Object),
      "Attendance_August_2026.xlsx"
    );
  });

  it("should create a workbook with the Attendance sheet", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: "EMP001",
        department: "IT",
        working_days: 22,
        present_days: 20,
        absent_days: 2,
        lop_days: 1,
        daily_records: [],
      },
    ];

    const appendSheetSpy = vi.spyOn(
      XLSX.utils,
      "book_append_sheet"
    );

    vi.spyOn(XLSX, "writeFile").mockImplementation(() => {});

    exportAttendanceExcel(employees, "August 2026");

    expect(appendSheetSpy).toHaveBeenCalledTimes(1);

    expect(appendSheetSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Attendance"
    );
  });

  it("should handle multiple employees", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: "EMP001",
        department: "IT",
        working_days: 22,
        present_days: 20,
        absent_days: 2,
        lop_days: 1,
        daily_records: [
          {
            date: "2026-08-01",
            status: "Present",
            first_punch_in: "09:00 AM",
            last_punch_out: "06:00 PM",
            total_hours: "9:00",
          },
        ],
      },
      {
        employee_name: "Jane Smith",
        employee_id: "EMP002",
        department: "HR",
        working_days: 22,
        present_days: 21,
        absent_days: 1,
        lop_days: 0,
        daily_records: [
          {
            date: "2026-08-01",
            status: "Present",
            first_punch_in: "09:15 AM",
            last_punch_out: "06:15 PM",
            total_hours: "9:00",
          },
        ],
      },
    ];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    exportAttendanceExcel(employees, "August 2026");

    expect(writeFileSpy).toHaveBeenCalledTimes(1);

    expect(writeFileSpy).toHaveBeenCalledWith(
      expect.any(Object),
      "Attendance_August_2026.xlsx"
    );
  });

  it("should handle employee with empty daily records", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: "EMP001",
        department: "IT",
        working_days: 22,
        present_days: 20,
        absent_days: 2,
        lop_days: 1,
        daily_records: [],
      },
    ];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    expect(() => {
      exportAttendanceExcel(employees, "August 2026");
    }).not.toThrow();

    expect(writeFileSpy).toHaveBeenCalledTimes(1);
  });

  it("should use '-' for missing attendance values", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: "EMP001",
        department: "IT",
        working_days: null,
        present_days: null,
        absent_days: null,
        lop_days: null,
        daily_records: [
          {
            date: null,
            status: null,
            first_punch_in: null,
            last_punch_out: null,
            total_hours: null,
          },
        ],
      },
    ];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    expect(() => {
      exportAttendanceExcel(employees, "August 2026");
    }).not.toThrow();

    expect(writeFileSpy).toHaveBeenCalledTimes(1);
  });

  it("should replace spaces in selectedMonth when generating filename", () => {
    const employees = [];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    exportAttendanceExcel(employees, "August 2026");

    expect(writeFileSpy).toHaveBeenCalledWith(
      expect.any(Object),
      "Attendance_August_2026.xlsx"
    );
  });

  it("should handle an empty employees array", () => {
    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    expect(() => {
      exportAttendanceExcel([], "August 2026");
    }).not.toThrow();

    expect(writeFileSpy).toHaveBeenCalledTimes(1);
  });

  it("should process numeric employee values correctly", () => {
    const employees = [
      {
        employee_name: "John Doe",
        employee_id: 1001,
        department: "IT",
        working_days: 22,
        present_days: 20,
        absent_days: 2,
        lop_days: 1,
        daily_records: [
          {
            date: "2026-08-01",
            status: "Present",
            first_punch_in: "09:00 AM",
            last_punch_out: "06:00 PM",
            total_hours: 9,
          },
        ],
      },
    ];

    const writeFileSpy = vi
      .spyOn(XLSX, "writeFile")
      .mockImplementation(() => {});

    expect(() => {
      exportAttendanceExcel(employees, "August 2026");
    }).not.toThrow();

    expect(writeFileSpy).toHaveBeenCalledTimes(1);
  });
});

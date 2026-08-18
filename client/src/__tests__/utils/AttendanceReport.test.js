import { describe, it, expect, beforeEach, vi } from "vitest";

// =====================================================
// HOISTED MOCKS
// =====================================================

const {
    bookNewMock,
    aoaToSheetMock,
    bookAppendSheetMock,
    writeFileMock,
} = vi.hoisted(() => ({
    bookNewMock: vi.fn(),
    aoaToSheetMock: vi.fn(),
    bookAppendSheetMock: vi.fn(),
    writeFileMock: vi.fn(),
}));

// =====================================================
// MOCK XLSX
// =====================================================

vi.mock("xlsx-js-style", () => ({
    utils: {
        book_new: bookNewMock,
        aoa_to_sheet: aoaToSheetMock,
        book_append_sheet: bookAppendSheetMock,
    },
    writeFile: writeFileMock,
}));

// =====================================================
// IMPORT FUNCTION
// =====================================================

import { exportAttendanceExcel } from "../../utils/attendance";

// =====================================================
// TESTS
// =====================================================

describe("exportAttendanceExcel", () => {
    let workbook;
    let worksheet;

    beforeEach(() => {
        vi.clearAllMocks();

        workbook = {
            Sheets: {},
            SheetNames: [],
        };

        worksheet = {};

        bookNewMock.mockReturnValue(workbook);
        aoaToSheetMock.mockReturnValue(worksheet);
    });

    // ---------------------------------------------------
    // WORKBOOK
    // ---------------------------------------------------

    it("creates a new workbook", () => {
        exportAttendanceExcel([]);

        expect(bookNewMock).toHaveBeenCalledTimes(1);
        expect(bookNewMock).toHaveBeenCalledWith();
    });

    // ---------------------------------------------------
    // EMPTY DATA
    // ---------------------------------------------------

    it("creates correct rows when attendance data is empty", () => {
        exportAttendanceExcel([]);

        expect(aoaToSheetMock).toHaveBeenCalledTimes(1);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows).toEqual([
            ["ATTENDANCE REPORT"],
            [],
            ["Total Employees: 0"],
            [],
            [
                "Sl No",
                "Employee ID",
                "Employee Name",
                "Department",
                "Working Days",
                "Present Days",
                "Absent Days",
                "LOP Days",
            ],
        ]);
    });

    // ---------------------------------------------------
    // EMPLOYEE COUNT
    // ---------------------------------------------------

    it("adds the correct employee count", () => {
        const attendanceData = [
            {
                employee_id: "EMP001",
                employee_name: "John Doe",
            },
            {
                employee_id: "EMP002",
                employee_name: "Jane Doe",
            },
            {
                employee_id: "EMP003",
                employee_name: "Alex Smith",
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[2]).toEqual([
            "Total Employees: 3",
        ]);
    });

    // ---------------------------------------------------
    // EMPLOYEE DATA
    // ---------------------------------------------------

    it("adds employee attendance data correctly", () => {
        const attendanceData = [
            {
                employee_id: "EMP001",
                employee_name: "John Doe",
                department: "IT",
                working_days: 26,
                present_days: 24,
                absent_days: 2,
                lop_days: 0,
            },
            {
                employee_id: "EMP002",
                employee_name: "Jane Doe",
                department: "HR",
                working_days: 26,
                present_days: 22,
                absent_days: 3,
                lop_days: 1,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows).toEqual([
            ["ATTENDANCE REPORT"],
            [],
            ["Total Employees: 2"],
            [],
            [
                "Sl No",
                "Employee ID",
                "Employee Name",
                "Department",
                "Working Days",
                "Present Days",
                "Absent Days",
                "LOP Days",
            ],
            [
                1,
                "EMP001",
                "John Doe",
                "IT",
                26,
                24,
                2,
                0,
            ],
            [
                2,
                "EMP002",
                "Jane Doe",
                "HR",
                26,
                22,
                3,
                1,
            ],
        ]);
    });

    // ---------------------------------------------------
    // SERIAL NUMBER
    // ---------------------------------------------------

    it("generates sequential serial numbers", () => {
        const attendanceData = [
            {
                employee_id: "EMP001",
                employee_name: "John",
                department: "IT",
                working_days: 26,
                present_days: 25,
                absent_days: 1,
                lop_days: 0,
            },
            {
                employee_id: "EMP002",
                employee_name: "Jane",
                department: "HR",
                working_days: 26,
                present_days: 23,
                absent_days: 2,
                lop_days: 1,
            },
            {
                employee_id: "EMP003",
                employee_name: "Alex",
                department: "Finance",
                working_days: 26,
                present_days: 20,
                absent_days: 5,
                lop_days: 1,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[5][0]).toBe(1);
        expect(rows[6][0]).toBe(2);
        expect(rows[7][0]).toBe(3);
    });

    // ---------------------------------------------------
    // WORKS WITH ZERO VALUES
    // ---------------------------------------------------

    it("preserves zero attendance values", () => {
        const attendanceData = [
            {
                employee_id: "EMP001",
                employee_name: "John Doe",
                department: "IT",
                working_days: 0,
                present_days: 0,
                absent_days: 0,
                lop_days: 0,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "EMP001",
            "John Doe",
            "IT",
            0,
            0,
            0,
            0,
        ]);
    });

    // ---------------------------------------------------
    // WORKS WITH MULTIPLE EMPLOYEES
    // ---------------------------------------------------

    it("adds all employees to the worksheet", () => {
        const attendanceData = Array.from(
            { length: 5 },
            (_, index) => ({
                employee_id: `EMP00${index + 1}`,
                employee_name: `Employee ${index + 1}`,
                department: "IT",
                working_days: 26,
                present_days: 25,
                absent_days: 1,
                lop_days: 0,
            })
        );

        exportAttendanceExcel(attendanceData);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows).toHaveLength(10);

        expect(rows[5][1]).toBe("EMP001");
        expect(rows[9][1]).toBe("EMP005");
    });

    // ---------------------------------------------------
    // COLUMN WIDTHS
    // ---------------------------------------------------

    it("sets the correct column widths", () => {
        exportAttendanceExcel([]);

        expect(worksheet["!cols"]).toEqual([
            { wch: 8 },
            { wch: 20 },
            { wch: 30 },
            { wch: 25 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ]);
    });

    // ---------------------------------------------------
    // CREATE WORKSHEET
    // ---------------------------------------------------

    it("creates a worksheet from the rows", () => {
        exportAttendanceExcel([]);

        expect(aoaToSheetMock).toHaveBeenCalledTimes(1);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[0]).toEqual([
            "ATTENDANCE REPORT",
        ]);
    });

    // ---------------------------------------------------
    // APPEND SHEET
    // ---------------------------------------------------

    it("appends the worksheet to the workbook", () => {
        exportAttendanceExcel([]);

        expect(bookAppendSheetMock).toHaveBeenCalledTimes(1);

        expect(bookAppendSheetMock).toHaveBeenCalledWith(
            workbook,
            worksheet,
            "Attendance Report"
        );
    });

    // ---------------------------------------------------
    // WRITE FILE
    // ---------------------------------------------------

    it("writes the Excel file with the correct filename", () => {
        exportAttendanceExcel([]);

        expect(writeFileMock).toHaveBeenCalledTimes(1);

        expect(writeFileMock).toHaveBeenCalledWith(
            workbook,
            "Attendance_Report.xlsx"
        );
    });

    // ---------------------------------------------------
    // DEFAULT PARAMETER
    // ---------------------------------------------------

    it("works when attendanceData is omitted", () => {
        exportAttendanceExcel();

        expect(bookNewMock).toHaveBeenCalledTimes(1);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[2]).toEqual([
            "Total Employees: 0",
        ]);

        expect(rows).toHaveLength(5);

        expect(writeFileMock).toHaveBeenCalledWith(
            workbook,
            "Attendance_Report.xlsx"
        );
    });
});
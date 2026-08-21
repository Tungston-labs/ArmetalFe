import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// MOCK XLSX
// ============================================================

const {
    mockBookNew,
    mockAoaToSheet,
    mockBookAppendSheet,
    mockWriteFile,
} = vi.hoisted(() => ({
    mockBookNew: vi.fn(),
    mockAoaToSheet: vi.fn(),
    mockBookAppendSheet: vi.fn(),
    mockWriteFile: vi.fn(),
}));

vi.mock("xlsx-js-style", () => ({
    utils: {
        book_new: mockBookNew,
        aoa_to_sheet: mockAoaToSheet,
        book_append_sheet: mockBookAppendSheet,
    },
    writeFile: mockWriteFile,
}));

// ============================================================
// IMPORT FUNCTION UNDER TEST
// ============================================================

import { exportAttendanceExcel } from "../../utils/attendance";

// ============================================================
// TEST SUITE
// ============================================================

describe("exportAttendanceExcel", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockBookNew.mockReturnValue({
            SheetNames: [],
            Sheets: {},
        });

        mockAoaToSheet.mockReturnValue({
            "!cols": [],
        });
    });

    // ==========================================================
    // 1. FUNCTION
    // ==========================================================

    it("should export exportAttendanceExcel as a function", () => {
        expect(exportAttendanceExcel).toBeDefined();
        expect(typeof exportAttendanceExcel).toBe("function");
    });

    // ==========================================================
    // 2. EMPTY DATA
    // ==========================================================

    it("should handle undefined attendance data", () => {
        exportAttendanceExcel();

        expect(mockBookNew).toHaveBeenCalledTimes(1);
        expect(mockAoaToSheet).toHaveBeenCalledTimes(1);
        expect(mockBookAppendSheet).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });

    it("should handle an empty attendance array", () => {
        exportAttendanceExcel([]);

        const rows = mockAoaToSheet.mock.calls[0][0];

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

    // ==========================================================
    // 3. REPORT TITLE
    // ==========================================================

    it("should create the correct report title", () => {
        exportAttendanceExcel([]);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[0]).toEqual(["ATTENDANCE REPORT"]);
    });

    // ==========================================================
    // 4. EMPLOYEE COUNT
    // ==========================================================

    it("should display the correct employee count", () => {
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
                present_days: 24,
                absent_days: 2,
                lop_days: 0,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[2]).toEqual(["Total Employees: 2"]);
    });

    // ==========================================================
    // 5. COLUMN HEADERS
    // ==========================================================

    it("should create all attendance column headers", () => {
        exportAttendanceExcel([]);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[4]).toEqual([
            "Sl No",
            "Employee ID",
            "Employee Name",
            "Department",
            "Working Days",
            "Present Days",
            "Absent Days",
            "LOP Days",
        ]);
    });

    // ==========================================================
    // 6. SINGLE EMPLOYEE
    // ==========================================================

    it("should add a single employee correctly", () => {
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
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "EMP001",
            "John Doe",
            "IT",
            26,
            24,
            2,
            0,
        ]);
    });

    // ==========================================================
    // 7. MULTIPLE EMPLOYEES
    // ==========================================================

    it("should add multiple employees correctly", () => {
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
                employee_name: "Jane Smith",
                department: "HR",
                working_days: 26,
                present_days: 25,
                absent_days: 1,
                lop_days: 0,
            },
            {
                employee_id: "EMP003",
                employee_name: "Robert",
                department: "Finance",
                working_days: 26,
                present_days: 20,
                absent_days: 3,
                lop_days: 3,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "EMP001",
            "John Doe",
            "IT",
            26,
            24,
            2,
            0,
        ]);

        expect(rows[6]).toEqual([
            2,
            "EMP002",
            "Jane Smith",
            "HR",
            26,
            25,
            1,
            0,
        ]);

        expect(rows[7]).toEqual([
            3,
            "EMP003",
            "Robert",
            "Finance",
            26,
            20,
            3,
            3,
        ]);
    });

    // ==========================================================
    // 8. SERIAL NUMBERS
    // ==========================================================

    it("should generate sequential serial numbers", () => {
        const attendanceData = [
            {
                employee_id: "E001",
                employee_name: "Employee One",
                department: "IT",
                working_days: 20,
                present_days: 20,
                absent_days: 0,
                lop_days: 0,
            },
            {
                employee_id: "E002",
                employee_name: "Employee Two",
                department: "HR",
                working_days: 20,
                present_days: 18,
                absent_days: 2,
                lop_days: 0,
            },
            {
                employee_id: "E003",
                employee_name: "Employee Three",
                department: "Finance",
                working_days: 20,
                present_days: 17,
                absent_days: 2,
                lop_days: 1,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[5][0]).toBe(1);
        expect(rows[6][0]).toBe(2);
        expect(rows[7][0]).toBe(3);
    });

    // ==========================================================
    // 9. EMPLOYEE DATA MAPPING
    // ==========================================================

    it("should correctly map employee attendance fields", () => {
        const employee = {
            employee_id: "A100",
            employee_name: "Alice",
            department: "Operations",
            working_days: 25,
            present_days: 22,
            absent_days: 2,
            lop_days: 1,
        };

        exportAttendanceExcel([employee]);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "A100",
            "Alice",
            "Operations",
            25,
            22,
            2,
            1,
        ]);
    });

    // ==========================================================
    // 10. ZERO VALUES
    // ==========================================================

    it("should preserve zero attendance values", () => {
        const attendanceData = [
            {
                employee_id: "EMP000",
                employee_name: "Test Employee",
                department: "Testing",
                working_days: 0,
                present_days: 0,
                absent_days: 0,
                lop_days: 0,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "EMP000",
            "Test Employee",
            "Testing",
            0,
            0,
            0,
            0,
        ]);
    });

    // ==========================================================
    // 11. WORKBOOK CREATION
    // ==========================================================

    it("should create a new workbook", () => {
        exportAttendanceExcel([]);

        expect(mockBookNew).toHaveBeenCalledTimes(1);
    });

    // ==========================================================
    // 12. WORKSHEET CREATION
    // ==========================================================

    it("should create a worksheet using aoa_to_sheet", () => {
        exportAttendanceExcel([]);

        expect(mockAoaToSheet).toHaveBeenCalledTimes(1);
    });

    // ==========================================================
    // 13. COLUMN WIDTHS
    // ==========================================================

    it("should set the correct worksheet column widths", () => {
        const worksheet = {
            "!cols": [],
        };

        mockAoaToSheet.mockReturnValue(worksheet);

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

    // ==========================================================
    // 14. APPEND WORKSHEET
    // ==========================================================

    it("should append the worksheet with the correct name", () => {
        const workbook = {
            SheetNames: [],
            Sheets: {},
        };

        const worksheet = {
            "!cols": [],
        };

        mockBookNew.mockReturnValue(workbook);
        mockAoaToSheet.mockReturnValue(worksheet);

        exportAttendanceExcel([]);

        expect(mockBookAppendSheet).toHaveBeenCalledWith(
            workbook,
            worksheet,
            "Attendance Report"
        );
    });

    // ==========================================================
    // 15. WRITE EXCEL FILE
    // ==========================================================

    it("should write the correct Excel file", () => {
        const workbook = {
            SheetNames: [],
            Sheets: {},
        };

        const worksheet = {
            "!cols": [],
        };

        mockBookNew.mockReturnValue(workbook);
        mockAoaToSheet.mockReturnValue(worksheet);

        exportAttendanceExcel([]);

        expect(mockWriteFile).toHaveBeenCalledWith(
            workbook,
            "Attendance_Report.xlsx"
        );
    });

    // ==========================================================
    // 16. COMPLETE EXPORT FLOW
    // ==========================================================

    it("should execute the complete Excel export flow", () => {
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
        ];

        exportAttendanceExcel(attendanceData);

        expect(mockBookNew).toHaveBeenCalledTimes(1);
        expect(mockAoaToSheet).toHaveBeenCalledTimes(1);
        expect(mockBookAppendSheet).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });

    // ==========================================================
    // 17. ROW COUNT
    // ==========================================================

    it("should create the correct number of rows", () => {
        const attendanceData = [
            {
                employee_id: "E1",
                employee_name: "Employee 1",
                department: "IT",
                working_days: 20,
                present_days: 20,
                absent_days: 0,
                lop_days: 0,
            },
            {
                employee_id: "E2",
                employee_name: "Employee 2",
                department: "HR",
                working_days: 20,
                present_days: 18,
                absent_days: 2,
                lop_days: 0,
            },
            {
                employee_id: "E3",
                employee_name: "Employee 3",
                department: "Finance",
                working_days: 20,
                present_days: 17,
                absent_days: 2,
                lop_days: 1,
            },
        ];

        exportAttendanceExcel(attendanceData);

        const rows = mockAoaToSheet.mock.calls[0][0];

        // 5 fixed rows + 3 employee rows
        expect(rows).toHaveLength(8);
    });
});
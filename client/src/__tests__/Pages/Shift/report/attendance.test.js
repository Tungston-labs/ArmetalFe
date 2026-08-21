import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// HOISTED MOCKS
// ============================================================

const {
    MockJsPDF,
    mockSetFontSize,
    mockText,
    mockSave,
    mockAutoTable,
} = vi.hoisted(() => {
    const mockSetFontSize = vi.fn();
    const mockText = vi.fn();
    const mockSave = vi.fn();
    const mockAutoTable = vi.fn();

    class MockJsPDF {
        constructor(...args) {
            this.constructorArgs = args;
            this.setFontSize = mockSetFontSize;
            this.text = mockText;
            this.save = mockSave;
        }
    }

    return {
        MockJsPDF,
        mockSetFontSize,
        mockText,
        mockSave,
        mockAutoTable,
    };
});

// ============================================================
// MODULE MOCKS
// ============================================================

vi.mock("jspdf", () => ({
    default: MockJsPDF,
}));

vi.mock("jspdf-autotable", () => ({
    default: mockAutoTable,
}));

// ============================================================
// SOURCE FILE
// ============================================================

import { exportAttendancePDF } from "../../../../Pages/report/attendance.js";

// ============================================================
// TEST DATA
// ============================================================

const employeeOne = {
    employee_id: "EMP001",
    employee_name: "John Doe",
    department: "IT",
    working_days: 22,
    present_days: 20,
    absent_days: 2,
    lop_days: 0,
};

const employeeTwo = {
    employee_id: "EMP002",
    employee_name: "Jane Smith",
    department: "HR",
    working_days: 21,
    present_days: 18,
    absent_days: 3,
    lop_days: 1,
};

// ============================================================
// TESTS
// ============================================================

describe("exportAttendancePDF", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create PDF in landscape mode", () => {
        exportAttendancePDF([]);

        const [doc] = mockAutoTable.mock.calls[0];

        expect(doc).toBeInstanceOf(MockJsPDF);
        expect(doc.constructorArgs).toEqual(["landscape"]);
    });

    it("should set the report title", () => {
        exportAttendancePDF([]);

        expect(mockText).toHaveBeenCalledWith(
            "Attendance Report",
            14,
            20
        );
    });

    it("should set the correct employee count for empty data", () => {
        exportAttendancePDF([]);

        expect(mockText).toHaveBeenCalledWith(
            "Total Employees: 0",
            14,
            30
        );
    });

    it("should set the correct employee count for employee data", () => {
        exportAttendancePDF([
            employeeOne,
            employeeTwo,
        ]);

        expect(mockText).toHaveBeenCalledWith(
            "Total Employees: 2",
            14,
            30
        );
    });

    it("should set font size to 18 for the title", () => {
        exportAttendancePDF([]);

        expect(mockSetFontSize).toHaveBeenNthCalledWith(
            1,
            18
        );
    });

    it("should set font size to 11 for employee count", () => {
        exportAttendancePDF([]);

        expect(mockSetFontSize).toHaveBeenNthCalledWith(
            2,
            11
        );
    });

    it("should set both font sizes exactly twice", () => {
        exportAttendancePDF([]);

        expect(mockSetFontSize).toHaveBeenCalledTimes(2);

        expect(mockSetFontSize).toHaveBeenNthCalledWith(
            1,
            18
        );

        expect(mockSetFontSize).toHaveBeenNthCalledWith(
            2,
            11
        );
    });

    it("should use an empty array when no argument is provided", () => {
        exportAttendancePDF();

        expect(mockAutoTable).toHaveBeenCalledTimes(1);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body).toEqual([]);
    });

    it("should handle an explicitly empty array", () => {
        exportAttendancePDF([]);

        expect(mockAutoTable).toHaveBeenCalledTimes(1);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body).toEqual([]);
    });

    it("should correctly map one employee into the table", () => {
        exportAttendancePDF([employeeOne]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body).toEqual([
            [
                1,
                "EMP001",
                "John Doe",
                "IT",
                22,
                20,
                2,
                0,
            ],
        ]);
    });

    it("should correctly map multiple employees into the table", () => {
        exportAttendancePDF([
            employeeOne,
            employeeTwo,
        ]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body).toEqual([
            [
                1,
                "EMP001",
                "John Doe",
                "IT",
                22,
                20,
                2,
                0,
            ],
            [
                2,
                "EMP002",
                "Jane Smith",
                "HR",
                21,
                18,
                3,
                1,
            ],
        ]);
    });

    it("should assign sequential serial numbers", () => {
        const attendanceData = [
            {
                employee_id: "EMP001",
                employee_name: "Employee One",
                department: "IT",
                working_days: 22,
                present_days: 20,
                absent_days: 2,
                lop_days: 0,
            },
            {
                employee_id: "EMP002",
                employee_name: "Employee Two",
                department: "HR",
                working_days: 21,
                present_days: 19,
                absent_days: 2,
                lop_days: 0,
            },
            {
                employee_id: "EMP003",
                employee_name: "Employee Three",
                department: "Finance",
                working_days: 20,
                present_days: 18,
                absent_days: 2,
                lop_days: 1,
            },
        ];

        exportAttendancePDF(attendanceData);

        const [, options] = mockAutoTable.mock.calls[0];

        const serialNumbers = options.body.map(
            (row) => row[0]
        );

        expect(serialNumbers).toEqual([1, 2, 3]);
    });

    it("should configure autoTable startY correctly", () => {
        exportAttendancePDF([employeeOne]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.startY).toBe(40);
    });

    it("should configure the correct table headers", () => {
        exportAttendancePDF([employeeOne]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.head).toEqual([
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

    it("should configure grid theme", () => {
        exportAttendancePDF([employeeOne]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.theme).toBe("grid");
    });

    it("should configure the correct header styles", () => {
        exportAttendancePDF([employeeOne]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.headStyles).toEqual({
            fillColor: [30, 58, 138],
        });
    });

    it("should pass the created PDF document to autoTable", () => {
        exportAttendancePDF([employeeOne]);

        const [doc] = mockAutoTable.mock.calls[0];

        expect(doc).toBeInstanceOf(MockJsPDF);
    });

    it("should call autoTable exactly once", () => {
        exportAttendancePDF([
            employeeOne,
            employeeTwo,
        ]);

        expect(mockAutoTable).toHaveBeenCalledTimes(1);
    });

    it("should save the PDF with the correct filename", () => {
        exportAttendancePDF([employeeOne]);

        expect(mockSave).toHaveBeenCalledTimes(1);

        expect(mockSave).toHaveBeenCalledWith(
            "Attendance_Report.pdf"
        );
    });

    it("should save an empty attendance report", () => {
        exportAttendancePDF();

        expect(mockSave).toHaveBeenCalledWith(
            "Attendance_Report.pdf"
        );
    });

    it("should save the PDF after generating the table", () => {
        exportAttendancePDF([employeeOne]);

        expect(mockAutoTable).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should preserve all employee attendance values", () => {
        const employee = {
            employee_id: "EMP999",
            employee_name: "Test Employee",
            department: "Development",
            working_days: 26,
            present_days: 24,
            absent_days: 2,
            lop_days: 3,
        };

        exportAttendancePDF([employee]);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body[0]).toEqual([
            1,
            "EMP999",
            "Test Employee",
            "Development",
            26,
            24,
            2,
            3,
        ]);
    });

    it("should handle three employees correctly", () => {
        const employees = [
            {
                employee_id: "E001",
                employee_name: "One",
                department: "IT",
                working_days: 20,
                present_days: 20,
                absent_days: 0,
                lop_days: 0,
            },
            {
                employee_id: "E002",
                employee_name: "Two",
                department: "HR",
                working_days: 20,
                present_days: 18,
                absent_days: 2,
                lop_days: 1,
            },
            {
                employee_id: "E003",
                employee_name: "Three",
                department: "Finance",
                working_days: 20,
                present_days: 17,
                absent_days: 3,
                lop_days: 2,
            },
        ];

        exportAttendancePDF(employees);

        const [, options] = mockAutoTable.mock.calls[0];

        expect(options.body).toHaveLength(3);

        expect(options.body[0][0]).toBe(1);
        expect(options.body[1][0]).toBe(2);
        expect(options.body[2][0]).toBe(3);
    });
});
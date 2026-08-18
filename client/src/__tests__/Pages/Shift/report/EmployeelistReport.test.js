import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock functions must be created inside vi.hoisted()
const {
    mockSetFontSize,
    mockSetFont,
    mockText,
    mockSave,
    mockAutoTable,
} = vi.hoisted(() => ({
    mockSetFontSize: vi.fn(),
    mockSetFont: vi.fn(),
    mockText: vi.fn(),
    mockSave: vi.fn(),
    mockAutoTable: vi.fn(),
}));

// Mock jsPDF
vi.mock("jspdf", () => {
    class MockJsPDF {
        constructor(orientation) {
            this.orientation = orientation;
            this.setFontSize = mockSetFontSize;
            this.setFont = mockSetFont;
            this.text = mockText;
            this.save = mockSave;
        }
    }

    return {
        default: MockJsPDF,
    };
});

// Mock jspdf-autotable
vi.mock("jspdf-autotable", () => ({
    default: mockAutoTable,
}));

import { exportEmployeePDF } from "../../../../Pages/report/EmployeelistReport";

describe("exportEmployeePDF", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create and save employee PDF report", () => {
        const employees = [
            {
                employee_id: "EMP001",
                name: "John Doe",
                department: "IT",
                designation: "Developer",
                employment_type: "Full Time",
                phno: "9876543210",
                email: "john@example.com",
                joining_date: "2026-01-01",
            },
        ];

        exportEmployeePDF(employees);

        expect(mockSetFontSize).toHaveBeenCalledWith(18);
        expect(mockSetFont).toHaveBeenCalledWith("helvetica", "bold");

        expect(mockText).toHaveBeenCalledWith(
            "EMPLOYEE MASTER REPORT",
            14,
            15
        );

        expect(mockSetFontSize).toHaveBeenCalledWith(11);

        expect(mockText).toHaveBeenCalledWith(
            "Total Employees: 1",
            14,
            25
        );

        expect(mockSave).toHaveBeenCalledWith(
            "Employee_Master_Report.pdf"
        );
    });

    it("should handle empty employee list", () => {
        exportEmployeePDF();

        expect(mockText).toHaveBeenCalledWith(
            "Total Employees: 0",
            14,
            25
        );

        expect(mockAutoTable).toHaveBeenCalled();

        expect(mockSave).toHaveBeenCalledWith(
            "Employee_Master_Report.pdf"
        );
    });

    it("should use '-' for missing employee fields", () => {
        const employees = [
            {
                employee_id: "EMP001",
                name: "John Doe",
            },
        ];

        exportEmployeePDF(employees);

        expect(mockAutoTable).toHaveBeenCalled();

        const tableConfig = mockAutoTable.mock.calls[0][1];

        expect(tableConfig.body).toEqual([
            [
                1,
                "EMP001",
                "John Doe",
                "-",
                "-",
                "-",
                "-",
                "-",
                "-",
            ],
        ]);
    });

    it("should generate correct employee table data", () => {
        const employees = [
            {
                employee_id: "EMP001",
                name: "John Doe",
                department: "IT",
                designation: "Developer",
                employment_type: "Full Time",
                phno: "9876543210",
                email: "john@example.com",
                joining_date: "2026-01-01",
            },
        ];

        exportEmployeePDF(employees);

        const tableConfig = mockAutoTable.mock.calls[0][1];

        expect(tableConfig.body).toEqual([
            [
                1,
                "EMP001",
                "John Doe",
                "IT",
                "Developer",
                "Full Time",
                "9876543210",
                "john@example.com",
                "2026-01-01",
            ],
        ]);
    });

    it("should configure autoTable correctly", () => {
        exportEmployeePDF([]);

        expect(mockAutoTable).toHaveBeenCalledTimes(1);

        const [doc, config] = mockAutoTable.mock.calls[0];

        expect(doc).toBeDefined();

        expect(config.startY).toBe(35);
        expect(config.theme).toBe("grid");

        expect(config.styles).toEqual({
            fontSize: 8,
            cellPadding: 3,
        });

        expect(config.headStyles).toEqual({
            fillColor: [48, 78, 176],
            textColor: 255,
            fontStyle: "bold",
        });
    });

    it("should generate correct table headers", () => {
        exportEmployeePDF([]);

        const config = mockAutoTable.mock.calls[0][1];

        expect(config.head).toEqual([
            [
                "Sl No",
                "Employee ID",
                "Employee Name",
                "Department",
                "Designation",
                "Employment Type",
                "Phone Number",
                "Email",
                "Joining Date",
            ],
        ]);
    });

    it("should handle multiple employees with correct serial numbers", () => {
        const employees = [
            {
                employee_id: "EMP001",
                name: "John",
                department: "IT",
                designation: "Developer",
                employment_type: "Full Time",
                phno: "1111111111",
                email: "john@example.com",
                joining_date: "2026-01-01",
            },
            {
                employee_id: "EMP002",
                name: "Jane",
                department: "HR",
                designation: "Manager",
                employment_type: "Full Time",
                phno: "2222222222",
                email: "jane@example.com",
                joining_date: "2026-02-01",
            },
        ];

        exportEmployeePDF(employees);

        const config = mockAutoTable.mock.calls[0][1];

        expect(config.body[0][0]).toBe(1);
        expect(config.body[1][0]).toBe(2);

        expect(config.body).toHaveLength(2);
    });
});
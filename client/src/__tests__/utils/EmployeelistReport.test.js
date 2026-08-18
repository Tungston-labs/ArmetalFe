import { describe, it, expect, beforeEach, vi } from "vitest";

// 1. Setup hoisted mocks for xlsx-js-style
const {
    bookNewMock,
    aoaToSheetMock,
    bookAppendSheetMock,
    writeFileMock,
    mockSheet,
} = vi.hoisted(() => {
    const sheet = {};

    return {
        mockSheet: sheet,

        bookNewMock: vi.fn(() => ({})),

        aoaToSheetMock: vi.fn(() => {
            return new Proxy(sheet, {
                get(target, prop) {
                    if (
                        !(prop in target) &&
                        typeof prop === "string" &&
                        !prop.startsWith("!")
                    ) {
                        target[prop] = {};
                    }

                    return target[prop];
                },

                set(target, prop, value) {
                    target[prop] = value;
                    return true;
                },
            });
        }),

        bookAppendSheetMock: vi.fn(),

        writeFileMock: vi.fn(),
    };
});

// 2. Mock xlsx-js-style
vi.mock("xlsx-js-style", () => ({
    default: {
        utils: {
            book_new: bookNewMock,
            aoa_to_sheet: aoaToSheetMock,
            book_append_sheet: bookAppendSheetMock,
        },
        writeFile: writeFileMock,
    },

    utils: {
        book_new: bookNewMock,
        aoa_to_sheet: aoaToSheetMock,
        book_append_sheet: bookAppendSheetMock,
    },

    writeFile: writeFileMock,
}));

// 3. Import the XLSX employee report utility
import { exportEmployeeReport } from "../../utils/employeelistReport";

describe("exportEmployeeReport", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        Object.keys(mockSheet).forEach((key) => delete mockSheet[key]);
    });

    it("creates a workbook and appends the worksheet with default empty data", () => {
        exportEmployeeReport();

        expect(bookNewMock).toHaveBeenCalledTimes(1);
        expect(aoaToSheetMock).toHaveBeenCalledTimes(1);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[0]).toEqual(["EMPLOYEE MASTER REPORT"]);

        expect(rows[2]).toEqual(["Total Employees: 0"]);

        expect(rows[4]).toEqual([
            "Sl No",
            "Employee ID",
            "Employee Name",
            "Department",
            "Designation",
            "Employment Type",
            "Phone Number",
            "Email",
            "Joining Date",
        ]);

        expect(bookAppendSheetMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            "Employee Report"
        );

        expect(writeFileMock).toHaveBeenCalledWith(
            expect.anything(),
            "Employee_Master_Report.xlsx"
        );
    });

    it("handles employee lists and maps missing fields to default '-'", () => {
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
            {},
        ];

        exportEmployeeReport(employees);

        const rows = aoaToSheetMock.mock.calls[0][0];

        expect(rows[2]).toEqual(["Total Employees: 2"]);

        expect(rows[5]).toEqual([
            1,
            "EMP001",
            "John Doe",
            "IT",
            "Developer",
            "Full Time",
            "9876543210",
            "john@example.com",
            "2026-01-01",
        ]);

        expect(rows[6]).toEqual([
            2,
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
        ]);
    });

    it("applies cell formatting, merges, column widths, row heights, and styles", () => {
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

        exportEmployeeReport(employees);

        const ws = aoaToSheetMock.mock.results[0].value;

        expect(ws["!merges"]).toEqual([
            {
                s: { r: 0, c: 0 },
                e: { r: 0, c: 8 },
            },
        ]);

        expect(ws["!cols"].length).toBe(9);

        expect(ws["!rows"][0]).toEqual({
            hpt: 30,
        });

        expect(ws["!freeze"]).toEqual({
            ySplit: 5,
        });

        expect(ws["!autofilter"]).toEqual({
            ref: "A5:I1000",
        });

        expect(ws["A1"].s.fill.fgColor.rgb).toBe("1E3A8A");

        expect(ws["A3"].s.fill.fgColor.rgb).toBe("E5E7EB");

        expect(ws["A5"].s.fill.fgColor.rgb).toBe("111827");

        expect(ws["A6"].s.fill.fgColor.rgb).toBe("F9FAFB");

        expect(ws["C6"].s.alignment.horizontal).toBe("left");

        expect(ws["A6"].s.alignment.horizontal).toBe("center");
    });
});
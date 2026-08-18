import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// HOISTED MOCKS
// ============================================================

const {
    mockBookNew,
    mockAoaToSheet,
    mockBookAppendSheet,
    mockWriteFile,
} = vi.hoisted(() => {
    return {
        mockBookNew: vi.fn(),
        mockAoaToSheet: vi.fn(),
        mockBookAppendSheet: vi.fn(),
        mockWriteFile: vi.fn(),
    };
});

// ============================================================
// XLSX MOCK
// ============================================================

vi.mock("xlsx-js-style", () => ({
    utils: {
        book_new: mockBookNew,
        aoa_to_sheet: mockAoaToSheet,
        book_append_sheet: mockBookAppendSheet,
    },
    writeFile: mockWriteFile,
}));

// ============================================================
// IMPORT
// ============================================================

import { exportLeaveReport } from "../../utils/leaveExcelExport";

// ============================================================
// TEST DATA
// ============================================================

const formatDate = vi.fn((date) => {
    if (!date) return "-";

    return `formatted-${date}`;
});

const leaves = [
    {
        employee: {
            name: "John Doe",
            first_name: "John",
            last_name: "Doe",
            employee_id: "EMP001",
            department: "IT",
        },
        leave_type: "Annual Leave",
        from_date: "2026-08-10",
        to_date: "2026-08-12",
        created_at: "2026-08-01",
        status: "approved",
        reason: "Vacation",
    },
    {
        employee: {
            name: "Jane Smith",
            first_name: "Jane",
            last_name: "Smith",
            employee_id: "EMP002",
            department: "HR",
        },
        leave_type: "Sick Leave",
        from_date: "2026-08-15",
        to_date: "2026-08-16",
        created_at: "2026-08-05",
        status: "pending",
        reason: "Medical leave",
    },
];

// ============================================================
// CREATE MOCK WORKSHEET
// ============================================================

const createMockWorksheet = () => {
    const worksheet = {
        "!merges": [],
        "!cols": [],
        "!rows": [],
        "!freeze": {},
        "!autofilter": {},
    };

    // Create all cells used by the production code.
    //
    // Rows 1-7 are the title, subtitle, summary and header rows.
    // Rows 8+ are data rows.
    for (let row = 1; row <= 20; row++) {
        for (let col = 0; col < 10; col++) {
            const column = String.fromCharCode(65 + col);

            worksheet[`${column}${row}`] = {
                v: "",
                s: {},
            };
        }
    }

    return worksheet;
};

// ============================================================
// DEFAULT MOCK RETURN VALUES
// ============================================================

beforeEach(() => {
    vi.clearAllMocks();

    mockBookNew.mockReturnValue({
        SheetNames: [],
        Sheets: {},
    });

    mockAoaToSheet.mockImplementation((rows) => {
        const worksheet = createMockWorksheet();

        // Put the actual row values into the mocked cells.
        rows.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const column = String.fromCharCode(65 + colIndex);
                const cell = `${column}${rowIndex + 1}`;

                worksheet[cell] = {
                    v: value,
                    s: {},
                };
            });
        });

        return worksheet;
    });
});

// ============================================================
// TESTS
// ============================================================

describe("exportLeaveReport", () => {
    it("should create a workbook", () => {
        exportLeaveReport(leaves, 1, formatDate);

        expect(mockBookNew).toHaveBeenCalledTimes(1);
    });

    it("should convert leave data into worksheet", () => {
        exportLeaveReport(leaves, 1, formatDate);

        expect(mockAoaToSheet).toHaveBeenCalledTimes(1);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(Array.isArray(rows)).toBe(true);
        expect(rows.length).toBeGreaterThan(0);

        expect(rows[0]).toEqual(["MONTHLY LEAVE REPORT"]);

        expect(rows[6]).toEqual([
            "Sl No",
            "Employee Name",
            "Employee ID",
            "Department",
            "Leave Type",
            "Start Date",
            "End Date",
            "Applied Date",
            "Status",
            "Reason",
        ]);

        expect(rows[7]).toContain("John Doe");
        expect(rows[7]).toContain("EMP001");
        expect(rows[7]).toContain("IT");
        expect(rows[7]).toContain("Annual Leave");

        expect(rows[8]).toContain("Jane Smith");
        expect(rows[8]).toContain("EMP002");
        expect(rows[8]).toContain("HR");
        expect(rows[8]).toContain("Sick Leave");
    });

    it("should append worksheet to workbook", () => {
        exportLeaveReport(leaves, 1, formatDate);

        expect(mockBookAppendSheet).toHaveBeenCalledTimes(1);

        const [workbook, worksheet, sheetName] =
            mockBookAppendSheet.mock.calls[0];

        expect(workbook).toBeDefined();
        expect(worksheet).toBeDefined();
        expect(sheetName).toBe("Leave Report");
    });

    it("should write the Excel file", () => {
        exportLeaveReport(leaves, 1, formatDate);

        expect(mockWriteFile).toHaveBeenCalledTimes(1);

        const [workbook, filename] =
            mockWriteFile.mock.calls[0];

        expect(workbook).toBeDefined();
        expect(filename).toBeDefined();

        expect(typeof filename).toBe("string");

        expect(filename).toMatch(
            /^Rekory_Leave_Report_\d{4}-\d{2}-\d{2}\.xlsx$/
        );
    });

    it("should handle empty leave array", () => {
        exportLeaveReport([], 1, formatDate);

        expect(mockBookNew).toHaveBeenCalledTimes(1);
        expect(mockAoaToSheet).toHaveBeenCalledTimes(1);
        expect(mockBookAppendSheet).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledTimes(1);

        const rows = mockAoaToSheet.mock.calls[0][0];

        expect(rows).toHaveLength(7);

        expect(rows[0]).toEqual([
            "MONTHLY LEAVE REPORT",
        ]);

        expect(rows[4]).toEqual([
            "Total Requests: 0 | Approved: 0 | Pending: 0 | Rejected: 0",
        ]);
    });

    it("should call formatDate for leave dates", () => {
        exportLeaveReport(leaves, 1, formatDate);

        expect(formatDate).toHaveBeenCalledTimes(6);

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-10"
        );

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-12"
        );

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-01"
        );

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-15"
        );

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-16"
        );

        expect(formatDate).toHaveBeenCalledWith(
            "2026-08-05"
        );
    });
});
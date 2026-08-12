import {
    describe,
    it,
    expect,
    beforeEach,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    workbook: null,
    worksheet: null,
    bookNew: vi.fn(),
    aoaToSheet: vi.fn(),
    bookAppendSheet: vi.fn(),
    writeFile: vi.fn(),
}));

vi.mock("xlsx-js-style", () => ({
    utils: {
        book_new: mocks.bookNew,
        aoa_to_sheet: mocks.aoaToSheet,
        book_append_sheet: mocks.bookAppendSheet,
    },
    writeFile: mocks.writeFile,
}));

import * as XLSX from "xlsx-js-style";
import { exportLeaveReport } from "../../utils/leaveExcelExport";

describe("exportLeaveReport", () => {
    const mockFormatDate = vi.fn((date) => {
        if (!date) return "N/A";
        return `formatted-${date}`;
    });

    const createWorksheet = () => {
        const worksheet = {
            "!merges": [],
            "!cols": [],
            "!rows": [],
        };

        // Title / subtitle / summary cells
        worksheet.A1 = { t: "s", v: "MONTHLY LEAVE REPORT" };
        worksheet.A2 = { t: "s", v: " HR Management System" };
        worksheet.A4 = { t: "s", v: "Generated Date" };
        worksheet.A5 = { t: "s", v: "Total Requests" };

        // Header row
        const headers = [
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
        ];

        headers.forEach((value, index) => {
            const column = String.fromCharCode(65 + index);
            worksheet[`${column}7`] = {
                t: "s",
                v: value,
            };
        });

        // Data rows are generated dynamically by the mock below.
        return worksheet;
    };

    const createLeave = (overrides = {}) => ({
        employee: {
            name: "John Doe",
            employee_id: "EMP001",
            department: "Engineering",
        },
        leave_type: "Annual Leave",
        from_date: "2026-08-01",
        to_date: "2026-08-03",
        created_at: "2026-07-25",
        status: "approved",
        reason: "Personal work",
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();

        mocks.workbook = {
            SheetNames: [],
            Sheets: {},
        };

        mocks.worksheet = createWorksheet();

        mocks.bookNew.mockReturnValue(mocks.workbook);

        mocks.aoaToSheet.mockImplementation((rows) => {
            const worksheet = createWorksheet();

            rows.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    const column = String.fromCharCode(65 + columnIndex);
                    const address = `${column}${rowIndex + 1}`;

                    worksheet[address] = {
                        t: typeof value === "number" ? "n" : "s",
                        v: value,
                    };
                });
            });

            mocks.worksheet = worksheet;

            return worksheet;
        });

        mocks.bookAppendSheet.mockImplementation(
            (workbook, worksheet, sheetName) => {
                workbook.SheetNames.push(sheetName);
                workbook.Sheets[sheetName] = worksheet;
            }
        );

        mocks.writeFile.mockImplementation(() => undefined);

        mockFormatDate.mockClear();
    });

    it("creates workbook and exports leave report", () => {
        const leaves = [createLeave()];

        exportLeaveReport(leaves, 1, mockFormatDate);

        expect(XLSX.utils.book_new).toHaveBeenCalledTimes(1);
        expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalledTimes(1);

        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(1);

        expect(XLSX.writeFile).toHaveBeenCalledTimes(1);
    });

    it("calculates approved, pending and rejected counts", () => {
        const leaves = [
            createLeave({ status: "approved" }),
            createLeave({ status: "approved" }),
            createLeave({ status: "pending" }),
            createLeave({ status: "rejected" }),
        ];

        exportLeaveReport(leaves, 1, mockFormatDate);

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[4][0]).toContain("Total Requests: 4");
        expect(rows[4][0]).toContain("Approved: 2");
        expect(rows[4][0]).toContain("Pending: 1");
        expect(rows[4][0]).toContain("Rejected: 1");
    });

    it("creates correct report headers", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[0]).toEqual([
            "MONTHLY LEAVE REPORT",
        ]);

        expect(rows[1]).toEqual([
            " HR Management System",
        ]);

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
    });

    it("adds employee leave data to the worksheet", () => {
        const leave = createLeave();

        exportLeaveReport(
            [leave],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[7]).toEqual([
            1,
            "John Doe",
            "EMP001",
            "Engineering",
            "Annual Leave",
            "formatted-2026-08-01",
            "formatted-2026-08-03",
            "formatted-2026-07-25",
            "APPROVED",
            "Personal work",
        ]);
    });

    it("uses fallback values when employee data is missing", () => {
        const leave = {
            employee: undefined,
            leave_type: undefined,
            from_date: undefined,
            to_date: undefined,
            created_at: undefined,
            status: undefined,
            reason: undefined,
        };

        exportLeaveReport(
            [leave],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[7]).toEqual([
            1,
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "PENDING",
            "-",
        ]);
    });

    it("uses employee id when employee_id is unavailable", () => {
        const leave = createLeave({
            employee: {
                name: "Jane Doe",
                id: 25,
                department: "HR",
            },
        });

        exportLeaveReport(
            [leave],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[7][2]).toBe(25);
    });

    it("converts status to uppercase", () => {
        const leave = createLeave({
            status: "pending",
        });

        exportLeaveReport(
            [leave],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[7][8]).toBe("PENDING");
    });

    it("calls formatDate for all three dates", () => {
        const leave = createLeave();

        exportLeaveReport(
            [leave],
            1,
            mockFormatDate
        );

        expect(mockFormatDate).toHaveBeenCalledTimes(3);

        expect(mockFormatDate).toHaveBeenNthCalledWith(
            1,
            "2026-08-01"
        );

        expect(mockFormatDate).toHaveBeenNthCalledWith(
            2,
            "2026-08-03"
        );

        expect(mockFormatDate).toHaveBeenNthCalledWith(
            3,
            "2026-07-25"
        );
    });

    it("configures worksheet merges and column widths", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const ws = mocks.worksheet;

        expect(ws["!merges"]).toEqual([
            {
                s: { r: 0, c: 0 },
                e: { r: 0, c: 9 },
            },
            {
                s: { r: 1, c: 0 },
                e: { r: 1, c: 9 },
            },
        ]);

        expect(ws["!cols"]).toHaveLength(10);

        expect(ws["!cols"][0]).toEqual({
            wch: 10,
        });

        expect(ws["!cols"][1]).toEqual({
            wch: 30,
        });

        expect(ws["!cols"][9]).toEqual({
            wch: 50,
        });
    });

    it("configures row heights", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const ws = mocks.worksheet;

        expect(ws["!rows"]).toHaveLength(8);

        expect(ws["!rows"][0]).toEqual({
            hpt: 35,
        });

        expect(ws["!rows"][1]).toEqual({
            hpt: 24,
        });

        expect(ws["!rows"][2]).toEqual({
            hpt: 22,
        });

        expect(ws["!rows"][7]).toEqual({
            hpt: 25,
        });
    });

    it("applies title styling", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const title = mocks.worksheet.A1;

        expect(title.s).toBeDefined();
        expect(title.s.font.bold).toBe(true);
        expect(title.s.font.sz).toBe(22);
        expect(title.s.font.color.rgb).toBe("FFFFFF");
        expect(title.s.fill.fgColor.rgb).toBe("0F172A");
        expect(title.s.alignment.horizontal).toBe("center");
        expect(title.s.alignment.vertical).toBe("center");
    });

    it("applies subtitle styling", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const subtitle = mocks.worksheet.A2;

        expect(subtitle.s).toBeDefined();
        expect(subtitle.s.font.bold).toBe(true);
        expect(subtitle.s.font.sz).toBe(12);
        expect(subtitle.s.font.color.rgb).toBe("FFFFFF");
        expect(subtitle.s.fill.fgColor.rgb).toBe("334155");
        expect(subtitle.s.alignment.horizontal).toBe("center");
        expect(subtitle.s.alignment.vertical).toBe("center");
    });

    it("styles the summary rows", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        expect(mocks.worksheet.A4.s).toBeDefined();
        expect(mocks.worksheet.A5.s).toBeDefined();

        expect(mocks.worksheet.A4.s.font.bold).toBe(true);
        expect(mocks.worksheet.A5.s.font.bold).toBe(true);

        expect(mocks.worksheet.A4.s.fill.fgColor.rgb)
            .toBe("E2E8F0");

        expect(mocks.worksheet.A5.s.fill.fgColor.rgb)
            .toBe("E2E8F0");
    });

    it("styles the header row", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        const header = mocks.worksheet.A7;

        expect(header.s).toBeDefined();
        expect(header.s.font.bold).toBe(true);
        expect(header.s.font.color.rgb).toBe("FFFFFF");
        expect(header.s.font.sz).toBe(11);

        expect(header.s.fill.fgColor.rgb).toBe("1E293B");

        expect(header.s.alignment.horizontal).toBe(
            "center"
        );

        expect(header.s.alignment.vertical).toBe(
            "center"
        );

        expect(header.s.alignment.wrapText).toBe(true);

        expect(header.s.border.top.style).toBe("thin");
        expect(header.s.border.bottom.style).toBe("thin");
        expect(header.s.border.left.style).toBe("thin");
        expect(header.s.border.right.style).toBe("thin");
    });

    it("applies approved status styling", () => {
        exportLeaveReport(
            [
                createLeave({
                    status: "approved",
                }),
            ],
            1,
            mockFormatDate
        );

        const statusCell = mocks.worksheet.I8;

        expect(statusCell).toBeDefined();
        expect(statusCell.s).toBeDefined();
        expect(statusCell.s.fill.fgColor.rgb).toBe(
            "BBF7D0"
        );
        expect(statusCell.s.font.bold).toBe(true);
    });

    it("applies pending status styling", () => {
        exportLeaveReport(
            [
                createLeave({
                    status: "pending",
                }),
            ],
            1,
            mockFormatDate
        );

        const statusCell = mocks.worksheet.I8;

        expect(statusCell).toBeDefined();
        expect(statusCell.s).toBeDefined();
        expect(statusCell.s.fill.fgColor.rgb).toBe(
            "FDE68A"
        );
        expect(statusCell.s.font.bold).toBe(true);
    });

    it("applies rejected status styling", () => {
        exportLeaveReport(
            [
                createLeave({
                    status: "rejected",
                }),
            ],
            1,
            mockFormatDate
        );

        const statusCell = mocks.worksheet.I8;

        expect(statusCell).toBeDefined();
        expect(statusCell.s).toBeDefined();
        expect(statusCell.s.fill.fgColor.rgb).toBe(
            "FCA5A5"
        );
        expect(statusCell.s.font.bold).toBe(true);
    });

    it("configures freeze panes and autofilter", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        expect(mocks.worksheet["!freeze"]).toEqual({
            ySplit: 7,
        });

        expect(mocks.worksheet["!autofilter"]).toEqual({
            ref: "A7:J1000",
        });
    });

    it("appends the worksheet with the correct sheet name", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        expect(
            XLSX.utils.book_append_sheet
        ).toHaveBeenCalledWith(
            mocks.workbook,
            mocks.worksheet,
            "Leave Report"
        );

        expect(
            mocks.workbook.SheetNames
        ).toContain("Leave Report");
    });

    it("exports the file with the expected filename pattern", () => {
        exportLeaveReport(
            [createLeave()],
            1,
            mockFormatDate
        );

        expect(XLSX.writeFile).toHaveBeenCalledTimes(1);

        const filename =
            XLSX.writeFile.mock.calls[0][1];

        expect(filename).toMatch(
            /^Rekory_Leave_Report_\d{4}-\d{2}-\d{2}\.xlsx$/
        );
    });

    it("handles an empty leave list", () => {
        exportLeaveReport(
            [],
            1,
            mockFormatDate
        );

        const rows = mocks.aoaToSheet.mock.calls[0][0];

        expect(rows[4][0]).toContain(
            "Total Requests: 0"
        );

        expect(rows[4][0]).toContain(
            "Approved: 0"
        );

        expect(rows[4][0]).toContain(
            "Pending: 0"
        );

        expect(rows[4][0]).toContain(
            "Rejected: 0"
        );

        expect(XLSX.writeFile).toHaveBeenCalledTimes(1);
    });
});


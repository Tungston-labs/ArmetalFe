import { describe, it, expect, vi, beforeEach } from "vitest";

/* =========================================================
   MOCK XLSX
========================================================= */

const mocks = vi.hoisted(() => ({
    book_new: vi.fn(),
    aoa_to_sheet: vi.fn(),
    book_append_sheet: vi.fn(),
    writeFile: vi.fn(),
}));

vi.mock("xlsx-js-style", () => ({
    utils: {
        book_new: mocks.book_new,
        aoa_to_sheet: mocks.aoa_to_sheet,
        book_append_sheet: mocks.book_append_sheet,
    },
    writeFile: mocks.writeFile,
}));

/* =========================================================
   IMPORT SOURCE AFTER MOCK
========================================================= */

import * as XLSX from "xlsx-js-style";
import { exportHolidayExcel } from "../../utils/holiday.js";

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
    vi.clearAllMocks();

    mocks.book_new.mockReturnValue({
        Sheets: {},
        SheetNames: [],
    });

    mocks.aoa_to_sheet.mockImplementation((rows) => ({
        "!rows": rows,
    }));

    mocks.book_append_sheet.mockImplementation(() => { });

    mocks.writeFile.mockImplementation(() => { });
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("exportHolidayExcel", () => {
    it("exports report with default empty holidays", () => {
        exportHolidayExcel();

        expect(XLSX.utils.book_new).toHaveBeenCalledTimes(1);
        expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalledTimes(1);
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(1);
        expect(XLSX.writeFile).toHaveBeenCalledTimes(1);
    });

    it("creates workbook correctly", () => {
        exportHolidayExcel([]);

        expect(mocks.book_new).toHaveBeenCalledTimes(1);
    });

    it("creates correct header rows", () => {
        exportHolidayExcel([]);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows).toEqual([
            ["HOLIDAY REPORT"],
            [],
            ["Total Holidays: 0"],
            [],
            [
                "Sl No",
                "Date",
                "Day",
                "Description",
                "Holiday Type",
            ],
        ]);
    });

    it("creates correct total holiday count", () => {
        const holidays = [
            {
                date: "2026-01-01",
                day: "Thursday",
                description: "New Year",
                holiday_type_display: "Public Holiday",
            },
            {
                date: "2026-01-26",
                day: "Monday",
                description: "Republic Day",
                holiday_type_display: "National Holiday",
            },
            {
                date: "2026-08-15",
                day: "Saturday",
                description: "Independence Day",
                holiday_type_display: "National Holiday",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[2]).toEqual(["Total Holidays: 3"]);
    });

    it("exports complete holiday information", () => {
        const holidays = [
            {
                date: "2026-01-01",
                day: "Thursday",
                description: "New Year",
                holiday_type_display: "Public Holiday",
            },
            {
                date: "2026-01-26",
                day: "Monday",
                description: "Republic Day",
                holiday_type_display: "National Holiday",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows).toEqual([
            ["HOLIDAY REPORT"],
            [],
            ["Total Holidays: 2"],
            [],
            [
                "Sl No",
                "Date",
                "Day",
                "Description",
                "Holiday Type",
            ],
            [
                1,
                "2026-01-01",
                "Thursday",
                "New Year",
                "Public Holiday",
            ],
            [
                2,
                "2026-01-26",
                "Monday",
                "Republic Day",
                "National Holiday",
            ],
        ]);
    });

    it("generates correct serial numbers", () => {
        const holidays = [
            {
                date: "2026-01-01",
                day: "Thursday",
                description: "Holiday 1",
                holiday_type_display: "Public",
            },
            {
                date: "2026-02-01",
                day: "Sunday",
                description: "Holiday 2",
                holiday_type_display: "Public",
            },
            {
                date: "2026-03-01",
                day: "Sunday",
                description: "Holiday 3",
                holiday_type_display: "Public",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5][0]).toBe(1);
        expect(rows[6][0]).toBe(2);
        expect(rows[7][0]).toBe(3);
    });

    it("uses fallback values for empty fields", () => {
        const holidays = [
            {
                date: "",
                day: "",
                description: "",
                holiday_type_display: "",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "-",
            "-",
            "-",
            "-",
        ]);
    });

    it("uses fallback values for null fields", () => {
        const holidays = [
            {
                date: null,
                day: null,
                description: null,
                holiday_type_display: null,
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "-",
            "-",
            "-",
            "-",
        ]);
    });

    it("uses fallback values for undefined fields", () => {
        const holidays = [
            {
                date: undefined,
                day: undefined,
                description: undefined,
                holiday_type_display: undefined,
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "-",
            "-",
            "-",
            "-",
        ]);
    });

    it("handles partially populated holiday data", () => {
        const holidays = [
            {
                date: "2026-05-01",
                description: "Labour Day",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "2026-05-01",
            "-",
            "Labour Day",
            "-",
        ]);
    });

    it("handles mixed complete and missing fields", () => {
        const holidays = [
            {
                date: "2026-12-25",
                day: "Friday",
                description: "Christmas Day",
                holiday_type_display: "Religious Holiday",
            },
            {
                date: "",
                day: "Saturday",
                description: "",
                holiday_type_display: "Public Holiday",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5]).toEqual([
            1,
            "2026-12-25",
            "Friday",
            "Christmas Day",
            "Religious Holiday",
        ]);

        expect(rows[6]).toEqual([
            2,
            "-",
            "Saturday",
            "-",
            "Public Holiday",
        ]);
    });

    it("handles explicitly empty array", () => {
        exportHolidayExcel([]);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows).toHaveLength(5);
    });

    it("creates one data row for one holiday", () => {
        const holidays = [
            {
                date: "2026-10-02",
                day: "Friday",
                description: "Gandhi Jayanti",
                holiday_type_display: "National Holiday",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows).toHaveLength(6);
        expect(rows[5]).toEqual([
            1,
            "2026-10-02",
            "Friday",
            "Gandhi Jayanti",
            "National Holiday",
        ]);
    });

    it("sets correct worksheet column widths", () => {
        exportHolidayExcel([]);

        const worksheet =
            mocks.aoa_to_sheet.mock.results[0].value;

        expect(worksheet["!cols"]).toEqual([
            { wch: 10 },
            { wch: 18 },
            { wch: 18 },
            { wch: 35 },
            { wch: 25 },
        ]);
    });

    it("appends worksheet with correct name", () => {
        const workbook = {
            Sheets: {},
            SheetNames: [],
        };

        const worksheet = {
            "!cols": [],
        };

        mocks.book_new.mockReturnValue(workbook);
        mocks.aoa_to_sheet.mockReturnValue(worksheet);

        exportHolidayExcel([]);

        expect(mocks.book_append_sheet).toHaveBeenCalledWith(
            workbook,
            worksheet,
            "Holiday Report"
        );
    });

    it("creates worksheet from generated rows", () => {
        exportHolidayExcel([]);

        expect(mocks.aoa_to_sheet).toHaveBeenCalledWith([
            ["HOLIDAY REPORT"],
            [],
            ["Total Holidays: 0"],
            [],
            [
                "Sl No",
                "Date",
                "Day",
                "Description",
                "Holiday Type",
            ],
        ]);
    });

    it("writes correct Excel filename", () => {
        exportHolidayExcel([]);

        expect(mocks.writeFile).toHaveBeenCalledWith(
            expect.anything(),
            "Holiday_Report.xlsx"
        );
    });

    it("passes the same workbook to writeFile", () => {
        const workbook = {
            Sheets: {},
            SheetNames: [],
        };

        mocks.book_new.mockReturnValue(workbook);

        exportHolidayExcel([]);

        expect(mocks.writeFile).toHaveBeenCalledWith(
            workbook,
            "Holiday_Report.xlsx"
        );
    });

    it("passes the generated worksheet to appendSheet", () => {
        const workbook = {};
        const worksheet = {
            "!cols": [],
        };

        mocks.book_new.mockReturnValue(workbook);
        mocks.aoa_to_sheet.mockReturnValue(worksheet);

        exportHolidayExcel([]);

        expect(
            mocks.book_append_sheet
        ).toHaveBeenCalledWith(
            workbook,
            worksheet,
            "Holiday Report"
        );
    });

    it("preserves holiday order", () => {
        const holidays = [
            {
                date: "2026-12-25",
                day: "Friday",
                description: "Christmas",
                holiday_type_display: "Religious",
            },
            {
                date: "2026-01-01",
                day: "Thursday",
                description: "New Year",
                holiday_type_display: "Public",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows[5][1]).toBe("2026-12-25");
        expect(rows[6][1]).toBe("2026-01-01");
    });

    it("creates exactly one row per holiday", () => {
        const holidays = [
            {
                date: "2026-01-01",
                day: "Thursday",
                description: "Holiday 1",
                holiday_type_display: "Public",
            },
            {
                date: "2026-02-01",
                day: "Sunday",
                description: "Holiday 2",
                holiday_type_display: "Public",
            },
            {
                date: "2026-03-01",
                day: "Sunday",
                description: "Holiday 3",
                holiday_type_display: "Public",
            },
            {
                date: "2026-04-01",
                day: "Wednesday",
                description: "Holiday 4",
                holiday_type_display: "Public",
            },
        ];

        exportHolidayExcel(holidays);

        const rows = mocks.aoa_to_sheet.mock.calls[0][0];

        expect(rows).toHaveLength(9);
    });

    it("executes XLSX operations in correct order", () => {
        const callOrder = [];

        mocks.book_new.mockImplementation(() => {
            callOrder.push("book_new");
            return {};
        });

        mocks.aoa_to_sheet.mockImplementation(() => {
            callOrder.push("aoa_to_sheet");
            return {};
        });

        mocks.book_append_sheet.mockImplementation(() => {
            callOrder.push("book_append_sheet");
        });

        mocks.writeFile.mockImplementation(() => {
            callOrder.push("writeFile");
        });

        exportHolidayExcel([]);

        expect(callOrder).toEqual([
            "book_new",
            "aoa_to_sheet",
            "book_append_sheet",
            "writeFile",
        ]);
    });

    it("generates the final Excel report", () => {
        const holidays = [
            {
                date: "2026-08-15",
                day: "Saturday",
                description: "Independence Day",
                holiday_type_display: "National Holiday",
            },
        ];

        exportHolidayExcel(holidays);

        expect(mocks.book_new).toHaveBeenCalledTimes(1);
        expect(mocks.aoa_to_sheet).toHaveBeenCalledTimes(1);
        expect(mocks.book_append_sheet).toHaveBeenCalledTimes(1);
        expect(mocks.writeFile).toHaveBeenCalledTimes(1);

        expect(mocks.writeFile).toHaveBeenLastCalledWith(
            expect.anything(),
            "Holiday_Report.xlsx"
        );
    });
});
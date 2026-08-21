import { describe, it, expect, vi, beforeEach } from "vitest";

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

import { exportHolidayExcel } from "../../utils/holiday.js";

describe("exportHolidayExcel", () => {
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

    it("should export an empty holiday report when no argument is provided", () => {
        exportHolidayExcel();

        expect(mocks.book_new).toHaveBeenCalledTimes(1);
        expect(mocks.aoa_to_sheet).toHaveBeenCalledTimes(1);
        expect(mocks.book_append_sheet).toHaveBeenCalledTimes(1);
        expect(mocks.writeFile).toHaveBeenCalledTimes(1);

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

        expect(mocks.writeFile).toHaveBeenCalledWith(
            expect.anything(),
            "Holiday_Report.xlsx"
        );
    });

    it("should export complete holiday data", () => {
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

    it("should assign sequential serial numbers", () => {
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

    it("should use fallback values for empty values", () => {
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

    it("should use fallback values for null and undefined values", () => {
        const holidays = [
            {
                date: null,
                day: undefined,
                description: null,
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

    it("should handle partially populated holiday data", () => {
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

    it("should set worksheet column widths", () => {
        exportHolidayExcel([]);

        const worksheet = mocks.aoa_to_sheet.mock.results[0].value;

        expect(worksheet["!cols"]).toEqual([
            { wch: 10 },
            { wch: 18 },
            { wch: 18 },
            { wch: 35 },
            { wch: 25 },
        ]);
    });

    it("should append worksheet with correct name", () => {
        const workbook = {};
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

    it("should write the correct Excel filename", () => {
        exportHolidayExcel([]);

        expect(mocks.writeFile).toHaveBeenCalledWith(
            expect.anything(),
            "Holiday_Report.xlsx"
        );
    });

    it("should pass the same workbook to writeFile", () => {
        const workbook = {};

        mocks.book_new.mockReturnValue(workbook);

        exportHolidayExcel([]);

        expect(mocks.writeFile).toHaveBeenCalledWith(
            workbook,
            "Holiday_Report.xlsx"
        );
    });
});
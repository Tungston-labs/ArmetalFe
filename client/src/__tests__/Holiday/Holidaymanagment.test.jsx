
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";

import HolidayManager from "../../Pages/holiday/Holiday";
import { fetchHolidayTypes } from "../../services/holidayService";
import { exportHolidayExcel } from "../../utils/holiday";
import { exportHolidayPDF } from "../../Pages/report/holiday";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/holidaySlice", () => ({
  getHolidays: (page) => ({ type: "getHolidays", payload: page }),
  addHoliday: (payload) => ({ type: "addHoliday", payload }),
  removeHoliday: (id) => ({ type: "removeHoliday", payload: id }),
}));

vi.mock("../../services/holidayService", () => ({
  fetchHolidayTypes: vi.fn(),
}));

vi.mock("../../utils/holiday", () => ({
  exportHolidayExcel: vi.fn(),
}));

vi.mock("../../Pages/report/holiday", () => ({
  exportHolidayPDF: vi.fn(),
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>loading-holidays</div>,
}));
vi.mock("../../Components/HolidayHeading", () => ({
  default: ({ onReportClick }) => (
    <div>
      <button onClick={() => onReportClick("excel")}>
        export-excel
      </button>
      <button onClick={() => onReportClick("pdf")}>
        export-pdf
      </button>
    </div>
  ),
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div>
      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button onClick={() => onPageChange(currentPage - 1)}>
        prev-page
      </button>

      <button onClick={() => onPageChange(currentPage + 1)}>
        next-page
      </button>

      <button onClick={() => onPageChange(0)}>
        jump-to-zero
      </button>

      <button onClick={() => onPageChange(999)}>
        jump-too-far
      </button>
    </div>
  ),
}));

vi.mock("../../Components/No found/Noemployeefound", () => ({
  default: () => <div>no-holidays-found</div>,
}));

const mockDispatch = vi.fn();

const makeThunkResult = (value) => {
  const p = Promise.resolve(value);
  p.unwrap = () => Promise.resolve(value);
  return p;
};
const makeThunkRejection = (err) => {
  const p = Promise.resolve().then(() => Promise.reject(err));
  p.unwrap = () => Promise.reject(err);
  p.catch(() => {});
  return p;
};

const holidaysFixture = [
  {
    id: 1,
    description: "republic day",
    holiday_type_display: "Public Holiday",
    date: "2026-01-26",
  },
  {
    id: 2,
    description: "founders day",
    holiday_type_display: "Company Holiday",
    date: "2026-03-10",
  },
  {
    id: 3,
    description: "weekly off",
    holiday_type_display: "Company Off Day",
    date: null,
  },
];

const baseHolidayState = {
  list: holidaysFixture,
  loading: false,
  error: null,
  totalPages: 2,
  currentPage: 1,
  count: 3,
  totalItems: 3,
};

let dispatchResponses;

beforeEach(() => {
  vi.clearAllMocks();

  // Pin "today" to a date before both holiday fixtures (2026-01-26, 2026-03-10)
  // so date-past-vs-future validation stays stable no matter when tests run.
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-12-01"));

  dispatchResponses = {
    getHolidays: undefined,
    addHoliday: {},
    removeHoliday: {},
  };

  mockDispatch.mockImplementation((action) => {
    const value = dispatchResponses[action.type];
    if (value instanceof Error) return makeThunkRejection(value);
    return makeThunkResult(value);
  });

  useDispatch.mockReturnValue(mockDispatch);
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({ holidays: baseHolidayState })
  );

  fetchHolidayTypes.mockResolvedValue({
    holiday_types: [
      { key: "public", label: "Public Holiday" },
      { key: "company", label: "Company Holiday" },
      { key: "company_off_day", label: "Company Off Day" },
    ],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

const openTypeDropdown = () => screen.getByDisplayValue("Select");

describe("HolidayManager", () => {
  test("fetches holiday types and the holiday list on mount", async () => {
    render(<HolidayManager />);

    await waitFor(() => expect(fetchHolidayTypes).toHaveBeenCalledTimes(1));
    const call = mockDispatch.mock.calls.find((c) => c[0].type === "getHolidays");
    expect(call[0].payload).toBe(1);
  });

  test("falls back to the default holiday types when the service call fails", async () => {
    fetchHolidayTypes.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await waitFor(() => expect(fetchHolidayTypes).toHaveBeenCalled());
    await user.click(openTypeDropdown());
    expect(
      screen.getByRole("option", { name: "Public Holiday" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Company Off Day" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Second Saturdays" })
    ).toBeInTheDocument();
  });

  test("shows a loader while holidays are loading", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ holidays: { ...baseHolidayState, loading: true } })
    );
    render(<HolidayManager />);
    expect(screen.getByText("loading-holidays")).toBeInTheDocument();
  });

  test("shows an empty state when there are no holidays", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ holidays: { ...baseHolidayState, list: [] } })
    );
    render(<HolidayManager />);
    expect(screen.getByText("no-holidays-found")).toBeInTheDocument();
  });

  test("renders holidays sorted most-recent-first, with undated entries last", () => {
    render(<HolidayManager />);
    const rows = screen.getAllByText(/Founders day|Republic day|Weekly off/i);
    expect(rows.map((r) => r.textContent)).toEqual([
      "Founders day",
      "Republic day",
      "Weekly off",
    ]);
  });

  test("capitalizes the first letter of the description and formats the date", () => {
    render(<HolidayManager />);
    expect(screen.getByText("Republic day")).toBeInTheDocument();
    expect(screen.getByText("26/Jan/2026")).toBeInTheDocument();
  });

  test("filters the list by the selected month", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    const monthInput = document.querySelector('input[type="month"]');
    await user.type(monthInput, "2026-03");

    expect(screen.getByText("Founders day")).toBeInTheDocument();
    expect(screen.queryByText("Republic day")).not.toBeInTheDocument();
  });

  test("shows an error when required fields are missing on add", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.click(screen.getByText("Add"));
    expect(
      screen.getByText("⚠️ Please fill in all required fields.")
    ).toBeInTheDocument();
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "addHoliday")
    ).toBe(false);
  });

  test("requires a weekly off day when the type is Company Off Day", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Weekly Rest");
    await user.selectOptions(openTypeDropdown(), "company_off_day");
    await user.click(screen.getByText("Add"));

    expect(
      screen.getByText("⚠️ Please select a weekly off day.")
    ).toBeInTheDocument();
  });

  test("requires a date for non-recurring holiday types", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "New Year");
    await user.selectOptions(openTypeDropdown(), "public");
    await user.click(screen.getByText("Add"));

    expect(screen.getByText("⚠️ Please select a date.")).toBeInTheDocument();
  });

  test("rejects a date in the past", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Old Day");
    await user.selectOptions(openTypeDropdown(), "public");
    const dateInput = document.querySelector('input[type="date"]');
    // Must be before the pinned "today" (2025-12-01) to count as past.
    await user.type(dateInput, "2025-11-01");
    await user.click(screen.getByText("Add"));

    expect(
      screen.getByText("⚠️ Holiday date cannot be in the past.")
    ).toBeInTheDocument();
  });

  test("rejects a date that already has a holiday", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Duplicate");
    await user.selectOptions(openTypeDropdown(), "public");
    const dateInput = document.querySelector('input[type="date"]');
    await user.type(dateInput, "2026-01-26"); // matches the Republic Day fixture, now in the future relative to pinned "today"
    await user.click(screen.getByText("Add"));

    expect(
      screen.getByText("⚠️ A holiday already exists on this date.")
    ).toBeInTheDocument();
  });

  test("adding a dated holiday dispatches the correct payload and refetches the list", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Spring Fest");
    await user.selectOptions(openTypeDropdown(), "public");
    const dateInput = document.querySelector('input[type="date"]');
    await user.type(dateInput, "2027-04-01");
    await user.click(screen.getByText("Add"));

    await waitFor(() => {
      const addCall = mockDispatch.mock.calls.find((c) => c[0].type === "addHoliday");
      expect(addCall[0].payload).toEqual({
        description: "Spring Fest",
        holiday_type: "public",
        date: "2027-04-01",
      });
    });

    await waitFor(() => {
      const refetches = mockDispatch.mock.calls.filter(
        (c) => c[0].type === "getHolidays"
      );
      expect(refetches.length).toBeGreaterThanOrEqual(2); // mount + post-add
    });

    // Form resets.
    expect(screen.getByPlaceholderText("Holiday name")).toHaveValue("");
  });

  test("adding a company off day sends the weekday number and today's date, skipping date validation", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Weekly Rest");
    await user.selectOptions(openTypeDropdown(), "company_off_day");
    await user.selectOptions(screen.getByDisplayValue("Select Day"), "6"); // Sunday

    await user.click(screen.getByText("Add"));

    const today = new Date().toISOString().split("T")[0]; // resolves against the pinned system time
    await waitFor(() => {
      const addCall = mockDispatch.mock.calls.find((c) => c[0].type === "addHoliday");
      expect(addCall[0].payload).toEqual({
        description: "Weekly Rest",
        holiday_type: "company_off_day",
        off_day_weekday: 6,
        date: today,
      });
    });
  });

  test("shows the server's error message when creating a holiday fails", async () => {
    dispatchResponses.addHoliday = new Error("Holiday limit reached");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.type(screen.getByPlaceholderText("Holiday name"), "Extra Day");
    await user.selectOptions(openTypeDropdown(), "public");
    const dateInput = document.querySelector('input[type="date"]');
    await user.type(dateInput, "2027-05-01");
    await user.click(screen.getByText("Add"));

    expect(await screen.findByText("Holiday limit reached")).toBeInTheDocument();
  });

  test("clicking delete opens a confirmation dialog", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<HolidayManager />);

    const trashIcons = container.querySelectorAll("svg");
    await user.click(trashIcons[trashIcons.length - 1]);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
  });

  test("confirming delete removes the holiday and refreshes the list", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<HolidayManager />);
    mockDispatch.mockClear();

    const trashIcons = container.querySelectorAll("svg");
    await user.click(trashIcons[0]);
    await user.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "removeHoliday")
      ).toBe(true);
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "getHolidays")
      ).toBe(true);
    });
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  test("cancelling delete closes the dialog without dispatching", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<HolidayManager />);
    mockDispatch.mockClear();

    const trashIcons = container.querySelectorAll("svg");
    await user.click(trashIcons[0]);
    await user.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "removeHoliday")
    ).toBe(false);
  });

  test("report buttons call the matching export helper with the current holiday list", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);

    await user.click(screen.getByText("export-excel"));
    expect(exportHolidayExcel).toHaveBeenCalledWith(holidaysFixture);

    await user.click(screen.getByText("export-pdf"));
    expect(exportHolidayPDF).toHaveBeenCalledWith(holidaysFixture);
  });

  test("pagination ignores out-of-range pages and fetches valid ones", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HolidayManager />);
    mockDispatch.mockClear();

    await user.click(screen.getByText("jump-to-zero"));
    await user.click(screen.getByText("jump-too-far"));
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "getHolidays")
    ).toBe(false);

    await user.click(screen.getByText("next-page"));
    await waitFor(() => {
      const call = mockDispatch.mock.calls.find((c) => c[0].type === "getHolidays");
      expect(call[0].payload).toBe(2);
    });
  });
});
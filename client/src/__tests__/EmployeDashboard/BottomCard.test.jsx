import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// =========================================================
// MOCKS
// =========================================================

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  useSelector: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: mocks.useSelector,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
  useParams: () => mocks.useParams(),
}));

vi.mock("../../Redux/authSlice", () => ({
  fetchEmployeeDash: vi.fn((employeeId) => ({
    type: "auth/fetchEmployeeDash",
    payload: employeeId,
  })),
}));

// =========================================================
// STYLED COMPONENT MOCK
// =========================================================

vi.mock("../../Pages/employeDashboard/BottomCard.Styles", () => {
  const React = require("react");

  const createComponent = (tag = "div") =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ...props, ref }, children),
    );

  return {
    Container: createComponent("div"),
    Section: createComponent("section"),
    Header: createComponent("div"),
    Title: createComponent("h2"),
    TaskList: createComponent("div"),
    TaskCard: createComponent("div"),
    TaskLeft: createComponent("div"),
    TaskDate: createComponent("span"),
    TaskTime: createComponent("span"),
    TaskContent: createComponent("div"),
    TaskRole: createComponent("div"),
    TaskDescription: createComponent("div"),
    RightArrow: createComponent("button"),
    AttendanceHeader: createComponent("div"),
    Table: createComponent("table"),
    TableRow: createComponent("tr"),
    TableCell: createComponent("td"),
    TimeIn: createComponent("span"),
    TimeOut: createComponent("span"),
    Divider: createComponent("div"),
    Wrapper: createComponent("div"),
    Image: createComponent("img"),
    Message: createComponent("p"),
    AttendanceSection: createComponent("div"),
    AttendanceImage: createComponent("img"),
    Text: createComponent("p"),
    TimeWrapper: createComponent("div"),
    ClockIcon: createComponent("img"),
    TimeText: createComponent("span"),
    RightArrows: createComponent("button"),
    TableWrapper: createComponent("div"),
  };
});

// =========================================================
// ICON MOCK
// =========================================================

vi.mock("react-icons/fi", () => ({
  FiArrowUpRight: () => <span data-testid="arrow-icon">arrow</span>,
}));

// =========================================================
// ASSET MOCKS
// =========================================================

vi.mock("../../assets/daliy.svg", () => ({
  default: "daily-task-image.svg",
}));

vi.mock("../../assets/puchtime.svg", () => ({
  default: "punch-time-image.svg",
}));

// =========================================================
// IMPORT COMPONENT AFTER MOCKS
// =========================================================

import DailyTaskList from "../../Pages/employeDashboard/BottomCard";

// =========================================================
// TEST DATA
// =========================================================

const employeeData = {
  daily_tasks: [
    {
      date: "2026-08-10",
      time_taken: 5.5,
      project: "Employee Portal",
      task: "Implement dashboard tests",
    },
    {
      date: "2026-08-11",
      time_taken: 2,
      project: "HR Management",
      task: "Fix attendance module",
    },
  ],

  today_sessions: [
    {
      time_in: "05:35:10.246872",
      time_out: "14:45:20.123456",
    },
    {
      time_in: "15:30:00",
      time_out: "18:00:00",
    },
  ],
};

// =========================================================
// SETUP
// =========================================================

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  mocks.useParams.mockReturnValue({
    employeeId: "123",
  });

  mocks.useSelector.mockReturnValue({
    employeeDashData: employeeData,
    loadingEmployeeDash: false,
    employeeDashError: null,
  });
});

// =========================================================
// TESTS
// =========================================================

describe("DailyTaskList", () => {
  // -------------------------------------------------------
  // BASIC RENDER
  // -------------------------------------------------------

  it("renders daily task and attendance sections", () => {
    render(<DailyTaskList />);

    expect(
      screen.getByRole("heading", {
        name: "Daily Task List",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Time in")).toBeInTheDocument();

    expect(screen.getByText("Time out")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // DISPATCH
  // -------------------------------------------------------

  it("dispatches fetchEmployeeDash when employeeId exists", () => {
    render(<DailyTaskList />);

    expect(mocks.dispatch).toHaveBeenCalledTimes(1);

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/fetchEmployeeDash",
      payload: "123",
    });
  });

  it("does not dispatch when employeeId is missing", () => {
    mocks.useParams.mockReturnValue({
      employeeId: undefined,
    });

    render(<DailyTaskList />);

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  it("renders loading state", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: null,
      loadingEmployeeDash: true,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  it("renders error state", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: null,
      loadingEmployeeDash: false,
      employeeDashError: "Failed to load dashboard",
    });

    render(<DailyTaskList />);

    expect(
      screen.getByText("Error: Failed to load dashboard"),
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // TASK DATA
  // -------------------------------------------------------

  it("renders daily tasks correctly", () => {
    render(<DailyTaskList />);

    expect(screen.getByText("Employee Portal")).toBeInTheDocument();

    expect(screen.getByText("Implement dashboard tests")).toBeInTheDocument();

    expect(screen.getByText("HR Management")).toBeInTheDocument();

    expect(screen.getByText("Fix attendance module")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // TASK DATE FORMATTING
  // -------------------------------------------------------

  it("formats task dates correctly", () => {
    render(<DailyTaskList />);

    expect(screen.getByText("10 Aug")).toBeInTheDocument();

    expect(screen.getByText("11 Aug")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // TASK HOURS FORMATTING
  // -------------------------------------------------------

  it("formats task hours correctly", () => {
    render(<DailyTaskList />);

    // 5.5 -> 05:50
    expect(screen.getByText("05:50")).toBeInTheDocument();

    // 2 -> 02:00
    expect(screen.getByText("02:00")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // EMPTY TASKS
  // -------------------------------------------------------

  it("renders empty task message when there are no tasks", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: [],
        today_sessions: employeeData.today_sessions,
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("Today's task list is empty")).toBeInTheDocument();

    expect(screen.getByAltText("No tasks")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // MISSING TASK DATA
  // -------------------------------------------------------

  it("handles missing daily_tasks safely", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {},
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("Today's task list is empty")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // TASK FALLBACK VALUES
  // -------------------------------------------------------

  it("renders fallback values for missing project and task", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: [
          {
            date: "2026-08-11",
            time_taken: 3,
            project: "",
            task: "",
          },
        ],
        today_sessions: [],
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("N/A")).toBeInTheDocument();

    expect(screen.getByText("No task")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // ATTENDANCE DATA
  // -------------------------------------------------------

  it("renders attendance sessions correctly", () => {
    render(<DailyTaskList />);

    const timeTexts = screen.getAllByText(/AM|PM/i);

    expect(timeTexts.length).toBeGreaterThanOrEqual(4);

    expect(screen.getAllByText("To").length).toBe(2);
  });

  // -------------------------------------------------------
  // ATTENDANCE EMPTY STATE
  // -------------------------------------------------------

  it("renders no attendance message when attendance is empty", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: employeeData.daily_tasks,
        today_sessions: [],
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(
      screen.getByText("No attendance recorded today"),
    ).toBeInTheDocument();

    expect(screen.getByAltText("No attendance")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // MISSING ATTENDANCE DATA
  // -------------------------------------------------------

  it("handles missing today_sessions safely", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: [],
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(
      screen.getByText("No attendance recorded today"),
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // TASK NAVIGATION
  // -------------------------------------------------------

  it("navigates to daily task page from header arrow", () => {
    render(<DailyTaskList />);

    fireEvent.click(screen.getByTitle("Go to Tasks"));

    expect(mocks.navigate).toHaveBeenCalledWith("/daily-task");
  });

  // -------------------------------------------------------
  // TASK DETAIL NAVIGATION
  // -------------------------------------------------------

  it("navigates to daily task page from task details arrow", () => {
    render(<DailyTaskList />);

    const taskButtons = screen.getAllByTitle("View Task Details");

    fireEvent.click(taskButtons[0]);

    expect(mocks.navigate).toHaveBeenCalledWith("/daily-task");
  });

  // -------------------------------------------------------
  // ATTENDANCE NAVIGATION
  // -------------------------------------------------------

  it("navigates to attendance page", () => {
    render(<DailyTaskList />);

    fireEvent.click(screen.getByTitle("View Attendance Details"));

    expect(mocks.navigate).toHaveBeenCalledWith("/employee-on-present");
  });

  // -------------------------------------------------------
  // MULTIPLE TASK DETAIL BUTTONS
  // -------------------------------------------------------

  it("renders a detail arrow for every task", () => {
    render(<DailyTaskList />);

    const buttons = screen.getAllByTitle("View Task Details");

    expect(buttons).toHaveLength(2);
  });

  // -------------------------------------------------------
  // SECOND TASK NAVIGATION
  // -------------------------------------------------------

  it("navigates when the second task arrow is clicked", () => {
    render(<DailyTaskList />);

    const buttons = screen.getAllByTitle("View Task Details");

    fireEvent.click(buttons[1]);

    expect(mocks.navigate).toHaveBeenCalledWith("/daily-task");
  });

  // -------------------------------------------------------
  // NULL DASHBOARD DATA
  // -------------------------------------------------------

  it("handles null employee dashboard data", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: null,
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("Today's task list is empty")).toBeInTheDocument();

    expect(
      screen.getByText("No attendance recorded today"),
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // NULL TASK ARRAY
  // -------------------------------------------------------

  it("handles non-array daily_tasks safely", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: null,
        today_sessions: [],
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(screen.getByText("Today's task list is empty")).toBeInTheDocument();
  });

  // -------------------------------------------------------
  // NULL ATTENDANCE ARRAY
  // -------------------------------------------------------

  it("handles non-array today_sessions safely", () => {
    mocks.useSelector.mockReturnValue({
      employeeDashData: {
        daily_tasks: [],
        today_sessions: null,
      },
      loadingEmployeeDash: false,
      employeeDashError: null,
    });

    render(<DailyTaskList />);

    expect(
      screen.getByText("No attendance recorded today"),
    ).toBeInTheDocument();
  });
});

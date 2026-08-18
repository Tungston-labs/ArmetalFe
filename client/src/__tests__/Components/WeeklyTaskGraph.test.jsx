import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import WeeklyTaskGraph from "../../Pages/employeDashboard/WeeklyTaskGraph";

describe("WeeklyTaskGraph Component", () => {
  const weeklyData = [
    { day: "Monday", tasksCompleted: 3 },
    { day: "Tuesday", tasksCompleted: 5 },
    { day: "Wednesday", tasksCompleted: 2 },
    { day: "Thursday", tasksCompleted: 7 },
    { day: "Friday", tasksCompleted: 4 },
    { day: "Saturday", tasksCompleted: 1 },
    { day: "Sunday", tasksCompleted: 0 },
  ];

  it("renders the Tasks Progress title", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    expect(screen.getByText("Tasks Progress")).toBeInTheDocument();
  });

  it("renders the Weekly Task Hours label", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    expect(screen.getByText("Weekly Task Hours")).toBeInTheDocument();
  });

  it("calculates and displays total weekly task hours", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    // 3 + 5 + 2 + 7 + 4 + 1 + 0 = 22
    expect(screen.getByText("22 hours")).toBeInTheDocument();
  });

  it("renders task hours for every day", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    expect(screen.getByText("3 hrs")).toBeInTheDocument();
    expect(screen.getByText("5 hrs")).toBeInTheDocument();
    expect(screen.getByText("2 hrs")).toBeInTheDocument();
    expect(screen.getByText("7 hrs")).toBeInTheDocument();
    expect(screen.getByText("4 hrs")).toBeInTheDocument();
    expect(screen.getByText("1 hrs")).toBeInTheDocument();
    expect(screen.getByText("0 hrs")).toBeInTheDocument();
  });

  it("renders first letter of each day", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    expect(screen.getByText("M")).toBeInTheDocument();

    // Tuesday and Thursday both render "T"
    expect(screen.getAllByText("T")).toHaveLength(2);

    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();

    // Saturday and Sunday both render "S"
    expect(screen.getAllByText("S")).toHaveLength(2);
  });

  it("renders all weekly task values", () => {
    render(<WeeklyTaskGraph weeklyData={weeklyData} />);

    const hourLabels = screen.getAllByText(/hrs$/);

    expect(hourLabels).toHaveLength(7);
  });

  it("renders an empty chart when weeklyData is empty", () => {
    render(<WeeklyTaskGraph weeklyData={[]} />);

    expect(screen.getByText("Tasks Progress")).toBeInTheDocument();

    expect(screen.getByText("Weekly Task Hours")).toBeInTheDocument();

    expect(screen.getByText("0 hours")).toBeInTheDocument();

    expect(screen.queryByText(/hrs$/)).not.toBeInTheDocument();
  });

  it("calculates total correctly with decimal values", () => {
    const decimalData = [
      { day: "Monday", tasksCompleted: 2.5 },
      { day: "Tuesday", tasksCompleted: 3.5 },
      { day: "Wednesday", tasksCompleted: 1.5 },
    ];

    render(<WeeklyTaskGraph weeklyData={decimalData} />);

    expect(screen.getByText("7.5 hours")).toBeInTheDocument();
  });

  it("handles all zero task values", () => {
    const zeroData = [
      { day: "Monday", tasksCompleted: 0 },
      { day: "Tuesday", tasksCompleted: 0 },
      { day: "Wednesday", tasksCompleted: 0 },
    ];

    render(<WeeklyTaskGraph weeklyData={zeroData} />);

    expect(screen.getByText("0 hours")).toBeInTheDocument();

    expect(screen.getAllByText("0 hrs")).toHaveLength(3);
  });

  it("handles a maximum value of 10 hours", () => {
    const maxData = [{ day: "Monday", tasksCompleted: 10 }];

    render(<WeeklyTaskGraph weeklyData={maxData} />);

    expect(screen.getByText("10 hrs")).toBeInTheDocument();

    expect(screen.getByText("10 hours")).toBeInTheDocument();
  });

  it("renders a single data point correctly", () => {
    const singleData = [
      {
        day: "Wednesday",
        tasksCompleted: 6,
      },
    ];

    render(<WeeklyTaskGraph weeklyData={singleData} />);

    expect(screen.getByText("6 hrs")).toBeInTheDocument();

    expect(screen.getByText("6 hours")).toBeInTheDocument();

    expect(screen.getByText("W")).toBeInTheDocument();
  });
});

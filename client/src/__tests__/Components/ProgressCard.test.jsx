import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProgressCard from "../../Pages/employeDashboard/ProgressCard";

describe("ProgressCard Component", () => {
  const attendanceGraph = {
    Monday: 8,
    Tuesday: 7.5,
    Wednesday: 9,
    Thursday: 8.5,
    Friday: 7,
    Saturday: 5,
    Sunday: 0,
  };

  it("renders the Progress title", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("renders the Work Time This Week subtitle", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    expect(screen.getByText("Work Time This Week")).toBeInTheDocument();
  });

  it("calculates and displays total working hours", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    expect(screen.getByText("45.0 hours")).toBeInTheDocument();
  });

  it("renders all seven day labels", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("renders seven day containers", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    expect(days).toHaveLength(7);
  });

  it("does not display tooltip initially", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    expect(screen.queryByText("8h")).not.toBeInTheDocument();

    expect(screen.queryByText("9h")).not.toBeInTheDocument();
  });

  it("displays tooltip when hovering over Monday", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const monday = screen.getByText("Mon");

    fireEvent.mouseEnter(monday.parentElement);

    expect(screen.getByText("8h")).toBeInTheDocument();
  });

  it("displays the correct tooltip for Wednesday", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const wednesday = screen.getByText("Wed");

    fireEvent.mouseEnter(wednesday.parentElement);

    expect(screen.getByText("9h")).toBeInTheDocument();
  });

  it("removes tooltip when mouse leaves Monday", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const monday = screen.getByText("Mon");
    const container = monday.parentElement;

    fireEvent.mouseEnter(container);

    expect(screen.getByText("8h")).toBeInTheDocument();

    fireEvent.mouseLeave(container);

    expect(screen.queryByText("8h")).not.toBeInTheDocument();
  });

  it("displays correct tooltip for Saturday", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const saturday = screen.getByText("Sat");

    fireEvent.mouseEnter(saturday.parentElement);

    expect(screen.getByText("5h")).toBeInTheDocument();
  });

  it("handles zero hours on Sunday", () => {
    render(<ProgressCard attendanceGraph={attendanceGraph} />);

    const sunday = screen.getByText("Sun");

    fireEvent.mouseEnter(sunday.parentElement);

    expect(screen.getByText("0h")).toBeInTheDocument();
  });
});

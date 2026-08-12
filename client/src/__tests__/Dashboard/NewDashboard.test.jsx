import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
   ========================================================= */

vi.mock("react-multi-date-picker", () => ({
  Calendar: ({ calendar, locale }) => (
    <div
      data-testid="hijri-calendar"
      data-calendar={calendar ? "arabic" : ""}
      data-locale={locale ? "arabic_ar" : ""}
    >
      Hijri Calendar
    </div>
  ),
}));

vi.mock("react-date-object/calendars/arabic", () => ({
  default: {},
}));

vi.mock("react-date-object/locales/arabic_ar", () => ({
  default: {},
}));

vi.mock("react-date-object", () => ({
  default: class DateObject {
    constructor() {
      this.month = {
        name: "Muharram",
      };
      this.year = 1448;
    }
  },
}));

vi.mock("../../Components/HalfDoughnutChart", () => ({
  default: ({ active, onLeave }) => (
    <div data-testid="half-doughnut-chart">
      <span data-testid="active-value">{active}</span>
      <span data-testid="leave-value">{onLeave}</span>
    </div>
  ),
}));

/*
 * Mock styles so the test focuses on component behavior
 * instead of styled-components implementation.
 */
vi.mock("../../Pages/employeDashboard/NewDashboard.Styles", () => {
  const React = require("react");

  const createComponent = (tag = "div") =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ...props, ref }, children),
    );

  return {
    Container: createComponent(),
    LeftIcon: createComponent(),
    CardGrid: createComponent(),
    VerticalBar: createComponent(),
    CardContent: createComponent(),
    Card: createComponent(),
    Flex: createComponent(),
    CardHeader: createComponent(),
    CardList: createComponent("ul"),
    DepartmentGrid: createComponent(),
    DepartmentCard: createComponent(),
    PresenceContainer: createComponent(),
    ChartContainer: createComponent(),
    ContractList: createComponent(),
    ContractItem: createComponent(),
    Avatar: createComponent(),
    Label: createComponent("span"),
    Heading: createComponent("h2"),
    SubText: createComponent(),
    Icon: createComponent(),
    MainContent: createComponent(),
    LeftContent: createComponent(),
    RightPanel: createComponent(),
    VisaCard: createComponent(),
    CalendarCard: createComponent(),
    HolidayCard: createComponent(),
    HolidayItem: createComponent(),
    StyledCalendar: createComponent(),
    CalendarWrapper: createComponent(),
  };
});

import Dashboard from "../../Pages/dashboard/NewDashboard";

/* =========================================================
   TESTS
   ========================================================= */

describe("Dashboard", () => {
  it("renders dashboard", () => {
    render(<Dashboard />);

    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("handles hover", () => {
    render(<Dashboard />);

    const arrows = document.querySelectorAll("svg");

    expect(arrows.length).toBeGreaterThan(0);

    fireEvent.mouseEnter(arrows[0]);
    fireEvent.mouseLeave(arrows[0]);
  });

  it("renders the dashboard successfully", () => {
    render(<Dashboard />);

    expect(screen.getAllByText("Total Employees")).toHaveLength(2);

    expect(screen.getByText("Visa Employees")).toBeInTheDocument();

    expect(screen.getByText("Department")).toBeInTheDocument();

    expect(screen.getByText("Employee Contract Expiry")).toBeInTheDocument();

    expect(screen.getByText("Upcoming Holidays")).toBeInTheDocument();
  });

  it("renders employee count cards", () => {
    render(<Dashboard />);

    expect(screen.getAllByText("12")).toHaveLength(3);

    expect(
      screen.getAllByText("Desirae Westervelt - 1254125 - Department"),
    ).toHaveLength(9);
  });

  it("renders employee names and contract information", () => {
    render(<Dashboard />);

    const names = screen.getAllByText("Desirae Westervelt");

    expect(names).toHaveLength(3);

    expect(screen.getAllByText("1254125")).toHaveLength(3);

    expect(screen.getAllByText("Ajaykumar@gmail.com")).toHaveLength(3);
  });

  it("renders all departments", () => {
    render(<Dashboard />);

    expect(screen.getByText("Developers")).toBeInTheDocument();

    expect(screen.getByText("Graphic Designer")).toBeInTheDocument();

    expect(screen.getByText("UI/UX Designer")).toBeInTheDocument();

    expect(screen.getByText("Ajay Raj")).toBeInTheDocument();

    expect(screen.getByText("Dummy")).toBeInTheDocument();

    expect(screen.getByText("Duummeee")).toBeInTheDocument();
  });

  it("renders department first letters", () => {
    render(<Dashboard />);

    expect(screen.getByText("D")).toBeInTheDocument();

    expect(screen.getByText("G")).toBeInTheDocument();

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("renders department head labels", () => {
    render(<Dashboard />);

    expect(screen.getAllByText("Department Head")).toHaveLength(3);
  });

  it("renders employee contract expiry section", () => {
    render(<Dashboard />);

    expect(screen.getByText("Employee Contract Expiry")).toBeInTheDocument();

    expect(screen.getAllByText("Desirae Westervelt")).toHaveLength(3);

    expect(screen.getAllByText("1254125")).toHaveLength(3);

    expect(screen.getAllByText("Ajaykumar@gmail.com")).toHaveLength(3);
  });

  it("renders the HalfDoughnutChart with correct values", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("half-doughnut-chart")).toBeInTheDocument();

    expect(screen.getByTestId("active-value")).toHaveTextContent("180");

    expect(screen.getByTestId("leave-value")).toHaveTextContent("71");
  });

  it("renders active employees and leave legend", () => {
    render(<Dashboard />);

    expect(screen.getByText("■ Active Employees")).toBeInTheDocument();

    expect(screen.getByText("■ On Leave Today")).toBeInTheDocument();
  });

  it("renders the Hijri calendar", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("hijri-calendar")).toBeInTheDocument();
  });

  it("renders upcoming holidays", () => {
    render(<Dashboard />);

    expect(screen.getByText("Upcoming Holidays")).toBeInTheDocument();

    expect(screen.getAllByText("Dummy Holiday")).toHaveLength(3);

    expect(screen.getAllByText("Dummy holiday")).toHaveLength(3);

    expect(screen.getAllByText("24 October")).toHaveLength(3);
  });

  it("handles the first arrow hover state", () => {
    render(<Dashboard />);

    const arrows = document.querySelectorAll("svg");

    expect(arrows.length).toBeGreaterThan(0);

    const hoverArrow = Array.from(arrows).find(
      (arrow) =>
        arrow.style.transform === "scale(1)" &&
        (arrow.style.color === "blue" || arrow.style.color === "rgb(0, 0, 255)"),
    );

    expect(hoverArrow).toBeInTheDocument();

    fireEvent.mouseEnter(hoverArrow);

    expect(hoverArrow).toHaveStyle({
      color: "rgb(0, 0, 139)",
      transform: "scale(1.2)",
    });

    fireEvent.mouseLeave(hoverArrow);

    expect(hoverArrow).toHaveStyle({
      color: "rgb(0, 0, 255)",
      transform: "scale(1)",
    });
  });

  it("handles employee contract arrow hover state", () => {
    render(<Dashboard />);

    const heading = screen.getByText("Employee Contract Expiry");

    const contractContainer = heading.parentElement;

    expect(contractContainer).toBeInTheDocument();

    const arrow = contractContainer.querySelector("svg");

    expect(arrow).toBeInTheDocument();

    fireEvent.mouseEnter(arrow);

    expect(arrow).toHaveStyle({
      color: "rgb(26, 42, 122)",
      transform: "scale(1.2)",
    });

    fireEvent.mouseLeave(arrow);

    expect(arrow).toHaveStyle({
      color: "rgb(51, 82, 186)",
      transform: "scale(1)",
    });
  });

  it("handles upcoming holidays arrow hover state", () => {
    render(<Dashboard />);

    const heading = screen.getByText("Upcoming Holidays");

    const holidayHeader = heading.parentElement;

    expect(holidayHeader).toBeInTheDocument();

    const arrow = holidayHeader.querySelector("svg");

    expect(arrow).toBeInTheDocument();

    fireEvent.mouseEnter(arrow);

    expect(arrow).toHaveStyle({
      color: "rgb(26, 42, 122)",
      transform: "scale(1.2)",
    });

    fireEvent.mouseLeave(arrow);

    expect(arrow).toHaveStyle({
      color: "rgb(0, 0, 255)",
      transform: "scale(1)",
    });
  });

  it("renders all holiday dates", () => {
    render(<Dashboard />);

    const dates = screen.getAllByText("24 October");

    expect(dates).toHaveLength(3);

    dates.forEach((date) => {
      expect(date).toBeInTheDocument();
    });
  });

  it("renders user icons in employee contract cards", () => {
    render(<Dashboard />);

    const contractHeading = screen.getByText("Employee Contract Expiry");

    const contractList = contractHeading.parentElement?.parentElement;

    expect(contractList).toBeInTheDocument();

    expect(contractList.querySelectorAll("svg").length).toBeGreaterThanOrEqual(
      3,
    );
  });

  it("renders all top-level dashboard sections", () => {
    render(<Dashboard />);

    expect(screen.getAllByText("Total Employees")).toHaveLength(2);

    expect(screen.getByText("Department")).toBeInTheDocument();

    expect(screen.getByText("Employee Contract Expiry")).toBeInTheDocument();

    expect(screen.getByText("Visa Employees")).toBeInTheDocument();

    expect(screen.getByText("Upcoming Holidays")).toBeInTheDocument();

    expect(screen.getByTestId("hijri-calendar")).toBeInTheDocument();

    expect(screen.getByTestId("half-doughnut-chart")).toBeInTheDocument();
  });
});
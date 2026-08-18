import React from "react";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import Header from "../../Components/HolidayHeading";

// Mock EmployeeTitle so we can verify the props passed to it
vi.mock("../../Components/EmployeeTitle", () => ({
  default: ({
    iconSrc,
    title,
    subtitle,
    showDropdown,
    showBackArrow,
    showTabs,
    showAddButton,
    showSearch,
    showReportButton,
    onReportClick,
  }) => (
    <div data-testid="employee-title">
      <img
        src={iconSrc}
        alt="holiday-icon"
      />

      <span data-testid="title">
        {title}
      </span>

      <span data-testid="subtitle">
        {subtitle}
      </span>

      <span data-testid="show-dropdown">
        {String(showDropdown)}
      </span>

      <span data-testid="show-back-arrow">
        {String(showBackArrow)}
      </span>

      <span data-testid="show-tabs">
        {String(showTabs)}
      </span>

      <span data-testid="show-add-button">
        {String(showAddButton)}
      </span>

      <span data-testid="show-search">
        {String(showSearch)}
      </span>

      <span data-testid="show-report-button">
        {String(showReportButton)}
      </span>

      <button
        data-testid="report-button"
        onClick={onReportClick}
      >
        Report
      </button>
    </div>
  ),
}));

describe("Holiday Header", () => {
  it("renders the EmployeeTitle component", () => {
    render(<Header />);

    expect(
      screen.getByTestId("employee-title")
    ).toBeInTheDocument();
  });

  it("renders Holiday title", () => {
    render(<Header />);

    expect(
      screen.getByTestId("title")
    ).toHaveTextContent("Holiday");
  });

  it("renders correct subtitle", () => {
    render(<Header />);

    expect(
      screen.getByTestId("subtitle")
    ).toHaveTextContent(
      "Unifying Teams Simplifying Operations"
    );
  });

  it("passes Holiday icon to EmployeeTitle", () => {
    render(<Header />);

    const icon = screen.getByAltText("holiday-icon");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src");
  });

  it("passes showDropdown as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-dropdown")
    ).toHaveTextContent("false");
  });

  it("passes showBackArrow as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-back-arrow")
    ).toHaveTextContent("false");
  });

  it("passes showTabs as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-tabs")
    ).toHaveTextContent("false");
  });

  it("passes showAddButton as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-add-button")
    ).toHaveTextContent("false");
  });

  it("passes showSearch as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-search")
    ).toHaveTextContent("false");
  });

  it("passes showReportButton as false", () => {
    render(<Header />);

    expect(
      screen.getByTestId("show-report-button")
    ).toHaveTextContent("false");
  });

  it("forwards onReportClick callback to EmployeeTitle", () => {
    const onReportClick = vi.fn();

    render(
      <Header
        onReportClick={onReportClick}
      />
    );

    fireEvent.click(
      screen.getByTestId("report-button")
    );

    expect(onReportClick).toHaveBeenCalledTimes(1);
  });

  it("renders correctly when onReportClick is not provided", () => {
    expect(() => {
      render(<Header />);
    }).not.toThrow();

    expect(
      screen.getByTestId("employee-title")
    ).toBeInTheDocument();
  });
});
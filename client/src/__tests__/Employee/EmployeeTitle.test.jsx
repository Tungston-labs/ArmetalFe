import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmployeeTitle from "../../Components/EmployeeTitle";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EmployeeTitle Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <EmployeeTitle {...props} />
      </MemoryRouter>
    );

  it("renders title and subtitle", () => {
    renderComponent();

    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your employees")
    ).toBeInTheDocument();
  });

  it("renders add employee button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: /add employee/i })
    ).toBeInTheDocument();
  });

  it("calls onAddClick when Add Employee button is clicked", () => {
    const onAddClick = vi.fn();

    renderComponent({ onAddClick });

    fireEvent.click(
      screen.getByRole("button", { name: /add employee/i })
    );

    expect(onAddClick).toHaveBeenCalledTimes(1);
  });

  it("navigates to basic-details if onAddClick is not provided", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", { name: /add employee/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/basic-details");
  });

  it("renders search input", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("Search Here...")
    ).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search input", () => {
    const onSearchChange = vi.fn();

    renderComponent({ onSearchChange });

    fireEvent.change(
      screen.getByPlaceholderText("Search Here..."),
      {
        target: {
          value: "John",
        },
      }
    );

    expect(onSearchChange).toHaveBeenCalledWith("John");
  });

  it("renders dropdown placeholder", () => {
    renderComponent({
      dropdownOptions: [],
    });

    expect(screen.getByDisplayValue("All")).toBeInTheDocument();
  });

 it("renders dropdown options that are plain strings or numbers", () => {
  renderComponent({
    dropdownOptions: ["HR", 2],
  });

  expect(screen.getByText("HR")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
});

  it("calls onDropdownChange", () => {
    const onDropdownChange = vi.fn();

    renderComponent({
      dropdownOptions: [
        {
          id: 1,
          name: "HR",
        },
      ],
      onDropdownChange,
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "1",
      },
    });

    expect(onDropdownChange).toHaveBeenCalledWith("1");
  });

  it("shows loading option when dropdownLoading is true", () => {
    renderComponent({
      dropdownLoading: true,
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows no options available message", () => {
    renderComponent({
      dropdownOptions: [],
    });

    expect(
      screen.getByText("No options available")
    ).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    renderComponent();

    expect(screen.getByText("Total Employee")).toBeInTheDocument();
    expect(
      screen.getByText("Employee Leave Request")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Employee Attendance")
    ).toBeInTheDocument();
  });

  it("renders custom tabs", () => {
    renderComponent({
      tabs: [
        {
          path: "/one",
          label: "Tab One",
        },
        {
          path: "/two",
          label: "Tab Two",
        },
      ],
    });

    expect(screen.getByText("Tab One")).toBeInTheDocument();
    expect(screen.getByText("Tab Two")).toBeInTheDocument();
  });

  it("calls onReportClick when Export Excel button is clicked", () => {
    const onReportClick = vi.fn();

    renderComponent({
      onReportClick,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /export excel/i,
      })
    );

    expect(onReportClick).toHaveBeenCalledWith("excel");
  });

  it("hides add button when showAddButton is false", () => {
    renderComponent({
      showAddButton: false,
    });

    expect(
      screen.queryByRole("button", {
        name: /add employee/i,
      })
    ).not.toBeInTheDocument();
  });

  it("hides report button when showReportButton is false", () => {
    renderComponent({
      showReportButton: false,
    });

    expect(
      screen.queryByRole("button", {
        name: /export excel/i,
      })
    ).not.toBeInTheDocument();
  });

  it("hides search section", () => {
    renderComponent({
      showSearch: false,
    });

    expect(
      screen.queryByPlaceholderText("Search Here...")
    ).not.toBeInTheDocument();
  });

  it("hides dropdown", () => {
    renderComponent({
      showDropdown: false,
    });

    expect(
      screen.queryByRole("combobox")
    ).not.toBeInTheDocument();
  });

  it("hides tabs", () => {
    renderComponent({
      showTabs: false,
    });

    expect(
      screen.queryByText("Total Employee")
    ).not.toBeInTheDocument();
  });

 it("navigates back when back arrow is clicked", () => {
  renderComponent();

  fireEvent.click(screen.getByTestId("back-arrow"));

  expect(mockNavigate).toHaveBeenCalledWith(-1);
});

  it("renders custom title", () => {
    renderComponent({
      title: "Department",
      subtitle: "Manage departments",
    });

    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(
      screen.getByText("Manage departments")
    ).toBeInTheDocument();
  });

  it("renders custom button text", () => {
    renderComponent({
      buttonText: "Create Employee",
    });

    expect(
      screen.getByRole("button", {
        name: /create employee/i,
      })
    ).toBeInTheDocument();
  });

  it("renders rightElement instead of add button", () => {
    renderComponent({
      rightElement: <button>Custom Button</button>,
    });

    expect(
      screen.getByRole("button", {
        name: /custom button/i,
      })
    ).toBeInTheDocument();
  });
});
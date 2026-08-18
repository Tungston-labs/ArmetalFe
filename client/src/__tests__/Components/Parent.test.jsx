import React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import DemoPage from "../../Pages/employeDashboard/Parent";

// Mock RightSideModal
vi.mock("../../Pages/employeDashboard/RightSideModal.jsx", () => ({
  default: ({ isOpen, onClose, onEdit, employee }) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div data-testid="right-side-modal">
        <h2>Employee Modal</h2>

        <p>{employee.name}</p>
        <p>{employee.position}</p>
        <p>{employee.email}</p>
        <p>{employee.employeeId}</p>
        <p>{employee.department}</p>

        <button onClick={onEdit}>Edit</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  },
}));

describe("DemoPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Open Employee Modal button", () => {
    render(<DemoPage />);

    expect(
      screen.getByRole("button", {
        name: /open employee modal/i,
      })
    ).toBeInTheDocument();
  });

  it("does not display the employee modal initially", () => {
    render(<DemoPage />);

    expect(
      screen.queryByTestId("right-side-modal")
    ).not.toBeInTheDocument();
  });

  it("opens the employee modal when the button is clicked", () => {
    render(<DemoPage />);

    const openButton = screen.getByRole("button", {
      name: /open employee modal/i,
    });

    fireEvent.click(openButton);

    expect(
      screen.getByTestId("right-side-modal")
    ).toBeInTheDocument();
  });

  it("displays employee information when modal is opened", () => {
    render(<DemoPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /open employee modal/i,
      })
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText("Software Engineer")
    ).toBeInTheDocument();
    expect(
      screen.getByText("john@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText("EMP12345")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Development")
    ).toBeInTheDocument();
  });

  it("closes the employee modal when close is clicked", () => {
    render(<DemoPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /open employee modal/i,
      })
    );

    expect(
      screen.getByTestId("right-side-modal")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /^close$/i,
      })
    );

    expect(
      screen.queryByTestId("right-side-modal")
    ).not.toBeInTheDocument();
  });

  it("calls the edit handler when Edit is clicked", () => {
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(<DemoPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /open employee modal/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^edit$/i,
      })
    );

    expect(alertSpy).toHaveBeenCalledWith("Edit clicked");

    alertSpy.mockRestore();
  });
});
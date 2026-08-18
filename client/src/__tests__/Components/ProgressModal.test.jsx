import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProgressModal from "../../Components/ProgressModal";

describe("ProgressModal Component", () => {
  // ---------------------------------------------------------
  // 1. Does not render when isOpen is false
  // ---------------------------------------------------------
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ProgressModal isOpen={false} status="on_hold" />,
    );

    expect(container.firstChild).toBeNull();
  });

  // ---------------------------------------------------------
  // 2. Does not render when status is missing
  // ---------------------------------------------------------
  it("does not render when status is missing", () => {
    const { container } = render(<ProgressModal isOpen={true} />);

    expect(container.firstChild).toBeNull();
  });

  // ---------------------------------------------------------
  // 3. Renders On-Hold status
  // ---------------------------------------------------------
  it("renders On-Hold status correctly", () => {
    render(<ProgressModal isOpen={true} status="on_hold" />);

    expect(screen.getByText("On-Hold")).toBeInTheDocument();

    expect(
      screen.getByText("Project is waiting for approval"),
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // 4. Renders Pending status
  // ---------------------------------------------------------
  it("renders Pending status correctly", () => {
    render(<ProgressModal isOpen={true} status="in_progress" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();

    expect(
      screen.getByText("Project is currently in progress"),
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // 5. Renders Completed status
  // ---------------------------------------------------------
  it("renders Completed status correctly", () => {
    render(<ProgressModal isOpen={true} status="completed" />);

    expect(screen.getByText("Completed")).toBeInTheDocument();

    expect(
      screen.getByText("Project has been successfully completed"),
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // 6. Falls back to On-Hold for unknown status
  // ---------------------------------------------------------
  it("falls back to On-Hold when an unknown status is provided", () => {
    render(<ProgressModal isOpen={true} status="unknown_status" />);

    expect(screen.getByText("On-Hold")).toBeInTheDocument();

    expect(
      screen.getByText("Project is waiting for approval"),
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // 7. Applies correct styles for On-Hold status
  // ---------------------------------------------------------
  it("applies the correct styles for On-Hold status", () => {
    render(<ProgressModal isOpen={true} status="on_hold" />);

    const title = screen.getByText("On-Hold");
    const box = title.parentElement;

    expect(box).toHaveStyle({
      borderLeft: "4px solid #f4c542",
      background: "rgba(244, 197, 66, 0.15)",
    });
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Pagination from "../../Components/Pagination/Pagination";

// Mock styled-components styles.
// This keeps the test focused on Pagination.jsx.
vi.mock("../../Components/Pagination/Pagination.styles.js", () => ({
  PaginationWrapper: ({ children }) => (
    <div data-testid="pagination-wrapper">{children}</div>
  ),
  PageButton: ({ children, disabled, onClick, $active }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      data-active={$active ? "true" : "false"}
    >
      {children}
    </button>
  ),
  Ellipsis: ({ children }) => <span data-testid="ellipsis">{children}</span>,
}));

describe("Pagination", () => {
  // =========================================================
  // totalPages <= 1
  // =========================================================

  it("should return null when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should return null when totalPages is less than 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />,
    );

    expect(container.firstChild).toBeNull();
  });

  // =========================================================
  // totalPages <= 5
  // =========================================================

  it("should display all pages when totalPages is 5", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.queryByTestId("ellipsis")).not.toBeInTheDocument();
  });

  it("should display all pages when totalPages is less than 5", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // =========================================================
  // totalPages > 5 - first pages
  // =========================================================

  it("should display pagination without leading ellipsis when currentPage is 1", () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // There should be an ellipsis after the nearby pages.
    expect(screen.getByTestId("ellipsis")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  // =========================================================
  // currentPage > 3
  // =========================================================

  it("should display leading ellipsis when currentPage is greater than 3", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />,
    );

    const ellipsis = screen.getAllByTestId("ellipsis");

    expect(ellipsis.length).toBe(2);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  // =========================================================
  // currentPage near the end
  // =========================================================

  it("should not display trailing ellipsis when currentPage is near the last page", () => {
    render(
      <Pagination currentPage={9} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getAllByTestId("ellipsis").length).toBe(1);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  // =========================================================
  // currentPage = totalPages
  // =========================================================

  it("should display correct pages on the last page", () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getAllByTestId("ellipsis").length).toBe(1);
  });

  // =========================================================
  // Active page
  // =========================================================

  it("should mark the current page as active", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    );

    const buttons = screen.getAllByRole("button");

    const activeButton = buttons.find(
      (button) => button.getAttribute("data-active") === "true",
    );

    expect(activeButton).toHaveTextContent("3");
  });

  // =========================================================
  // Previous button
  // =========================================================

  it("should disable previous button on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toBeDisabled();
  });

  it("should call onPageChange with previous page", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // =========================================================
  // Next button
  // =========================================================

  it("should disable next button on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it("should call onPageChange with next page", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[buttons.length - 1]);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  // =========================================================
  // Page button click
  // =========================================================

  it("should call onPageChange when a page number is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    );

    fireEvent.click(screen.getByText("3"));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  // =========================================================
  // More than 5 pages - middle page
  // =========================================================

  it("should show pages around the current page for large pagination", () => {
    render(
      <Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();

    expect(screen.getAllByTestId("ellipsis").length).toBe(2);
  });

  // =========================================================
  // currentPage = 3
  // =========================================================

  it("should handle currentPage equal to 3", () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.queryByTestId("ellipsis")).toBeInTheDocument();
  });
});

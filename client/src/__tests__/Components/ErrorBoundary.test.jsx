import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorBoundary from "../../Components/ErrorBoundary";

// Mock ErrorSomething so we can easily verify that
// the error fallback is rendered.
vi.mock("../../Pages/error/ErrorSomething", () => ({
  default: () => <div data-testid="error-something">Something went wrong</div>,
}));

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-content">Child content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.queryByTestId("error-something")).not.toBeInTheDocument();
  });

  it("should render ErrorSomething when a child throws an error", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("error-something")).toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("should update state using getDerivedStateFromError", () => {
    const result = ErrorBoundary.getDerivedStateFromError(
      new Error("Test error"),
    );

    expect(result).toEqual({
      hasError: true,
    });
  });
});

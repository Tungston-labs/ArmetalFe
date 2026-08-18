import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { render, screen, cleanup } from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCK ERROR SVG
========================================================= */

vi.mock("../../assets/error.svg", () => ({
  default: "mock-error.svg",
}));

/* =========================================================
   IMPORT COMPONENT
========================================================= */

import ErrorSomething from "../../Pages/error/ErrorSomething";

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("ErrorSomething Component", () => {
  /* =======================================================
     1. RENDER COMPONENT
  ======================================================= */

  it("renders the ErrorSomething component", () => {
    render(<ErrorSomething />);

    expect(
      screen.getByRole("heading", {
        name: "Oops! Something went wrong",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     2. RENDERS ERROR ICON
  ======================================================= */

  it("renders the error icon", () => {
    render(<ErrorSomething />);

    const icon = screen.getByRole("img", {
      name: "Error",
    });

    expect(icon).toBeInTheDocument();

    expect(icon).toHaveAttribute("alt", "Error");

    expect(icon).toHaveAttribute("src", "mock-error.svg");
  });

  /* =======================================================
     3. RENDERS ERROR TITLE
  ======================================================= */

  it("renders the error title", () => {
    render(<ErrorSomething />);

    expect(
      screen.getByRole("heading", {
        name: "Oops! Something went wrong",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     4. RENDERS ERROR SUBTITLE
  ======================================================= */

  it("renders the error subtitle", () => {
    render(<ErrorSomething />);

    expect(
      screen.getByText(
        "We couldn’t process your request right now. Please try again later.",
      ),
    ).toBeInTheDocument();
  });

  /* =======================================================
     5. CHECK TITLE CONTENT
  ======================================================= */

  it("renders the correct title text", () => {
    render(<ErrorSomething />);

    const title = screen.getByRole("heading", {
      name: "Oops! Something went wrong",
    });

    expect(title).toHaveTextContent("Oops! Something went wrong");
  });

  /* =======================================================
     6. CHECK SUBTITLE CONTENT
  ======================================================= */

  it("renders the correct subtitle text", () => {
    render(<ErrorSomething />);

    const subtitle = screen.getByText(
      "We couldn’t process your request right now. Please try again later.",
    );

    expect(subtitle).toHaveTextContent(
      "We couldn’t process your request right now. Please try again later.",
    );
  });

  /* =======================================================
     7. CHECK ALL CONTENT IS RENDERED
  ======================================================= */

  it("renders all error content", () => {
    render(<ErrorSomething />);

    expect(
      screen.getByRole("img", {
        name: "Error",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Oops! Something went wrong",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "We couldn’t process your request right now. Please try again later.",
      ),
    ).toBeInTheDocument();
  });

  /* =======================================================
     8. ACCEPTS onRetry PROP
  ======================================================= */

  it("renders correctly when onRetry is provided", () => {
    const onRetry = vi.fn();

    render(<ErrorSomething onRetry={onRetry} />);

    expect(
      screen.getByRole("heading", {
        name: "Oops! Something went wrong",
      }),
    ).toBeInTheDocument();

    expect(onRetry).not.toHaveBeenCalled();
  });

  /* =======================================================
     9. NO RETRY BUTTON
  ======================================================= */

  it("does not render a retry button", () => {
    const onRetry = vi.fn();

    render(<ErrorSomething onRetry={onRetry} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

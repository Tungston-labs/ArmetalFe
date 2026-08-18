import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import RequireAuth from "../../Components/RequireAuth";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: mocks.useSelector,
}));

vi.mock("react-router-dom", () => ({
  Navigate: ({ to, replace }) => (
    <div data-testid="navigate">
      Navigate to: {to} - replace: {String(replace)}
    </div>
  ),

  Outlet: () => <div data-testid="outlet">Protected Content</div>,
}));

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  localStorage.clear();
  sessionStorage.clear();

  // Default: no Redux token
  mocks.useSelector.mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

/* =========================================================
   TESTS
========================================================= */

describe("RequireAuth Component", () => {
  it("renders protected content when Redux has an access token", () => {
    mocks.useSelector.mockReturnValue("redux-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("renders protected content when localStorage has an access token", () => {
    localStorage.setItem("accessToken", "local-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("renders protected content when sessionStorage has an access token", () => {
    sessionStorage.setItem("accessToken", "session-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("redirects to login when no access token exists", () => {
    render(<RequireAuth />);

    expect(screen.getByTestId("navigate")).toBeInTheDocument();

    expect(screen.getByText("Navigate to: /login - replace: true"))
      .toBeInTheDocument();

    expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
  });

  it("prefers Redux token when both Redux and localStorage tokens exist", () => {
    mocks.useSelector.mockReturnValue("redux-token");

    localStorage.setItem("accessToken", "local-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("authenticates when Redux token is an empty value but localStorage has a token", () => {
    mocks.useSelector.mockReturnValue(null);

    localStorage.setItem("accessToken", "local-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("uses sessionStorage when Redux and localStorage have no token", () => {
    mocks.useSelector.mockReturnValue(null);

    sessionStorage.setItem("accessToken", "session-token");

    render(<RequireAuth />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
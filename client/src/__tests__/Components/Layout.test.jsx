import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ============================================================
// MOCK SIDEBAR
// ============================================================

vi.mock("../../Components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

// ============================================================
// MOCK LAYOUT STYLES
// ============================================================

vi.mock("../../Components/Layout.styles", () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,

  ContentArea: ({ children }) => (
    <div data-testid="content-area">{children}</div>
  ),
}));

// ============================================================
// MOCK REACT ROUTER OUTLET
// ============================================================

vi.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

// ============================================================
// COMPONENT IMPORT
// ============================================================

import LayOut from "../../Components/Layout";

// ============================================================
// TESTS
// ============================================================

describe("LayOut Component", () => {
  it("renders the layout container", () => {
    render(<LayOut />);

    expect(screen.getByTestId("container")).toBeInTheDocument();
  });

  it("renders the Sidebar", () => {
    render(<LayOut />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders the ContentArea", () => {
    render(<LayOut />);

    expect(screen.getByTestId("content-area")).toBeInTheDocument();
  });

  it("renders the Outlet", () => {
    render(<LayOut />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("renders Sidebar inside Container", () => {
    render(<LayOut />);

    const container = screen.getByTestId("container");
    const sidebar = screen.getByTestId("sidebar");

    expect(container).toContainElement(sidebar);
  });

  it("renders ContentArea inside Container", () => {
    render(<LayOut />);

    const container = screen.getByTestId("container");
    const contentArea = screen.getByTestId("content-area");

    expect(container).toContainElement(contentArea);
  });

  it("renders Outlet inside ContentArea", () => {
    render(<LayOut />);

    const contentArea = screen.getByTestId("content-area");
    const outlet = screen.getByTestId("outlet");

    expect(contentArea).toContainElement(outlet);
  });
});

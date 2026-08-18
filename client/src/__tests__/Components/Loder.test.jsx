import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import SyncLoader from "../../Components/Loder";

describe("SyncLoader", () => {
  it("renders the loader component", () => {
    const { container } = render(<SyncLoader />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders exactly four loader dots", () => {
    const { container } = render(<SyncLoader />);

    const loaderWrapper = container.firstChild;

    expect(loaderWrapper.children).toHaveLength(4);
  });

  it("renders all four dots as div elements", () => {
    const { container } = render(<SyncLoader />);

    const dots = container.firstChild.children;

    expect(dots[0].tagName).toBe("DIV");
    expect(dots[1].tagName).toBe("DIV");
    expect(dots[2].tagName).toBe("DIV");
    expect(dots[3].tagName).toBe("DIV");
  });

  it("renders the loader wrapper with the expected styles", () => {
    const { container } = render(<SyncLoader />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveStyle({
      display: "flex",
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100vh",
      "justify-content": "center",
      "align-items": "center",
      "z-index": "9999",
    });
  });

  it("renders each dot with the expected styles", () => {
    const { container } = render(<SyncLoader />);

    const dots = Array.from(container.firstChild.children);

    dots.forEach((dot) => {
      expect(dot).toHaveStyle({
        width: "12px",
        height: "12px",
        margin: "0px 6px",
        "background-color": "rgb(85, 85, 85)",
        "border-radius": "50%",
        display: "inline-block",
      });
    });
  });

  it("renders loader with no text content", () => {
    const { container } = render(<SyncLoader />);

    expect(container.textContent).toBe("");
  });

  it("renders without throwing an error", () => {
    expect(() => render(<SyncLoader />)).not.toThrow();
  });
});

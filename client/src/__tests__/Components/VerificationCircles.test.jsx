import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import VerificationCircles from "../../Components/VerificationCircle";

describe("VerificationCircles Component", () => {
  const emp = {
    id: 101,
    name: "John Doe",
  };

  let handleCircleClick;

  beforeEach(() => {
    handleCircleClick = vi.fn();
  });

  it("renders two verification circles", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{}}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");
    
    // The component contains the container and two Circle elements.
    expect(circles.length).toBeGreaterThanOrEqual(3);
  });

  it("renders both circles without check icons when employee is not verified", () => {
    render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{}}
        handleCircleClick={handleCircleClick}
      />,
    );

    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("renders the first check icon when first verification is complete", () => {
    render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: true,
            second: false,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const svgIcons = document.querySelectorAll("svg");

    expect(svgIcons).toHaveLength(1);
  });

  it("renders the second check icon when second verification is complete", () => {
    render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: false,
            second: true,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const svgIcons = document.querySelectorAll("svg");

    expect(svgIcons).toHaveLength(1);
  });

  it("renders two check icons when both verifications are complete", () => {
    render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: true,
            second: true,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const svgIcons = document.querySelectorAll("svg");

    expect(svgIcons).toHaveLength(2);
  });

  it("calls handleCircleClick with first when first circle is clicked", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: false,
            second: false,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");

    // First Circle is the second div because the first div is CircleContainer.
    fireEvent.click(circles[1]);

    expect(handleCircleClick).toHaveBeenCalledTimes(1);

    expect(handleCircleClick).toHaveBeenCalledWith(
      expect.any(Object),
      emp,
      "first",
    );
  });

  it("calls handleCircleClick with second when second circle is clicked", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: false,
            second: false,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");

    // Second Circle.
    fireEvent.click(circles[2]);

    expect(handleCircleClick).toHaveBeenCalledTimes(1);

    expect(handleCircleClick).toHaveBeenCalledWith(
      expect.any(Object),
      emp,
      "second",
    );
  });

  it("does not call handleCircleClick when first circle is already verified", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: true,
            second: false,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");

    fireEvent.click(circles[1]);

    expect(handleCircleClick).not.toHaveBeenCalled();
  });

  it("does not call handleCircleClick when second circle is already verified", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: false,
            second: true,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");

    fireEvent.click(circles[2]);

    expect(handleCircleClick).not.toHaveBeenCalled();
  });

  it("allows clicking the unverified circle when the other circle is verified", () => {
    const { container } = render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          101: {
            first: true,
            second: false,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const circles = container.querySelectorAll("div");

    fireEvent.click(circles[2]);

    expect(handleCircleClick).toHaveBeenCalledTimes(1);

    expect(handleCircleClick).toHaveBeenCalledWith(
      expect.any(Object),
      emp,
      "second",
    );
  });

  it("handles verificationStatus for a different employee", () => {
    render(
      <VerificationCircles
        emp={emp}
        verificationStatus={{
          999: {
            first: true,
            second: true,
          },
        }}
        handleCircleClick={handleCircleClick}
      />,
    );

    const svgIcons = document.querySelectorAll("svg");

    expect(svgIcons).toHaveLength(0);
  });
});
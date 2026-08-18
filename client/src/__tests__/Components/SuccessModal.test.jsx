import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   COMPONENT
========================================================= */

import SuccessModal from "../../Components/Succes";

/* =========================================================
   MOCKS
========================================================= */

const mocks = {
  onClose: vi.fn(),
  onAddAnother: vi.fn(),
  navigate: vi.fn(),
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe("SuccessModal Component", () => {
  /* -------------------------------------------------------
     1. Renders modal
  ------------------------------------------------------- */

  it("renders the success modal correctly", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    expect(
      screen.getByText("New employee added.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Success!")
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     2. Renders success image
  ------------------------------------------------------- */

  it("renders the success image", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    const image = screen.getByAltText("Success");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/images/succes.png"
    );
  });

  /* -------------------------------------------------------
     3. Renders Close button
  ------------------------------------------------------- */

  it("renders the Close button", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    expect(
      screen.getByRole("button", { name: "Close" })
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     4. Renders Add another button
  ------------------------------------------------------- */

  it("renders the Add another button", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    expect(
      screen.getByRole("button", { name: "Add another" })
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     5. Close button behavior
  ------------------------------------------------------- */

  it("calls onClose and navigates to employee page when Close is clicked", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    const closeButton = screen.getByRole("button", {
      name: "Close",
    });

    fireEvent.click(closeButton);

    expect(mocks.onClose).toHaveBeenCalledTimes(1);

    expect(mocks.navigate).toHaveBeenCalledTimes(1);

    expect(mocks.navigate).toHaveBeenCalledWith(
      "/employee"
    );
  });

  /* -------------------------------------------------------
     6. Add another behavior
  ------------------------------------------------------- */

  it("calls onAddAnother and navigates to employee page when Add another is clicked", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    const addAnotherButton = screen.getByRole("button", {
      name: "Add another",
    });

    fireEvent.click(addAnotherButton);

    expect(mocks.onAddAnother).toHaveBeenCalledTimes(1);

    expect(mocks.navigate).toHaveBeenCalledTimes(1);

    expect(mocks.navigate).toHaveBeenCalledWith(
      "/employee"
    );
  });

  /* -------------------------------------------------------
     7. Close does not call Add another
  ------------------------------------------------------- */

  it("does not call onAddAnother when Close is clicked", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close",
      })
    );

    expect(mocks.onClose).toHaveBeenCalledTimes(1);
    expect(mocks.onAddAnother).not.toHaveBeenCalled();
  });

  /* -------------------------------------------------------
     8. Add another does not call onClose
  ------------------------------------------------------- */

  it("does not call onClose when Add another is clicked", () => {
    render(
      <SuccessModal
        onClose={mocks.onClose}
        onAddAnother={mocks.onAddAnother}
        navigate={mocks.navigate}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add another",
      })
    );

    expect(mocks.onAddAnother).toHaveBeenCalledTimes(1);
    expect(mocks.onClose).not.toHaveBeenCalled();
  });
});
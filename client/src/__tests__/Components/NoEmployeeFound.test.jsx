import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import NoEmployeeFound from "../../Components/No found/Noemployeefound";

describe("NoEmployeeFound Component", () => {
  it("renders the no employee found title", () => {
    render(<NoEmployeeFound />);

    expect(screen.getByText("No Employee Found")).toBeInTheDocument();
  });

  it("renders default message when searchTerm is not provided", () => {
    render(<NoEmployeeFound />);

    expect(
      screen.getByText(
        "No employees match your current search or filter. Try adjusting your query."
      )
    ).toBeInTheDocument();
  });

  it("renders default message when searchTerm is empty", () => {
    render(<NoEmployeeFound searchTerm="" />);

    expect(
      screen.getByText(
        "No employees match your current search or filter. Try adjusting your query."
      )
    ).toBeInTheDocument();
  });

  it("renders search term message when searchTerm is provided", () => {
    render(<NoEmployeeFound searchTerm="John" />);

    expect(
      screen.getByText(/We couldn't find anyone matching/i)
    ).toBeInTheDocument();

    expect(screen.getByText('"John"')).toBeInTheDocument();

    expect(
      screen.getByText(/Try a different name or ID/i)
    ).toBeInTheDocument();
  });

  it("renders the search icon", () => {
    render(<NoEmployeeFound />);

    expect(screen.getByText("🔍")).toBeInTheDocument();
  });
});
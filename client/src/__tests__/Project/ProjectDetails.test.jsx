import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import DepartmentPage from "./FieldShift"; // adjust path/filename to match your project
import * as fieldShiftSlice from "../../Redux/fieldShiftSlice";

// ---- Mocks ----
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../Redux/fieldShiftSlice", () => ({
  getProjects: jest.fn(() => ({ type: "projects/getProjects" })),
}));

jest.mock("../../Components/Loader", () => () => <div>Loading...</div>);

jest.mock("../../Components/No found/Noemployeefound", () => (props) => (
  <div>{props.label}</div>
));

jest.mock("../../Components/AddProjectModal", () => (props) =>
  props.isOpen ? (
    <div data-testid="add-project-modal">
      <button onClick={() => props.onSave({ name: "New Project" })}>Save</button>
      <button onClick={props.onClose}>Close</button>
    </div>
  ) : null
);

// Mock EmployeeTitle to expose the search/add controls in a predictable way
jest.mock("../../Components/EmployeeTitle", () => (props) => (
  <div>
    <h1>{props.title}</h1>
    <input
      placeholder={props.searchPlaceholder}
      value={props.searchValue}
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
    <button onClick={props.onAddClick}>{props.buttonText}</button>
  </div>
));

const projects = [
  {
    id: 1,
    name: "Site Alpha",
    employees: [{ id: 1 }, { id: 2 }],
    punch_type: "GPS",
    status: "in_progress",
  },
  {
    id: 2,
    name: "Site Beta",
    employees: [],
    punch_type: "QR",
    status: "completed",
  },
  {
    id: 3,
    name: "Site Gamma",
    employees: [{ id: 3 }],
    status: "unknown_status",
  },
];

function renderWithProviders({ projects: projState = projects, isLoading = false } = {}) {
  const store = configureStore({
    reducer: {
      projects: (state = { projects: projState, isLoading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DepartmentPage />
      </MemoryRouter>
    </Provider>
  );
}

describe("DepartmentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches getProjects with empty search term on mount", () => {
    renderWithProviders();
    expect(fieldShiftSlice.getProjects).toHaveBeenCalledWith({ search: "" });
  });

  test("shows the loader while isLoading is true", () => {
    renderWithProviders({ isLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders a card for each project with employee count, punch type, and status", () => {
    renderWithProviders();

    expect(screen.getByText("Site Alpha")).toBeInTheDocument();
    expect(screen.getByText("Site Beta")).toBeInTheDocument();
    expect(screen.getByText("Site Gamma")).toBeInTheDocument();

    // Employee counts
    expect(screen.getByText("2")).toBeInTheDocument(); // Alpha
    expect(screen.getByText("0")).toBeInTheDocument(); // Beta
    expect(screen.getByText("1")).toBeInTheDocument(); // Gamma

    // Punch type fallback
    expect(screen.getByText("GPS")).toBeInTheDocument();
    expect(screen.getByText("QR")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument(); // Gamma has no punch_type

    // Status labels
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    // Unknown status falls back to raw value
    expect(screen.getByText("unknown_status")).toBeInTheDocument();
  });

  test("shows 'No Projects Found' when the project list is empty", () => {
    renderWithProviders({ projects: [] });
    expect(screen.getByText("No Projects Found")).toBeInTheDocument();
  });

  test("does not show empty-state message while still loading", () => {
    renderWithProviders({ projects: [], isLoading: true });
    expect(screen.queryByText("No Projects Found")).not.toBeInTheDocument();
  });

  test("clicking a project card navigates to its detail page with project name in state", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Site Alpha"));
    expect(mockNavigate).toHaveBeenCalledWith("/project-department/1", {
      state: { projectName: "Site Alpha" },
    });
  });

  test("typing in the search box updates search term and re-triggers getProjects", async () => {
    renderWithProviders();
    fieldShiftSlice.getProjects.mockClear();

    const input = screen.getByPlaceholderText("Search Project Name");
    fireEvent.change(input, { target: { value: "Alpha" } });

    await waitFor(() =>
      expect(fieldShiftSlice.getProjects).toHaveBeenCalledWith({ search: "Alpha" })
    );
  });

  test("clicking 'Add Project' opens the AddProjectModal", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add Project"));
    expect(screen.getByTestId("add-project-modal")).toBeInTheDocument();
  });

  test("saving from the AddProjectModal closes it and refetches projects", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add Project"));
    fieldShiftSlice.getProjects.mockClear();

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.queryByTestId("add-project-modal")).not.toBeInTheDocument()
    );
    expect(fieldShiftSlice.getProjects).toHaveBeenCalled();
  });

  test("closing the AddProjectModal without saving just closes it", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add Project"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("add-project-modal")).not.toBeInTheDocument();
  });

  test("handles missing projects/isLoading state gracefully (defaults applied)", () => {
    const store = configureStore({
      reducer: {
        projects: (state = undefined) => state ?? null,
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DepartmentPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("No Projects Found")).toBeInTheDocument();
  });
});
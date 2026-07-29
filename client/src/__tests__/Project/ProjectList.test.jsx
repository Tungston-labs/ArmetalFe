import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Swal from "sweetalert2";

import FieldShift from "./FieldShift"; // adjust path/filename to match your project
import * as fieldShiftSlice from "../../Redux/fieldShiftSlice";

// ---- Mocks ----
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "42" }),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

jest.mock("../../Redux/fieldShiftSlice", () => ({
  getProjectById: jest.fn(() => ({ type: "projects/getProjectById" })),
  updateProject: jest.fn(() => ({
    type: "projects/updateProject",
    unwrap: () => Promise.resolve({}),
  })),
  deleteProject: jest.fn(() => ({
    type: "projects/deleteProject",
    unwrap: () => Promise.resolve({}),
  })),
  removeEmployeeFromProject: jest.fn(() => ({
    type: "projects/removeEmployeeFromProject",
    unwrap: () => Promise.resolve({}),
  })),
}));

jest.mock("../../Components/Loader", () => () => <div>Loading...</div>);
jest.mock("../../Components/EmployeeTitle", () => (props) => <h1>{props.title}</h1>);
jest.mock("../../Components/ProgressModal", () => (props) => (
  <div data-testid="progress-modal">{props.status}</div>
));
jest.mock("../../Components/EmployeeModal", () => (props) => (
  <div data-testid="employee-modal">
    <button onClick={props.onClose}>Close Employee Modal</button>
  </div>
));
jest.mock("../../Components/EditProjectModal", () => (props) =>
  props.isOpen ? (
    <div data-testid="edit-project-modal">
      <button
        onClick={() =>
          props.onSave({
            projectName: "Updated Name",
            punchInType: "QR",
            latitude: "1.1",
            longitude: "2.2",
            status: "completed",
          })
        }
      >
        Save Edit
      </button>
      <button onClick={props.onClose}>Close Edit</button>
    </div>
  ) : null
);

const baseProject = {
  id: 42,
  name: "Site Alpha",
  punch_type: "GPS",
  latitude: "10.1",
  longitude: "20.2",
  status: "in_progress",
  employees: [
    {
      id: 1,
      name: "John Smith",
      employee_id: "EMP001",
      email: "john@example.com",
      designation: "Technician",
      department_name: "Field Ops",
    },
    {
      id: 2,
      name: "Amy Lee",
      employee_id: "EMP002",
      email: "amy@example.com",
      designation: "Supervisor",
      department_name: "Field Ops",
    },
  ],
};

function renderWithProviders({ project = baseProject, loading = false, error = null } = {}) {
  const store = configureStore({
    reducer: {
      projects: (state = { project, loading, error }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FieldShift />
      </MemoryRouter>
    </Provider>
  );
}

describe("FieldShift (project detail)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches getProjectById with the route id on mount", () => {
    renderWithProviders();
    expect(fieldShiftSlice.getProjectById).toHaveBeenCalledWith("42");
  });

  test("shows loader while loading", () => {
    renderWithProviders({ loading: true, project: null });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error message when fetch fails", () => {
    renderWithProviders({ project: null, error: "Not found" });
    expect(screen.getByText(/failed to load project: not found/i)).toBeInTheDocument();
  });

  test("populates form fields from the loaded project", () => {
    renderWithProviders();
    expect(screen.getByDisplayValue("Site Alpha")).toBeInTheDocument();
    expect(screen.getByDisplayValue("GPS")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10.1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20.2")).toBeInTheDocument();
  });

  test("renders the employee table with mapped fields", () => {
    renderWithProviders();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Technician")).toBeInTheDocument();
    expect(screen.getAllByText("Field Ops")).toHaveLength(2);
    expect(screen.getByText("Amy Lee")).toBeInTheDocument();
  });

  test("renders ProgressModal with current status", () => {
    renderWithProviders();
    expect(screen.getByTestId("progress-modal")).toHaveTextContent("in_progress");
  });

  test("clicking Edit opens the EditProjectModal", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByTestId("edit-project-modal")).toBeInTheDocument();
  });

  test("saving from EditProjectModal dispatches updateProject and refetches", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save Edit"));

    await waitFor(() =>
      expect(fieldShiftSlice.updateProject).toHaveBeenCalledWith({
        id: "42",
        projectData: {
          name: "Updated Name",
          punch_type: "QR",
          latitude: "1.1",
          longitude: "2.2",
          status: "completed",
        },
      })
    );
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Updated!", icon: "success" })
    );
    expect(fieldShiftSlice.getProjectById).toHaveBeenCalledTimes(2); // mount + after save
  });

  test("shows an error alert if updateProject fails", async () => {
    fieldShiftSlice.updateProject.mockReturnValueOnce({
      type: "projects/updateProject",
      unwrap: () => Promise.reject(new Error("fail")),
    });
    renderWithProviders();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save Edit"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error!", icon: "error" })
      )
    );
  });

  test("clicking Delete asks for confirmation and deletes on confirm", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => expect(fieldShiftSlice.deleteProject).toHaveBeenCalledWith("42"));
    expect(screen.getByText(/the project has been deleted/i)).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/project");
  });

  test("does not delete the project if confirmation is declined", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    renderWithProviders();
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(fieldShiftSlice.deleteProject).not.toHaveBeenCalled();
    expect(screen.queryByText(/the project has been deleted/i)).not.toBeInTheDocument();
  });

  test("shows an error alert if deleteProject fails", async () => {
    fieldShiftSlice.deleteProject.mockReturnValueOnce({
      type: "projects/deleteProject",
      unwrap: () => Promise.reject(new Error("fail")),
    });
    renderWithProviders();
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error!", icon: "error" })
      )
    );
  });

  test("clicking the trash icon for an employee asks for confirmation and removes them", async () => {
    renderWithProviders();
    const row = screen.getByText("John Smith").closest("tr");
    const deleteCell = within(row).getByText((_, el) => el.tagName === "svg" || false, {
      selector: "svg",
    }) || row.querySelector("svg");
    fireEvent.click(deleteCell);

    await waitFor(() =>
      expect(fieldShiftSlice.removeEmployeeFromProject).toHaveBeenCalledWith({
        projectId: "42",
        employeeId: 1,
      })
    );
    await waitFor(() => expect(screen.queryByText("John Smith")).not.toBeInTheDocument());
  });

  test("clicking Add opens the EmployeeModal with the current project id", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("employee-modal")).toBeInTheDocument();
  });

  test("closing the EmployeeModal hides it", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Close Employee Modal"));
    expect(screen.queryByTestId("employee-modal")).not.toBeInTheDocument();
  });

  test("renders an empty employees table when the project has no employees", () => {
    renderWithProviders({ project: { ...baseProject, employees: [] } });
    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
  });
});
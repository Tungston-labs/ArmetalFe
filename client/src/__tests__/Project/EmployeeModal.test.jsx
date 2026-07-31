import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import EmployeeModal from "../../Components/EmployeeModal";
import {
  getEmployeesNotInProject,
  assignEmployees,
  getProjectById,
} from "../../Redux/fieldShiftSlice";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

vi.mock("../../Redux/fieldShiftSlice", () => ({
  getEmployeesNotInProject: vi.fn((id) => ({ type: "fieldShift/getEmployeesNotInProject", payload: id })),
  assignEmployees: vi.fn((payload) => ({ type: "fieldShift/assignEmployees", payload })),
  getProjectById: vi.fn((id) => ({ type: "fieldShift/getProjectById", payload: id })),
}));

describe("EmployeeModal", () => {
  const mockDispatch = vi.fn();
  const onClose = vi.fn();

  const employees = [
    { id: 1, name: "Alice Smith", designation: "Engineer", department_name: "Tech" },
    { id: 2, name: "Bob Jones", designation: "Designer", department_name: null },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ projects: { employeesNotInProject: employees, isLoading: false } })
    );
  });

  test("dispatches getEmployeesNotInProject with the projectId on mount", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(getEmployeesNotInProject).toHaveBeenCalledWith(42);
  });

  test("does not dispatch when projectId is missing", () => {
    render(<EmployeeModal onClose={onClose} projectId={null} project={null} />);
    expect(getEmployeesNotInProject).not.toHaveBeenCalled();
  });

  test("shows a loading message when isLoading is true", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ projects: { employeesNotInProject: [], isLoading: true } })
    );
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  });

  test("renders each unassigned employee row", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  test("shows a dash for missing department_name", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("shows 'No unassigned employees found' when the list is empty", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ projects: { employeesNotInProject: [], isLoading: false } })
    );
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.getByText(/no unassigned employees found/i)).toBeInTheDocument();
  });

  test("defaults to an empty list when employeesNotInProject is undefined", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ projects: { isLoading: false } })
    );
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.getByText(/no unassigned employees found/i)).toBeInTheDocument();
  });

  test("filters employees by search term, case-insensitively", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    fireEvent.change(screen.getByPlaceholderText(/search employee/i), {
      target: { value: "alice" },
    });
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Jones")).not.toBeInTheDocument();
  });

  test("shows a Clear button only when there is a search term, and it resets the search", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search employee/i), {
      target: { value: "alice" },
    });
    expect(screen.getByText("Clear")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByPlaceholderText(/search employee/i)).toHaveValue("");
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  test("toggles an employee's checkbox on and off", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).not.toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  test("clicking Cancel calls onClose", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("shows a warning and does not dispatch when Add is clicked with none selected", () => {
    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);
    fireEvent.click(screen.getByText("Add"));

    expect(Swal.fire).toHaveBeenCalledWith("Select at least one employee!", "", "warning");
    expect(assignEmployees).not.toHaveBeenCalled();
  });

  test("merges selected employees with the project's existing employees and assigns them", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/assignEmployees") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    const existingProject = { employees: [{ id: 99 }] };

    render(<EmployeeModal onClose={onClose} projectId={42} project={existingProject} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // select Alice (id 1)

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(assignEmployees).toHaveBeenCalledWith({
        projectId: 42,
        employeeIds: [99, 1],
      });
    });
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Success!",
        "Employees added successfully.",
        "success"
      );
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(getProjectById).toHaveBeenCalledWith(42);
  });

  test("deduplicates employee ids already present in the project", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/assignEmployees") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    const existingProject = { employees: [{ id: 1 }] }; // already has Alice

    render(<EmployeeModal onClose={onClose} projectId={42} project={existingProject} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // select Alice (id 1) again

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(assignEmployees).toHaveBeenCalledWith({
        projectId: 42,
        employeeIds: [1], // deduplicated, not [1, 1]
      });
    });
  });

  test("defaults to an empty employees list when project prop is null", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/assignEmployees") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // select Bob (id 2)

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(assignEmployees).toHaveBeenCalledWith({
        projectId: 42,
        employeeIds: [2],
      });
    });
  });

  test("shows an error alert if assignEmployees fails", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/assignEmployees") {
        return { unwrap: () => Promise.reject(new Error("boom")) };
      }
      return action;
    });

    render(<EmployeeModal onClose={onClose} projectId={42} project={null} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Error", "Failed to add employees.", "error");
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
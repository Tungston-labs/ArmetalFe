// src/__tests__/pages/department/DepartmentList.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// Located under src/__tests__/pages/department/, mirroring the real
// component at src/pages/department/DepartmentList.jsx one level deeper,
// so every relative import below has one extra "../" versus co-located.

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import DepartmentList from "../../../pages/department/DepartmentList";
import { fetchDepartmentById } from "../../../services/departmentServices";

// ---- Mocks -------------------------------------------------------------

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../../Redux/departmentSlice.js", () => ({
  getDepartments: (params) => ({ type: "getDepartments", payload: params }),
  getEmployeesByDepartment: (deptId) => ({
    type: "getEmployeesByDepartment",
    payload: deptId,
  }),
  updateDepartmentById: (args) => ({ type: "updateDepartmentById", payload: args }),
  createNewDepartment: (form) => ({ type: "createNewDepartment", payload: form }),
}));

jest.mock("../../../Redux/employeeSlice.js", () => ({
  deleteEmployeeById: (id) => ({ type: "deleteEmployeeById", payload: id }),
}));

jest.mock("../../../services/departmentServices", () => ({
  fetchDepartmentById: jest.fn(),
}));

jest.mock("../../../Components/Loader.jsx", () => () => <div>loading-departments</div>);

jest.mock("react-spinners", () => ({
  ClipLoader: () => <div>loading-employees</div>,
}));

jest.mock("../../../Components/EmployeeTitle.jsx", () => ({
  onSearchChange,
  onAddClick,
  searchValue,
}) => (
  <div>
    <input
      aria-label="search-departments"
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <button onClick={onAddClick}>Add Department</button>
  </div>
));

jest.mock("../../../Components/No found/Noemployeefound.jsx", () => ({
  searchTerm,
  label,
}) => (
  <div>
    {label} {searchTerm ? `(searched: ${searchTerm})` : ""}
  </div>
));

jest.mock("../../../pages/department/AddDepartment.jsx", () => ({ onClose }) => (
  <div data-testid="add-department-modal">
    <button onClick={onClose}>close-add-department</button>
  </div>
));

// ---- Fixtures ------------------------------------------------------------

const departmentsFixture = [
  { id: 1, name: "Engineering", department_code: "ENG", employee_count: 2 },
  { id: 2, name: "Sales", department_code: "SLS", employee_count: 0 },
];

const employeesFixtureDept1 = [
  { id: 10, name: "Bob", employee_id: "E10", email: "bob@co.com", designation: "Dev" },
  { id: 11, name: "Alice", employee_id: "E11", email: "alice@co.com", designation: "Lead" },
];

const deptDetailsFixture = {
  name: "Engineering",
  department_code: "ENG",
  department_head: { id: 11, name: "Alice" },
};

const makeThunkResult = (value) => {
  const p = Promise.resolve(value);
  p.unwrap = () => Promise.resolve(value);
  return p;
};
const makeThunkRejection = (err) => {
  const p = Promise.resolve().then(() => Promise.reject(err));
  p.unwrap = () => Promise.reject(err);
  p.catch(() => {});
  return p;
};

const mockDispatch = jest.fn();
let dispatchResponses;

beforeEach(() => {
  jest.clearAllMocks();

  dispatchResponses = {
    getDepartments: undefined,
    getEmployeesByDepartment: employeesFixtureDept1,
    updateDepartmentById: {},
    createNewDepartment: {},
    deleteEmployeeById: {},
  };

  mockDispatch.mockImplementation((action) => {
    const value = dispatchResponses[action.type];
    if (value instanceof Error) return makeThunkRejection(value);
    return makeThunkResult(value);
  });

  useDispatch.mockReturnValue(mockDispatch);
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({ departments: { list: departmentsFixture, loading: false } })
  );

  fetchDepartmentById.mockResolvedValue(deptDetailsFixture);
});

// ---- Tests ---------------------------------------------------------------

describe("DepartmentList", () => {
  test("shows a loader while the department list is loading", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ departments: { list: [], loading: true } })
    );
    render(<DepartmentList />);
    expect(screen.getByText("loading-departments")).toBeInTheDocument();
  });

  test("fetches the department list once on mount", () => {
    render(<DepartmentList />);
    const calls = mockDispatch.mock.calls.filter(
      (c) => c[0].type === "getDepartments"
    );
    expect(calls).toHaveLength(1);
    expect(calls[0][0].payload).toEqual({ page: 1, search: "" });
  });

  test("renders all departments with their employee counts", () => {
    render(<DepartmentList />);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("filters departments by name or code as the user types", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.type(screen.getByLabelText("search-departments"), "sls");

    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
  });

  test("shows the empty state with the current search term when nothing matches", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.type(screen.getByLabelText("search-departments"), "zzz");

    expect(
      screen.getByText(/No Department Found.*zzz/)
    ).toBeInTheDocument();
  });

  test("expanding a department loads and displays its employees, sorted by name", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.click(screen.getByText("Engineering"));

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const names = screen.getAllByText(/^(Alice|Bob)$/).map((n) => n.textContent);
    expect(names).toEqual(["Alice", "Bob"]); // alphabetical
  });

  test("collapses the department when clicked again", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    await user.click(screen.getByText("Engineering"));
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("saving without a department head shows a warning and does not dispatch the update", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /edit department/i }));
    // Clear the pre-filled department head by editing the select back to blank.
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "");

    await user.click(screen.getByRole("button", { name: /save department/i }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Missing Department Head" })
    );
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "updateDepartmentById")
    ).toBe(false);
  });

  test("saving with a valid department head updates the department and refreshes the list", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /edit department/i }));
    await user.selectOptions(screen.getByRole("combobox"), "11");
    fetchDepartmentById.mockResolvedValueOnce({
      ...deptDetailsFixture,
      name: "Engineering",
    });

    await user.click(screen.getByRole("button", { name: /save department/i }));

    await waitFor(() => {
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "updateDepartmentById")
      ).toBe(true);
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      "Updated!",
      "Department updated successfully.",
      "success"
    );
  });

  test("deleting an employee: confirming removes them and refreshes the department's list", async () => {
    const user = userEvent.setup();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(<DepartmentList />);
    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    dispatchResponses.getEmployeesByDepartment = [employeesFixtureDept1[1]]; // Bob removed
    await user.click(screen.getByLabelText("Delete Bob"));

    await waitFor(() => {
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });

  test("deleting the last employee in a department closes and removes the department card", async () => {
    const user = userEvent.setup();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(<DepartmentList />);
    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    // Simulate a 404: the follow-up fetch for remaining employees fails.
    dispatchResponses.getEmployeesByDepartment = new Error("Not Found");
    await user.click(screen.getByLabelText("Delete Bob"));

    await waitFor(() => {
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
    // The department card collapses back to its header-only state.
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  test("cancelling the delete confirmation does not remove the employee", async () => {
    const user = userEvent.setup();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(<DepartmentList />);
    await user.click(screen.getByText("Engineering"));
    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());

    await user.click(screen.getByLabelText("Delete Bob"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledTimes(1));
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "deleteEmployeeById")
    ).toBe(false);
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("shows pagination controls only when a department has more than one page of employees", async () => {
    const user = userEvent.setup();
    const manyEmployees = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      name: `Emp ${i}`,
      employee_id: `E${i}`,
    }));
    dispatchResponses.getEmployeesByDepartment = manyEmployees;

    render(<DepartmentList />);
    await user.click(screen.getByText("Engineering"));

    await waitFor(() => expect(screen.getByText("Page 1 / 2")).toBeInTheDocument());
  });

  test("does not show pagination controls for departments with a single page of employees", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);
    await user.click(screen.getByText("Engineering"));

    await waitFor(() => expect(screen.getByText("Bob")).toBeInTheDocument());
    expect(screen.queryByText(/Page \d+ \/ \d+/)).not.toBeInTheDocument();
  });

  test("opens and closes the Add Department modal", async () => {
    const user = userEvent.setup();
    render(<DepartmentList />);

    expect(screen.queryByTestId("add-department-modal")).not.toBeInTheDocument();

    await user.click(screen.getByText("Add Department"));
    expect(screen.getByTestId("add-department-modal")).toBeInTheDocument();

    await user.click(screen.getByText("close-add-department"));
    expect(screen.queryByTestId("add-department-modal")).not.toBeInTheDocument();
  });
});
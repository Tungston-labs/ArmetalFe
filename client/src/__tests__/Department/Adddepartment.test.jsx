// src/__tests__/pages/department/AddDepartment.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";

import AddDepartment from "../../Pages/department/AddDepartment";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("../../Redux/departmentSlice.js", () => ({
  createNewDepartment: (form) => ({ type: "createNewDepartment", payload: form }),
  getDepartments: (params) => ({ type: "getDepartments", payload: params }),
}));

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

const mockDispatch = vi.fn();
const mockOnClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  mockDispatch.mockImplementation((action) => makeThunkResult({}));
});

describe("AddDepartment", () => {
  test("renders empty fields with the default 'HR' avatar", () => {
    render(<AddDepartment onClose={mockOnClose} />);

    expect(screen.getByText("Add department")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Development")).toHaveValue("");
    expect(screen.getByPlaceholderText("e.g. DEV_00")).toHaveValue("");
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("New Department")).toBeInTheDocument();
  });

  test("uppercases typed input and updates the live preview name/avatar", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText("e.g. Development"), "design");

    expect(screen.getByPlaceholderText("e.g. Development")).toHaveValue("DESIGN");
    expect(screen.getByText("DESIGN")).toBeInTheDocument(); // preview name
    expect(screen.getByText("DE")).toBeInTheDocument(); // avatar initials
  });

  test("shows an error when the department name is missing", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(
      await screen.findByText("Please provide a department name.")
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("shows an error when the department code is missing", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(
      await screen.findByText("Please provide a department code.")
    ).toBeInTheDocument();
  });

  test("shows an error when the department code exceeds 10 characters", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    // The input has maxLength=10, so bypass it directly to exercise the
    // validate() branch the same way a pasted value would.
    fireEvent.change(screen.getByPlaceholderText("e.g. DEV_00"), {
      target: { name: "department_code", value: "WAYTOOLONGCODE" },
    });

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(
      await screen.findByText("Department code cannot exceed 10 characters.")
    ).toBeInTheDocument();
  });

  test("submits successfully: creates the department, refreshes the list, and closes", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    await user.type(screen.getByPlaceholderText("e.g. DEV_00"), "DES");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "createNewDepartment")
      ).toBe(true);
      expect(
        mockDispatch.mock.calls.some((c) => c[0].type === "getDepartments")
      ).toBe(true);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test("shows the server error message on failure and does not close the modal", async () => {
    const user = userEvent.setup();
    mockDispatch.mockImplementation((action) => {
      if (action.type === "createNewDepartment") {
        return makeThunkRejection({ payload: { detail: "Code already exists" } });
      }
      return makeThunkResult({});
    });

    render(<AddDepartment onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    await user.type(screen.getByPlaceholderText("e.g. DEV_00"), "DES");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Code already exists")).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("falls back to a generic error message when the rejection has no detail", async () => {
    const user = userEvent.setup();
    mockDispatch.mockImplementation((action) => {
      if (action.type === "createNewDepartment") {
        return makeThunkRejection(new Error("network down"));
      }
      return makeThunkResult({});
    });

    render(<AddDepartment onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    await user.type(screen.getByPlaceholderText("e.g. DEV_00"), "DES");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("network down")).toBeInTheDocument();
  });

  test("shows 'Saving...' and disables the button while the request is pending", async () => {
    const user = userEvent.setup();
    let resolveCreate;
    mockDispatch.mockImplementation((action) => {
      if (action.type === "createNewDepartment") {
        const p = new Promise((resolve) => {
          resolveCreate = resolve;
        });
        p.unwrap = () => p;
        return p;
      }
      return makeThunkResult({});
    });

    render(<AddDepartment onClose={mockOnClose} />);
    await user.type(screen.getByPlaceholderText("e.g. Development"), "Design");
    await user.type(screen.getByPlaceholderText("e.g. DEV_00"), "DES");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByRole("button", { name: /saving\.\.\./i })).toBeDisabled();

    resolveCreate({});
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  test("Cancel and the ✕ close icon both call onClose without submitting", async () => {
    const user = userEvent.setup();
    render(<AddDepartment onClose={mockOnClose} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByLabelText("Close"));
    expect(mockOnClose).toHaveBeenCalledTimes(2);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
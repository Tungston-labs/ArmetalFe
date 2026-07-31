import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";
import AddProjectModal from "../../Components/AddProjectModal";
import { createProject, getProjects } from "../../Redux/fieldShiftSlice";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("../../Redux/fieldShiftSlice", () => ({
  createProject: vi.fn((payload) => ({ type: "fieldShift/createProject", payload })),
  getProjects: vi.fn(() => ({ type: "fieldShift/getProjects" })),
}));

describe("AddProjectModal", () => {
  const mockDispatch = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(<AddProjectModal isOpen={false} onClose={onClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders the form when isOpen is true", () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText("Add Project")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/project name/i)).toBeInTheDocument();
  });

  test("resets form fields and errors each time the modal opens", () => {
    const { rerender } = render(<AddProjectModal isOpen={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText(/project name/i), {
      target: { value: "Some project" },
    });
    expect(screen.getByPlaceholderText(/project name/i)).toHaveValue("Some project");

    // close then reopen
    rerender(<AddProjectModal isOpen={false} onClose={onClose} />);
    rerender(<AddProjectModal isOpen={true} onClose={onClose} />);

    expect(screen.getByPlaceholderText(/project name/i)).toHaveValue("");
  });

  test("clicking outside the modal (overlay) calls onClose", () => {
    const { container } = render(<AddProjectModal isOpen={true} onClose={onClose} />);
    fireEvent.click(container.firstChild);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the modal content does not call onClose", () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Add Project"));
    expect(onClose).not.toHaveBeenCalled();
  });

  test("clicking Cancel calls onClose", () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("shows validation errors for empty project name and punch in type", async () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/punch in type is required/i)).toBeInTheDocument();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("shows a validation error when latitude is non-numeric", async () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(screen.getByPlaceholderText(/enter latitude/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/latitude must be a number/i)).toBeInTheDocument();
    });
  });

  test("shows a validation error when longitude is non-numeric", async () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(screen.getByPlaceholderText(/enter longitude/i), {
      target: { value: "xyz" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/longitude must be a number/i)).toBeInTheDocument();
    });
  });

  test("clears a field's error as soon as it is edited", async () => {
    render(<AddProjectModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/project name/i), {
      target: { value: "HQ" },
    });

    expect(screen.queryByText(/project name is required/i)).not.toBeInTheDocument();
  });

  test("does not require latitude/longitude to be filled in at all", async () => {
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function" || action?.type === "fieldShift/createProject") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(document.querySelector("select"), { target: { value: "on_site" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("submits successfully with all fields, dispatching createProject then getProjects, and closes", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/createProject") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ Building");
    fireEvent.change(document.querySelector("select"), { target: { value: "variant" } });
    fireEvent.change(screen.getByPlaceholderText(/enter latitude/i), {
      target: { value: "12.34" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter longitude/i), {
      target: { value: "56.78" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: "HQ Building",
        punch_type: "variant",
        latitude: "12.34",
        longitude: "56.78",
        employees: [],
      });
    });
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("sends null for latitude/longitude when left blank", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/createProject") {
        return { unwrap: () => Promise.resolve({}) };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(document.querySelector("select"), { target: { value: "bench" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith(
        expect.objectContaining({ latitude: null, longitude: null })
      );
    });
  });

  test("shows the server error message when the save fails", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/createProject") {
        return { unwrap: () => Promise.reject(new Error("Project name already exists")) };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "Dup");
    fireEvent.change(document.querySelector("select"), { target: { value: "on_site" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/project name already exists/i)).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  test("shows a fallback error message when the rejected error has no message", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/createProject") {
        return { unwrap: () => Promise.reject({}) };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(document.querySelector("select"), { target: { value: "on_site" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/failed to save project/i)).toBeInTheDocument();
    });
  });

  test("disables the Save button and shows 'Saving...' while the request is in flight", async () => {
    let resolveUnwrap;
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "fieldShift/createProject") {
        return {
          unwrap: () =>
            new Promise((resolve) => {
              resolveUnwrap = resolve;
            }),
        };
      }
      return action;
    });

    render(<AddProjectModal isOpen={true} onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "HQ");
    fireEvent.change(document.querySelector("select"), { target: { value: "on_site" } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/saving\.\.\./i).closest("button")).toBeDisabled();

    resolveUnwrap({});
    await waitFor(() => {
      expect(screen.queryByText(/saving\.\.\./i)).not.toBeInTheDocument();
    });
  });
});
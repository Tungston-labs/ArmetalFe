import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  unwrap: vi.fn(),
  swal: vi.fn(),
  projectState: {
    project: null,
    loading: false,
    error: null,
  },
}));

/* =========================================================
   REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) =>
    selector({
      projects: mocks.projectState,
    }),
}));

/* =========================================================
   REACT ROUTER
========================================================= */

vi.mock("react-router-dom", () => ({
  useParams: () => ({
    id: "123",
  }),

  useNavigate: () => mocks.navigate,
}));

/* =========================================================
   SWEETALERT
========================================================= */

vi.mock("sweetalert2", () => ({
  default: {
    fire: (...args) => mocks.swal(...args),
  },
}));

/* =========================================================
   REDUX SLICE
========================================================= */

vi.mock("../../../Redux/fieldShiftSlice", () => ({
  getProjectById: vi.fn((id) => ({
    type: "projects/getProjectById",
    payload: id,
  })),

  updateProject: vi.fn((data) => ({
    type: "projects/updateProject",
    payload: data,
  })),

  deleteProject: vi.fn((id) => ({
    type: "projects/deleteProject",
    payload: id,
  })),

  removeEmployeeFromProject: vi.fn((data) => ({
    type: "projects/removeEmployeeFromProject",
    payload: data,
  })),
}));

/* =========================================================
   STYLES
========================================================= */

vi.mock("../../../Pages/Shift/FieldDepartment.Styles", () => {
  const createComponent = (tag) => {
    return ({ children, onClick, disabled, ...props }) =>
      React.createElement(
        tag,
        {
          onClick,
          disabled,
          ...props,
        },
        children,
      );
  };

  return {
    PageWrapper: createComponent("div"),
    FormContainer: createComponent("div"),
    FormRow: createComponent("div"),
    InputField: createComponent("input"),
    ActionButton: createComponent("button"),
    EmployeesSection: createComponent("section"),
    AddButton: createComponent("button"),
    ButtonWrapper: createComponent("div"),
    EmployeeHeader: createComponent("div"),
    ProgressContainer: createComponent("div"),
    LeftSide: createComponent("div"),
    RightSide: createComponent("div"),
    StyledTable: createComponent("table"),
    BodyCell: createComponent("td"),
    BodyRow: createComponent("tr"),
    HeadCell: createComponent("th"),
    HeadRow: createComponent("tr"),
    TableBody: createComponent("tbody"),
    TableHead: createComponent("thead"),
    TableWrapper: createComponent("div"),
  };
});

/* =========================================================
   EMPLOYEE MODAL
========================================================= */

vi.mock("../../../Components/EmployeeModal", () => ({
  default: ({ onClose, projectId }) => (
    <div data-testid="employee-modal">
      <span>Employee Modal</span>
      <span>{projectId}</span>

      <button onClick={onClose}>Close Employee Modal</button>
    </div>
  ),
}));

/* =========================================================
   EDIT PROJECT MODAL
========================================================= */

vi.mock("../../../Components/EditProjectModal", () => ({
  default: ({ onClose, onSave, projectData }) => (
    <div data-testid="edit-project-modal">
      <span>Edit Project Modal</span>

      <span>{projectData.projectName}</span>

      <button onClick={onClose}>Close Edit Modal</button>

      <button
        onClick={() =>
          onSave({
            projectName: "Updated Project",
            punchInType: "Face",
            latitude: "20",
            longitude: "30",
            status: "completed",
          })
        }
      >
        Save Project
      </button>
    </div>
  ),
}));

/* =========================================================
   LOADER
========================================================= */

vi.mock("../../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

/* =========================================================
   EMPLOYEE TITLE
========================================================= */

vi.mock("../../../Components/EmployeeTitle", () => ({
  default: ({ title, subtitle }) => (
    <div data-testid="employee-title">
      <h1>{title}</h1>
      <span>{subtitle}</span>
    </div>
  ),
}));

/* =========================================================
   PROGRESS MODAL
========================================================= */

vi.mock("../../../Components/ProgressModal", () => ({
  default: ({ status }) => <div data-testid="progress-modal">{status}</div>,
}));

/* =========================================================
   ICONS
========================================================= */

vi.mock("../../../assets/projecticon.svg", () => ({
  default: "project-icon.svg",
}));

vi.mock("react-icons/fa", () => ({
  FaPlus: () => <span data-testid="plus-icon">Plus</span>,

  FaTrash: () => <span data-testid="trash-icon">Trash</span>,
}));

vi.mock("react-icons/bi", () => ({
  BiEditAlt: () => <span data-testid="edit-icon">EditIcon</span>,
}));

/* =========================================================
   COMPONENT IMPORT
========================================================= */

import FieldShift from "../../../Pages/Shift/FieldDepartment";

import {
  getProjectById,
  updateProject,
  deleteProject,
  removeEmployeeFromProject,
} from "../../../Redux/fieldShiftSlice";

/* =========================================================
   TEST DATA
========================================================= */

const project = {
  id: 123,
  name: "Test Project",
  punch_type: "Face",
  latitude: "10.123",
  longitude: "20.456",
  status: "in_progress",

  employees: [
    {
      id: 1,
      name: "John Doe",
      employee_id: "EMP001",
      email: "john@example.com",
      designation: "Developer",
      department_name: "IT",
    },

    {
      id: 2,
      name: "Jane Smith",
      employee_id: "EMP002",
      email: "jane@example.com",
      designation: "Manager",
      department_name: "HR",
    },
  ],
};

/* =========================================================
   HELPER
========================================================= */

const renderComponent = () => {
  return render(<FieldShift />);
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.projectState = {
    project,
    loading: false,
    error: null,
  };

  mocks.dispatch.mockImplementation(() => ({
    unwrap: mocks.unwrap,
  }));

  mocks.unwrap.mockResolvedValue({});

  /*
    Default SweetAlert response.
    Individual tests override this when required.
  */
  mocks.swal.mockResolvedValue({
    isConfirmed: false,
  });
});

/* =========================================================
   TESTS
========================================================= */

describe("FieldShift", () => {
  /* -------------------------------------------------------
     1. Render project details
  ------------------------------------------------------- */

  it("renders project details and employees", () => {
    renderComponent();

    expect(screen.getByText("Project")).toBeInTheDocument();

    expect(
      screen.getByText("Manage all Project within the organization"),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("Test Project")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Face")).toBeInTheDocument();

    expect(screen.getByDisplayValue("10.123")).toBeInTheDocument();

    expect(screen.getByDisplayValue("20.456")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("EMP001")).toBeInTheDocument();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    expect(screen.getByText("EMP002")).toBeInTheDocument();

    expect(getProjectById).toHaveBeenCalledWith("123");
  });

  /* -------------------------------------------------------
     2. Loading state
  ------------------------------------------------------- */

  it("renders loader when loading is true", () => {
    mocks.projectState = {
      project: null,
      loading: true,
      error: null,
    };

    renderComponent();

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     3. Error state
  ------------------------------------------------------- */

  it("renders error message when error exists", () => {
    mocks.projectState = {
      project: null,
      loading: false,
      error: "Unable to load project",
    };

    renderComponent();

    expect(
      screen.getByText("Failed to load project: Unable to load project"),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     4. Open employee modal
  ------------------------------------------------------- */

  it("opens employee modal when Add button is clicked", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /add/i,
      }),
    );

    expect(screen.getByTestId("employee-modal")).toBeInTheDocument();

    expect(screen.getByText("123")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     5. Close employee modal
  ------------------------------------------------------- */

  it("closes employee modal", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /add/i,
      }),
    );

    expect(screen.getByTestId("employee-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Employee Modal",
      }),
    );

    expect(screen.queryByTestId("employee-modal")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     6. Open edit modal
  ------------------------------------------------------- */

  it("opens edit project modal", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    );

    expect(screen.getByTestId("edit-project-modal")).toBeInTheDocument();

    expect(screen.getByText("Edit Project Modal")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     7. Close edit modal
  ------------------------------------------------------- */

  it("closes edit project modal", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Edit Modal",
      }),
    );

    expect(screen.queryByTestId("edit-project-modal")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     8. Successful project update
  ------------------------------------------------------- */

  it("updates project successfully from edit modal", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Project",
      }),
    );

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalledWith({
        id: "123",

        projectData: {
          name: "Updated Project",
          punch_type: "Face",
          latitude: "20",
          longitude: "30",
          status: "completed",
        },
      });
    });

    expect(mocks.swal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Updated!",
      }),
    );

    expect(getProjectById).toHaveBeenCalledWith("123");
  });

  /* -------------------------------------------------------
     9. Project update failure
  ------------------------------------------------------- */

  it("handles update project failure", async () => {
    mocks.unwrap.mockRejectedValueOnce(new Error("Update failed"));

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Project",
      }),
    );

    await waitFor(() => {
      expect(mocks.swal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error!",
          text: "Failed to update project.",
        }),
      );
    });
  });

  /* -------------------------------------------------------
     10. Successful project deletion
  ------------------------------------------------------- */

  it("handles delete confirmation and successful deletion", async () => {
    mocks.swal
      .mockResolvedValueOnce({
        isConfirmed: true,
      })
      .mockResolvedValueOnce({});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /delete/i,
      }),
    );

    await waitFor(() => {
      expect(deleteProject).toHaveBeenCalledWith("123");
    });

    expect(mocks.navigate).toHaveBeenCalledWith("/project");

    await waitFor(() => {
      expect(
        screen.getByText("The project has been deleted."),
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     11. Cancel project deletion
  ------------------------------------------------------- */

  it("does nothing when delete is cancelled", async () => {
    mocks.swal.mockResolvedValueOnce({
      isConfirmed: false,
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /delete/i,
      }),
    );

    await waitFor(() => {
      expect(deleteProject).not.toHaveBeenCalled();
    });

    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  /* -------------------------------------------------------
     12. Project deletion failure
  ------------------------------------------------------- */

  it("handles delete failure", async () => {
    mocks.swal.mockResolvedValueOnce({
      isConfirmed: true,
    });

    mocks.unwrap.mockRejectedValueOnce(new Error("Delete failed"));

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /delete/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error!",
          text: "Failed to delete project.",
        }),
      );
    });
  });

  /* -------------------------------------------------------
     13. Successful employee removal
  ------------------------------------------------------- */

  it("removes employee successfully", async () => {
    mocks.swal
      .mockResolvedValueOnce({
        isConfirmed: true,
      })
      .mockResolvedValueOnce({});

    renderComponent();

    /*
      First trash icon = project delete button.
      Second trash icon = first employee.
    */
    const trashIcons = screen.getAllByTestId("trash-icon");

    expect(trashIcons.length).toBeGreaterThanOrEqual(3);

    fireEvent.click(trashIcons[1]);

    await waitFor(() => {
      expect(removeEmployeeFromProject).toHaveBeenCalledWith({
        projectId: "123",
        employeeId: 1,
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    expect(getProjectById).toHaveBeenCalledWith("123");
  });

  /* -------------------------------------------------------
     14. Cancel employee removal
  ------------------------------------------------------- */

  it("does nothing when employee deletion is cancelled", async () => {
    mocks.swal.mockResolvedValueOnce({
      isConfirmed: false,
    });

    renderComponent();

    const trashIcons = screen.getAllByTestId("trash-icon");

    fireEvent.click(trashIcons[1]);

    await waitFor(() => {
      expect(removeEmployeeFromProject).not.toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------
     15. Employee removal failure
  ------------------------------------------------------- */

  it("handles employee removal failure", async () => {
    mocks.swal.mockResolvedValueOnce({
      isConfirmed: true,
    });

    mocks.unwrap.mockRejectedValueOnce(new Error("Remove employee failed"));

    renderComponent();

    const trashIcons = screen.getAllByTestId("trash-icon");

    fireEvent.click(trashIcons[1]);

    await waitFor(() => {
      expect(mocks.swal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error!",
          text: "Failed to remove employee from project.",
        }),
      );
    });
  });

  /* -------------------------------------------------------
     16. No employees
  ------------------------------------------------------- */

  it("handles project with no employees", () => {
    mocks.projectState = {
      project: {
        ...project,
        employees: [],
      },

      loading: false,
      error: null,
    };

    renderComponent();

    expect(screen.getByText("Employees")).toBeInTheDocument();

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     17. Missing project values
  ------------------------------------------------------- */

  it("uses default empty values when project fields are missing", async () => {
    mocks.projectState = {
      project: {
        id: 123,
        name: null,
        punch_type: null,
        latitude: null,
        longitude: null,
        status: null,
        employees: undefined,
      },

      loading: false,
      error: null,
    };

    renderComponent();

    await waitFor(() => {
      const inputs = screen.getAllByRole("textbox");

      expect(inputs).toHaveLength(4);

      expect(inputs[0]).toHaveValue("");
      expect(inputs[1]).toHaveValue("");
      expect(inputs[2]).toHaveValue("");
      expect(inputs[3]).toHaveValue("");
    });

    expect(screen.getByTestId("progress-modal")).toHaveTextContent(
      "in_progress",
    );
  });
});

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
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) =>
    selector({
      projects: mocks.projectState,
    }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

/* =========================================================
   STYLES MOCK
========================================================= */

vi.mock("../../../Pages/Shift/FieldShift.Styles", () => {
  const React = require("react");

  const component = (tag) => {
    return ({ children, ...props }) =>
      React.createElement(tag, props, children);
  };

  return {
    PageWrapper: component("div"),
    CardsGrid: component("div"),
    Card: component("div"),
    CardHeader: component("div"),
    CardTitle: component("h2"),
    CardText: component("div"),
    CardFooter: component("div"),
    Tag: component("span"),
    CardTitleSection: component("div"),
    StatusTag: component("span"),
  };
});

/* =========================================================
   REDUX MOCK
========================================================= */

vi.mock("../../../Redux/fieldShiftSlice", () => ({
  getProjects: vi.fn((data) => ({
    type: "projects/getAll",
    payload: data,
  })),
}));

/* =========================================================
   COMPONENT MOCKS
========================================================= */

vi.mock("../../../Components/AddProjectModal", () => ({
  default: ({ isOpen, onClose, onSave }) =>
    isOpen ? (
      <div data-testid="add-project-modal">
        <h2>Add Project Modal</h2>

        <button onClick={onClose}>Close Add Project Modal</button>

        <button
          onClick={() =>
            onSave({
              name: "New Project",
              punch_type: "Face",
            })
          }
        >
          Save Project
        </button>
      </div>
    ) : null,
}));

vi.mock("../../../Components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../../Components/EmployeeTitle", () => ({
  default: ({
    title,
    subtitle,
    buttonText,
    searchValue,
    onSearchChange,
    onAddClick,
    searchPlaceholder,
  }) => (
    <div data-testid="employee-title">
      <h1>{title}</h1>

      <span>{subtitle}</span>

      {buttonText && <button onClick={onAddClick}>{buttonText}</button>}

      {onSearchChange && (
        <input
          aria-label="Search Project"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
    </div>
  ),
}));

vi.mock("../../../Components/No found/Noemployeefound", () => ({
  default: ({ searchTerm, label }) => (
    <div data-testid="no-project-found">
      <span>{label}</span>
      <span>{searchTerm}</span>
    </div>
  ),
}));

/* =========================================================
   ASSET MOCKS
========================================================= */

vi.mock("../../../assets/shift.svg", () => ({
  default: "shift.svg",
}));

vi.mock("../../../assets/projecticon.svg", () => ({
  default: "projecticon.svg",
}));

vi.mock("../../../assets/downicon.svg", () => ({
  default: "downicon.svg",
}));

vi.mock("react-icons/hi", () => ({
  HiOutlineDotsHorizontal: () => <span data-testid="dots-icon">...</span>,
}));

/* =========================================================
   IMPORT COMPONENT AFTER MOCKS
========================================================= */

import DepartmentPage from "../../../Pages/Shift/FieldShift";

import { getProjects } from "../../../Redux/fieldShiftSlice";

/* =========================================================
   TEST DATA
========================================================= */

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    punch_type: "Face",
    status: "in_progress",
    employees: [
      {
        id: 101,
        name: "John Doe",
      },
      {
        id: 102,
        name: "Jane Smith",
      },
    ],
  },
  {
    id: 2,
    name: "Project Beta",
    punch_type: "Location",
    status: "completed",
    employees: [
      {
        id: 103,
        name: "David",
      },
    ],
  },
  {
    id: 3,
    name: "Project Gamma",
    punch_type: null,
    status: "pending",
    employees: [],
  },
];

/* =========================================================
   HELPER
========================================================= */

const renderComponent = () => {
  return render(<DepartmentPage />);
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.projectState = {
    projects,
    isLoading: false,
  };

  mocks.dispatch.mockImplementation(() => ({
    type: "projects/getAll",
  }));
});

/* =========================================================
   TESTS
========================================================= */

describe("DepartmentPage", () => {
  /* -------------------------------------------------------
     1. BASIC RENDER
  ------------------------------------------------------- */

  it("renders project page title and subtitle", () => {
    renderComponent();

    expect(screen.getByText("Project")).toBeInTheDocument();

    expect(
      screen.getByText("Manage all projects within the organization"),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     2. FETCH PROJECTS ON MOUNT
  ------------------------------------------------------- */

  it("dispatches getProjects when component mounts", () => {
    renderComponent();

    expect(getProjects).toHaveBeenCalledWith({
      search: "",
    });

    expect(mocks.dispatch).toHaveBeenCalled();
  });

  /* -------------------------------------------------------
     3. RENDER PROJECTS
  ------------------------------------------------------- */

  it("renders all projects", () => {
    renderComponent();

    expect(screen.getByText("Project Alpha")).toBeInTheDocument();

    expect(screen.getByText("Project Beta")).toBeInTheDocument();

    expect(screen.getByText("Project Gamma")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     4. EMPLOYEE COUNTS
  ------------------------------------------------------- */

  it("renders employee count for each project", () => {
    renderComponent();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     5. PUNCH TYPES
  ------------------------------------------------------- */

  it("renders project punch types", () => {
    renderComponent();

    expect(screen.getByText("Face")).toBeInTheDocument();

    expect(screen.getByText("Location")).toBeInTheDocument();

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     6. STATUS LABEL - IN PROGRESS
  ------------------------------------------------------- */

  it("renders In Progress status correctly", () => {
    renderComponent();

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     7. STATUS LABEL - COMPLETED
  ------------------------------------------------------- */

  it("renders Completed status correctly", () => {
    renderComponent();

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     8. STATUS LABEL - PENDING
  ------------------------------------------------------- */

  it("renders Pending status correctly", () => {
    renderComponent();

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     9. LOADING STATE
  ------------------------------------------------------- */

  it("renders loader when projects are loading", () => {
    mocks.projectState = {
      projects: [],
      isLoading: true,
    };

    renderComponent();

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    expect(screen.queryByText("Project Alpha")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     10. EMPTY PROJECT STATE
  ------------------------------------------------------- */

  it("renders No Projects Found when there are no projects", () => {
    mocks.projectState = {
      projects: [],
      isLoading: false,
    };

    renderComponent();

    expect(screen.getByTestId("no-project-found")).toBeInTheDocument();

    expect(screen.getByText("No Projects Found")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     11. SEARCH INPUT
  ------------------------------------------------------- */

  it("updates search term when user types", async () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search Project",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Alpha",
      },
    });

    expect(searchInput).toHaveValue("Alpha");

    await waitFor(() => {
      expect(getProjects).toHaveBeenCalledWith({
        search: "Alpha",
      });
    });
  });

  /* -------------------------------------------------------
     12. EMPTY STATE WITH SEARCH TERM
  ------------------------------------------------------- */

  it("passes search term to NoEmployeeFound component", async () => {
    mocks.projectState = {
      projects: [],
      isLoading: false,
    };

    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search Project",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Unknown",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     13. OPEN ADD PROJECT MODAL
  ------------------------------------------------------- */

  it("opens Add Project modal when Add Project is clicked", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Project",
      }),
    );

    expect(screen.getByTestId("add-project-modal")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     14. CLOSE ADD PROJECT MODAL
  ------------------------------------------------------- */

  it("closes Add Project modal", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Project",
      }),
    );

    expect(screen.getByTestId("add-project-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Add Project Modal",
      }),
    );

    expect(screen.queryByTestId("add-project-modal")).not.toBeInTheDocument();
  });

  /* -------------------------------------------------------
     15. SAVE PROJECT
  ------------------------------------------------------- */

  it("closes modal and refreshes projects after saving", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Project",
      }),
    );

    expect(screen.getByTestId("add-project-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Project",
      }),
    );

    expect(screen.queryByTestId("add-project-modal")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getProjects).toHaveBeenCalledWith({
        search: "",
      });

      expect(getProjects).toHaveBeenCalledWith();
    });
  });

  /* -------------------------------------------------------
     16. PROJECT NAVIGATION
  ------------------------------------------------------- */

  it("navigates to project department when project card is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Project Alpha"));

    expect(mocks.navigate).toHaveBeenCalledWith("/project-department/1", {
      state: {
        projectName: "Project Alpha",
      },
    });
  });

  /* -------------------------------------------------------
     17. SECOND PROJECT NAVIGATION
  ------------------------------------------------------- */

  it("navigates correctly for another project", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Project Beta"));

    expect(mocks.navigate).toHaveBeenCalledWith("/project-department/2", {
      state: {
        projectName: "Project Beta",
      },
    });
  });

  /* -------------------------------------------------------
     18. PROJECT WITH NO EMPLOYEES
  ------------------------------------------------------- */

  it("renders zero employee count when employees array is empty", () => {
    renderComponent();

    const zeroCount = screen.getByText("0");

    expect(zeroCount).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     19. PROJECT WITH UNDEFINED EMPLOYEES
  ------------------------------------------------------- */

  it("renders zero employee count when employees is undefined", () => {
    mocks.projectState = {
      projects: [
        {
          id: 10,
          name: "No Employee Project",
          punch_type: "Face",
          status: "completed",
        },
      ],
      isLoading: false,
    };

    renderComponent();

    expect(screen.getByText("No Employee Project")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     20. UNKNOWN STATUS
  ------------------------------------------------------- */

  it("renders raw status when status is not in statusLabels", () => {
    mocks.projectState = {
      projects: [
        {
          id: 20,
          name: "Unknown Status Project",
          punch_type: "Face",
          status: "archived",
          employees: [],
        },
      ],
      isLoading: false,
    };

    renderComponent();

    expect(screen.getByText("archived")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     21. NULL STATUS
  ------------------------------------------------------- */

  it("renders N/A when project status is missing", () => {
    mocks.projectState = {
      projects: [
        {
          id: 21,
          name: "No Status Project",
          punch_type: "Face",
          status: null,
          employees: [],
        },
      ],
      isLoading: false,
    };

    renderComponent();

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     22. PROJECT DEFAULT ARRAY
  ------------------------------------------------------- */

  it("handles missing projects array", () => {
    mocks.projectState = {
      isLoading: false,
    };

    renderComponent();

    expect(screen.getByText("No Projects Found")).toBeInTheDocument();
  });

  /* -------------------------------------------------------
     23. SEARCH DISPATCH ON CHANGE
  ------------------------------------------------------- */

  it("dispatches getProjects again when search term changes", async () => {
    renderComponent();

    const searchInput = screen.getByRole("textbox", {
      name: "Search Project",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Project Beta",
      },
    });

    await waitFor(() => {
      expect(getProjects).toHaveBeenCalledWith({
        search: "Project Beta",
      });
    });
  });

  /* -------------------------------------------------------
     24. PROJECT CARD DOT ICON
  ------------------------------------------------------- */

  it("renders the menu icon for each project", () => {
    renderComponent();

    const icons = screen.getAllByTestId("dots-icon");

    expect(icons).toHaveLength(3);
  });
});

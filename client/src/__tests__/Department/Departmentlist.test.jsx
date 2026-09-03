import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  within,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ============================================================
// HOISTED MOCKS
// ============================================================

const {
  mockDispatch,
  mockGetDepartments,
  mockCreateNewDepartment,
  mockDepartmentsRef,
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(),

  mockGetDepartments: vi.fn((payload) => ({
    type: "departments/getDepartments",
    payload,
  })),

  mockCreateNewDepartment: vi.fn((payload) => ({
    type: "departments/createNewDepartment",
    payload,
    __mockCreate: true,
  })),

  mockDepartmentsRef: {
    current: [],
  },
}));

// ============================================================
// REDUX
// ============================================================

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      departments: {
        list: mockDepartmentsRef.current,
      },
    }),
}));

// ============================================================
// DEPARTMENT SLICE
// ============================================================

vi.mock("../../Redux/departmentSlice.js", () => ({
  getDepartments: mockGetDepartments,
  createNewDepartment: mockCreateNewDepartment,
}));

// ============================================================
// REUSABLE HEADER
// ============================================================

vi.mock("../../Components/ReusableTable/ReusableHeader.jsx", () => ({
  default: ({ title, breadcrumbs, buttonText, onButtonClick }) => (
    <div data-testid="reusable-header">
      <h1>{title}</h1>

      <div data-testid="breadcrumbs">
        {breadcrumbs?.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <button type="button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  ),
}));

// ============================================================
// REUSABLE TABLE
// ============================================================

vi.mock("../../Components/ReusableTable/ReusableTable.jsx", () => ({
  default: ({ data = [] }) => (
    <div data-testid="employee-table">
      {data.length === 0 ? (
        <div data-testid="employee-table-empty">No employees</div>
      ) : (
        data.map((employee, index) => (
          <div
            key={employee.id ?? index}
            data-testid={`employee-row-${employee.id ?? index}`}
          >
            <span>
              {employee.name
                ? employee.name.charAt(0).toUpperCase() + employee.name.slice(1)
                : ""}
            </span>

            <span>{employee.email}</span>

            <span>{employee.employee_code}</span>

            <span>{employee.designation}</span>
          </div>
        ))
      )}
    </div>
  ),
}));

// ============================================================
// PAGINATION
// ============================================================

vi.mock("../../Components/Pagination/ReusablePagination.jsx", () => ({
  default: ({ currentPage = 1, totalPages = 1, onPageChange }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} / {totalPages}
      </span>

      <button type="button" onClick={() => onPageChange?.(currentPage + 1)}>
        Next
      </button>
    </div>
  ),
}));

// ============================================================
// EMPTY STATE
// ============================================================

vi.mock("../../Components/No found/Noemployeefound.jsx", () => ({
  default: ({ label, searchTerm }) => (
    <div data-testid="no-department-found">
      <span>{label}</span>

      {searchTerm !== undefined && <span>{searchTerm}</span>}
    </div>
  ),
}));

// ============================================================
// ADD DEPARTMENT
// ============================================================

vi.mock("../../Pages/department/AddDepartment.jsx", () => ({
  default: ({ onClose, form, error, loading, onChange, onSubmit }) => (
    <div data-testid="add-department-modal">
      <input
        aria-label="Department Name"
        name="name"
        value={form?.name ?? ""}
        onChange={onChange}
      />

      <input
        aria-label="Department Code"
        name="department_code"
        value={form?.department_code ?? ""}
        onChange={onChange}
      />

      {error && <div role="alert">{error}</div>}

      <button type="button" onClick={onSubmit} disabled={loading}>
        Save
      </button>

      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </div>
  ),
}));

// ============================================================
// DEPARTMENT DETAILS HOOK
// ============================================================

vi.mock("../../Pages/department/useDepartmentDetails.js", async () => {
  const ReactModule = await import("react");

  const PAGE_SIZE = 10;

  const normalizeId = (value) =>
    typeof value === "object" ? value?.id : value;

  return {
    PAGE_SIZE,

    useDepartmentDetails: () => {
      const [selectedDeptId, setSelectedDeptId] = ReactModule.useState(null);

      const [editingDeptId, setEditingDeptId] = ReactModule.useState(null);

      const [pageMap, setPageMap] = ReactModule.useState({});

      const toggleDepartment = (value) => {
        const id = normalizeId(value);

        setSelectedDeptId((previous) => (previous === id ? null : id));

        setEditingDeptId(null);
      };

      const toggleEdit = (value) => {
        const id = normalizeId(value);

        setEditingDeptId((previous) => (previous === id ? null : id));
      };

      const updateFormField = (departmentId, event) => {
        // The real hook manages this state.
        // This mock only needs to provide the callback.
        void departmentId;
        void event;
      };

      const saveDepartment = vi.fn();

      const setPage = (departmentId, page) => {
        const id = normalizeId(departmentId);

        setPageMap((previous) => ({
          ...previous,
          [id]: page,
        }));
      };

      const getPage = (departmentId) => {
        const id = normalizeId(departmentId);
        return pageMap[id] || 1;
      };

      // IMPORTANT:
      // DepartmentList.jsx calls getEntry(dept.id)
      const getEntry = (departmentId) => {
        const id = normalizeId(departmentId);

        const department = mockDepartmentsRef.current.find(
          (dept) => dept.id === id,
        );

        const employees = department?.employees || [];

        return {
          employees,

          details: {
            department_head: department?.department_head || null,
          },

          form: {
            name: department?.name || "",
            department_code: department?.department_code || "",
            department_head_id: department?.department_head?.id || "",
          },

          page: getPage(id),

          isEditing: editingDeptId === id,
        };
      };

      return {
        selectedDeptId,
        loadingDept: false,
        getEntry,
        toggleDepartment,
        toggleEdit,
        updateFormField,
        setPage,
        saveDepartment,
      };
    },
  };
});

// ============================================================
// COMPONENT
// ============================================================

import DepartmentList from "../../Pages/department/DepartmentList.jsx";

// ============================================================
// TEST DATA
// ============================================================

const createDepartments = () => [
  {
    id: 1,
    name: "Engineering",
    department_code: "ENG",

    // IMPORTANT:
    // DepartmentList uses employee_count, not employees.length
    employee_count: 3,

    department_head: {
      id: 101,
      name: "John Doe",
    },

    employees: [
      {
        id: 1,
        name: "Zack Employee",
        email: "zack@example.com",
        employee_code: "EMP003",
        designation: "Developer",
      },

      {
        id: 2,
        name: "Alice Employee",
        email: "alice@example.com",
        employee_code: "EMP001",
        designation: "Senior Developer",
      },

      {
        id: 3,
        name: "Bob Employee",
        email: "bob@example.com",
        employee_code: "EMP002",
        designation: "Tester",
      },
    ],
  },

  {
    id: 2,
    name: "Sales",
    department_code: "SAL",

    employee_count: 0,

    department_head: null,

    employees: [],
  },
];

// ============================================================
// HELPERS
// ============================================================

const renderDepartmentList = () => {
  return render(<DepartmentList />);
};

const getDepartmentHeading = (name) => {
  return screen.getByRole("heading", {
    name,
  });
};

const expandEngineering = async () => {
  const user = userEvent.setup();

  await user.click(getDepartmentHeading("Engineering"));

  return user;
};

const enterEditMode = async () => {
  const user = await expandEngineering();

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: "Edit department",
      }),
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole("button", {
      name: "Edit department",
    }),
  );

  return user;
};

// ============================================================
// SETUP
// ============================================================

beforeEach(() => {
  mockDepartmentsRef.current = createDepartments();

  mockDispatch.mockReset();
  mockGetDepartments.mockClear();
  mockCreateNewDepartment.mockClear();

  mockDispatch.mockImplementation((action) => {
    if (action?.__mockCreate) {
      return {
        unwrap: () => Promise.resolve({}),
      };
    }

    return action;
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================
// TESTS
// ============================================================

describe("DepartmentList", () => {
  // ==========================================================
  // HEADER
  // ==========================================================

  it("renders the department header", () => {
    renderDepartmentList();

    expect(
      screen.getByRole("heading", {
        name: "Department",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(
      screen.getByText("Department", {
        selector: "span",
      }),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // FETCH
  // ==========================================================

  it("fetches departments when the component mounts", async () => {
    renderDepartmentList();

    await waitFor(() => {
      expect(mockGetDepartments).toHaveBeenCalledWith({
        page: 1,
        search: "",
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  // ==========================================================
  // DEPARTMENTS
  // ==========================================================

  it("renders all departments", () => {
    renderDepartmentList();

    expect(getDepartmentHeading("Engineering")).toBeInTheDocument();

    expect(getDepartmentHeading("Sales")).toBeInTheDocument();
  });

  it("renders employee count for each department", () => {
    renderDepartmentList();

    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders the department initial", () => {
    renderDepartmentList();

    expect(screen.getByText("E")).toBeInTheDocument();

    expect(screen.getByText("S")).toBeInTheDocument();
  });

  // ==========================================================
  // EXPAND / COLLAPSE
  // ==========================================================

  it("expands a department when its name is clicked", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(screen.getByDisplayValue("ENG")).toBeInTheDocument();

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("collapses an expanded department when clicked again", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    const heading = getDepartmentHeading("Engineering");

    await user.click(heading);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    await user.click(heading);

    await waitFor(() => {
      expect(screen.queryByDisplayValue("John Doe")).not.toBeInTheDocument();
    });
  });

  it("can expand the Sales department", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(getDepartmentHeading("Sales"));

    expect(screen.getByDisplayValue("SAL")).toBeInTheDocument();
  });

  // ==========================================================
  // EMPLOYEES
  // ==========================================================

  it("renders employee information after expanding Engineering", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(screen.getByTestId("employee-table")).toBeInTheDocument();

    expect(screen.getByText("Zack Employee")).toBeInTheDocument();

    expect(screen.getByText("Alice Employee")).toBeInTheDocument();

    expect(screen.getByText("Bob Employee")).toBeInTheDocument();
  });

  it("renders an empty employee table for Sales", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(getDepartmentHeading("Sales"));

    expect(screen.getByTestId("employee-table")).toBeInTheDocument();

    expect(screen.getByTestId("employee-table-empty")).toBeInTheDocument();
  });

  it("sorts employees alphabetically by name", async () => {
    renderDepartmentList();

    await expandEngineering();

    const table = screen.getByTestId("employee-table");

    const rows = within(table).getAllByTestId(/employee-row-/);

    expect(rows[0]).toHaveTextContent("Alice Employee");

    expect(rows[1]).toHaveTextContent("Bob Employee");

    expect(rows[2]).toHaveTextContent("Zack Employee");
  });

  // ==========================================================
  // DETAILS
  // ==========================================================

  it("renders department name and code in expanded view", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();

    expect(screen.getByDisplayValue("ENG")).toBeInTheDocument();
  });

  it("renders department head when assigned", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("renders Not Assigned when department has no department head", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(getDepartmentHeading("Sales"));

    expect(screen.getByDisplayValue("Not Assigned")).toBeInTheDocument();
  });

  it("shows Edit department button in expanded view", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(
      screen.getByRole("button", {
        name: "Edit department",
      }),
    ).toBeInTheDocument();
  });

  // ==========================================================
  // EDIT
  // ==========================================================

  it("enters edit mode when Edit department is clicked", async () => {
    renderDepartmentList();

    await enterEditMode();

    expect(
      screen.getByRole("button", {
        name: "Save department",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("renders editable department name input", async () => {
    renderDepartmentList();

    await enterEditMode();

    const input = screen.getByDisplayValue("Engineering");

    expect(input).toBeInTheDocument();

    expect(input).not.toBeDisabled();
  });

  it("renders editable department code input", async () => {
    renderDepartmentList();

    await enterEditMode();

    const input = screen.getByDisplayValue("ENG");

    expect(input).toBeInTheDocument();

    expect(input).not.toBeDisabled();
  });

  it("renders department head select in edit mode", async () => {
    renderDepartmentList();

    await enterEditMode();

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders Save department button in edit mode", async () => {
    renderDepartmentList();

    await enterEditMode();

    expect(
      screen.getByRole("button", {
        name: "Save department",
      }),
    ).toBeInTheDocument();
  });

  it("renders Cancel button in edit mode", async () => {
    renderDepartmentList();

    await enterEditMode();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("exits edit mode when Cancel is clicked", async () => {
    renderDepartmentList();

    const user = await enterEditMode();

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Edit department",
        }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", {
        name: "Save department",
      }),
    ).not.toBeInTheDocument();
  });

  // ==========================================================
  // PAGINATION
  // ==========================================================

  it("does not render pagination when employee count is within page size", async () => {
    renderDepartmentList();

    await expandEngineering();

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("renders pagination when a department has more than PAGE_SIZE employees", async () => {
    mockDepartmentsRef.current = [
      {
        id: 1,
        name: "Engineering",
        department_code: "ENG",
        employee_count: 15,

        department_head: {
          id: 101,
          name: "John Doe",
        },

        employees: Array.from({ length: 15 }, (_, index) => ({
          id: index + 1,
          name: `Employee ${String(index + 1).padStart(2, "0")}`,
          email: `employee${index + 1}@example.com`,
          employee_code: `EMP${index + 1}`,
          designation: "Developer",
        })),
      },
    ];

    renderDepartmentList();

    await expandEngineering();

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("changes employee page when next page is selected", async () => {
    mockDepartmentsRef.current = [
      {
        id: 1,
        name: "Engineering",
        department_code: "ENG",
        employee_count: 15,

        department_head: {
          id: 101,
          name: "John Doe",
        },

        employees: Array.from({ length: 15 }, (_, index) => ({
          id: index + 1,
          name: `Employee ${String(index + 1).padStart(2, "0")}`,
          email: `employee${index + 1}@example.com`,
          employee_code: `EMP${index + 1}`,
          designation: "Developer",
        })),
      },
    ];

    renderDepartmentList();

    await expandEngineering();

    const pagination = screen.getByTestId("pagination");

    expect(within(pagination).getByText("Page 1 / 2")).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      within(pagination).getByRole("button", {
        name: "Next",
      }),
    );

    await waitFor(() => {
      expect(within(pagination).getByText("Page 2 / 2")).toBeInTheDocument();
    });
  });

  // ==========================================================
  // ADD DEPARTMENT
  // ==========================================================

  it("opens Add Department modal", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    expect(screen.getByTestId("add-department-modal")).toBeInTheDocument();
  });

  it("closes Add Department modal when Cancel is clicked", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(
      screen.queryByTestId("add-department-modal"),
    ).not.toBeInTheDocument();
  });

  it("uppercases department name while typing", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    const input = screen.getByLabelText("Department Name");

    await user.type(input, "finance");

    expect(input).toHaveValue("FINANCE");
  });

  it("uppercases department code while typing", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    const input = screen.getByLabelText("Department Code");

    await user.type(input, "fin");

    expect(input).toHaveValue("FIN");
  });

  // ==========================================================
  // VALIDATION
  // ==========================================================

  it("shows validation error when department name is empty", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please provide a department name.",
    );
  });

  it("shows validation error when department code is empty", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please provide a department code.",
    );
  });

  it("shows validation error when department code exceeds 10 characters", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.type(screen.getByLabelText("Department Code"), "ABCDEFGHIJK");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Department code cannot exceed 10 characters.",
    );
  });

  // ==========================================================
  // CREATE
  // ==========================================================

  it("creates a new department with valid data", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.type(screen.getByLabelText("Department Code"), "FIN");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(mockCreateNewDepartment).toHaveBeenCalledWith({
        name: "FINANCE",
        department_code: "FIN",
      });
    });

    await waitFor(() => {
      expect(mockGetDepartments).toHaveBeenCalledWith({
        page: 1,
        search: "",
      });
    });

    expect(
      screen.queryByTestId("add-department-modal"),
    ).not.toBeInTheDocument();
  });

  // ==========================================================
  // CREATE ERRORS
  // ==========================================================

  it("handles create department error", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.__mockCreate) {
        return {
          unwrap: () =>
            Promise.reject({
              payload: {
                detail: "Department already exists.",
              },
            }),
        };
      }

      return action;
    });

    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.type(screen.getByLabelText("Department Code"), "FIN");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Department already exists.",
      );
    });
  });

  it("handles create department error using message", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.__mockCreate) {
        return {
          unwrap: () =>
            Promise.reject({
              payload: {
                message: "Unable to create department.",
              },
            }),
        };
      }

      return action;
    });

    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.type(screen.getByLabelText("Department Code"), "FIN");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Unable to create department.",
      );
    });
  });

  it("uses fallback error message when create department fails without details", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.__mockCreate) {
        return {
          unwrap: () => Promise.reject({}),
        };
      }

      return action;
    });

    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "+ ADD NEW DEPARTMENT",
      }),
    );

    await user.type(screen.getByLabelText("Department Name"), "Finance");

    await user.type(screen.getByLabelText("Department Code"), "FIN");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again later.",
      );
    });
  });

  // ==========================================================
  // EDGE CASES
  // ==========================================================

  it("renders department code when available", () => {
    mockDepartmentsRef.current = [
      {
        id: 10,
        name: "Finance",
        department_code: "FIN",
        employee_count: 0,
        department_head: null,
        employees: [],
      },
    ];

    renderDepartmentList();

    expect(getDepartmentHeading("Finance")).toBeInTheDocument();
  });

  it("renders Not Assigned for a missing department head", async () => {
    mockDepartmentsRef.current = [
      {
        id: 10,
        name: "Finance",
        department_code: "FIN",
        employee_count: 0,
        department_head: null,
        employees: [],
      },
    ];

    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(getDepartmentHeading("Finance"));

    expect(screen.getByDisplayValue("Not Assigned")).toBeInTheDocument();
  });

  it("switches between departments correctly", async () => {
    renderDepartmentList();

    const user = userEvent.setup();

    await user.click(getDepartmentHeading("Engineering"));

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();

    await user.click(getDepartmentHeading("Sales"));

    await waitFor(() => {
      expect(screen.queryByDisplayValue("John Doe")).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("SAL")).toBeInTheDocument();
  });

  it("handles a department without a name", () => {
    mockDepartmentsRef.current = [
      {
        id: 20,
        name: "",
        department_code: "NONAME",
        employee_count: 0,
        department_head: null,
        employees: [],
      },
    ];

    renderDepartmentList();

    expect(screen.getByTestId("reusable-header")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();

    expect(screen.queryByText("NONAME")).not.toBeInTheDocument();
  });
});

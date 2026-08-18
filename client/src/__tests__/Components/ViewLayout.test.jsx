import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  useLocation: vi.fn(),
  employeeTitleProps: null,
  headerProps: null,
}));

/* =========================================================
   REACT ROUTER
========================================================= */

vi.mock("react-router-dom", () => ({
  useLocation: () => mocks.useLocation(),
  NavLink: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

/* =========================================================
   STYLED COMPONENTS
========================================================= */

vi.mock("../../Pages/employee/layout/ViewLayout.Styles", () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,

  TopSection: ({ children }) => <div data-testid="top-section">{children}</div>,

  FormSection: ({ children }) => (
    <div data-testid="form-section">{children}</div>
  ),

  TabsRowContainer: ({ children }) => (
    <div data-testid="tabs-row-container">{children}</div>
  ),

  TabsRow: ({ children, ...props }) => (
    <div data-testid="tabs-row" {...props}>
      {children}
    </div>
  ),

  TabButton: ({ children, active }) => (
    <button
      type="button"
      data-testid={`tab-${children.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      data-active={String(active)}
    >
      {children}
    </button>
  ),
}));

/* =========================================================
   EMPLOYEE TITLE
========================================================= */

vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => {
    mocks.employeeTitleProps = props;

    return (
      <div data-testid="employee-title">
        <button type="button" onClick={props.onAddClick}>
          {props.buttonText}
        </button>
      </div>
    );
  },
}));

/* =========================================================
   HEADER
========================================================= */

vi.mock("../../Components/Header", () => ({
  default: (props) => {
    mocks.headerProps = props;

    return <div data-testid="header">Header</div>;
  },
}));

/* =========================================================
   ASSET MOCK
========================================================= */

vi.mock("../../assets/employeeicon.svg", () => ({
  default: "employee-icon.svg",
}));

/* =========================================================
   IMPORT COMPONENT
========================================================= */

import ViewBasicLayout from "../../Pages/employee/layout/ViewLayout";

/* =========================================================
   TEST DATA
========================================================= */

const defaultProps = {
  id: "101",

  handleTabNavigation: vi.fn(),

  departmentList: [
    {
      id: 1,
      name: "HR",
    },
    {
      id: 2,
      name: "Finance",
    },
  ],

  handleSubmit: vi.fn(),

  formData: {
    id: "101",
    first_name: "John",
    last_name: "Doe",
  },

  handleChange: vi.fn(),

  handleImageChange: vi.fn(),

  isIndianCompany: true,
};

/* =========================================================
   HELPER
========================================================= */

const renderComponent = (props = {}) => {
  return render(
    <ViewBasicLayout {...defaultProps} {...props}>
      <div data-testid="test-child">Test Child Content</div>
    </ViewBasicLayout>,
  );
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  mocks.useLocation.mockReturnValue({
    pathname: "/ViewBasic/101",
  });

  mocks.employeeTitleProps = null;
  mocks.headerProps = null;
});

/* =========================================================
   CLEANUP
========================================================= */

afterEach(() => {
  cleanup();

  vi.clearAllMocks();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("ViewBasicLayout Component", () => {
  /* =======================================================
     1. BASIC RENDER
  ======================================================= */

  it("renders the ViewBasicLayout component", () => {
    renderComponent();

    expect(screen.getByTestId("container")).toBeInTheDocument();

    expect(screen.getByTestId("top-section")).toBeInTheDocument();

    expect(screen.getByTestId("form-section")).toBeInTheDocument();
  });

  /* =======================================================
     2. RENDERS CHILDREN
  ======================================================= */

  it("renders children inside the form section", () => {
    renderComponent();

    const child = screen.getByTestId("test-child");

    expect(child).toBeInTheDocument();

    expect(child).toHaveTextContent("Test Child Content");

    expect(screen.getByTestId("form-section")).toContainElement(child);
  });

  /* =======================================================
     3. EMPLOYEE TITLE
  ======================================================= */

  it("renders EmployeeTitle", () => {
    renderComponent();

    expect(screen.getByTestId("employee-title")).toBeInTheDocument();
  });

  /* =======================================================
     4. EMPLOYEE TITLE PROPS
  ======================================================= */

  it("passes correct props to EmployeeTitle", () => {
    renderComponent();

    expect(mocks.employeeTitleProps).toEqual(
      expect.objectContaining({
        iconSrc: "employee-icon.svg",
        showAddButton: true,
        showTabs: false,
        showSearch: false,
        showDropdown: false,
        buttonText: "Save",
        showBackArrow: false,
        showReportButton: false,
      }),
    );
  });

  /* =======================================================
     5. EMPLOYEE TITLE HANDLE SUBMIT
  ======================================================= */

  it("passes handleSubmit to EmployeeTitle onAddClick", () => {
    renderComponent();

    expect(mocks.employeeTitleProps.onAddClick).toBe(defaultProps.handleSubmit);
  });

  /* =======================================================
     6. SAVE BUTTON
  ======================================================= */

  it("calls handleSubmit when Save button is clicked", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(defaultProps.handleSubmit).toHaveBeenCalledTimes(1);
  });

  /* =======================================================
     7. HEADER RENDER
  ======================================================= */

  it("renders Header component", () => {
    renderComponent();

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  /* =======================================================
     8. HEADER EMPLOYEE DATA
  ======================================================= */

  it("passes formData to Header as employee", () => {
    renderComponent();

    expect(mocks.headerProps.employee).toBe(defaultProps.formData);
  });

  /* =======================================================
     9. HEADER EDITABLE
  ======================================================= */

  it("passes editable true to Header", () => {
    renderComponent();

    expect(mocks.headerProps.editable).toBe(true);
  });

  /* =======================================================
     10. HEADER HANDLE CHANGE
  ======================================================= */

  it("passes handleChange to Header onChange", () => {
    renderComponent();

    expect(mocks.headerProps.onChange).toBe(defaultProps.handleChange);
  });

  /* =======================================================
     11. HEADER IMAGE CHANGE
  ======================================================= */

  it("passes handleImageChange to Header", () => {
    renderComponent();

    expect(mocks.headerProps.onImageChange).toBe(
      defaultProps.handleImageChange,
    );
  });

  /* =======================================================
     12. BASIC DETAILS TAB
  ======================================================= */

  it("renders Basic Details tab", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Basic Details",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     13. BANK TAB
  ======================================================= */

  it("renders Bank & Payment tab", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Bank & Payment",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     14. DOCUMENTS TAB
  ======================================================= */

  it("renders Documents tab", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Documents",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     15. RENDERS THREE TABS
  ======================================================= */

  it("renders exactly three navigation tabs", () => {
    renderComponent();

    const tabs = screen.getAllByRole("button");

    expect(tabs).toHaveLength(4);

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     16. BASIC DETAILS TAB URL
  ======================================================= */

  it("generates correct Basic Details URL", () => {
    renderComponent();

    const link = screen
      .getByRole("button", {
        name: "Basic Details",
      })
      .closest("a");

    expect(link).toHaveAttribute("href", "/ViewBasic/101");
  });

  /* =======================================================
     17. BANK TAB URL
  ======================================================= */

  it("generates correct Bank & Payment URL", () => {
    renderComponent();

    const link = screen
      .getByRole("button", {
        name: "Bank & Payment",
      })
      .closest("a");

    expect(link).toHaveAttribute("href", "/ViewBasic/101/bank");
  });

  /* =======================================================
     18. DOCUMENTS TAB URL
  ======================================================= */

  it("generates correct Documents URL", () => {
    renderComponent();

    const link = screen
      .getByRole("button", {
        name: "Documents",
      })
      .closest("a");

    expect(link).toHaveAttribute("href", "/ViewBasic/101/documents");
  });

  /* =======================================================
     19. BASIC DETAILS ACTIVE
  ======================================================= */

  it("marks Basic Details tab active on its route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/ViewBasic/101",
    });

    renderComponent();

    expect(screen.getByTestId("tab-basic-details")).toHaveAttribute(
      "data-active",
      "true",
    );

    expect(screen.getByTestId("tab-bank-payment")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-documents")).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  /* =======================================================
     20. BANK ACTIVE
  ======================================================= */

  it("marks Bank & Payment tab active on its route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/ViewBasic/101/bank",
    });

    renderComponent();

    expect(screen.getByTestId("tab-basic-details")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-bank-payment")).toHaveAttribute(
      "data-active",
      "true",
    );

    expect(screen.getByTestId("tab-documents")).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  /* =======================================================
     21. DOCUMENTS ACTIVE
  ======================================================= */

  it("marks Documents tab active on its route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/ViewBasic/101/documents",
    });

    renderComponent();

    expect(screen.getByTestId("tab-basic-details")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-bank-payment")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-documents")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  /* =======================================================
     22. NO TAB ACTIVE ON UNKNOWN ROUTE
  ======================================================= */

  it("does not mark any tab active on an unknown route", () => {
    mocks.useLocation.mockReturnValue({
      pathname: "/some-other-route",
    });

    renderComponent();

    expect(screen.getByTestId("tab-basic-details")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-bank-payment")).toHaveAttribute(
      "data-active",
      "false",
    );

    expect(screen.getByTestId("tab-documents")).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  /* =======================================================
     23. DIFFERENT EMPLOYEE ID
  ======================================================= */

  it("generates tab URLs using the provided employee id", () => {
    renderComponent({
      id: "999",
    });

    expect(
      screen
        .getByRole("button", {
          name: "Basic Details",
        })
        .closest("a"),
    ).toHaveAttribute("href", "/ViewBasic/999");

    expect(
      screen
        .getByRole("button", {
          name: "Bank & Payment",
        })
        .closest("a"),
    ).toHaveAttribute("href", "/ViewBasic/999/bank");

    expect(
      screen
        .getByRole("button", {
          name: "Documents",
        })
        .closest("a"),
    ).toHaveAttribute("href", "/ViewBasic/999/documents");
  });

  /* =======================================================
     24. EMPTY CHILDREN
  ======================================================= */

  it("renders correctly without children", () => {
    render(<ViewBasicLayout {...defaultProps} />);

    expect(screen.getByTestId("form-section")).toBeInTheDocument();
  });

  /* =======================================================
     25. EMPTY DEPARTMENT LIST
  ======================================================= */

  it("renders correctly when departmentList is empty", () => {
    renderComponent({
      departmentList: [],
    });

    expect(screen.getByTestId("employee-title")).toBeInTheDocument();
  });

  /* =======================================================
     26. UNDEFINED DEPARTMENT LIST
  ======================================================= */

  it("renders correctly when departmentList is undefined", () => {
    renderComponent({
      departmentList: undefined,
    });

    expect(screen.getByTestId("employee-title")).toBeInTheDocument();
  });

  /* =======================================================
     27. INDIAN COMPANY PROP
  ======================================================= */

  it("accepts isIndianCompany prop without breaking the layout", () => {
    renderComponent({
      isIndianCompany: false,
    });

    expect(screen.getByTestId("container")).toBeInTheDocument();

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  /* =======================================================
     28. TABS CONTAINER
  ======================================================= */

  it("renders the tabs inside TabsRowContainer", () => {
    renderComponent();

    expect(screen.getByTestId("tabs-row-container")).toContainElement(
      screen.getByTestId("tabs-row"),
    );
  });

  /* =======================================================
     29. FORM SECTION CONTAINS CHILDREN
  ======================================================= */

  it("places children inside FormSection", () => {
    renderComponent();

    const formSection = screen.getByTestId("form-section");

    expect(formSection).toContainElement(screen.getByTestId("test-child"));
  });

  /* =======================================================
     30. TAB LINKS ARE NOT DECORATED
  ======================================================= */

  it("removes text decoration from tab links", () => {
    renderComponent();

    const basicLink = screen
      .getByRole("button", {
        name: "Basic Details",
      })
      .closest("a");

    const bankLink = screen
      .getByRole("button", {
        name: "Bank & Payment",
      })
      .closest("a");

    const documentsLink = screen
      .getByRole("button", {
        name: "Documents",
      })
      .closest("a");

    expect(basicLink).toHaveStyle("text-decoration: none");

    expect(bankLink).toHaveStyle("text-decoration: none");

    expect(documentsLink).toHaveStyle("text-decoration: none");
  });
});

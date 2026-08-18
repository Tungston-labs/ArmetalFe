import React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  fetchEmployeeDashboard: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("../../services/employeeService.js", () => ({
  fetchEmployeeDashboard: mocks.fetchEmployeeDashboard,
}));

vi.mock("../../Pages/employeDashboard/EmployeeDetails.jsx", () => ({
  default: ({ employee }) => (
    <div data-testid="employee-details">
      Employee Details - {employee.name}
    </div>
  ),
}));

vi.mock("../../Pages/employeDashboard/ProgressCard.jsx", () => ({
  default: ({ attendanceGraph }) => (
    <div data-testid="progress-card">
      Progress Card - {Object.keys(attendanceGraph).length} days
    </div>
  ),
}));

vi.mock("../../Pages/employeDashboard/WeeklyTaskGraph.jsx", () => ({
  default: ({ weeklyData }) => (
    <div data-testid="weekly-task-graph">
      Weekly Task Graph - {weeklyData.length} days
    </div>
  ),
}));

/* =========================================================
   IMPORT COMPONENT AFTER MOCKS
========================================================= */

import RightSideModal from "../../Pages/employeDashboard/RightSideModal";

/* =========================================================
   TEST DATA
========================================================= */

const employeeData = {
  name: "John Doe",
  position: "Software Engineer",
  email: "john@example.com",
  employeeId: "EMP12345",

  attendance_graph: {
    Monday: 8,
    Tuesday: 7,
    Wednesday: 9,
    Thursday: 8,
    Friday: 7,
    Saturday: 5,
    Sunday: 0,
  },

  task_graph: {
    Monday: 3,
    Tuesday: 4,
    Wednesday: 2,
    Thursday: 5,
    Friday: 3,
    Saturday: 1,
    Sunday: 0,
  },
};

describe("RightSideModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* =========================================================
     1. CLOSED STATE
  ========================================================= */

  it("does not render when isOpen is false", () => {
    render(
      <RightSideModal
        isOpen={false}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    expect(
      screen.queryByText("← Back")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Edit")
    ).not.toBeInTheDocument();

    expect(
      mocks.fetchEmployeeDashboard
    ).not.toHaveBeenCalled();
  });

  /* =========================================================
     2. OPEN STATE
  ========================================================= */

  it("renders the modal when isOpen is true", () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    expect(
      screen.getByText("← Back")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Edit")
    ).toBeInTheDocument();
  });

  /* =========================================================
     3. API CALL
  ========================================================= */

  it("fetches employee dashboard data when modal is opened", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    await waitFor(() => {
      expect(
        mocks.fetchEmployeeDashboard
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      mocks.fetchEmployeeDashboard
    ).toHaveBeenCalledWith("EMP12345");
  });

  /* =========================================================
     4. LOADING STATE
  ========================================================= */

  it("displays Loading while employee data is being fetched", () => {
    mocks.fetchEmployeeDashboard.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  /* =========================================================
     5. EMPLOYEE DATA
  ========================================================= */

  it("renders employee details after successful API response", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("employee-details")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Employee Details - John Doe")
    ).toBeInTheDocument();
  });

  /* =========================================================
     6. PROGRESS CARD
  ========================================================= */

  it("renders ProgressCard with attendance graph data", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("progress-card")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Progress Card - 7 days")
    ).toBeInTheDocument();
  });

  /* =========================================================
     7. WEEKLY TASK GRAPH
  ========================================================= */

  it("renders WeeklyTaskGraph with task graph data", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("weekly-task-graph")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Weekly Task Graph - 7 days")
    ).toBeInTheDocument();
  });

  /* =========================================================
     8. CLOSE BUTTON
  ========================================================= */

  it("calls onClose when Back button is clicked", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    const onClose = vi.fn();

    render(
      <RightSideModal
        isOpen={true}
        onClose={onClose}
        employeeId="EMP12345"
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /back/i,
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* =========================================================
     9. EDIT BUTTON
  ========================================================= */

  it("navigates to employee edit page when Edit is clicked", async () => {
    mocks.fetchEmployeeDashboard.mockResolvedValue(employeeData);

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    expect(
      mocks.navigate
    ).toHaveBeenCalledTimes(1);

    expect(
      mocks.navigate
    ).toHaveBeenCalledWith("/ViewBasic/EMP12345");
  });

  /* =========================================================
     10. NO EMPLOYEE ID
  ========================================================= */

  it("does not fetch data when employeeId is missing", () => {
    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(
      mocks.fetchEmployeeDashboard
    ).not.toHaveBeenCalled();
  });

  /* =========================================================
     11. ERROR HANDLING
  ========================================================= */

  it("handles API error without crashing", async () => {
    mocks.fetchEmployeeDashboard.mockRejectedValue(
      new Error("API Error")
    );

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    await waitFor(() => {
      expect(
        mocks.fetchEmployeeDashboard
      ).toHaveBeenCalledWith("EMP12345");
    });

    expect(
      screen.getByText("← Back")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Employee Details - John Doe")
    ).not.toBeInTheDocument();
  });

  /* =========================================================
     12. MODAL OPEN WITHOUT DATA
  ========================================================= */

  it("renders modal content but not employee sections before data loads", () => {
    mocks.fetchEmployeeDashboard.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <RightSideModal
        isOpen={true}
        onClose={vi.fn()}
        employeeId="EMP12345"
      />
    );

    expect(
      screen.getByText("← Back")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Edit")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("employee-details")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("progress-card")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("weekly-task-graph")
    ).not.toBeInTheDocument();
  });
});
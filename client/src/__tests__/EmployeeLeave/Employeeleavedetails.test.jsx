import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import EmployeeLeaveForm from "./EmployeeLeaveDetails"; // adjust path/filename to match your project
import * as leaveSlice from "../../Redux/leaveSlice";

// ---- Mocks ----
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../Redux/leaveSlice", () => ({
  getLeaveDetails: jest.fn(() => ({ type: "leave/getLeaveDetails" })),
  patchLeaveStatus: jest.fn(() => ({ type: "leave/patchLeaveStatus" })),
}));

jest.mock("../../Components/Loader", () => () => <div>Loading...</div>);
jest.mock("../../Components/Header", () => (props) => (
  <div data-testid="employee-header">{props.employee?.name || "No Employee"}</div>
));
jest.mock("../../Components/EmployeeTitle", () => () => <div>Title Bar</div>);
jest.mock("../../Components/ConfirmLeaveModal", () => (props) =>
  props.show ? (
    <div data-testid="confirm-modal">
      actionType:{props.actionType} leaveId:{props.leaveId}
      <button onClick={props.onConfirm}>Confirm</button>
      <button onClick={props.onClose}>Cancel</button>
    </div>
  ) : null
);

const leaveDetails = {
  leave_type: "Sick Leave",
  from_date: "2026-08-01",
  to_date: "2026-08-03",
  from_date_type: "Full Day",
  to_date_type: "Half Day",
  reason: "Fever and cold",
  employee: {
    name: "John Smith",
    designation: "Technician",
    employment_type: "Full-Time",
    department: "Field Ops",
    joining_date: "2022-01-15",
    total_leave: 12,
    paid_leave: 8,
  },
};

function renderWithProviders({
  leaveDetailsState = leaveDetails,
  loading = false,
  route = "/employee-leave-request/7",
} = {}) {
  const store = configureStore({
    reducer: {
      leave: (state = { leaveDetails: leaveDetailsState, loading }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/employee-leave-request/:id" element={<EmployeeLeaveForm />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("EmployeeLeaveForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches getLeaveDetails with the route id on mount", () => {
    renderWithProviders();
    expect(leaveSlice.getLeaveDetails).toHaveBeenCalledWith("7");
  });

  test("shows loader while loading and does not render the page content", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Job Details")).not.toBeInTheDocument();
  });

  test("renders the employee header", () => {
    renderWithProviders();
    expect(screen.getByTestId("employee-header")).toHaveTextContent("John Smith");
  });

  test("section content is collapsed by default", () => {
    renderWithProviders();
    expect(screen.getByText("Job Details")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Technician")).not.toBeInTheDocument();
  });

  test("expanding Job Details shows formatted job fields", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Job Details"));

    expect(screen.getByDisplayValue("Technician")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Full-Time")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Field Ops")).toBeInTheDocument();
    expect(screen.getByDisplayValue("15/Jan/2022")).toBeInTheDocument();
  });

  test("collapsing Job Details again hides the fields", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Job Details"));
    expect(screen.getByDisplayValue("Technician")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Job Details"));
    expect(screen.queryByDisplayValue("Technician")).not.toBeInTheDocument();
  });

  test("expanding Leave Application shows leave type and formatted from/to dates with type labels", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Leave Application"));

    expect(screen.getByDisplayValue("Sick Leave")).toBeInTheDocument();
    expect(screen.getByDisplayValue("01/Aug/2026 (Full Day)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("03/Aug/2026 (Half Day)")).toBeInTheDocument();
  });

  test("expanding Leave Balance shows total and paid leave", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Leave Balance"));

    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8")).toBeInTheDocument();
  });

  test("expanding Reason shows the provided reason text", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Reason for Leave"));
    expect(screen.getByText("Fever and cold")).toBeInTheDocument();
  });

  test("shows fallback text when no reason is provided", () => {
    renderWithProviders({
      leaveDetailsState: { ...leaveDetails, reason: "" },
    });
    fireEvent.click(screen.getByText("Reason for Leave"));
    expect(screen.getByText("No reason provided")).toBeInTheDocument();
  });

  test("handles missing leaveDetails gracefully without crashing", () => {
    renderWithProviders({ leaveDetailsState: null });
    expect(screen.getByTestId("employee-header")).toHaveTextContent("No Employee");
    fireEvent.click(screen.getByText("Job Details"));
    // Readonly inputs should render with empty values rather than throwing
    expect(screen.getByText("Job Details")).toBeInTheDocument();
  });

  test("clicking Decline opens the confirm modal with actionType 'reject'", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Decline"));

    const modal = screen.getByTestId("confirm-modal");
    expect(modal).toHaveTextContent("actionType:reject");
    expect(modal).toHaveTextContent("leaveId:7");
  });

  test("clicking Approve opens the confirm modal with actionType 'approve'", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Approve"));

    const modal = screen.getByTestId("confirm-modal");
    expect(modal).toHaveTextContent("actionType:approve");
  });

  test("closing the modal without confirming hides it and does not dispatch a status update", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    expect(leaveSlice.patchLeaveStatus).not.toHaveBeenCalled();
  });

  test("confirming approval dispatches patchLeaveStatus with 'approved' and navigates away", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(leaveSlice.patchLeaveStatus).toHaveBeenCalledWith({
        leaveId: "7",
        status: "approved",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/employee-leave-request");
    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });

  test("confirming decline dispatches patchLeaveStatus with 'rejected'", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Decline"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(leaveSlice.patchLeaveStatus).toHaveBeenCalledWith({
        leaveId: "7",
        status: "rejected",
      })
    );
  });

  test("closes the modal and resets action type even if the dispatch throws", async () => {
    leaveSlice.patchLeaveStatus.mockImplementationOnce(() => {
      throw new Error("network error");
    });
    renderWithProviders();
    fireEvent.click(screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument());
  });
});
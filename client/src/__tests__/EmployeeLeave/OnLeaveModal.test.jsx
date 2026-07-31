import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import OnLeaveModal from "../../Pages/leaveDetails/ModalList";
import API from "../../services/api";
import { patchLeaveStatus } from "../../Redux/leaveSlice";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("../../Redux/leaveSlice", () => ({
  patchLeaveStatus: vi.fn((payload) => ({ type: "leave/patchLeaveStatus", payload })),
}));

vi.mock("../../Components/ConfirmLeaveModal", () => ({
  default: (props) => (
    <div data-testid="confirm-leave-modal">
      <span>{props.actionType}</span>
      <button onClick={props.onConfirm}>Confirm</button>
      <button onClick={props.onClose}>Cancel</button>
    </div>
  ),
}));

describe("OnLeaveModal", () => {
  const mockDispatch = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test("does not fetch when employeeId or date is missing", () => {
    render(<OnLeaveModal onClose={onClose} employeeId={null} date="2026-01-15" />);
    expect(API.get).not.toHaveBeenCalled();
  });

  test("does not fetch when date is missing", () => {
    render(<OnLeaveModal onClose={onClose} employeeId={5} date={null} />);
    expect(API.get).not.toHaveBeenCalled();
  });

  test("fetches on-leave employees for the given employeeId and date", async () => {
    API.get.mockResolvedValueOnce({ data: { on_leave: [] } });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith("/department/5/on-leaves/?date=2026-01-15");
    });
  });

  test("shows a loading row while the request is in flight", () => {
    API.get.mockReturnValueOnce(new Promise(() => {}));
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  test("shows 'No leave record found.' when the response list is empty", async () => {
    API.get.mockResolvedValueOnce({ data: { on_leave: [] } });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText(/no leave record found/i)).toBeInTheDocument();
    });
  });

  test("defaults to an empty list when on_leave is missing from the response", async () => {
    API.get.mockResolvedValueOnce({ data: {} });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText(/no leave record found/i)).toBeInTheDocument();
    });
  });

  test("shows 'No leave record found.' if the fetch fails", async () => {
    API.get.mockRejectedValueOnce(new Error("network error"));
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText(/no leave record found/i)).toBeInTheDocument();
    });
  });

  test("renders each employee row with formatted dates and details", async () => {
    API.get.mockResolvedValueOnce({
      data: {
        on_leave: [
          {
            employee_name: "Jane Doe",
            leave_type: "Sick Leave",
            email: "jane@example.com",
            phone: "9876543210",
            from_date: "2026-01-10",
            from_date_type: "Full Day",
            to_date: "2026-01-12",
            to_date_type: "Half Day",
          },
        ],
      },
    });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
    expect(screen.getByText("Sick Leave")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(
      screen.getByText(/10\/01\/2026 \(Full Day\) To 12\/01\/2026 \(Half Day\)/)
    ).toBeInTheDocument();
  });

  test("renders multiple rows for multiple employees", async () => {
    API.get.mockResolvedValueOnce({
      data: {
        on_leave: [
          { employee_name: "Employee One", leave_type: "Sick", email: "a@x.com", phone: "1", from_date: "2026-01-01", to_date: "2026-01-02" },
          { employee_name: "Employee Two", leave_type: "Casual", email: "b@x.com", phone: "2", from_date: "2026-01-03", to_date: "2026-01-04" },
        ],
      },
    });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText("Employee One")).toBeInTheDocument();
    });
    expect(screen.getByText("Employee Two")).toBeInTheDocument();
  });

  test("clicking Close calls onClose", async () => {
    API.get.mockResolvedValueOnce({ data: { on_leave: [] } });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText(/no leave record found/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not render ConfirmLeaveModal by default", async () => {
    API.get.mockResolvedValueOnce({ data: { on_leave: [] } });
    render(<OnLeaveModal onClose={onClose} employeeId={5} date="2026-01-15" />);
    await waitFor(() => {
      expect(screen.getByText(/no leave record found/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("confirm-leave-modal")).not.toBeInTheDocument();
  });
});
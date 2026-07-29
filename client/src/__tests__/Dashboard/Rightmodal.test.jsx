// src/Components/homepage/RightModal.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// Child widgets (AttendanceCircle, SingleHolidayCalendar, Notifications,
// EditProfileModal, ChangePasswordModal) are mocked so this file only
// verifies RightModal's own logic: data fetching on open, loading/empty
// states, the two nested modals, and the logout confirmation dialog.

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import RightModal from "../../../Components/homepage/RightModal";
import { useLogout } from "../../../services/logout";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../../services/logout", () => ({
  useLogout: jest.fn(),
}));

jest.mock("../../../Redux/dashboardSlice", () => ({
  getHolidaySummary: () => ({ type: "getHolidaySummary" }),
  getTodayEmployeeStats: () => ({ type: "getTodayEmployeeStats" }),
  getSimpleNotifications: () => ({ type: "getSimpleNotifications" }),
}));

jest.mock("../../../Components/homepage/AttendanceCircle", () => (props) => (
  <div data-testid="attendance-circle">{JSON.stringify(props)}</div>
));
jest.mock("../../../Components/homepage/SingleHolidayCalendar.jsx", () => (props) => (
  <div data-testid="holiday-calendar">{JSON.stringify(props)}</div>
));
jest.mock("../../../Components/homepage/Notifications", () => (props) => (
  <div data-testid="notifications">{JSON.stringify(props)}</div>
));
jest.mock("../../../Components/homepage/EditProfileModal.jsx", () => (props) => (
  <div data-testid="edit-profile-modal">{JSON.stringify(props)}</div>
));
jest.mock("../../../Components/ChangePasswordModal/ChangePasswordModal.jsx", () => ({ onClose }) => (
  <div data-testid="change-password-modal">
    <button onClick={onClose}>close-password-modal</button>
  </div>
));

const mockDispatch = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);
const mockOnClose = jest.fn();

const notLoading = { notifications: false, todayStats: false, holidaySummary: false };

const baseDashboardState = {
  notifications: { notifications: [{ id: 1, text: "Welcome!" }] },
  todayStats: { present_percentage: 80, leave_percentage: 20 },
  holidaySummary: { all_holidays: { list: [{ date: "2026-01-26" }] } },
  loading: notLoading,
};

beforeEach(() => {
  jest.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  useLogout.mockReturnValue(mockLogout);
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({ dashboard: baseDashboardState })
  );
});

describe("RightModal", () => {
  test("dispatches notification/attendance/holiday fetches only while open", () => {
    const { rerender } = render(<RightModal open={false} onClose={mockOnClose} />);
    expect(mockDispatch).not.toHaveBeenCalled();

    rerender(<RightModal open={true} onClose={mockOnClose} />);
    const types = mockDispatch.mock.calls.map((c) => c[0].type);
    expect(types).toEqual(
      expect.arrayContaining([
        "getSimpleNotifications",
        "getTodayEmployeeStats",
        "getHolidaySummary",
      ])
    );
  });

  test("applies the 'open' class only when open is true", () => {
    const { container, rerender } = render(
      <RightModal open={false} onClose={mockOnClose} />
    );
    expect(container.querySelector(".open")).not.toBeInTheDocument();

    rerender(<RightModal open={true} onClose={mockOnClose} />);
    expect(container.querySelector(".open")).toBeInTheDocument();
  });

  test("calls onClose when either close icon is clicked", async () => {
    const user = userEvent.setup();
    render(<RightModal open={true} onClose={mockOnClose} />);

    const closeIcons = screen.getAllByText("×");
    await user.click(closeIcons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("shows loading text for notifications, attendance, and holidays independently", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dashboard: {
          ...baseDashboardState,
          loading: { notifications: true, todayStats: true, holidaySummary: true },
        },
      })
    );
    render(<RightModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
    expect(screen.getByText("Loading attendance...")).toBeInTheDocument();
    expect(screen.getByText("Loading holidays...")).toBeInTheDocument();
  });

  test("renders the real widgets once their loading flags are false", () => {
    render(<RightModal open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("notifications")).toBeInTheDocument();
    expect(screen.getByTestId("attendance-circle")).toBeInTheDocument();
    expect(screen.getByTestId("holiday-calendar")).toBeInTheDocument();
  });

  test("shows 'No stats found' when todayStats is falsy and not loading", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dashboard: { ...baseDashboardState, todayStats: null },
      })
    );
    render(<RightModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("No stats found")).toBeInTheDocument();
  });

  test("shows 'No holidays found' when holidaySummary is falsy and not loading", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dashboard: { ...baseDashboardState, holidaySummary: null },
      })
    );
    render(<RightModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("No holidays found")).toBeInTheDocument();
  });

  test("clicking Edit Profile opens the profile modal in add-mode reset state", async () => {
    const user = userEvent.setup();
    render(<RightModal open={true} onClose={mockOnClose} />);

    await user.click(screen.getByText("Edit Profile"));

    const modal = screen.getByTestId("edit-profile-modal");
    const props = JSON.parse(modal.textContent);
    expect(props.isEdit).toBe(true);
    expect(props.selectedCompany).toBeNull();
  });

  test("clicking Change Password opens the ChangePasswordModal, which can close itself", async () => {
    const user = userEvent.setup();
    render(<RightModal open={true} onClose={mockOnClose} />);

    await user.click(screen.getByText("Change Password"));
    expect(screen.getByTestId("change-password-modal")).toBeInTheDocument();

    await user.click(screen.getByText("close-password-modal"));
    expect(screen.queryByTestId("change-password-modal")).not.toBeInTheDocument();
  });

  test("logout: confirming the SweetAlert dialog logs the user out and closes the panel", async () => {
    const user = userEvent.setup();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(<RightModal open={true} onClose={mockOnClose} />);
    await user.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test("logout: cancelling the SweetAlert dialog does not log out or close the panel", async () => {
    const user = userEvent.setup();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(<RightModal open={true} onClose={mockOnClose} />);
    await user.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledTimes(1);
    });
    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});



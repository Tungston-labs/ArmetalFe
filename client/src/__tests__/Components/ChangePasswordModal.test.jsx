import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  apiPost: vi.fn(),
  swalFire: vi.fn(),
}));

/* =========================================================
   API MOCK
========================================================= */

vi.mock("../../services/api.js", () => ({
  default: {
    post: mocks.apiPost,
  },
}));

/* =========================================================
   SWEETALERT MOCK
========================================================= */

vi.mock("sweetalert2", () => ({
  default: {
    fire: mocks.swalFire,
  },
}));

/* =========================================================
   ICON MOCK
========================================================= */

vi.mock("react-icons/fi", () => ({
  FiEye: () => <span data-testid="eye-icon">Eye</span>,
  FiEyeOff: () => <span data-testid="eye-off-icon">Eye Off</span>,
}));

/* =========================================================
   COMPONENT
========================================================= */

import ChangePasswordModal from "../../Components/ChangePasswordModal/ChangePasswordModal";

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.apiPost.mockResolvedValue({
    data: {
      success: true,
    },
  });
});

afterEach(() => {
  cleanup();
});

/* =========================================================
   TESTS
========================================================= */

describe("ChangePasswordModal Component", () => {
  it("renders the modal correctly", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    expect(screen.getByText("Change Password")).toBeInTheDocument();

    expect(screen.getByText("Old Password")).toBeInTheDocument();

    expect(screen.getByText("New Password")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter old password"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter new password"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("renders both password fields as password type initially", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    expect(oldPassword).toHaveAttribute("type", "password");

    expect(newPassword).toHaveAttribute("type", "password");
  });

  it("updates old password field", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    expect(oldPassword).toHaveValue("oldPassword123");
  });

  it("updates new password field", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(newPassword, {
      target: {
        value: "newPassword123",
      },
    });

    expect(newPassword).toHaveValue("newPassword123");
  });

  it("shows warning when both password fields are empty", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "warning",
        text: "Both fields are required",
      });
    });

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });

  it("shows warning when old password is empty", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(newPassword, {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "warning",
        text: "Both fields are required",
      });
    });

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });

  it("shows warning when new password is empty", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "warning",
        text: "Both fields are required",
      });
    });

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });

  it("shows warning when new password has less than 6 characters", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(newPassword, {
      target: {
        value: "12345",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "warning",
        text: "Password must be at least 6 characters",
      });
    });

    expect(mocks.apiPost).not.toHaveBeenCalled();
  });

  it("does not show short password warning when password has exactly 6 characters", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(newPassword, {
      target: {
        value: "123456",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalled();
    });
  });

  it("calls API with correct password data", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(newPassword, {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledWith("/change-password/", {
        old_password: "oldPassword123",
        new_password: "newPassword123",
      });
    });
  });

  it("shows success alert and closes modal after successful password update", async () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(newPassword, {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully",
      });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows Updating text while API request is pending", async () => {
    const onClose = vi.fn();

    let resolveRequest;

    mocks.apiPost.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    const newPassword = screen.getByPlaceholderText("Enter new password");

    fireEvent.change(oldPassword, {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(newPassword, {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    expect(
      await screen.findByRole("button", {
        name: "Updating...",
      }),
    ).toBeDisabled();

    resolveRequest({
      data: {
        success: true,
      },
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows API error message from response.error", async () => {
    const onClose = vi.fn();

    mocks.apiPost.mockRejectedValueOnce({
      response: {
        data: {
          error: "Old password is incorrect",
        },
      },
    });

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter old password"), {
      target: {
        value: "wrongPassword",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "error",
        title: "Update Failed",
        text: "Old password is incorrect",
      });
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows API detail error when response.error is unavailable", async () => {
    const onClose = vi.fn();

    mocks.apiPost.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Invalid password",
        },
      },
    });

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter old password"), {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "error",
        title: "Update Failed",
        text: "Invalid password",
      });
    });
  });

  it("shows default error when API provides no error or detail", async () => {
    const onClose = vi.fn();

    mocks.apiPost.mockRejectedValueOnce({
      response: {
        data: {},
      },
    });

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter old password"), {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "error",
        title: "Update Failed",
        text: "Failed to change password",
      });
    });
  });

  it("handles API error without response object", async () => {
    const onClose = vi.fn();

    mocks.apiPost.mockRejectedValueOnce(new Error("Network Error"));

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter old password"), {
      target: {
        value: "oldPassword123",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: {
        value: "newPassword123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        icon: "error",
        title: "Update Failed",
        text: "Failed to change password",
      });
    });
  });

  it("toggles old password visibility", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const oldPassword = screen.getByPlaceholderText("Enter old password");

    expect(oldPassword).toHaveAttribute("type", "password");

    const eyeIcons = screen.getAllByTestId("eye-icon");

    fireEvent.click(eyeIcons[0]);

    expect(oldPassword).toHaveAttribute("type", "text");

    expect(screen.getAllByTestId("eye-off-icon")).toHaveLength(1);

    fireEvent.click(screen.getAllByTestId("eye-off-icon")[0]);

    expect(oldPassword).toHaveAttribute("type", "password");
  });

  it("toggles new password visibility", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    const newPassword = screen.getByPlaceholderText("Enter new password");

    expect(newPassword).toHaveAttribute("type", "password");

    const eyeIcons = screen.getAllByTestId("eye-icon");

    fireEvent.click(eyeIcons[1]);

    expect(newPassword).toHaveAttribute("type", "text");

    expect(screen.getAllByTestId("eye-off-icon")).toHaveLength(1);

    fireEvent.click(screen.getAllByTestId("eye-off-icon")[0]);

    expect(newPassword).toHaveAttribute("type", "password");
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();

    const { container } = render(<ChangePasswordModal onClose={onClose} />);

    const overlay = container.firstChild;

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when modal content is clicked", () => {
    const onClose = vi.fn();

    render(<ChangePasswordModal onClose={onClose} />);

    fireEvent.click(screen.getByText("Change Password"));

    expect(onClose).not.toHaveBeenCalled();
  });
});

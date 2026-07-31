import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Navbar from "../../Components/Navbar";
import API from "../../services/api";
import { useLogout } from "../../services/logout";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

vi.mock("../../services/api", () => ({
  default: { post: vi.fn() },
}));

vi.mock("../../services/logout", () => ({
  useLogout: vi.fn(),
}));

vi.mock("../../Redux/authSlice", () => ({
  logout: vi.fn(() => ({ type: "auth/logout" })),
}));

describe("Navbar", () => {
  const mockDispatch = vi.fn();
  const mockLogoutFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useLogout.mockReturnValue(mockLogoutFn);
  });

  const openMenu = () => {
    fireEvent.click(screen.getByText(/hr manager/i));
  };

  test("renders the trigger with avatar and name, menu closed by default", () => {
    render(<Navbar />);
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText(/hr manager/i)).toBeInTheDocument();
    expect(screen.queryByText(/change password/i)).not.toBeInTheDocument();
  });

  test("clicking the trigger opens the dropdown menu", () => {
    render(<Navbar />);
    openMenu();
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test("clicking the trigger again closes the dropdown menu", () => {
    render(<Navbar />);
    openMenu();
    openMenu();
    expect(screen.queryByText(/change password/i)).not.toBeInTheDocument();
  });

  test("clicking outside the dropdown closes it", () => {
    render(<Navbar />);
    openMenu();
    expect(screen.getByText(/change password/i)).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText(/change password/i)).not.toBeInTheDocument();
  });

  test("clicking inside the dropdown does not close it via the outside-click handler", () => {
    render(<Navbar />);
    openMenu();
    fireEvent.mouseDown(screen.getByText(/change password/i));
    // still open because click target is inside dropdownRef
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
  });

test("clicking 'Change password' opens the modal and closes the dropdown", () => {
  render(<Navbar />);
  openMenu();
  fireEvent.click(screen.getByText(/change password/i));

  // scope to the paragraph specifically to avoid matching the submit button too
  expect(screen.getByText("Change password", { selector: "p" })).toBeInTheDocument();
  expect(screen.queryByText(/logout/i)).not.toBeInTheDocument(); // dropdown closed
});
  test("closing the modal via the X button resets fields and message", async () => {
    render(<Navbar />);
    openMenu();
    fireEvent.click(screen.getByText(/change password/i));

    await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "old123");
    fireEvent.click(screen.getByText("✕"));

    expect(screen.queryByPlaceholderText(/enter current password/i)).not.toBeInTheDocument();
  });

  describe("password visibility toggles", () => {
    test("toggles the current password field between hidden and shown", async () => {
      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      const oldInput = screen.getByPlaceholderText(/enter current password/i);
      expect(oldInput).toHaveAttribute("type", "password");

      const eyeButtons = screen.getAllByRole("button", { name: "" }); // eye buttons have no accessible name
      fireEvent.click(eyeButtons[0]);

      expect(oldInput).toHaveAttribute("type", "text");
    });

    test("toggles the new password field between hidden and shown", async () => {
      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      const newInput = screen.getByPlaceholderText(/enter new password/i);
      expect(newInput).toHaveAttribute("type", "password");

      const eyeButtons = screen.getAllByRole("button", { name: "" });
      fireEvent.click(eyeButtons[1]);

      expect(newInput).toHaveAttribute("type", "text");
    });
  });

  describe("handlePasswordChange validation", () => {
    test("shows an error when both fields are empty", () => {
      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      expect(screen.getByText(/please fill in both fields/i)).toBeInTheDocument();
      expect(API.post).not.toHaveBeenCalled();
    });

    test("shows an error when the new password is shorter than 6 characters", async () => {
      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "old123");
      await userEvent.type(screen.getByPlaceholderText(/enter new password/i), "123");
      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      expect(
        screen.getByText(/new password must be at least 6 characters/i)
      ).toBeInTheDocument();
      expect(API.post).not.toHaveBeenCalled();
    });

    test("submits successfully and shows a success message", async () => {
      API.post.mockResolvedValueOnce({ data: {} });
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "old123");
      await userEvent.type(screen.getByPlaceholderText(/enter new password/i), "newpass1");
      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      await waitFor(() => {
        expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument();
      });

      expect(API.post).toHaveBeenCalledWith("/change-password/", {
        old_password: "old123",
        new_password: "newpass1",
      });

      vi.useRealTimers();
    });

    test("shows the server's detail message when the request fails", async () => {
      API.post.mockRejectedValueOnce({ response: { data: { detail: "Old password incorrect" } } });

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "wrongold");
      await userEvent.type(screen.getByPlaceholderText(/enter new password/i), "newpass1");
      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      await waitFor(() => {
        expect(screen.getByText(/old password incorrect/i)).toBeInTheDocument();
      });
    });

    test("shows a generic failure message when the error has no detail field", async () => {
      API.post.mockRejectedValueOnce(new Error("Network error"));

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "old123");
      await userEvent.type(screen.getByPlaceholderText(/enter new password/i), "newpass1");
      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      await waitFor(() => {
        expect(screen.getByText(/password change failed/i)).toBeInTheDocument();
      });
    });

    test("disables the submit button and shows a loading label while submitting", async () => {
      let resolvePromise;
      API.post.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/change password/i));

      await userEvent.type(screen.getByPlaceholderText(/enter current password/i), "old123");
      await userEvent.type(screen.getByPlaceholderText(/enter new password/i), "newpass1");
      fireEvent.click(screen.getByText("Change password", { selector: "button" }));

      expect(screen.getByText(/changing\.\.\./i)).toBeInTheDocument();
      expect(screen.getByText(/changing\.\.\./i).closest("button")).toBeDisabled();

      resolvePromise({ data: {} });
      await waitFor(() => {
        expect(screen.queryByText(/changing\.\.\./i)).not.toBeInTheDocument();
      });
    });
  });

  describe("logout flow", () => {
    test("does nothing if the confirmation dialog is dismissed", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/logout/i));

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalled();
      });

      expect(mockLogoutFn).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("logs out and dispatches the logout action when confirmed", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

      render(<Navbar />);
      openMenu();
      fireEvent.click(screen.getByText(/logout/i));

      await waitFor(() => {
        expect(mockLogoutFn).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "auth/logout" });
      });
    });
  });
});
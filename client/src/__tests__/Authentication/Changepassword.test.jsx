import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";
import { vi } from "vitest";

import ChangePasswordPage from "../../Pages/login/NewPassword";

// -------------------- Mocks --------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("axios");

vi.mock("../../services/api", () => ({
  BASE_URL: "https://api.example.com",
}));

// -------------------- Render Helper --------------------
function renderPage(email) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/new-password",
          state: email ? { email } : undefined,
        },
      ]}
    >
      <Routes>
        <Route path="/new-password" element={<ChangePasswordPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ChangePasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("displays the email address being reset", () => {
    renderPage("jane@example.com");

    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  test("shows an error immediately when no email is present in navigation state", () => {
    renderPage(undefined);

    expect(
      screen.getByText("Email not found. Please restart the reset process.")
    ).toBeInTheDocument();
  });

  test("password fields are masked by default", () => {
    renderPage("jane@example.com");

    expect(
      screen.getByPlaceholderText("New password")
    ).toHaveAttribute("type", "password");

    expect(
      screen.getByPlaceholderText("Confirm password")
    ).toHaveAttribute("type", "password");
  });

  test("toggling the eye icon reveals the new password field", () => {
    renderPage("jane@example.com");

    const newPasswordInput =
      screen.getByPlaceholderText("New password");

    const newPasswordEye =
      screen.getByTestId("toggle-password");

    expect(newPasswordInput).toHaveAttribute(
      "type",
      "password"
    );

    fireEvent.click(newPasswordEye);

    expect(newPasswordInput).toHaveAttribute(
      "type",
      "text"
    );

    fireEvent.click(newPasswordEye);

    expect(newPasswordInput).toHaveAttribute(
      "type",
      "password"
    );
  });

  test("toggling the confirm password eye reveals only the confirm password", () => {
    renderPage("jane@example.com");

    const confirmInput =
      screen.getByPlaceholderText("Confirm password");

    const confirmEye =
      screen.getByTestId("toggle-confirm-password");

    fireEvent.click(confirmEye);

    expect(confirmInput).toHaveAttribute(
      "type",
      "text"
    );

    expect(
      screen.getByPlaceholderText("New password")
    ).toHaveAttribute("type", "password");
  });

  test("typing updates the password fields", () => {
    renderPage("jane@example.com");

    const newPassword =
      screen.getByPlaceholderText("New password");

    const confirmPassword =
      screen.getByPlaceholderText("Confirm password");

    fireEvent.change(newPassword, {
      target: { value: "Secret123!" },
    });

    fireEvent.change(confirmPassword, {
      target: { value: "Secret123!" },
    });

    expect(newPassword).toHaveValue("Secret123!");
    expect(confirmPassword).toHaveValue("Secret123!");
  });

  test("submitting with empty fields shows validation error", async () => {
    renderPage("jane@example.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText("Please fill in all fields.")
    ).toBeInTheDocument();

    expect(axios.post).not.toHaveBeenCalled();
  });

  test("submitting with only one field filled shows validation error", async () => {
    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText("Please fill in all fields.")
    ).toBeInTheDocument();

    expect(axios.post).not.toHaveBeenCalled();
  });

  test("submitting mismatched passwords shows error", async () => {
    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: {
          value: "Different123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText("Passwords do not match.")
    ).toBeInTheDocument();

    expect(axios.post).not.toHaveBeenCalled();
  });

  test("submitting matching passwords calls API", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.example.com/api/forgot-password/reset/",
        {
          email: "jane@example.com",
          new_password: "Secret123!",
          confirm_password: "Secret123!",
        }
      )
    );
  });

  test("shows success message and redirects to login", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText(
        "Password changed successfully. Redirecting to login..."
      )
    ).toBeInTheDocument();

    vi.advanceTimersByTime(1500);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/login")
    );
  });

  test("shows server error message", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Reset link has expired.",
        },
      },
    });

    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText("Reset link has expired.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  test("falls back to generic error message", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    renderPage("jane@example.com");

    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: {
          value: "Secret123!",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      })
    );

    expect(
      await screen.findByText("Failed to change password.")
    ).toBeInTheDocument();
  });

  test("clicking the title navigates back", () => {
    renderPage("jane@example.com");

    fireEvent.click(screen.getByText("Set New Password"));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
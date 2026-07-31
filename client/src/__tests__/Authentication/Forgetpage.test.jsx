import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";

import ForgotPasswordPage from "../../Pages/login/ForgetPassword"; // adjust path/filename to match your project

// ---- Mocks ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("axios");

vi.mock("../../Components/Loader", () => ({
  default: ({ text }) => (
    <div data-testid="loader">{text}</div>
  ),
}));

vi.mock("../../services/api", () => ({
  BASE_URL: "https://api.example.com",
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ legacyFakeTimers: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders the email input and submit button", () => {
    renderPage();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByText("Send Reset Link")).toBeInTheDocument();
  });

  test("does not show the loader initially", () => {
    renderPage();
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  test("typing updates the email field value", () => {
    renderPage();
    const input = screen.getByPlaceholderText("Email");
    fireEvent.change(input, { target: { value: "jane@example.com" } });
    expect(input).toHaveValue("jane@example.com");
  });

  test("submitting calls the forgot-password endpoint with the entered email", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.example.com/api/forgot-password/send-otp/",
        { email: "jane@example.com" }
      )
    );
  });

  test("shows the loader while the request is in flight", async () => {
    let resolvePromise;
    axios.post.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    expect(await screen.findByTestId("loader")).toHaveTextContent("Sending OTP...");

    resolvePromise({ data: {} });
    await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());
  });

  test("shows a success message on successful submission", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    expect(
      await screen.findByText("OTP sent to your email successfully.")
    ).toBeInTheDocument();
  });

  test("navigates to /verification with the email in state 1 second after success", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    await screen.findByText("OTP sent to your email successfully.");
    expect(mockNavigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/verification", {
        state: { email: "jane@example.com" },
      })
    );
  });

  test("shows the server-provided error message when the request fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "No account found with that email." } },
    });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    expect(
      await screen.findByText("No account found with that email.")
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("falls back to a generic error message when the server provides no detail", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    expect(
      await screen.findByText("Failed to send OTP. Please try again.")
    ).toBeInTheDocument();
  });

  test("hides the loader again after a failed submission", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));

    await screen.findByText("Failed to send OTP. Please try again.");
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  test("clears a previous error message on a fresh submit attempt", async () => {
    axios.post.mockRejectedValueOnce(new Error("first failure"));
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Link"));
    await screen.findByText("Failed to send OTP. Please try again.");

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() =>
      expect(
        screen.queryByText("Failed to send OTP. Please try again.")
      ).not.toBeInTheDocument()
    );
    expect(
      await screen.findByText("OTP sent to your email successfully.")
    ).toBeInTheDocument();
  });

  test("clicking the back arrow navigates back in history", () => {
    renderPage();
    const backArrow = document.querySelector("svg");
    fireEvent.click(backArrow);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
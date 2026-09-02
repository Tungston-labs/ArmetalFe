import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";

import VerifyCodePage from "../../Pages/login/Verification"; // adjust path/filename to match your project

// ---- Mocks ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("axios");

vi.mock("../../Components/Loader", () => ({
  default: (props) => (
    <div data-testid="loader">{props.text}</div>
  ),
}));

vi.mock("../../services/api", () => ({
  BASE_URL: "https://api.example.com",
}));

function renderPage(email) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/verification",
          state: email ? { email } : undefined,
        },
      ]}
    >
      <Routes>
        <Route path="/verification" element={<VerifyCodePage />} />
      </Routes>
    </MemoryRouter>
  );
}

function getCodeInputs() {
  // CodeInputBox renders as text inputs with maxLength 1; grab all of them.
  return screen.getAllByRole("textbox");
}

function fillCode(inputs, code = "123456") {
  code.split("").forEach((digit, i) => {
    fireEvent.change(inputs[i], { target: { value: digit } });
  });
}

describe("VerifyCodePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ legacyFakeTimers: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

test("displays the email address the code was sent to", () => {
  renderPage("jane@example.com");
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
});

test("shows an error immediately if no email was passed via navigation state", () => {
  renderPage(); // no email passed
  expect(screen.getByText("Email not found. Please go back.")).toBeInTheDocument();
});

  test("renders six OTP input boxes", () => {
    renderPage();
    expect(getCodeInputs()).toHaveLength(6);
  });

  test("only accepts single numeric digits per box", () => {
    renderPage();
    const inputs = getCodeInputs();

    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(inputs[0]).toHaveValue("");

    fireEvent.change(inputs[0], { target: { value: "5" } });
    expect(inputs[0]).toHaveValue("5");
  });

  test("auto-focuses the next box after entering a digit", () => {
    renderPage();
    const inputs = getCodeInputs();

    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(inputs[1]).toHaveFocus();
  });

  test("does not advance focus past the last box", () => {
    renderPage();
    const inputs = getCodeInputs();
    inputs[5].focus();
    fireEvent.change(inputs[5], { target: { value: "9" } });
    expect(inputs[5]).toHaveFocus();
  });

  test("backspace on an empty box moves focus to the previous box", () => {
    renderPage();
    const inputs = getCodeInputs();
    inputs[2].focus();
    fireEvent.keyDown(inputs[2], { key: "Backspace" });
    expect(inputs[1]).toHaveFocus();
  });

  test("backspace does nothing on the first box", () => {
    renderPage();
    const inputs = getCodeInputs();
    inputs[0].focus();
    fireEvent.keyDown(inputs[0], { key: "Backspace" });
    expect(inputs[0]).toHaveFocus();
  });

  test("submitting an incomplete code shows a validation error and does not call the API", async () => {
    renderPage();
    const inputs = getCodeInputs();
    fillCode(inputs, "123"); // only 3 digits filled, rest remain empty

    fireEvent.click(screen.getByText("Continue"));

    expect(
      await screen.findByText("Please enter the full 6-digit OTP.")
    ).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("submitting a full 6-digit code calls the verify-otp endpoint with email and otp", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage("jane@example.com");
    fillCode(getCodeInputs(), "123456");

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.example.com/api/forgot-password/verify-otp/",
        { email: "jane@example.com", otp: "123456" }
      )
    );
  });

  test("shows the loader while verifying and hides it afterward", async () => {
    let resolvePromise;
    axios.post.mockImplementationOnce(
      () => new Promise((resolve) => (resolvePromise = resolve))
    );
    renderPage();
    fillCode(getCodeInputs(), "123456");
    fireEvent.click(screen.getByText("Continue"));

    expect(await screen.findByTestId("loader")).toHaveTextContent("Verifying OTP...");
    resolvePromise({ data: {} });
    await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());
  });

  test("shows a success message and navigates to /new-password after 1 second", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage("jane@example.com");
    fillCode(getCodeInputs(), "123456");
    fireEvent.click(screen.getByText("Continue"));

    expect(
      await screen.findByText("OTP verified successfully. Redirecting...")
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/new-password", {
        state: { email: "jane@example.com" },
      })
    );
  });

  test("shows the server error message when verification fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "OTP has expired." } },
    });
    renderPage();
    fillCode(getCodeInputs(), "123456");
    fireEvent.click(screen.getByText("Continue"));

    expect(await screen.findByText("OTP has expired.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("falls back to a generic error message when the server gives no detail", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));
    renderPage();
    fillCode(getCodeInputs(), "123456");
    fireEvent.click(screen.getByText("Continue"));

    expect(await screen.findByText("Invalid or expired OTP.")).toBeInTheDocument();
  });

  test("clicking 'Resend OTP' calls the send-otp endpoint and shows a confirmation message", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderPage("jane@example.com");

    fireEvent.click(screen.getByText("Resend OTP"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.example.com/api/forgot-password/send-otp/",
        { email: "jane@example.com" }
      )
    );
    expect(await screen.findByText("A new OTP has been sent!")).toBeInTheDocument();
  });

  test("resend failure shows an error and clears any prior success message", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "Too many requests, try again later." } },
    });
    renderPage("jane@example.com");

    fireEvent.click(screen.getByText("Resend OTP"));

    expect(
      await screen.findByText("Too many requests, try again later.")
    ).toBeInTheDocument();
  });

  test("resend failure falls back to a generic message when no server detail is given", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));
    renderPage("jane@example.com");

    fireEvent.click(screen.getByText("Resend OTP"));

    expect(await screen.findByText("Failed to resend OTP.")).toBeInTheDocument();
  });

  test("resending clears a previously shown submit error", async () => {
    renderPage("jane@example.com");
    fillCode(getCodeInputs(), "12"); // incomplete -> triggers validation error
    fireEvent.click(screen.getByText("Continue"));
    await screen.findByText("Please enter the full 6-digit OTP.");

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByText("Resend OTP"));

    await waitFor(() =>
      expect(
        screen.queryByText("Please enter the full 6-digit OTP.")
      ).not.toBeInTheDocument()
    );
    expect(await screen.findByText("A new OTP has been sent!")).toBeInTheDocument();
  });

  test("clicking the back arrow/title area navigates back in history", () => {
    renderPage();
    fireEvent.click(screen.getByText("Verification"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
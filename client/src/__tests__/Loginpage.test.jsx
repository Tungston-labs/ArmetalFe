// src/pages/LoginPage.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
// Mocks: axios, react-redux (useDispatch), react-router-dom (useNavigate),
//        localStorage, and window.alert.
//
// If your project uses Vitest instead of Jest, swap `jest.mock` -> `vi.mock`
// and `jest.fn()` -> `vi.fn()`; the rest of the API is compatible.

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import LoginForm from "./LoginPage";

// ---- Mocks -----------------------------------------------------------

jest.mock("axios");

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

jest.mock("../../Redux/authSlice", () => ({
  login: (payload) => ({ type: "auth/login", payload }),
}));

jest.mock("../../services/api", () => ({
  BASE_URL: "http://test-api.local",
}));

// ---- Fixtures ----------------------------------------------------------

const fillLoginForm = async (user, { username = "john", password = "secret123" } = {}) => {
  await user.type(screen.getByPlaceholderText(/username/i), username);
  await user.type(screen.getByPlaceholderText(/^password$/i), password);
};

let setItemSpy;
let getItemSpy;
let removeItemSpy;
let clearSpy;

beforeEach(() => {
  jest.clearAllMocks();

  // Mock localStorage via Storage.prototype so calls are spied on while
  // still hitting the real jsdom localStorage under the hood, instead
  // of relying on a hand-rolled fake object.
  setItemSpy = jest.spyOn(Storage.prototype, "setItem");
  getItemSpy = jest.spyOn(Storage.prototype, "getItem");
  removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
  clearSpy = jest.spyOn(Storage.prototype, "clear");

  window.localStorage.clear();
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  setItemSpy.mockRestore();
  getItemSpy.mockRestore();
  removeItemSpy.mockRestore();
  clearSpy.mockRestore();
});

// ---- Tests ---------------------------------------------------------------

describe("LoginForm", () => {
  test("renders the login view by default with all fields", () => {
    render(<LoginForm />);

    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  test("username and password inputs are required", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/username/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeRequired();
  });

  test("typing updates username, password, and remember-me state", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillLoginForm(user, { username: "alice", password: "hunter2" });
    await user.click(screen.getByRole("checkbox"));

    expect(screen.getByPlaceholderText(/username/i)).toHaveValue("alice");
    expect(screen.getByPlaceholderText(/^password$/i)).toHaveValue("hunter2");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  test("toggles password visibility when the eye icon is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // The eye icon is rendered as an adjacent clickable span with no
    // accessible name from the icon itself; select via the input's
    // sibling. Easiest robust approach: query by test id if you add one,
    // otherwise fall back to the icon's svg role.
    const toggle = passwordInput.parentElement.querySelector("span");
    await user.click(toggle);

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggle);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("clicking 'Forgot password?' navigates to /forget-password", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByText(/forgot password\?/i));

    expect(mockNavigate).toHaveBeenCalledWith("/forget-password");
  });

  test("submits credentials, stores tokens, dispatches login, and navigates to '/' for a regular user", async () => {
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({
      data: {
        access: "access-token",
        refresh: "refresh-token",
        user: { username: "john", is_superadmin: false },
      },
    });

    render(<LoginForm />);
    await fillLoginForm(user);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test-api.local/api/token/",
        { username: "john", password: "secret123" }
      );
    });

    expect(setItemSpy).toHaveBeenCalledWith("accessToken", "access-token");
    expect(setItemSpy).toHaveBeenCalledWith("refreshToken", "refresh-token");
    expect(setItemSpy).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ username: "john", is_superadmin: false })
    );

    // Storage.prototype is real jsdom storage under the hood, so the
    // values are also actually readable back out.
    expect(window.localStorage.getItem("accessToken")).toBe("access-token");
    expect(window.localStorage.getItem("refreshToken")).toBe("refresh-token");

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/login",
      payload: {
        userName: "john",
        accessToken: "access-token",
        user: { username: "john", is_superadmin: false },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("navigates to /superadmin-dashboard when the user is a superadmin", async () => {
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({
      data: {
        access: "access-token",
        refresh: "refresh-token",
        user: { username: "admin", is_superadmin: true },
      },
    });

    render(<LoginForm />);
    await fillLoginForm(user, { username: "admin", password: "adminpass" });
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/superadmin-dashboard");
    });
  });

  test("shows the loading label while the request is in flight", async () => {
    const user = userEvent.setup();
    let resolvePost;
    axios.post.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePost = resolve;
      })
    );

    render(<LoginForm />);
    await fillLoginForm(user);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("button", { name: /logging in\.\.\./i })).toBeDisabled();

    resolvePost({
      data: { access: "a", refresh: "r", user: { username: "john", is_superadmin: false } },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^log in$/i })).toBeInTheDocument();
    });
  });

  test("shows the server error message when login fails with a detail field", async () => {
    const user = userEvent.setup();

    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "Invalid credentials" } },
    });

    render(<LoginForm />);
    await fillLoginForm(user, { username: "wrong", password: "wrong" });
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("shows a generic error message when the failure has no detail field", async () => {
    const user = userEvent.setup();

    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<LoginForm />);
    await fillLoginForm(user);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText(/login failed\. check credentials\./i)
    ).toBeInTheDocument();
  });

  test("clears a previous error on a new submit attempt", async () => {
    const user = userEvent.setup();

    axios.post
      .mockRejectedValueOnce({ response: { data: { detail: "Invalid credentials" } } })
      .mockResolvedValueOnce({
        data: { access: "a", refresh: "r", user: { username: "john", is_superadmin: false } },
      });

    render(<LoginForm />);
    await fillLoginForm(user);
    await user.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });
});
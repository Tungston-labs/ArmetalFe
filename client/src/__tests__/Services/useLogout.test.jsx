import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogout } from "../../services/logout";
import API from "../../services/api";

const mockNavigate = vi.fn();

vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("logs out successfully when refresh token exists", async () => {
    localStorage.setItem("refreshToken", "refresh-token");

    API.post.mockResolvedValue({
      data: { message: "Logged out" },
    });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(API.post).toHaveBeenCalledWith("/logout/", {
      refresh: "refresh-token",
    });

    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("clears storage and navigates when refresh token is missing", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(API.post).not.toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("clears storage and navigates when API fails", async () => {
    localStorage.setItem("refreshToken", "refresh-token");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    API.post.mockRejectedValue({
      response: {
        data: "Logout Failed",
      },
    });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(API.post).toHaveBeenCalled();

    expect(localStorage.getItem("refreshToken")).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith("/login");

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("handles error without response object", async () => {
    localStorage.setItem("refreshToken", "refresh-token");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    API.post.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
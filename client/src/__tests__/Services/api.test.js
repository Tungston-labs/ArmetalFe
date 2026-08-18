import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------
// 1. HOIST INTERCEPTOR TRACKING & AXIOS MOCKS
// ---------------------------------------------------------
const {
  mockAxiosInstance,
  requestInterceptorUse,
  responseInterceptorUse,
  postMock,
} = vi.hoisted(() => {
  const requestInterceptorUse = vi.fn();
  const responseInterceptorUse = vi.fn();
  const postMock = vi.fn();

  const mockAxiosInstance = vi.fn();
  mockAxiosInstance.interceptors = {
    request: { use: requestInterceptorUse },
    response: { use: responseInterceptorUse },
  };
  mockAxiosInstance.create = vi.fn(() => mockAxiosInstance);
  mockAxiosInstance.post = postMock;

  return {
    mockAxiosInstance,
    requestInterceptorUse,
    responseInterceptorUse,
    postMock,
  };
});

vi.mock("axios", () => ({
  default: mockAxiosInstance,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// ---------------------------------------------------------
// 2. IMPORT MODULE UNDER TEST AFTER MOCKS
// ---------------------------------------------------------
import axios from "axios";
import API, { BASE_URL } from "../../services/api";

describe("API Service - 100% Coverage Suite", () => {
  let requestSuccess;
  let requestError;
  let responseSuccess;
  let responseError;

  // Extract the handler functions passed to interceptors during module instantiation
  if (requestInterceptorUse.mock.calls.length > 0) {
    [requestSuccess, requestError] = requestInterceptorUse.mock.calls[0];
  }
  if (responseInterceptorUse.mock.calls.length > 0) {
    [responseSuccess, responseError] = responseInterceptorUse.mock.calls[0];
  }

  beforeEach(() => {
    postMock.mockReset();
    localStorage.clear();
    sessionStorage.clear();

    // Safely mock window.location
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================
  // BASE URL & EXPORTS
  // =========================================================
  describe("Base Configuration & Exports", () => {
    it("should export BASE_URL and default instance", () => {
      expect(BASE_URL).toBeDefined();
      expect(API).toBeDefined();
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: `${BASE_URL}/api`,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  // =========================================================
  // REQUEST INTERCEPTOR
  // =========================================================
  describe("Request Interceptor", () => {
    it("should attach Bearer token from localStorage when present", () => {
      localStorage.setItem("accessToken", "local-token-123");
      const config = { headers: {} };

      const result = requestSuccess(config);

      expect(result.headers.Authorization).toBe("Bearer local-token-123");
    });

    it("should attach Bearer token from sessionStorage when localStorage is empty", () => {
      sessionStorage.setItem("accessToken", "session-token-456");
      const config = { headers: {} };

      const result = requestSuccess(config);

      expect(result.headers.Authorization).toBe("Bearer session-token-456");
    });

    it("should leave Authorization header empty if no token exists in either storage", () => {
      const config = { headers: {} };

      const result = requestSuccess(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it("should reject error in request interceptor error callback", async () => {
      const error = new Error("Request setup error");

      await expect(requestError(error)).rejects.toBe(error);
    });
  });

  // =========================================================
  // RESPONSE INTERCEPTOR - SUCCESS
  // =========================================================
  describe("Response Interceptor - Success Path", () => {
    it("should pass through successful responses unchanged", () => {
      const response = { status: 200, data: { ok: true } };

      const result = responseSuccess(response);

      expect(result).toBe(response);
    });
  });

  // =========================================================
  // RESPONSE INTERCEPTOR - NON-RETRYABLE ERRORS
  // =========================================================
  describe("Response Interceptor - Error Pass-Through", () => {
    it("should reject non-401 errors directly", async () => {
      const error = { response: { status: 500 }, config: { headers: {} } };

      await expect(responseError(error)).rejects.toBe(error);
    });

    it("should reject 401 error if request was already retried once", async () => {
      localStorage.setItem("refreshToken", "refresh-123");
      const error = {
        response: { status: 401 },
        config: { _retry: true, headers: {} },
      };

      await expect(responseError(error)).rejects.toBe(error);
      expect(postMock).not.toHaveBeenCalled();
    });

    it("should reject 401 error if no refresh token exists in local or session storage", async () => {
      const error = {
        response: { status: 401 },
        config: { headers: {} },
      };

      await expect(responseError(error)).rejects.toBe(error);
      expect(postMock).not.toHaveBeenCalled();
    });

    it("should reject error if response object is missing", async () => {
      const error = new Error("Network Error");

      await expect(responseError(error)).rejects.toBe(error);
    });
  });

  // =========================================================
  // TOKEN REFRESH FLOWS - LOCAL STORAGE
  // =========================================================
  describe("Token Refresh Flow - LocalStorage", () => {
    it("should handle successful refresh with both new access & refresh tokens", async () => {
      localStorage.setItem("refreshToken", "local-refresh-token");
      const originalRequest = { headers: {} };
      const error = { response: { status: 401 }, config: originalRequest };

      postMock.mockResolvedValueOnce({
        data: {
          access: "new-access-1",
          refresh: "new-refresh-1",
        },
      });
      mockAxiosInstance.mockResolvedValueOnce({ data: "retried-response" });

      const result = await responseError(error);

      expect(postMock).toHaveBeenCalledWith(`${BASE_URL}/api/token/refresh/`, {
        refresh: "local-refresh-token",
      });
      expect(localStorage.getItem("accessToken")).toBe("new-access-1");
      expect(localStorage.getItem("refreshToken")).toBe("new-refresh-1");
      expect(originalRequest._retry).toBe(true);
      expect(originalRequest.headers.Authorization).toBe("Bearer new-access-1");
      expect(result).toEqual({ data: "retried-response" });
    });

    it("should update access token only when refresh token is not returned", async () => {
      localStorage.setItem("refreshToken", "local-refresh-token");
      const originalRequest = { headers: {} };
      const error = { response: { status: 401 }, config: originalRequest };

      postMock.mockResolvedValueOnce({
        data: { access: "new-access-2" },
      });
      mockAxiosInstance.mockResolvedValueOnce({ data: "success" });

      await responseError(error);

      expect(localStorage.getItem("accessToken")).toBe("new-access-2");
      expect(localStorage.getItem("refreshToken")).toBe("local-refresh-token");
    });
  });

  // =========================================================
  // TOKEN REFRESH FLOWS - SESSION STORAGE
  // =========================================================
  describe("Token Refresh Flow - SessionStorage", () => {
    it("should handle successful refresh for sessionStorage user with new refresh token", async () => {
      sessionStorage.setItem("refreshToken", "session-refresh-token");
      const originalRequest = { headers: {} };
      const error = { response: { status: 401 }, config: originalRequest };

      postMock.mockResolvedValueOnce({
        data: {
          access: "sess-access-1",
          refresh: "sess-refresh-1",
        },
      });
      mockAxiosInstance.mockResolvedValueOnce({ data: "ok" });

      await responseError(error);

      expect(postMock).toHaveBeenCalledWith(`${BASE_URL}/api/token/refresh/`, {
        refresh: "session-refresh-token",
      });
      expect(sessionStorage.getItem("accessToken")).toBe("sess-access-1");
      expect(sessionStorage.getItem("refreshToken")).toBe("sess-refresh-1");
    });

    it("should update access token only in sessionStorage when new refresh token is omitted", async () => {
      sessionStorage.setItem("refreshToken", "session-refresh-token");
      const originalRequest = { headers: {} };
      const error = { response: { status: 401 }, config: originalRequest };

      postMock.mockResolvedValueOnce({
        data: { access: "sess-access-2" },
      });
      mockAxiosInstance.mockResolvedValueOnce({ data: "ok" });

      await responseError(error);

      expect(sessionStorage.getItem("accessToken")).toBe("sess-access-2");
      expect(sessionStorage.getItem("refreshToken")).toBe("session-refresh-token");
    });
  });

  // =========================================================
  // REFRESH FAILURE FLOW
  // =========================================================
  describe("Token Refresh Failure Handling", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should clear localStorage, redirect to /login, and reject when refresh fails", async () => {
      localStorage.setItem("accessToken", "old-access");
      localStorage.setItem("refreshToken", "invalid-refresh");

      const originalRequest = { headers: {} };
      const error = { response: { status: 401 }, config: originalRequest };
      const refreshError = new Error("Invalid Refresh Token");

      postMock.mockRejectedValueOnce(refreshError);

      await expect(responseError(error)).rejects.toBe(refreshError);

      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
      expect(window.location.href).toBe("/login");
    });
  });
});
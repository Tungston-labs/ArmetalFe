import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// ============================================================
// HOISTED MOCKS
// ============================================================

const {
    mockPost,
    mockDispatch,
    mockSetAccessToken,
    mockLogout,
} = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockDispatch: vi.fn(),
    mockSetAccessToken: vi.fn((payload) => ({
        type: "auth/setAccessToken",
        payload,
    })),
    mockLogout: vi.fn(() => ({
        type: "auth/logout",
    })),
}));

// ============================================================
// MOCK REACT REDUX
// ============================================================

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}));

// ============================================================
// MOCK AUTH SLICE
// ============================================================

vi.mock("../../Redux/authSlice", () => ({
    setAccessToken: mockSetAccessToken,
    logout: mockLogout,
}));

// ============================================================
// MOCK API
// ============================================================

vi.mock("../../services/api", () => ({
    default: {
        post: mockPost,
    },
}));

// ============================================================
// IMPORT AFTER MOCKS
// ============================================================

import useRefreshToken from "../../hooks/useRefreshToken";

// ============================================================
// TEST SETUP
// ============================================================

beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();
    sessionStorage.clear();
});

// ============================================================
// TESTS
// ============================================================

describe("useRefreshToken", () => {
    // ----------------------------------------------------------
    // 1. Hook should return refresh function
    // ----------------------------------------------------------

    it("should return a refresh function", () => {
        const { result } = renderHook(() => useRefreshToken());

        expect(typeof result.current).toBe("function");
    });

    // ----------------------------------------------------------
    // 2. Successful refresh with access token
    // ----------------------------------------------------------

    it("should refresh token and return the new access token", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                accessToken: "new-access-token",
            },
        });

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(mockPost).toHaveBeenCalledTimes(1);

        expect(mockPost).toHaveBeenCalledWith(
            "/admin/auth/refresh",
            {},
            {
                withCredentials: true,
            }
        );

        expect(mockSetAccessToken).toHaveBeenCalledTimes(1);

        expect(mockSetAccessToken).toHaveBeenCalledWith({
            accessToken: "new-access-token",
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "auth/setAccessToken",
            payload: {
                accessToken: "new-access-token",
            },
        });

        expect(localStorage.getItem("accessToken")).toBe(
            "new-access-token"
        );

        expect(token).toBe("new-access-token");
    });

    // ----------------------------------------------------------
    // 3. API returns no access token
    // ----------------------------------------------------------

    it("should return null when API response does not contain an access token", async () => {
        mockPost.mockResolvedValueOnce({
            data: {},
        });

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(mockPost).toHaveBeenCalledTimes(1);

        expect(mockSetAccessToken).not.toHaveBeenCalled();

        expect(mockDispatch).not.toHaveBeenCalled();

        expect(localStorage.getItem("accessToken")).toBeNull();

        expect(token).toBeNull();
    });

    // ----------------------------------------------------------
    // 4. API returns undefined data
    // ----------------------------------------------------------

    it("should return null when API response data is undefined", async () => {
        mockPost.mockResolvedValueOnce({
            data: undefined,
        });

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(mockPost).toHaveBeenCalledTimes(1);

        expect(token).toBeNull();

        expect(mockSetAccessToken).not.toHaveBeenCalled();

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    // ----------------------------------------------------------
    // 5. API throws error
    // ----------------------------------------------------------

    it("should logout and remove access token when refresh fails", async () => {
        localStorage.setItem("accessToken", "old-access-token");

        mockPost.mockRejectedValueOnce(
            new Error("Refresh token failed")
        );

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(mockPost).toHaveBeenCalledTimes(1);

        expect(mockLogout).toHaveBeenCalledTimes(1);

        expect(mockDispatch).toHaveBeenCalledTimes(1);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "auth/logout",
        });

        expect(localStorage.getItem("accessToken")).toBeNull();

        expect(token).toBeNull();
    });

    // ----------------------------------------------------------
    // 6. Error when there is no stored token
    // ----------------------------------------------------------

    it("should handle refresh failure even when no token exists", async () => {
        mockPost.mockRejectedValueOnce(
            new Error("Network error")
        );

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(mockLogout).toHaveBeenCalledTimes(1);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "auth/logout",
        });

        expect(localStorage.getItem("accessToken")).toBeNull();

        expect(token).toBeNull();
    });

    // ----------------------------------------------------------
    // 7. Should not store token when API returns empty string
    // ----------------------------------------------------------

    it("should return null when access token is an empty string", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                accessToken: "",
            },
        });

        const { result } = renderHook(() => useRefreshToken());

        let token;

        await act(async () => {
            token = await result.current();
        });

        expect(token).toBeNull();

        expect(mockSetAccessToken).not.toHaveBeenCalled();

        expect(mockDispatch).not.toHaveBeenCalled();

        expect(localStorage.getItem("accessToken")).toBeNull();
    });
});
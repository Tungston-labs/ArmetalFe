import { describe, it, expect, beforeEach, vi } from "vitest";
import { getAccessToken } from "../../hooks/useAccessToken";

describe("getAccessToken", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return the access token from localStorage", () => {
    localStorage.setItem("accessToken", "local-token-123");

    const result = getAccessToken();

    expect(result).toBe("local-token-123");
  });

  it("should return the access token from sessionStorage when localStorage has no token", () => {
    sessionStorage.setItem("accessToken", "session-token-456");

    const result = getAccessToken();

    expect(result).toBe("session-token-456");
  });

  it("should prefer localStorage token over sessionStorage token", () => {
    localStorage.setItem("accessToken", "local-token-123");
    sessionStorage.setItem("accessToken", "session-token-456");

    const result = getAccessToken();

    expect(result).toBe("local-token-123");
  });

  it("should return null when no access token exists", () => {
    const result = getAccessToken();

    expect(result).toBeNull();
  });

  it("should return null when localStorage throws an error", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const result = getAccessToken();

    expect(result).toBeNull();
  });
});
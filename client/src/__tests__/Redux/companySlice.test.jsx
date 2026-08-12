import { describe, it, expect, beforeEach, vi } from "vitest";
import reducer, {
  getCompanySelf,
  patchCompanySelf,
  resetCompanyState,
} from "../../Redux/companySlice";

import {
  fetchCompanySelf,
  updateCompanySelf,
} from "../../services/companyService";

// Mock the service functions
vi.mock("../../services/companyService", () => ({
  fetchCompanySelf: vi.fn(),
  updateCompanySelf: vi.fn(),
}));

describe("companySlice", () => {
  const initialState = {
    company: null,
    loading: false,
    error: null,
    success: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================
  // INITIAL STATE
  // =========================================================

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // =========================================================
  // resetCompanyState
  // =========================================================

  it("should reset company state", () => {
    const state = {
      company: {
        id: 1,
        name: "Test Company",
      },
      loading: true,
      error: "Some error",
      success: true,
    };

    const result = reducer(state, resetCompanyState());

    expect(result).toEqual({
      company: {
        id: 1,
        name: "Test Company",
      },
      loading: false,
      error: null,
      success: false,
    });
  });

  // =========================================================
  // getCompanySelf - PENDING
  // =========================================================

  it("should handle getCompanySelf.pending", () => {
    const state = reducer(initialState, getCompanySelf.pending("request-id"));

    expect(state.loading).toBe(true);
    expect(state.company).toBeNull();
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  // =========================================================
  // getCompanySelf - FULFILLED
  // =========================================================

  it("should handle getCompanySelf.fulfilled", () => {
    const companyData = {
      id: 1,
      name: "ABC Company",
      email: "abc@example.com",
    };

    const state = reducer(
      {
        ...initialState,
        loading: true,
      },
      getCompanySelf.fulfilled(companyData, "request-id"),
    );

    expect(state.loading).toBe(false);
    expect(state.company).toEqual(companyData);
  });

  // =========================================================
  // getCompanySelf - REJECTED
  // =========================================================

  it("should handle getCompanySelf.rejected", () => {
    const errorData = {
      detail: "Unable to fetch company",
    };

    const state = reducer(
      {
        ...initialState,
        loading: true,
      },
      getCompanySelf.rejected(
        new Error("Request failed"),
        "request-id",
        undefined,
        errorData,
      ),
    );

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(errorData);
  });

  // =========================================================
  // getCompanySelf - SUCCESSFUL THUNK
  // =========================================================

  it("should successfully execute getCompanySelf thunk", async () => {
    const companyData = {
      id: 1,
      name: "ABC Company",
    };

    fetchCompanySelf.mockResolvedValue(companyData);

    const dispatch = vi.fn();

    const result = await getCompanySelf()(dispatch, vi.fn(), undefined);

    expect(fetchCompanySelf).toHaveBeenCalledTimes(1);
    expect(result.payload).toEqual(companyData);
    expect(result.type).toBe("company/getSelf/fulfilled");
  });

  // =========================================================
  // getCompanySelf - ERROR WITH response.data
  // =========================================================

  it("should reject getCompanySelf with response data", async () => {
    const errorResponse = {
      response: {
        data: {
          detail: "Company not found",
        },
      },
    };

    fetchCompanySelf.mockRejectedValue(errorResponse);

    const dispatch = vi.fn();

    const result = await getCompanySelf()(dispatch, vi.fn(), undefined);

    expect(fetchCompanySelf).toHaveBeenCalledTimes(1);
    expect(result.type).toBe("company/getSelf/rejected");
    expect(result.payload).toEqual({
      detail: "Company not found",
    });
  });

  // =========================================================
  // getCompanySelf - ERROR WITH error.message
  // =========================================================

  it("should reject getCompanySelf with error message when response data is unavailable", async () => {
    const error = new Error("Network error");

    fetchCompanySelf.mockRejectedValue(error);

    const dispatch = vi.fn();

    const result = await getCompanySelf()(dispatch, vi.fn(), undefined);

    expect(fetchCompanySelf).toHaveBeenCalledTimes(1);
    expect(result.type).toBe("company/getSelf/rejected");
    expect(result.payload).toBe("Network error");
  });

  // =========================================================
  // patchCompanySelf - PENDING
  // =========================================================

  it("should handle patchCompanySelf.pending", () => {
    const state = reducer(
      {
        ...initialState,
        success: true,
      },
      patchCompanySelf.pending("request-id", {
        name: "Updated Company",
      }),
    );

    expect(state.loading).toBe(true);
    expect(state.success).toBe(false);
  });

  // =========================================================
  // patchCompanySelf - FULFILLED
  // =========================================================

  it("should handle patchCompanySelf.fulfilled", () => {
    const updatedCompany = {
      id: 1,
      name: "Updated Company",
    };

    const state = reducer(
      {
        ...initialState,
        loading: true,
      },
      patchCompanySelf.fulfilled(updatedCompany, "request-id", {
        name: "Updated Company",
      }),
    );

    expect(state.loading).toBe(false);
    expect(state.company).toEqual(updatedCompany);
    expect(state.success).toBe(true);
  });

  // =========================================================
  // patchCompanySelf - REJECTED
  // =========================================================

  it("should handle patchCompanySelf.rejected", () => {
    const errorData = {
      detail: "Unable to update company",
    };

    const state = reducer(
      {
        ...initialState,
        loading: true,
      },
      patchCompanySelf.rejected(
        new Error("Update failed"),
        "request-id",
        {
          name: "Updated Company",
        },
        errorData,
      ),
    );

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(errorData);
  });

  // =========================================================
  // patchCompanySelf - SUCCESSFUL THUNK
  // =========================================================

  it("should successfully execute patchCompanySelf thunk", async () => {
    const companyData = {
      id: 1,
      name: "Updated Company",
    };

    const updateData = {
      name: "Updated Company",
    };

    updateCompanySelf.mockResolvedValue(companyData);

    const dispatch = vi.fn();

    const result = await patchCompanySelf(updateData)(
      dispatch,
      vi.fn(),
      undefined,
    );

    expect(updateCompanySelf).toHaveBeenCalledTimes(1);
    expect(updateCompanySelf).toHaveBeenCalledWith(updateData);
    expect(result.payload).toEqual(companyData);
    expect(result.type).toBe("company/updateSelf/fulfilled");
  });

  // =========================================================
  // patchCompanySelf - ERROR WITH response.data
  // =========================================================

  it("should reject patchCompanySelf with response data", async () => {
    const updateData = {
      name: "Updated Company",
    };

    const errorResponse = {
      response: {
        data: {
          detail: "Update failed",
        },
      },
    };

    updateCompanySelf.mockRejectedValue(errorResponse);

    const dispatch = vi.fn();

    const result = await patchCompanySelf(updateData)(
      dispatch,
      vi.fn(),
      undefined,
    );

    expect(updateCompanySelf).toHaveBeenCalledWith(updateData);
    expect(result.type).toBe("company/updateSelf/rejected");
    expect(result.payload).toEqual({
      detail: "Update failed",
    });
  });

  // =========================================================
  // patchCompanySelf - ERROR WITH error.message
  // =========================================================

  it("should reject patchCompanySelf with error message when response data is unavailable", async () => {
    const updateData = {
      name: "Updated Company",
    };

    const error = new Error("Network error");

    updateCompanySelf.mockRejectedValue(error);

    const dispatch = vi.fn();

    const result = await patchCompanySelf(updateData)(
      dispatch,
      vi.fn(),
      undefined,
    );

    expect(updateCompanySelf).toHaveBeenCalledWith(updateData);
    expect(result.type).toBe("company/updateSelf/rejected");
    expect(result.payload).toBe("Network error");
  });
});

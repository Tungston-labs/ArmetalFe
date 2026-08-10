import { describe, it, expect } from "vitest";
import reducer, {
  clearSelectedCompany,
  setSearchQuery,
  getCompanies,
  addCompany,
  getCompanyById,
  editCompany,
  removeCompany,
  getCompanyOverview,
  updateCompanyStatusThunk,
} from "../../Redux/superAdminSlice";

describe("superAdminSlice", () => {
  const initialState = {
    companies: [],
    pagination: {
      total_pages: 0,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    selectedCompany: null,
    overview: null,
    loading: false,
    error: null,
    searchQuery: "",
  };

  it("should return initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("reducers", () => {
    it("should clear selected company", () => {
      const state = reducer(
        {
          ...initialState,
          selectedCompany: { id: 1 },
        },
        clearSelectedCompany()
      );

      expect(state.selectedCompany).toBeNull();
    });

    it("should set search query", () => {
      const state = reducer(initialState, setSearchQuery("abc"));

      expect(state.searchQuery).toBe("abc");
    });
  });

  describe("getCompanies", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: getCompanies.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const payload = {
        results: [
          { id: 1, name: "ABC" },
          { id: 2, name: "XYZ" },
        ],
        total_pages: 3,
        current_page: 2,
        total_items: 10,
        next: "page3",
        previous: "page1",
      };

      const state = reducer(initialState, {
        type: getCompanies.fulfilled.type,
        payload,
      });

      expect(state.loading).toBe(false);
      expect(state.companies).toEqual(payload.results);

      expect(state.pagination).toEqual({
        total_pages: 3,
        current_page: 2,
        total_items: 10,
        next: "page3",
        previous: "page1",
      });
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: getCompanies.rejected.type,
        error: { message: "Failed" },
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed");
    });
  });

  describe("addCompany", () => {
    it("adds company", () => {
      const newCompany = {
        id: 3,
        name: "New Company",
      };

      const state = reducer(initialState, {
        type: addCompany.fulfilled.type,
        payload: newCompany,
      });

      expect(state.companies).toEqual([newCompany]);
    });
  });

  describe("getCompanyById", () => {
    it("sets selected company", () => {
      const company = {
        id: 10,
        name: "Company",
      };

      const state = reducer(initialState, {
        type: getCompanyById.fulfilled.type,
        payload: company,
      });

      expect(state.selectedCompany).toEqual(company);
    });
  });

  describe("editCompany", () => {
    it("updates company", () => {
      const currentState = {
        ...initialState,
        companies: [
          { id: 1, name: "Old" },
          { id: 2, name: "Another" },
        ],
      };

      const updated = {
        id: 1,
        name: "Updated",
      };

      const state = reducer(currentState, {
        type: editCompany.fulfilled.type,
        payload: updated,
      });

      expect(state.companies[0]).toEqual(updated);
    });

    it("does nothing if company not found", () => {
      const currentState = {
        ...initialState,
        companies: [{ id: 1, name: "ABC" }],
      };

      const state = reducer(currentState, {
        type: editCompany.fulfilled.type,
        payload: {
          id: 99,
          name: "XYZ",
        },
      });

      expect(state.companies).toEqual([{ id: 1, name: "ABC" }]);
    });
  });

  describe("removeCompany", () => {
    it("removes company", () => {
      const currentState = {
        ...initialState,
        companies: [
          { id: 1 },
          { id: 2 },
        ],
      };

      const state = reducer(currentState, {
        type: removeCompany.fulfilled.type,
        payload: 1,
      });

      expect(state.companies).toEqual([{ id: 2 }]);
    });
  });

  describe("getCompanyOverview", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: getCompanyOverview.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const overview = {
        totalCompanies: 50,
      };

      const state = reducer(initialState, {
        type: getCompanyOverview.fulfilled.type,
        payload: overview,
      });

      expect(state.loading).toBe(false);
      expect(state.overview).toEqual(overview);
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: getCompanyOverview.rejected.type,
        error: { message: "Overview Error" },
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Overview Error");
    });
  });

  describe("updateCompanyStatusThunk", () => {
    it("handles pending", () => {
      const state = reducer(initialState, {
        type: updateCompanyStatusThunk.pending.type,
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("activates company", () => {
      const currentState = {
        ...initialState,
        selectedCompany: {
          id: 1,
          is_active: false,
        },
        companies: [
          {
            id: 1,
            is_active: false,
          },
        ],
      };

      const state = reducer(currentState, {
        type: updateCompanyStatusThunk.fulfilled.type,
        payload: {
          companyId: 1,
          action: "activate",
        },
      });

      expect(state.loading).toBe(false);
      expect(state.selectedCompany.is_active).toBe(true);
      expect(state.companies[0].is_active).toBe(true);
    });

    it("freezes company", () => {
      const currentState = {
        ...initialState,
        selectedCompany: {
          id: 1,
          is_active: true,
        },
        companies: [
          {
            id: 1,
            is_active: true,
          },
        ],
      };

      const state = reducer(currentState, {
        type: updateCompanyStatusThunk.fulfilled.type,
        payload: {
          companyId: 1,
          action: "freeze",
        },
      });

      expect(state.selectedCompany.is_active).toBe(false);
      expect(state.companies[0].is_active).toBe(false);
    });

    it("handles rejected", () => {
      const state = reducer(initialState, {
        type: updateCompanyStatusThunk.rejected.type,
        payload: "Status Error",
        error: { message: "Status Error" },
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Status Error");
    });
  });
});
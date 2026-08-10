import { describe, it, expect } from "vitest";
import reducer, {
  clearCurrentDepartment,
  getDepartmentsMin,
  getDepartments,
  getDepartmentById,
  createNewDepartment,
  updateDepartmentById,
  deleteDepartmentById,
  getEmployeesByDepartment,
  getEmployeesByDepartmentMini,
} from "../../Redux/departmentSlice";

describe("departmentSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return initial state", () => {
    expect(initialState).toEqual({
      list: [],
      minList: [],
      current: null,
      loading: false,
      loadingEmployees: false,
      error: null,
      departmentEmployees: [],
      departmentEmployeesMini: [],
      pagination: {
        total_pages: 0,
        current_page: 1,
        next: null,
        previous: null,
        total_items: 0,
      },
    });
  });

  it("should clear current department", () => {
    const state = reducer(
      {
        ...initialState,
        current: { id: 1, name: "HR" },
      },
      clearCurrentDepartment()
    );

    expect(state.current).toBeNull();
  });

  describe("getDepartmentsMin", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        getDepartmentsMin.pending("", undefined)
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled", () => {
      const payload = {
        results: [{ id: 1, name: "HR" }],
      };

      const state = reducer(
        initialState,
        getDepartmentsMin.fulfilled(payload, "", undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.minList).toEqual(payload.results);
      expect(state.error).toBeNull();
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        getDepartmentsMin.rejected(
          null,
          "",
          undefined,
          "Error"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Error");
    });
  });

  describe("getDepartments", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        getDepartments.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled", () => {
      const payload = {
        results: [{ id: 1 }],
        total_pages: 5,
        current_page: 2,
        next: "next",
        previous: "prev",
        total_items: 40,
      };

      const state = reducer(
        initialState,
        getDepartments.fulfilled(payload, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual(payload.results);

      expect(state.pagination).toEqual({
        total_pages: 5,
        current_page: 2,
        next: "next",
        previous: "prev",
        total_items: 40,
      });
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        getDepartments.rejected(
          null,
          "",
          {},
          "Fetch Error"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Fetch Error");
    });
  });

  describe("getDepartmentById", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        getDepartmentById.pending("", 1)
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled", () => {
      const payload = {
        id: 1,
        name: "Finance",
      };

      const state = reducer(
        initialState,
        getDepartmentById.fulfilled(payload, "", 1)
      );

      expect(state.loading).toBe(false);
      expect(state.current).toEqual(payload);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        getDepartmentById.rejected(
          null,
          "",
          1,
          "Not Found"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Not Found");
    });
  });

  describe("createNewDepartment", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        createNewDepartment.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled", () => {
      const state = reducer(
        initialState,
        createNewDepartment.fulfilled({}, "", {})
      );

      expect(state.loading).toBe(false);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        createNewDepartment.rejected(
          null,
          "",
          {},
          "Create Error"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Create Error");
    });
  });

  describe("updateDepartmentById", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        updateDepartmentById.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled updates department", () => {
      const startState = {
        ...initialState,
        list: [
          { id: 1, name: "HR" },
          { id: 2, name: "IT" },
        ],
      };

      const payload = {
        id: 2,
        name: "Information Technology",
      };

      const state = reducer(
        startState,
        updateDepartmentById.fulfilled(payload, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.list[1]).toEqual(payload);
    });

    it("fulfilled with unknown id", () => {
      const startState = {
        ...initialState,
        list: [{ id: 1 }],
      };

      const state = reducer(
        startState,
        updateDepartmentById.fulfilled(
          { id: 999 },
          "",
          {}
        )
      );

      expect(state.list).toEqual([{ id: 1 }]);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        updateDepartmentById.rejected(
          null,
          "",
          {},
          "Update Error"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Update Error");
    });
  });

  describe("deleteDepartmentById", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        deleteDepartmentById.pending("", {})
      );

      expect(state.loading).toBe(true);
    });

    it("fulfilled", () => {
      const startState = {
        ...initialState,
        list: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ],
      };

      const state = reducer(
        startState,
        deleteDepartmentById.fulfilled(2, "", {})
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual([
        { id: 1 },
        { id: 3 },
      ]);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        deleteDepartmentById.rejected(
          null,
          "",
          {},
          "Delete Error"
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Delete Error");
    });
  });

  describe("getEmployeesByDepartment", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        getEmployeesByDepartment.pending("", 1)
      );

      expect(state.loadingEmployees).toBe(true);
    });

    it("fulfilled", () => {
      const payload = [{ id: 1, name: "John" }];

      const state = reducer(
        initialState,
        getEmployeesByDepartment.fulfilled(
          payload,
          "",
          1
        )
      );

      expect(state.loadingEmployees).toBe(false);
      expect(state.departmentEmployees).toEqual(payload);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        getEmployeesByDepartment.rejected(
          null,
          "",
          1,
          "Employee Error"
        )
      );

      expect(state.loadingEmployees).toBe(false);
      expect(state.error).toBe("Employee Error");
    });
  });

  describe("getEmployeesByDepartmentMini", () => {
    it("pending", () => {
      const state = reducer(
        initialState,
        getEmployeesByDepartmentMini.pending("", 1)
      );

      expect(state.loadingEmployees).toBe(true);
    });

    it("fulfilled", () => {
      const payload = [{ id: 2, name: "Jane" }];

      const state = reducer(
        initialState,
        getEmployeesByDepartmentMini.fulfilled(
          payload,
          "",
          1
        )
      );

      expect(state.loadingEmployees).toBe(false);
      expect(state.departmentEmployeesMini).toEqual(payload);
    });

    it("rejected", () => {
      const state = reducer(
        initialState,
        getEmployeesByDepartmentMini.rejected(
          null,
          "",
          1,
          "Mini Error"
        )
      );

      expect(state.loadingEmployees).toBe(false);
      expect(state.error).toBe("Mini Error");
    });
  });
});
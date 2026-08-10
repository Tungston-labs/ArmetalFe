import { describe, it, expect } from "vitest";
import reducer, {
  getHolidays,
  addHoliday,
  removeHoliday,
} from "../../Redux/holidaySlice";

describe("holidaySlice", () => {
  const initialState = {
    list: [],
    count: 0,
    totalPages: 1,
    currentPage: 1,
    next: null,
    previous: null,
    loading: false,
    error: null,
    selected: null,
  };

  it("should return initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("getHolidays", () => {
    it("should handle pending", () => {
      const state = reducer(
        initialState,
        getHolidays.pending("", 1)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const payload = {
        results: [
          {
            id: 1,
            name: "New Year",
          },
          {
            id: 2,
            name: "Christmas",
          },
        ],
        total_items: 2,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
      };

      const state = reducer(
        initialState,
        getHolidays.fulfilled(payload, "", 1)
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual(payload.results);
      expect(state.count).toBe(2);
      expect(state.totalPages).toBe(1);
      expect(state.currentPage).toBe(1);
      expect(state.next).toBeNull();
      expect(state.previous).toBeNull();
    });

    it("should handle rejected", () => {
      const state = reducer(
        initialState,
        getHolidays.rejected(
          new Error("Failed"),
          "",
          1
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed");
    });
  });

  describe("addHoliday", () => {
    it("should add a holiday", () => {
      const holiday = {
        id: 3,
        name: "Eid",
      };

      const state = reducer(
        initialState,
        addHoliday.fulfilled(holiday, "", holiday)
      );

      expect(state.list).toEqual([holiday]);
    });

    it("should append multiple holidays", () => {
      const state1 = reducer(
        initialState,
        addHoliday.fulfilled(
          { id: 1, name: "Holiday 1" },
          "",
          {}
        )
      );

      const state2 = reducer(
        state1,
        addHoliday.fulfilled(
          { id: 2, name: "Holiday 2" },
          "",
          {}
        )
      );

      expect(state2.list).toHaveLength(2);
      expect(state2.list[1].name).toBe("Holiday 2");
    });
  });

  describe("removeHoliday", () => {
    const populatedState = {
      ...initialState,
      list: [
        { id: 1, name: "New Year" },
        { id: 2, name: "Christmas" },
        { id: 3, name: "Eid" },
      ],
    };

    it("should remove a holiday", () => {
      const state = reducer(
        populatedState,
        removeHoliday.fulfilled(2, "", 2)
      );

      expect(state.list).toEqual([
        { id: 1, name: "New Year" },
        { id: 3, name: "Eid" },
      ]);
    });

    it("should do nothing if holiday id does not exist", () => {
      const state = reducer(
        populatedState,
        removeHoliday.fulfilled(99, "", 99)
      );

      expect(state.list).toEqual(populatedState.list);
    });
  });

  it("should preserve existing state on unknown action", () => {
    const state = reducer(initialState, {
      type: "UNKNOWN_ACTION",
    });

    expect(state).toEqual(initialState);
  });
});
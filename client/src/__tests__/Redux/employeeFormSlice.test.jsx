import { describe, it, expect } from "vitest";
import reducer, {
  saveBasicInfo,
  saveJobDetails,
  saveLegalInfo,
  clearEmployeeForm,
} from "../../Redux/employeeFormSlice";

describe("employeeFormSlice", () => {
  const initialState = reducer(undefined, { type: "@@INIT" });

  it("should return the initial state", () => {
    expect(initialState).toEqual({
      basicInfo: {},
      jobDetails: {},
      legalInfo: {},
    });
  });

  it("should save basic info", () => {
    const payload = {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
    };

    const state = reducer(initialState, saveBasicInfo(payload));

    expect(state.basicInfo).toEqual(payload);
    expect(state.jobDetails).toEqual({});
    expect(state.legalInfo).toEqual({});
  });

  it("should save job details", () => {
    const payload = {
      department: "IT",
      designation: "Developer",
      salary: 50000,
    };

    const state = reducer(initialState, saveJobDetails(payload));

    expect(state.jobDetails).toEqual(payload);
    expect(state.basicInfo).toEqual({});
    expect(state.legalInfo).toEqual({});
  });

  it("should save legal info", () => {
    const payload = {
      passport: "A1234567",
      visa: "Employment Visa",
    };

    const state = reducer(initialState, saveLegalInfo(payload));

    expect(state.legalInfo).toEqual(payload);
    expect(state.basicInfo).toEqual({});
    expect(state.jobDetails).toEqual({});
  });

  it("should clear employee form", () => {
    const populatedState = {
      basicInfo: {
        first_name: "John",
      },
      jobDetails: {
        department: "IT",
      },
      legalInfo: {
        passport: "ABC123",
      },
    };

    const state = reducer(
      populatedState,
      clearEmployeeForm()
    );

    expect(state).toEqual({
      basicInfo: {},
      jobDetails: {},
      legalInfo: {},
    });
  });

  it("should overwrite existing basic info", () => {
    const state1 = reducer(
      initialState,
      saveBasicInfo({ first_name: "John" })
    );

    const state2 = reducer(
      state1,
      saveBasicInfo({ first_name: "Jane" })
    );

    expect(state2.basicInfo).toEqual({
      first_name: "Jane",
    });
  });

  it("should overwrite existing job details", () => {
    const state1 = reducer(
      initialState,
      saveJobDetails({ department: "HR" })
    );

    const state2 = reducer(
      state1,
      saveJobDetails({ department: "Finance" })
    );

    expect(state2.jobDetails).toEqual({
      department: "Finance",
    });
  });

  it("should overwrite existing legal info", () => {
    const state1 = reducer(
      initialState,
      saveLegalInfo({ passport: "11111" })
    );

    const state2 = reducer(
      state1,
      saveLegalInfo({ passport: "22222" })
    );

    expect(state2.legalInfo).toEqual({
      passport: "22222",
    });
  });
});
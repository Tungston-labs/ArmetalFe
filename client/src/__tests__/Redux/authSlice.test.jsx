import { describe, it, expect } from "vitest";
import reducer, {
    login,
    logout,
    setAccessToken,
    setUser,
    fetchEmployeeDash,
} from "../../Redux/authSlice";

describe("authSlice", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });

    it("should return the initial state", () => {
        expect(initialState).toEqual({
            userName: null,
            accessToken: null,
            user: null,
            employeeDashData: null,
            loadingEmployeeDash: false,
            employeeDashError: null,
        });
    });

    describe("login", () => {
        it("should store login details", () => {
            const payload = {
                userName: "john",
                accessToken: "token123",
                user: {
                    id: 1,
                    name: "John Doe",
                },
            };

            const state = reducer(initialState, login(payload));

            expect(state.userName).toBe("john");
            expect(state.accessToken).toBe("token123");
            expect(state.user).toEqual(payload.user);
        });
    });

    describe("logout", () => {
        it("should clear auth state", () => {
            const loggedInState = {
                userName: "john",
                accessToken: "token123",
                user: {
                    id: 1,
                },
                employeeDashData: {
                    attendance: 10,
                },
                loadingEmployeeDash: true,
                employeeDashError: "Some Error",
            };

            const state = reducer(loggedInState, logout());

            expect(state).toEqual({
                userName: null,
                accessToken: null,
                user: null,
                employeeDashData: null,
                loadingEmployeeDash: false,
                employeeDashError: null,
            });
        });
    });

    describe("setAccessToken", () => {
        it("should update access token", () => {
            const state = reducer(
                initialState,
                setAccessToken({
                    accessToken: "new-token",
                })
            );

            expect(state.accessToken).toBe("new-token");
        });
    });

    describe("setUser", () => {
        it("should update user", () => {
            const user = {
                id: 10,
                name: "Alice",
                role: "Admin",
            };

            const state = reducer(initialState, setUser(user));

            expect(state.user).toEqual(user);
        });
    });

    describe("fetchEmployeeDash", () => {
        it("should handle pending", () => {
            const state = reducer(
                initialState,
                fetchEmployeeDash.pending("", 1)
            );

            expect(state.loadingEmployeeDash).toBe(true);
            expect(state.employeeDashError).toBeNull();
        });

        it("should handle fulfilled", () => {
            const payload = {
                attendance: 22,
                leave: 5,
            };

            const state = reducer(
                initialState,
                fetchEmployeeDash.fulfilled(payload, "", 1)
            );

            expect(state.loadingEmployeeDash).toBe(false);
            expect(state.employeeDashData).toEqual(payload);
            expect(state.employeeDashError).toBeNull();
        });

        it("should handle rejected with payload", () => {
            const state = reducer(
                initialState,
                fetchEmployeeDash.rejected(
                    null,
                    "",
                    1,
                    "Dashboard Error"
                )
            );

            expect(state.loadingEmployeeDash).toBe(false);
            expect(state.employeeDashError).toBe("Dashboard Error");
        });

        it("should use default error when payload is undefined", () => {
            const state = reducer(
                initialState,
                fetchEmployeeDash.rejected(
                    null,
                    "",
                    1,
                    undefined
                )
            );

            expect(state.loadingEmployeeDash).toBe(false);
            expect(state.employeeDashError).toBe(
                "Failed to fetch employee data"
            );
        });
    });
});
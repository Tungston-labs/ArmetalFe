import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
}));

/* =========================================================
   REACT REDUX MOCK
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) =>
    selector({
      dashboard: mocks.dashboardState,
    }),
}));

/* =========================================================
   DASHBOARD SLICE MOCK
========================================================= */

vi.mock("../../Redux/dashboardSlice", () => ({
  getDashboardSummary: vi.fn(() => ({
    type: "dashboard/getDashboardSummary",
  })),
}));

/* =========================================================
   NAVBAR MOCK
========================================================= */

vi.mock("../../Components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

/* =========================================================
   LOADER MOCK
========================================================= */

vi.mock("../../Components/Loader", () => ({
  default: ({ size }) => <div data-testid="loader">Loader {size || ""}</div>,
}));

/* =========================================================
   STYLED COMPONENT MOCK
========================================================= */

vi.mock("../../Pages/Dashboard/DashboardNew.Styles", () => ({
  Container: ({ children }) => (
    <div data-testid="dashboard-container">{children}</div>
  ),
}));

/* =========================================================
   IMPORT COMPONENT AFTER MOCKS
========================================================= */

import CardsOnly from "../../Pages/Dashboard/DashboardNew";
import { getDashboardSummary } from "../../Redux/dashboardSlice";

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.dashboardState = {
    summary: null,
    loading: false,
    error: null,
  };

  mocks.dispatch.mockReturnValue({
    unwrap: vi.fn(),
  });

  localStorage.clear();

  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              date: "2025-01-26",
              localName: "Republic Day",
            },
            {
              date: "2025-08-15",
              localName: "Independence Day",
            },
          ]),
      }),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

/* =========================================================
   TESTS
========================================================= */

describe("CardsOnly", () => {
  it("renders Navbar and dashboard container", () => {
    render(<CardsOnly />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();
  });

  it("dispatches getDashboardSummary on mount", () => {
    render(<CardsOnly />);

    expect(getDashboardSummary).toHaveBeenCalledTimes(1);
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "dashboard/getDashboardSummary",
    });
  });

  it("renders correctly when dashboard has no error", () => {
    mocks.dashboardState = {
      summary: {
        totalEmployees: 10,
        totalProjects: 5,
      },
      loading: false,
      error: null,
    };

    render(<CardsOnly />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();
  });

  it("renders error message when dashboard error exists", () => {
    mocks.dashboardState = {
      summary: null,
      loading: false,
      error: "Failed to load dashboard",
    };

    render(<CardsOnly />);

    expect(screen.getByText("Failed to load dashboard")).toBeInTheDocument();

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("fetches public holidays when localStorage cache does not exist", async () => {
    render(<CardsOnly />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://date.nager.at/api/v3/PublicHolidays/2025/IN",
    );
  });

  it("stores formatted holidays in localStorage after successful fetch", async () => {
    render(<CardsOnly />);

    await waitFor(() => {
      expect(localStorage.getItem("publicHolidays2025")).not.toBeNull();
    });

    const stored = JSON.parse(localStorage.getItem("publicHolidays2025"));

    expect(stored).toEqual([
      {
        date: "2025-01-26",
        name: "Republic Day",
        type: "Public Holiday",
      },
      {
        date: "2025-08-15",
        name: "Independence Day",
        type: "Public Holiday",
      },
    ]);
  });

  it("uses cached holidays instead of fetching again", async () => {
    const cachedHolidays = [
      {
        date: "2025-01-26",
        name: "Republic Day",
        type: "Public Holiday",
      },
    ];

    localStorage.setItem("publicHolidays2025", JSON.stringify(cachedHolidays));

    render(<CardsOnly />);

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it("handles holiday API failure without crashing", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<CardsOnly />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("does not overwrite existing cached holidays", async () => {
    const cachedHolidays = [
      {
        date: "2025-12-25",
        name: "Christmas Day",
        type: "Public Holiday",
      },
    ];

    localStorage.setItem("publicHolidays2025", JSON.stringify(cachedHolidays));

    render(<CardsOnly />);

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });

    expect(JSON.parse(localStorage.getItem("publicHolidays2025"))).toEqual(
      cachedHolidays,
    );
  });

  it("renders without crashing when loading is true", () => {
    mocks.dashboardState = {
      summary: null,
      loading: true,
      error: null,
    };

    render(<CardsOnly />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();
  });

  it("handles empty holiday API response", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });

    render(<CardsOnly />);

    await waitFor(() => {
      expect(localStorage.getItem("publicHolidays2025")).toBe("[]");
    });
  });
});

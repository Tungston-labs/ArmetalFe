import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HalfDoughnutChart from "../../Components/HalfDoughnutChart";

/* =========================================================
   MOCKS
========================================================= */

const navigateMock = vi.fn();

const mockDoughnutProps = {
  data: null,
  options: null,
};

/* Mock react-router-dom */
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

/* Mock Chart.js */
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  ArcElement: {},
  Tooltip: {},
}));

/*
  IMPORTANT:
  Do NOT JSON.stringify options here.

  JSON.stringify removes functions such as:
  options.onClick

  We keep the actual object so the navigation
  callback can be tested.
*/
vi.mock("react-chartjs-2", () => ({
  Doughnut: ({ data, options }) => {
    mockDoughnutProps.data = data;
    mockDoughnutProps.options = options;

    return (
      <div data-testid="mock-doughnut">
        Mocked Doughnut Chart
      </div>
    );
  },
}));

/* Mock styled-components */
vi.mock("../../Components/HalfDoughnutChart.Styles", () => ({
  ChartContainer: ({ children, ...props }) => (
    <div data-testid="chart-container" {...props}>
      {children}
    </div>
  ),

  CenterText: ({ children, ...props }) => (
    <div data-testid="center-text" {...props}>
      {children}
    </div>
  ),

  CenterTitle: ({ children, ...props }) => (
    <h1 data-testid="center-title" {...props}>
      {children}
    </h1>
  ),

  CenterSubtitle: ({ children, ...props }) => (
    <p data-testid="center-subtitle" {...props}>
      {children}
    </p>
  ),

  CustomLegend: ({ children, ...props }) => (
    <div data-testid="custom-legend" {...props}>
      {children}
    </div>
  ),

  LegendItem: ({ children, ...props }) => (
    <div data-testid="legend-item" {...props}>
      {children}
    </div>
  ),

  LegendColor: ({ color, ...props }) => (
    <span
      data-testid="legend-color"
      data-color={color}
      {...props}
    />
  ),

  LegendLabel: ({ children, ...props }) => (
    <span data-testid="legend-label" {...props}>
      {children}
    </span>
  ),
}));

/* =========================================================
   HELPERS
========================================================= */

const renderChart = (active, onLeave) => {
  return render(
    <MemoryRouter>
      <HalfDoughnutChart
        active={active}
        onLeave={onLeave}
      />
    </MemoryRouter>,
  );
};

const setScreenWidth = (width) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

/* =========================================================
   TEST SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mockDoughnutProps.data = null;
  mockDoughnutProps.options = null;

  setScreenWidth(1920);
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("HalfDoughnutChart Component", () => {
  /* =======================================================
     1. RENDERING
  ======================================================= */

  describe("Rendering", () => {
    it("renders the chart container", () => {
      renderChart(70, 30);

      expect(
        screen.getByTestId("chart-container"),
      ).toBeInTheDocument();
    });

    it("renders the doughnut chart", () => {
      renderChart(70, 30);

      expect(
        screen.getByTestId("mock-doughnut"),
      ).toBeInTheDocument();
    });

    it("renders total employees correctly", () => {
      renderChart(70, 30);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("100");
    });

    it("renders total employees for different values", () => {
      renderChart(150, 50);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("200");
    });

    it("renders total employees subtitle", () => {
      renderChart(70, 30);

      expect(
        screen.getByTestId("center-subtitle"),
      ).toHaveTextContent("Total Employees");
    });
  });

  /* =======================================================
     2. CHART DATA
  ======================================================= */

  describe("Chart Data", () => {
    it("passes correct labels to Doughnut", () => {
      renderChart(70, 30);

      expect(mockDoughnutProps.data.labels).toEqual([
        "Active Employees",
        "On Leave Today",
      ]);
    });

    it("passes active and leave values correctly", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([70, 30]);
    });

    it("uses correct background colors", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].backgroundColor,
      ).toEqual(["#2f4ded", "#ff6b5f"]);
    });

    it("uses correct border color", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderColor,
      ).toBe("#fff");
    });

    it("uses correct border radius", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderRadius,
      ).toBe(10);
    });
  });

  /* =======================================================
     3. RESPONSIVE BORDER WIDTH
  ======================================================= */

  describe("Responsive Border Width", () => {
    it("uses border width 10 for screens <= 768", () => {
      setScreenWidth(768);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(10);
    });

    it("uses border width 10 for small mobile screens", () => {
      setScreenWidth(320);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(10);
    });

    it("uses border width 14 for screens between 769 and 1024", () => {
      setScreenWidth(1024);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(14);
    });

    it("uses border width 18 for screens between 1025 and 1440", () => {
      setScreenWidth(1440);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(18);
    });

    it("uses border width 10 for screens between 1441 and 1920", () => {
      setScreenWidth(1920);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(10);
    });

    it("uses border width 26 for screens above 1920", () => {
      setScreenWidth(1921);

      renderChart(70, 30);

      expect(
        mockDoughnutProps.data.datasets[0].borderWidth,
      ).toBe(26);
    });
  });

  /* =======================================================
     4. CHART OPTIONS
  ======================================================= */

  describe("Chart Options", () => {
    it("uses correct rotation", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.rotation,
      ).toBe(-90);
    });

    it("uses correct circumference", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.circumference,
      ).toBe(180);
    });

    it("uses correct cutout", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.cutout,
      ).toBe("80%");
    });

    it("enables responsive mode", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.responsive,
      ).toBe(true);
    });

    it("disables maintainAspectRatio", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.maintainAspectRatio,
      ).toBe(false);
    });

    it("disables default legend", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.plugins.legend.display,
      ).toBe(false);
    });

    it("disables tooltip", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.plugins.tooltip.enabled,
      ).toBe(false);
    });

    it("contains an onClick function", () => {
      renderChart(70, 30);

      expect(
        mockDoughnutProps.options.onClick,
      ).toBeDefined();

      expect(
        typeof mockDoughnutProps.options.onClick,
      ).toBe("function");
    });
  });

  /* =======================================================
     5. CHART CLICK NAVIGATION
  ======================================================= */

  describe("Chart Click Navigation", () => {
    it("navigates to employee attendance when active employees segment is clicked", () => {
      renderChart(70, 30);

      const onClick =
        mockDoughnutProps.options.onClick;

      onClick({}, [
        {
          index: 0,
        },
      ]);

      expect(navigateMock).toHaveBeenCalledTimes(1);

      expect(navigateMock).toHaveBeenCalledWith(
        "/employee-attendance",
      );
    });

    it("navigates to employee on leave when leave segment is clicked", () => {
      renderChart(70, 30);

      const onClick =
        mockDoughnutProps.options.onClick;

      onClick({}, [
        {
          index: 1,
        },
      ]);

      expect(navigateMock).toHaveBeenCalledTimes(1);

      expect(navigateMock).toHaveBeenCalledWith(
        "/employee-on-leave",
      );
    });

    it("does not navigate when no chart element is clicked", () => {
      renderChart(70, 30);

      const onClick =
        mockDoughnutProps.options.onClick;

      onClick({}, []);

      expect(
        navigateMock,
      ).not.toHaveBeenCalled();
    });

    it("does not navigate for an unknown chart index", () => {
      renderChart(70, 30);

      const onClick =
        mockDoughnutProps.options.onClick;

      onClick({}, [
        {
          index: 5,
        },
      ]);

      expect(
        navigateMock,
      ).not.toHaveBeenCalled();
    });

    it("handles multiple clicked elements using the first element", () => {
      renderChart(70, 30);

      const onClick =
        mockDoughnutProps.options.onClick;

      onClick({}, [
        {
          index: 0,
        },
        {
          index: 1,
        },
      ]);

      expect(navigateMock).toHaveBeenCalledTimes(1);

      expect(navigateMock).toHaveBeenCalledWith(
        "/employee-attendance",
      );
    });
  });

  /* =======================================================
     6. LEGEND
  ======================================================= */

  describe("Legend", () => {
    it("renders custom legend", () => {
      renderChart(70, 30);

      expect(
        screen.getByTestId("custom-legend"),
      ).toBeInTheDocument();
    });

    it("renders exactly two legend items", () => {
      renderChart(70, 30);

      expect(
        screen.getAllByTestId("legend-item"),
      ).toHaveLength(2);
    });

    it("renders active employees legend", () => {
      renderChart(70, 30);

      expect(
        screen.getByText("Active Employees"),
      ).toBeInTheDocument();
    });

    it("renders on leave legend", () => {
      renderChart(70, 30);

      expect(
        screen.getByText("On Leave Today"),
      ).toBeInTheDocument();
    });

    it("uses correct active employee legend color", () => {
      renderChart(70, 30);

      const colors =
        screen.getAllByTestId("legend-color");

      expect(
        colors[0].getAttribute("data-color"),
      ).toBe("#2f4ded");
    });

    it("uses correct leave legend color", () => {
      renderChart(70, 30);

      const colors =
        screen.getAllByTestId("legend-color");

      expect(
        colors[1].getAttribute("data-color"),
      ).toBe("#ff6b5f");
    });
  });

  /* =======================================================
     7. EDGE CASES
  ======================================================= */

  describe("Edge Cases", () => {
    it("handles zero active employees", () => {
      renderChart(0, 30);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("30");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([0, 30]);
    });

    it("handles zero employees on leave", () => {
      renderChart(50, 0);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("50");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([50, 0]);
    });

    it("handles both values as zero", () => {
      renderChart(0, 0);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("0");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([0, 0]);
    });

    it("handles numeric string values", () => {
      renderChart("40", "10");

      /*
       * JavaScript:
       * "40" + "10" = "4010"
       *
       * This verifies the actual component behavior.
       */
      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("4010");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual(["40", "10"]);
    });

    it("handles undefined values according to JavaScript addition behavior", () => {
      render(
        <MemoryRouter>
          <HalfDoughnutChart
            active={undefined}
            onLeave={undefined}
          />
        </MemoryRouter>,
      );

      /*
       * undefined + undefined = NaN
       */
      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("NaN");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([undefined, undefined]);
    });

    it("handles null values according to JavaScript addition behavior", () => {
      renderChart(null, null);

      /*
       * null + null = 0
       */
      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("0");
    });

    it("handles negative values", () => {
      renderChart(-10, 20);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("10");

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([-10, 20]);
    });
  });

  /* =======================================================
     8. RE-RENDERING
  ======================================================= */

  describe("Re-rendering", () => {
    it("updates total when props change", () => {
      const { rerender } = render(
        <MemoryRouter>
          <HalfDoughnutChart
            active={10}
            onLeave={20}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("30");

      rerender(
        <MemoryRouter>
          <HalfDoughnutChart
            active={50}
            onLeave={50}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("100");
    });

    it("updates chart data when props change", () => {
      const { rerender } = render(
        <MemoryRouter>
          <HalfDoughnutChart
            active={10}
            onLeave={20}
          />
        </MemoryRouter>,
      );

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([10, 20]);

      rerender(
        <MemoryRouter>
          <HalfDoughnutChart
            active={80}
            onLeave={20}
          />
        </MemoryRouter>,
      );

      expect(
        mockDoughnutProps.data.datasets[0].data,
      ).toEqual([80, 20]);

      expect(
        screen.getByTestId("center-title"),
      ).toHaveTextContent("100");
    });
  });

  /* =======================================================
     9. COMPONENT STRUCTURE
  ======================================================= */

  describe("Component Structure", () => {
    it("contains all major sections", () => {
      renderChart(70, 30);

      const container =
        screen.getByTestId("chart-container");

      const chart =
        screen.getByTestId("mock-doughnut");

      const centerText =
        screen.getByTestId("center-text");

      const legend =
        screen.getByTestId("custom-legend");

      expect(container).toContainElement(chart);
      expect(container).toContainElement(centerText);
      expect(container).toContainElement(legend);
    });

    it("contains center title and subtitle inside center text", () => {
      renderChart(70, 30);

      const centerText =
        screen.getByTestId("center-text");

      const centerTitle =
        screen.getByTestId("center-title");

      const centerSubtitle =
        screen.getByTestId("center-subtitle");

      expect(centerText).toContainElement(
        centerTitle,
      );

      expect(centerText).toContainElement(
        centerSubtitle,
      );
    });

    it("renders exactly one center title", () => {
      renderChart(70, 30);

      expect(
        screen.getAllByTestId("center-title"),
      ).toHaveLength(1);
    });

    it("renders exactly one center subtitle", () => {
      renderChart(70, 30);

      expect(
        screen.getAllByTestId("center-subtitle"),
      ).toHaveLength(1);
    });
  });
});
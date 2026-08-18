import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HalfDoughnutChart from "../../Components/HalfDoughnutChart";

// Mock Chart.js completely to avoid canvas context errors
vi.mock("chart.js/auto", () => ({
  default: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    data: {},
    options: {},
  })),
}));

// Mock react-chartjs-2 Doughnut component
vi.mock("react-chartjs-2", () => ({
  Doughnut: ({ data, options }) => (
    <div
      data-testid="mock-doughnut"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
    >
      Mocked Doughnut Chart
    </div>
  ),
}));

// Mock styled-components/styles
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
    <span data-testid="legend-color" color={color} {...props} />
  ),
  LegendLabel: ({ children, ...props }) => (
    <span data-testid="legend-label" {...props}>
      {children}
    </span>
  ),
}));

// Helper to render component with React Router Context
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("HalfDoughnutChart Component", () => {
  const defaultProps = {
    active: 70,
    onLeave: 30,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    1. RENDERING TESTS
  */
  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    it("should render the Doughnut component", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      expect(screen.getByTestId("mock-doughnut")).toBeInTheDocument();
    });

    it("should render calculated total in center title", () => {
      renderWithRouter(<HalfDoughnutChart active={70} onLeave={30} />);
      expect(screen.getByTestId("center-title")).toHaveTextContent("100");
    });

    it("should render center subtitle correctly", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      expect(screen.getByTestId("center-subtitle")).toBeInTheDocument();
    });

    it("should calculate total correctly for different values", () => {
      renderWithRouter(<HalfDoughnutChart active={150} onLeave={50} />);
      expect(screen.getByTestId("center-title")).toHaveTextContent("200");
    });
  });

  /*
    2. LEGEND TESTS
  */
  describe("Custom Legend", () => {
    it("should render custom legend container", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      expect(screen.getByTestId("custom-legend")).toBeInTheDocument();
    });

    it("should render correct number of legend items", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      const legendItems = screen.getAllByTestId("legend-item");
      expect(legendItems.length).toBeGreaterThan(0);
    });

    it("should handle 0 onLeave count gracefully", () => {
      renderWithRouter(<HalfDoughnutChart active={50} onLeave={0} />);
      expect(screen.getByTestId("center-title")).toHaveTextContent("50");
    });

    it("should handle 0 active count gracefully", () => {
      renderWithRouter(<HalfDoughnutChart active={0} onLeave={25} />);
      expect(screen.getByTestId("center-title")).toHaveTextContent("25");
    });
  });

  /*
    3. CHART CONFIGURATION & OPTIONS TESTS
  */
  describe("Chart Options and Configuration", () => {
    it("should pass correct options to Doughnut component", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      const doughnut = screen.getByTestId("mock-doughnut");
      const options = JSON.parse(doughnut.getAttribute("data-chart-options"));

      expect(options.rotation).toBe(-90);
      expect(options.circumference).toBe(180);
      expect(options.cutout).toBe("80%");
      expect(options.maintainAspectRatio).toBe(false);
      expect(options.responsive).toBe(true);
    });

    it("should disable default chart legend in options", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      const doughnut = screen.getByTestId("mock-doughnut");
      const options = JSON.parse(doughnut.getAttribute("data-chart-options"));

      expect(options.plugins.legend.display).toBe(false);
    });

    it("should disable chart tooltip in options", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);
      const doughnut = screen.getByTestId("mock-doughnut");
      const options = JSON.parse(doughnut.getAttribute("data-chart-options"));

      expect(options.plugins.tooltip.enabled).toBe(false);
    });
  });

  describe("Edge Cases and Fallbacks", () => {
    it("should handle undefined or null props safely", () => {
      renderWithRouter(
        <HalfDoughnutChart active={undefined} onLeave={undefined} />,
      );
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    it("should handle string numbers passed as props", () => {
      renderWithRouter(<HalfDoughnutChart active={40} onLeave={10} />);
      expect(screen.getByTestId("center-title")).toHaveTextContent("50");
    });
  });

  describe("Props Updates & Re-rendering", () => {
    it("should update rendered total when active/onLeave props change", () => {
      const { rerender } = render(
        <MemoryRouter>
          <HalfDoughnutChart active={10} onLeave={20} />
        </MemoryRouter>,
      );
      expect(screen.getByTestId("center-title")).toHaveTextContent("30");

      rerender(
        <MemoryRouter>
          <HalfDoughnutChart active={50} onLeave={50} />
        </MemoryRouter>,
      );
      expect(screen.getByTestId("center-title")).toHaveTextContent("100");
    });
  });

  describe("Structure", () => {
    it("should maintain expected component hierarchy", () => {
      renderWithRouter(<HalfDoughnutChart {...defaultProps} />);

      const container = screen.getByTestId("chart-container");
      const centerText = screen.getByTestId("center-text");
      const customLegend = screen.getByTestId("custom-legend");

      expect(container).toContainElement(centerText);
      expect(container).toContainElement(customLegend);
      expect(centerText).toContainElement(screen.getByTestId("center-title"));
    });
  });
});
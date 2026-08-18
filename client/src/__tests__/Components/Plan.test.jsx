import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
  apiPost: vi.fn(),
  useParams: vi.fn(),
  print: vi.fn(),
}));

/* =========================================================
   API MOCK
========================================================= */

vi.mock("../../services/api.js", () => ({
  default: {
    get: mocks.apiGet,
    patch: mocks.apiPatch,
    post: mocks.apiPost,
  },
}));

/* =========================================================
   ROUTER MOCK
========================================================= */

vi.mock("react-router-dom", () => ({
  useParams: mocks.useParams,
}));

/* =========================================================
   PRINT MOCK
========================================================= */

vi.mock("react-to-print", () => ({
  useReactToPrint: () => mocks.print,
}));

/* =========================================================
   INVOICE MOCK
========================================================= */

vi.mock("../../Pages/superAdmin/print/Invoice.jsx", () => ({
  default: ({ entry, company }) => (
    <div data-testid="invoice">
      Invoice - {entry?.id} - {company?.name}
    </div>
  ),
}));

/* =========================================================
   ICON MOCKS
========================================================= */

vi.mock("react-icons/md", () => ({
  MdOutlineFileDownload: () => (
    <span data-testid="download-icon">Download Icon</span>
  ),
}));

vi.mock("react-icons/sl", () => ({
  SlCalender: () => <span data-testid="calendar-icon">Calendar Icon</span>,
}));

vi.mock("react-icons/vsc", () => ({
  VscSend: () => <span data-testid="send-icon">Send Icon</span>,
}));

/* =========================================================
   COMPONENT
========================================================= */

import PaymentOverview from "../../Components/Plan";

/* =========================================================
   TEST DATA
========================================================= */

const companyData = {
  id: 10,
  name: "Armetal Corp",
};

const mockSubscriptions = [
  {
    id: 101,
    month_display: "January 2026",
    paid_date: "2026-01-05",
    amount: "$500",
    status: "paid",
    company: 10,
  },
  {
    id: 102,
    month_display: "February 2026",
    paid_date: null,
    amount: "$500",
    status: "unpaid",
    company: 10,
  },
];

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.useParams.mockReturnValue({
    id: "10",
  });

  mocks.apiGet.mockResolvedValue({
    data: {
      company: companyData,
      subscriptions: mockSubscriptions,
    },
  });

  mocks.apiPatch.mockResolvedValue({
    data: {
      success: true,
    },
  });

  mocks.apiPost.mockResolvedValue({
    data: {
      success: true,
    },
  });

  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe("PaymentOverview Component", () => {
  it("renders static elements correctly", () => {
    render(<PaymentOverview companyId="10" />);

    expect(screen.getByText("Payment Overview")).toBeInTheDocument();

    expect(screen.getByText("Enterprise plan")).toBeInTheDocument();
  });

  it("renders subscription table rows when API returns data", async () => {
    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("January 2026")).toBeInTheDocument();

    expect(screen.getByText("February 2026")).toBeInTheDocument();

    expect(screen.getAllByText("$500")).toHaveLength(2);

    expect(screen.getByText("paid")).toBeInTheDocument();

    expect(screen.getByText("unpaid")).toBeInTheDocument();

    expect(mocks.apiGet).toHaveBeenCalledWith("/subscriptions/10/");
  });

  it("sends email successfully and triggers alert", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const sendIcons = screen.getAllByTestId("send-icon");

    expect(sendIcons).toHaveLength(2);

    fireEvent.click(sendIcons[0]);

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledWith("/invoice/send-email/", {
        entry: mockSubscriptions[0],
        company_id: 10,
      });
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Invoice email sent successfully.",
    );
  });

  it("shows failure alert when send email API fails", async () => {
    mocks.apiPost.mockRejectedValueOnce(new Error("API Error"));

    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const sendIcons = screen.getAllByTestId("send-icon");

    fireEvent.click(sendIcons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to send invoice email.",
      );
    });
  });
});

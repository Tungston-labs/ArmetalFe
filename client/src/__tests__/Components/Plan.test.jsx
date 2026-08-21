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
  /* =======================================================
     STATIC UI
  ======================================================= */

  it("renders static elements correctly", () => {
    render(<PaymentOverview companyId="10" />);

    expect(screen.getByText("Payment Overview")).toBeInTheDocument();

    expect(screen.getByText("Enterprise plan")).toBeInTheDocument();

    expect(
      screen.getByText(/Pay a fixed amount per employee/i),
    ).toBeInTheDocument();

    expect(screen.getByAltText("Plan Icon")).toBeInTheDocument();

    expect(screen.getByText("Month")).toBeInTheDocument();

    expect(screen.getByText("Paid date")).toBeInTheDocument();

    expect(screen.getByText("Amount")).toBeInTheDocument();

    expect(screen.getByText("Status")).toBeInTheDocument();

    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  /* =======================================================
     COMPANY ID FROM PROP
  ======================================================= */

  it("uses companyId from props when provided", async () => {
    render(<PaymentOverview companyId="25" />);

    await waitFor(() => {
      expect(mocks.apiGet).toHaveBeenCalledWith("/subscriptions/25/");
    });
  });

  /* =======================================================
     COMPANY ID FROM URL
  ======================================================= */

  it("uses companyId from URL params when prop is not provided", async () => {
    mocks.useParams.mockReturnValue({
      id: "99",
    });

    render(<PaymentOverview />);

    await waitFor(() => {
      expect(mocks.apiGet).toHaveBeenCalledWith("/subscriptions/99/");
    });
  });

  /* =======================================================
     NO COMPANY ID
  ======================================================= */

  it("does not fetch payment data when companyId is unavailable", () => {
    mocks.useParams.mockReturnValue({
      id: undefined,
    });

    render(<PaymentOverview />);

    expect(mocks.apiGet).not.toHaveBeenCalled();
  });

  /* =======================================================
     API SUCCESS
  ======================================================= */

  it("renders subscription table rows when API returns data", async () => {
    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("January 2026")).toBeInTheDocument();

    expect(screen.getByText("February 2026")).toBeInTheDocument();

    expect(screen.getAllByText("$500")).toHaveLength(2);

    expect(screen.getByText("paid")).toBeInTheDocument();

    expect(screen.getByText("unpaid")).toBeInTheDocument();

    expect(mocks.apiGet).toHaveBeenCalledWith("/subscriptions/10/");
  });

  /* =======================================================
     PAID DATE
  ======================================================= */

  it("renders paid date when paid_date exists", async () => {
    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("2026-01-05")).toBeInTheDocument();

    expect(screen.getAllByTestId("calendar-icon")).toHaveLength(2);
  });

  /* =======================================================
     EMPTY PAID DATE
  ======================================================= */

  it("renders dash when paid_date is missing", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("February 2026");

    const dash = screen.getByText("-");

    expect(dash).toBeInTheDocument();
  });

  /* =======================================================
     EMPTY SUBSCRIPTIONS
  ======================================================= */

  it("renders No records found when subscriptions are empty", async () => {
    mocks.apiGet.mockResolvedValueOnce({
      data: {
        company: companyData,
        subscriptions: [],
      },
    });

    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("No records found.")).toBeInTheDocument();
  });

  /* =======================================================
     API RESPONSE WITHOUT .data
  ======================================================= */

  it("handles API response directly without data property", async () => {
    mocks.apiGet.mockResolvedValueOnce({
      company: companyData,
      subscriptions: [
        {
          id: 200,
          month_display: "March 2026",
          paid_date: "2026-03-01",
          amount: "$700",
          status: "paid",
          company: 10,
        },
      ],
    });

    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("March 2026")).toBeInTheDocument();
  });

  /* =======================================================
     API RESPONSE WITHOUT COMPANY
  ======================================================= */

  it("handles response without company", async () => {
    mocks.apiGet.mockResolvedValueOnce({
      data: {
        subscriptions: [
          {
            id: 201,
            month_display: "April 2026",
            paid_date: null,
            amount: "$800",
            status: "unpaid",
            company: 10,
          },
        ],
      },
    });

    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("April 2026")).toBeInTheDocument();
  });

  /* =======================================================
     API RESPONSE WITHOUT SUBSCRIPTIONS
  ======================================================= */

  it("handles response without subscriptions", async () => {
    mocks.apiGet.mockResolvedValueOnce({
      data: {
        company: companyData,
      },
    });

    render(<PaymentOverview companyId="10" />);

    expect(await screen.findByText("No records found.")).toBeInTheDocument();
  });

  /* =======================================================
     FETCH ERROR
  ======================================================= */

  it("handles payment API failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.apiGet.mockRejectedValueOnce(new Error("Fetch failed"));

    render(<PaymentOverview companyId="10" />);

    await waitFor(() => {
      expect(mocks.apiGet).toHaveBeenCalledWith("/subscriptions/10/");
    });

    expect(await screen.findByText("No records found.")).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  /* =======================================================
     STATUS BUTTONS
  ======================================================= */

  it("renders paid status button", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const paidButton = screen.getByRole("button", {
      name: "paid",
    });

    expect(paidButton).toBeInTheDocument();

    expect(paidButton.style.backgroundColor).toBe("rgb(76, 175, 80)");
  });

  it("renders unpaid status button", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("February 2026");

    const unpaidButton = screen.getByRole("button", {
      name: "unpaid",
    });

    expect(unpaidButton).toBeInTheDocument();

    expect(unpaidButton.style.backgroundColor).toBe("rgb(242, 139, 130)");
  });

  /* =======================================================
     PAID -> UNPAID
  ======================================================= */

  it("changes paid subscription to unpaid", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const paidButton = screen.getByRole("button", {
      name: "paid",
    });

    fireEvent.click(paidButton);

    await waitFor(() => {
      expect(mocks.apiPatch).toHaveBeenCalledWith(
        "/subscriptions/mark-paid/101/",
        {
          status: "unpaid",
        },
      );
    });

    await waitFor(() => {
      expect(mocks.apiGet).toHaveBeenCalledTimes(2);
    });
  });

  /* =======================================================
     UNPAID -> PAID
  ======================================================= */

  it("changes unpaid subscription to paid", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("February 2026");

    const unpaidButton = screen.getByRole("button", {
      name: "unpaid",
    });

    fireEvent.click(unpaidButton);

    await waitFor(() => {
      expect(mocks.apiPatch).toHaveBeenCalledWith(
        "/subscriptions/mark-paid/102/",
        {
          status: "paid",
        },
      );
    });

    await waitFor(() => {
      expect(mocks.apiGet).toHaveBeenCalledTimes(2);
    });
  });

  /* =======================================================
     PATCH ERROR
  ======================================================= */

  it("handles status change API failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.apiPatch.mockRejectedValueOnce(new Error("Patch failed"));

    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const paidButton = screen.getByRole("button", {
      name: "paid",
    });

    fireEvent.click(paidButton);

    await waitFor(() => {
      expect(mocks.apiPatch).toHaveBeenCalledWith(
        "/subscriptions/mark-paid/101/",
        {
          status: "unpaid",
        },
      );
    });

    expect(mocks.apiGet).toHaveBeenCalledTimes(1);

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  /* =======================================================
     DOWNLOAD / PRINT
  ======================================================= */

  it("selects invoice and triggers print when download is clicked", async () => {
    vi.useFakeTimers();

    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const downloadButtons = screen.getAllByTitle("Download");

    expect(downloadButtons).toHaveLength(2);

    fireEvent.click(downloadButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId("invoice")).toBeInTheDocument();
    });

    expect(screen.getByText(/Invoice - 101/)).toBeInTheDocument();

    vi.advanceTimersByTime(100);

    expect(mocks.print).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  /* =======================================================
     DOWNLOAD SECOND INVOICE
  ======================================================= */

  it("selects the second invoice correctly", async () => {
    vi.useFakeTimers();

    render(<PaymentOverview companyId="10" />);

    await screen.findByText("February 2026");

    const downloadButtons = screen.getAllByTitle("Download");

    fireEvent.click(downloadButtons[1]);

    await waitFor(() => {
      expect(screen.getByText(/Invoice - 102/)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(100);

    expect(mocks.print).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  /* =======================================================
     INVOICE COMPANY
  ======================================================= */

  it("passes company data to Invoice", async () => {
    vi.useFakeTimers();

    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    const downloadButtons = screen.getAllByTitle("Download");

    fireEvent.click(downloadButtons[0]);

    expect(
      await screen.findByText("Invoice - 101 - Armetal Corp"),
    ).toBeInTheDocument();

    vi.advanceTimersByTime(100);

    expect(mocks.print).toHaveBeenCalled();

    vi.useRealTimers();
  });

  /* =======================================================
     SEND EMAIL SUCCESS
  ======================================================= */

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

  /* =======================================================
     SEND SECOND EMAIL
  ======================================================= */

  it("sends email for the second subscription", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("February 2026");

    const sendIcons = screen.getAllByTestId("send-icon");

    fireEvent.click(sendIcons[1]);

    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledWith("/invoice/send-email/", {
        entry: mockSubscriptions[1],
        company_id: 10,
      });
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Invoice email sent successfully.",
    );
  });

  /* =======================================================
     SEND EMAIL FAILURE
  ======================================================= */

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

  /* =======================================================
     ICON COUNTS
  ======================================================= */

  it("renders download and send icons for every subscription", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    expect(screen.getAllByTestId("download-icon")).toHaveLength(2);

    expect(screen.getAllByTestId("send-icon")).toHaveLength(2);

    expect(screen.getAllByTestId("calendar-icon")).toHaveLength(2);
  });

  /* =======================================================
     BUTTON TITLES
  ======================================================= */

  it("renders correct button titles", async () => {
    render(<PaymentOverview companyId="10" />);

    await screen.findByText("January 2026");

    expect(screen.getAllByTitle("Download")).toHaveLength(2);

    expect(screen.getAllByTitle("Import")).toHaveLength(2);
  });
});

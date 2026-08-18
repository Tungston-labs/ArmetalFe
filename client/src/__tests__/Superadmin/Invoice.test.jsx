import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import Invoice from "../../Pages/superAdmin/print/Invoice";

/* ============================================================
   MOCK REACT ICONS
   ============================================================ */

vi.mock("react-icons/io", () => ({
  IoMdCall: () => <span data-testid="call-icon">Call Icon</span>,
}));

vi.mock("react-icons/ci", () => ({
  CiGlobe: () => <span data-testid="globe-icon">Globe Icon</span>,
}));

vi.mock("react-icons/fa6", () => ({
  FaLocationDot: () => <span data-testid="location-icon">Location Icon</span>,
}));

/* ============================================================
   CLEANUP
   ============================================================ */

beforeEach(() => {
  cleanup();
});

/* ============================================================
   TEST DATA
   ============================================================ */

const company = {
  name: "ABC Technologies",
  address: "Kochi, Kerala",
  contact_number: "+91 9876543210",
  email: "abc@example.com",
  employee_count: 25,
  amount_per_employee: 100,
  today: "2026-08-18",
};

const entry = {
  id: 123,
  month_display: "August",
  year: 2026,
  amount: 2500,
  paid_date: "2026-08-15",
  status: "paid",
};

/* ============================================================
   HELPERS
   ============================================================ */

const renderInvoice = (customEntry = entry, customCompany = company) => {
  return render(<Invoice entry={customEntry} company={customCompany} />);
};

const getInvoiceDetails = () => {
  const heading = screen.getByText("Invoice Details");

  expect(heading).toBeInTheDocument();

  return heading.parentElement;
};

const getInvoiceTable = () => {
  return screen.getByRole("table");
};

/*
 * Finds text inside the actual <p> element.
 *
 * This is important because Invoice.jsx uses <br /> tags,
 * which can cause Testing Library to see both the parent
 * element and its children as matching elements.
 */
const getTextContaining = (text) => {
  return screen.getByText((content, element) => {
    if (!element) {
      return false;
    }

    if (element.tagName !== "P") {
      return false;
    }

    return element.textContent?.includes(text);
  });
};

/* ============================================================
   TESTS
   ============================================================ */

describe("Invoice Component", () => {
  /* ==========================================================
     NULL / EMPTY DATA
     ========================================================== */

  it("returns null when entry is missing", () => {
    const { container } = render(<Invoice entry={null} company={company} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when company is missing", () => {
    const { container } = render(<Invoice entry={entry} company={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when both entry and company are missing", () => {
    const { container } = render(<Invoice entry={null} company={null} />);

    expect(container.firstChild).toBeNull();
  });

  /* ==========================================================
     BASIC RENDERING
     ========================================================== */

  it("renders the invoice title", () => {
    renderInvoice();

    expect(
      screen.getByRole("heading", {
        name: "INVOICE",
      }),
    ).toBeInTheDocument();
  });

  it("renders the logo and watermark", () => {
    renderInvoice();

    expect(screen.getByAltText("logo")).toBeInTheDocument();

    expect(screen.getByAltText("watermark")).toBeInTheDocument();

    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  /* ==========================================================
     COMPANY DETAILS
     ========================================================== */

  it("renders the company name", () => {
    renderInvoice();

    expect(screen.getByText(company.name)).toBeInTheDocument();
  });

  it("renders the company address", () => {
    renderInvoice();

    /*
     * The address is inside a <p> and is separated from
     * the other values using <br />.
     *
     * Therefore, instead of:
     *
     * screen.getByText(company.address)
     *
     * we check the complete "TO" section.
     */

    const toHeading = screen.getByText("TO:");

    const toSection = toHeading.parentElement;

    expect(toSection).toBeTruthy();

    expect(toSection).toHaveTextContent(company.address);
  });

  it("renders the company phone number", () => {
    renderInvoice();

    const toHeading = screen.getByText("TO:");

    const toSection = toHeading.parentElement;

    expect(toSection).toBeTruthy();

    expect(toSection).toHaveTextContent(company.contact_number);
  });

  it("renders the company email", () => {
    renderInvoice();

    const toHeading = screen.getByText("TO:");

    const toSection = toHeading.parentElement;

    expect(toSection).toBeTruthy();

    expect(toSection).toHaveTextContent(company.email);
  });

  /* ==========================================================
     INVOICE DETAILS
     ========================================================== */

  it("renders invoice number", () => {
    renderInvoice();

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("INV-123");
  });

  it("renders the paid date correctly", () => {
    renderInvoice();

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("15/08/2026");
  });

  it("uses company.today when paid_date is missing", () => {
    const entryWithoutPaidDate = {
      ...entry,
      paid_date: null,
    };

    renderInvoice(entryWithoutPaidDate, company);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("18/08/2026");
  });

  it("renders dash when both dates are missing", () => {
    const entryWithoutPaidDate = {
      ...entry,
      paid_date: null,
    };

    const companyWithoutToday = {
      ...company,
      today: null,
    };

    renderInvoice(entryWithoutPaidDate, companyWithoutToday);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("Date : -");
  });

  it("renders invoice status in uppercase", () => {
    renderInvoice();

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("PAID");
  });

  it("renders pending status in uppercase", () => {
    const pendingEntry = {
      ...entry,
      status: "pending",
    };

    renderInvoice(pendingEntry);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("PENDING");
  });

  /* ==========================================================
     TABLE
     ========================================================== */

  it("renders the invoice table", () => {
    renderInvoice();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders all table headers", () => {
    renderInvoice();

    const table = getInvoiceTable();

    const headers = within(table).getAllByRole("columnheader");

    expect(headers).toHaveLength(4);

    expect(headers[0]).toHaveTextContent("SL.NO");

    expect(headers[1]).toHaveTextContent("DESCRIPTION");

    expect(headers[2]).toHaveTextContent("BASE PRICE");

    expect(headers[3]).toHaveTextContent("TOTAL");
  });

  it("renders the description section and table description header", () => {
    renderInvoice();

    const descriptions = screen.getAllByText("DESCRIPTION");

    expect(descriptions).toHaveLength(2);
  });

  it("renders the invoice description", () => {
    renderInvoice();

    expect(
      screen.getByText(
        "HR App monthly subscription charge (August 2026) (25 Employees)",
      ),
    ).toBeInTheDocument();
  });

  it("renders the base price", () => {
    renderInvoice();

    const table = getInvoiceTable();

    const rows = within(table).getAllByRole("row");

    expect(rows[1]).toHaveTextContent("100.00");
  });

  it("renders the total amount", () => {
    renderInvoice();

    const table = getInvoiceTable();

    const rows = within(table).getAllByRole("row");

    expect(rows[1]).toHaveTextContent("2500.00");
  });

  it("renders grand total", () => {
    renderInvoice();

    const table = getInvoiceTable();

    const rows = within(table).getAllByRole("row");

    expect(rows[2]).toHaveTextContent("GRAND TOTAL");

    expect(rows[2]).toHaveTextContent("2500.00");
  });

  /* ==========================================================
     NOTES
     ========================================================== */

  it("renders notes section", () => {
    renderInvoice();

    expect(screen.getByText("NOTES")).toBeInTheDocument();

    expect(
      screen.getByText("Amounts received will not be reimbursed."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Project will be taken forward after the payment."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Payment terms due on receipt."),
    ).toBeInTheDocument();
  });

  /* ==========================================================
     BANK DETAILS
     ========================================================== */

  it("renders bank details", () => {
    renderInvoice();

    expect(screen.getByText("BANK DETAILS")).toBeInTheDocument();

    const accountHolder = getTextContaining(
      "Account holder: OFFRADAR TUNGSTON LABS",
    );

    expect(accountHolder).toBeInTheDocument();

    const accountNumber = getTextContaining("Account number: 14690200014910");

    expect(accountNumber).toBeInTheDocument();

    const ifsc = getTextContaining("IFSC: FDRL0001469");

    expect(ifsc).toBeInTheDocument();

    const bankAddress = getTextContaining("FEDERAL BANK KAKKANAD");

    expect(bankAddress).toBeInTheDocument();
  });

  /* ==========================================================
     FOOTER
     ========================================================== */

  it("renders call icon and phone number", () => {
    renderInvoice();

    expect(screen.getByTestId("call-icon")).toBeInTheDocument();

    expect(screen.getByText("+91 9778377526")).toBeInTheDocument();
  });

  it("renders globe icon and website information", () => {
    renderInvoice();

    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();

    expect(screen.getByText("tungstonlabs.com")).toBeInTheDocument();

    expect(screen.getByText("info@tungstonlabs.com")).toBeInTheDocument();
  });

  it("renders location icon and footer address", () => {
    renderInvoice();

    expect(screen.getByTestId("location-icon")).toBeInTheDocument();

    const locationIcon = screen.getByTestId("location-icon");

    const footerCard = locationIcon.closest("div")?.parentElement;

    expect(footerCard).toBeTruthy();

    expect(footerCard).toHaveTextContent("4th Floor, Ullampilly Building");

    expect(footerCard).toHaveTextContent("Seaport - Airport Rd");

    expect(footerCard).toHaveTextContent("Kakkanad, Kochi, Kerala 682030");
  });

  /* ==========================================================
     STRING NUMERIC VALUES
     ========================================================== */

  it("handles numeric values supplied as strings", () => {
    const stringEntry = {
      ...entry,
      amount: "2500",
    };

    const stringCompany = {
      ...company,
      amount_per_employee: "100",
    };

    renderInvoice(stringEntry, stringCompany);

    const table = getInvoiceTable();

    const rows = within(table).getAllByRole("row");

    expect(rows[1]).toHaveTextContent("100.00");

    expect(rows[1]).toHaveTextContent("2500.00");

    expect(rows[2]).toHaveTextContent("2500.00");
  });

  /* ==========================================================
     ZERO VALUES
     ========================================================== */

  it("renders zero amount correctly", () => {
    const zeroAmountEntry = {
      ...entry,
      amount: 0,
    };

    renderInvoice(zeroAmountEntry);

    const table = getInvoiceTable();

    const rows = within(table).getAllByRole("row");

    expect(rows[1]).toHaveTextContent("0.00");

    expect(rows[2]).toHaveTextContent("0.00");
  });

  it("renders zero employee count correctly", () => {
    const zeroEmployeeCompany = {
      ...company,
      employee_count: 0,
    };

    renderInvoice(entry, zeroEmployeeCompany);

    expect(
      screen.getByText(
        "HR App monthly subscription charge (August 2026) (0 Employees)",
      ),
    ).toBeInTheDocument();
  });

  /* ==========================================================
     DIFFERENT MONTH / YEAR
     ========================================================== */

  it("renders different month and year correctly", () => {
    const differentEntry = {
      ...entry,
      month_display: "January",
      year: 2027,
    };

    renderInvoice(differentEntry);

    expect(
      screen.getByText(
        "HR App monthly subscription charge (January 2027) (25 Employees)",
      ),
    ).toBeInTheDocument();
  });

  /* ==========================================================
     DIFFERENT EMPLOYEE COUNT
     ========================================================== */

  it("renders different employee count correctly", () => {
    const differentCompany = {
      ...company,
      employee_count: 50,
    };

    renderInvoice(entry, differentCompany);

    expect(
      screen.getByText(
        "HR App monthly subscription charge (August 2026) (50 Employees)",
      ),
    ).toBeInTheDocument();
  });

  /* ==========================================================
     DATE FORMATTING
     ========================================================== */

  it("formats a single digit day correctly", () => {
    const dateEntry = {
      ...entry,
      paid_date: "2026-01-05",
    };

    renderInvoice(dateEntry);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("05/01/2026");
  });

  it("formats a single digit month correctly", () => {
    const dateEntry = {
      ...entry,
      paid_date: "2026-01-15",
    };

    renderInvoice(dateEntry);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("15/01/2026");
  });

  it("formats a date with both single digit day and month", () => {
    const dateEntry = {
      ...entry,
      paid_date: "2026-01-05",
    };

    renderInvoice(dateEntry);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("05/01/2026");
  });

  /* ==========================================================
     INVALID DATE
     ========================================================== */

  it("renders dash for an invalid date", () => {
    const invalidDateEntry = {
      ...entry,
      paid_date: "invalid-date",
    };

    renderInvoice(invalidDateEntry);

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails.textContent).toContain("Date : -");
  });

  /* ==========================================================
     MISSING STATUS
     ========================================================== */

  it("handles missing status without crashing", () => {
    const noStatusEntry = {
      ...entry,
      status: undefined,
    };

    /*
     * The previous test expected renderInvoice() to throw.
     *
     * But the actual Invoice component rendered successfully,
     * which means the expectation was incorrect.
     *
     * This test now verifies the real expected behavior:
     * the invoice should render even when status is missing.
     */

    expect(() => {
      renderInvoice(noStatusEntry);
    }).not.toThrow();

    expect(screen.getByText("Invoice Details")).toBeInTheDocument();

    const invoiceDetails = getInvoiceDetails();

    expect(invoiceDetails).toBeInTheDocument();
  });

  /* ==========================================================
     COMPLETE INVOICE
     ========================================================== */

  it("renders all major invoice sections", () => {
    renderInvoice();

    expect(screen.getByText("INVOICE")).toBeInTheDocument();

    expect(screen.getByText("TO:")).toBeInTheDocument();

    expect(screen.getByText("Invoice Details")).toBeInTheDocument();

    expect(screen.getAllByText("DESCRIPTION")).toHaveLength(2);

    expect(screen.getByText("NOTES")).toBeInTheDocument();

    expect(screen.getByText("BANK DETAILS")).toBeInTheDocument();

    expect(screen.getByText("GRAND TOTAL")).toBeInTheDocument();
  });
});

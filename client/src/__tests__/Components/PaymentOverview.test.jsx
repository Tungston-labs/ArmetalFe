import React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

/* =========================================================
   PAYMENT DATA USED TO COVER ALL COMPONENT LOGIC
========================================================= */

const paymentData = [
  {
    month: "January",
    date: "2026-01-15",
    amount: "$500",
    status: "Paid",
  },
  {
    month: "February",
    date: "not-a-valid-date",
    amount: "$600",
    status: "Un-Paid",
  },
  {
    month: "March",
    date: "",
    amount: "$700",
    status: "Paid",
  },
];

/* =========================================================
   MOCK REACT useState
   The actual component starts with [].

   For testing, we provide payment records so that:
   - map() executes
   - formatDate() executes
   - status change executes
   - buttons inside rows execute
========================================================= */

vi.mock("react", async () => {
  const actual = await vi.importActual("react");

  return {
    ...actual,

    useState: (initialValue) => {
      if (Array.isArray(initialValue) && initialValue.length === 0) {
        return actual.useState([
          {
            month: "January",
            date: "2026-01-15",
            amount: "$500",
            status: "Paid",
          },
          {
            month: "February",
            date: "not-a-valid-date",
            amount: "$600",
            status: "Un-Paid",
          },
          {
            month: "March",
            date: "",
            amount: "$700",
            status: "Paid",
          },
        ]);
      }

      return actual.useState(initialValue);
    },
  };
});

/* =========================================================
   MOCK STYLED COMPONENTS
========================================================= */

vi.mock("../../Pages/payroll/PaymentOverview.styles.js", () => ({
  SectionTitle: ({ children }) => (
    <h2 data-testid="section-title">{children}</h2>
  ),

  PlanCard: ({ children }) => (
    <div data-testid="plan-card">{children}</div>
  ),

  PlanIcon: ({ children }) => (
    <div data-testid="plan-icon">{children}</div>
  ),

  PlanDetails: ({ children }) => (
    <div data-testid="plan-details">{children}</div>
  ),

  PlanPrice: ({ children }) => (
    <div data-testid="plan-price">{children}</div>
  ),

  PaymentTable: ({ children }) => (
    <table data-testid="payment-table">{children}</table>
  ),

  TableHead: ({ children }) => <th>{children}</th>,

  TableRow: ({ children, status }) => (
    <tr data-testid="table-row" data-status={status}>
      {children}
    </tr>
  ),

  TableData: ({ children }) => <td>{children}</td>,

  StatusSelect: ({ children, value, onChange }) => (
    <select
      aria-label="Payment status"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  ),

  IconButton: ({ children, title }) => (
    <button type="button" title={title}>
      {children}
    </button>
  ),

  ButtonGroup: ({ children }) => (
    <div data-testid="button-group">{children}</div>
  ),

  CancelButton: ({ children }) => (
    <button type="button">{children}</button>
  ),

  SaveButton: ({ children }) => (
    <button type="button">{children}</button>
  ),
}));

/* =========================================================
   IMPORT COMPONENT
========================================================= */

import PaymentOverview from "../../Pages/payroll/PaymentOverview";

/* =========================================================
   HELPERS
========================================================= */

const renderComponent = () => {
  return render(<PaymentOverview />);
};

/* =========================================================
   SETUP / CLEANUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("PaymentOverview Component - 100% Coverage", () => {
  /* =======================================================
     1. MAIN TITLE
  ======================================================= */

  it("renders Payment Overview title", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", {
        name: "Payment Overview",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     2. SECTION TITLE
  ======================================================= */

  it("renders the section title correctly", () => {
    renderComponent();

    expect(screen.getByTestId("section-title")).toHaveTextContent(
      "Payment Overview",
    );
  });

  /* =======================================================
     3. ENTERPRISE PLAN
  ======================================================= */

  it("renders the enterprise plan", () => {
    renderComponent();

    expect(
      screen.getByText("Enterprise plan"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     4. PLAN DESCRIPTION
  ======================================================= */

  it("renders the complete plan description", () => {
    renderComponent();

    expect(
      screen.getByText(/Pay a fixed \$5 per employee/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Simple, transparent, and ideal for managing individual payroll with ease/i,
      ),
    ).toBeInTheDocument();
  });

  /* =======================================================
     5. PLAN PRICE
  ======================================================= */

  it("renders the plan price", () => {
    renderComponent();

    expect(
      screen.getByTestId("plan-price"),
    ).toHaveTextContent("$5");
  });

  /* =======================================================
     6. PLAN CARD
  ======================================================= */

  it("renders the plan card", () => {
    renderComponent();

    expect(
      screen.getByTestId("plan-card"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     7. PLAN DETAILS
  ======================================================= */

  it("renders plan details container", () => {
    renderComponent();

    expect(
      screen.getByTestId("plan-details"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     8. PLAN ICON
  ======================================================= */

  it("renders the plan icon", () => {
    renderComponent();

    expect(
      screen.getByTestId("plan-icon"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     9. PLAN IMAGE
  ======================================================= */

  it("renders the correct plan image", () => {
    renderComponent();

    const image = screen.getByAltText("Plan Icon");

    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute(
      "src",
      "/images/plan.png",
    );
  });

  /* =======================================================
     10. PAYMENT TABLE
  ======================================================= */

  it("renders payment table", () => {
    renderComponent();

    expect(
      screen.getByTestId("payment-table"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     11. THEAD
  ======================================================= */

  it("renders table header", () => {
    renderComponent();

    const table = screen.getByTestId("payment-table");

    expect(
      table.querySelector("thead"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     12. TBODY
  ======================================================= */

  it("renders table body", () => {
    renderComponent();

    const table = screen.getByTestId("payment-table");

    expect(
      table.querySelector("tbody"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     13. ALL HEADERS
  ======================================================= */

  it("renders all five table headers", () => {
    renderComponent();

    const headers =
      screen.getAllByRole("columnheader");

    expect(headers).toHaveLength(5);

    expect(headers[0]).toHaveTextContent("Month");
    expect(headers[1]).toHaveTextContent("Paid date");
    expect(headers[2]).toHaveTextContent("Amount");
    expect(headers[3]).toHaveTextContent("Status");
    expect(headers[4]).toHaveTextContent("Import");
  });

  /* =======================================================
     14. MONTH HEADER
  ======================================================= */

  it("renders Month header", () => {
    renderComponent();

    expect(
      screen.getByRole("columnheader", {
        name: "Month",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     15. PAID DATE HEADER
  ======================================================= */

  it("renders Paid date header", () => {
    renderComponent();

    expect(
      screen.getByRole("columnheader", {
        name: "Paid date",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     16. AMOUNT HEADER
  ======================================================= */

  it("renders Amount header", () => {
    renderComponent();

    expect(
      screen.getByRole("columnheader", {
        name: "Amount",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     17. STATUS HEADER
  ======================================================= */

  it("renders Status header", () => {
    renderComponent();

    expect(
      screen.getByRole("columnheader", {
        name: "Status",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     18. IMPORT HEADER
  ======================================================= */

  it("renders Import header", () => {
    renderComponent();

    expect(
      screen.getByRole("columnheader", {
        name: "Import",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     19. PAYMENT ROWS
  ======================================================= */

  it("renders all payment rows", () => {
    renderComponent();

    const rows =
      screen.getAllByTestId("table-row");

    expect(rows).toHaveLength(3);
  });

  /* =======================================================
     20. PAYMENT MONTHS
  ======================================================= */

  it("renders payment months", () => {
    renderComponent();

    expect(
      screen.getByText("January"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("February"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("March"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     21. PAYMENT AMOUNTS
  ======================================================= */

  it("renders payment amounts", () => {
    renderComponent();

    expect(
      screen.getByText("$500"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("$600"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("$700"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     22. VALID DATE FORMAT
     Covers:
       const date = new Date(dateStr)
       isNaN(date) === false
       day/month/year formatting
  ======================================================= */

  it("formats valid payment dates correctly", () => {
    renderComponent();

    expect(
      screen.getByText("15/01/2026 📅"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     23. INVALID DATE FORMAT
     Covers:
       if (isNaN(date)) return dateStr
  ======================================================= */

  it("returns original value for invalid date", () => {
    renderComponent();

    expect(
      screen.getByText("not-a-valid-date 📅"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     24. EMPTY DATE
     Covers:
       if (!dateStr) return "---"
  ======================================================= */

  it("returns --- when payment date is empty", () => {
    renderComponent();

    expect(
      screen.getByText("--- 📅"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     25. DATE ICON
  ======================================================= */

  it("renders the calendar icon after payment dates", () => {
    renderComponent();

    const dateCells =
      screen
        .getByTestId("payment-table")
        .querySelectorAll("tbody tr td:nth-child(2)");

    expect(dateCells).toHaveLength(3);

    expect(dateCells[0]).toHaveTextContent(
      "15/01/2026",
    );

    expect(dateCells[1]).toHaveTextContent(
      "not-a-valid-date",
    );

    expect(dateCells[2]).toHaveTextContent(
      "---",
    );
  });

  /* =======================================================
     26. STATUS SELECTS
  ======================================================= */

  it("renders status select for every payment", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    expect(selects).toHaveLength(3);
  });

  /* =======================================================
     27. INITIAL STATUS VALUES
  ======================================================= */

  it("sets the correct initial status values", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    expect(selects[0]).toHaveValue("Paid");
    expect(selects[1]).toHaveValue("Un-Paid");
    expect(selects[2]).toHaveValue("Paid");
  });

  /* =======================================================
     28. STATUS OPTIONS
  ======================================================= */

  it("renders both status options for every payment", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    selects.forEach((select) => {
      expect(
        select.querySelector(
          'option[value="Paid"]',
        ),
      ).toBeInTheDocument();

      expect(
        select.querySelector(
          'option[value="Un-Paid"]',
        ),
      ).toBeInTheDocument();
    });
  });

  /* =======================================================
     29. TABLE ROW STATUS
     IMPORTANT:
     First row = Paid
     Second row = Un-Paid
     Third row = Paid

     This fixes the failure from the previous test.
  ======================================================= */

  it("passes the correct payment status to table rows", () => {
    renderComponent();

    const rows =
      screen.getAllByTestId("table-row");

    expect(rows[0]).toHaveAttribute(
      "data-status",
      "Paid",
    );

    expect(rows[1]).toHaveAttribute(
      "data-status",
      "Un-Paid",
    );

    expect(rows[2]).toHaveAttribute(
      "data-status",
      "Paid",
    );
  });

  /* =======================================================
     30. FIVE CELLS PER ROW
  ======================================================= */

  it("renders five cells for every payment row", () => {
    renderComponent();

    const rows =
      screen.getAllByTestId("table-row");

    rows.forEach((row) => {
      expect(row.querySelectorAll("td")).toHaveLength(5);
    });
  });

  /* =======================================================
     31. DOWNLOAD BUTTONS
  ======================================================= */

  it("renders download button for every payment", () => {
    renderComponent();

    const buttons =
      screen.getAllByTitle("Download");

    expect(buttons).toHaveLength(3);
  });

  /* =======================================================
     32. IMPORT BUTTONS
  ======================================================= */

  it("renders import button for every payment", () => {
    renderComponent();

    const buttons =
      screen.getAllByTitle("Import");

    expect(buttons).toHaveLength(3);
  });

  /* =======================================================
     33. BUTTON COUNT INSIDE PAYMENT ROWS
  ======================================================= */

  it("renders two action buttons for every payment", () => {
    renderComponent();

    const downloadButtons =
      screen.getAllByTitle("Download");

    const importButtons =
      screen.getAllByTitle("Import");

    expect(downloadButtons).toHaveLength(3);
    expect(importButtons).toHaveLength(3);
  });

  /* =======================================================
     34. STATUS CHANGE
     Covers:
       handleStatusChange()
       [...paymentData]
       updatedData[index].status
       setPaymentData(updatedData)
  ======================================================= */

  it("handles status change correctly", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    expect(selects[0]).toHaveValue("Paid");

    fireEvent.change(selects[0], {
      target: {
        value: "Un-Paid",
      },
    });

    expect(selects[0]).toHaveValue("Un-Paid");
  });

  /* =======================================================
     35. STATUS CHANGE SECOND ROW
  ======================================================= */

  it("changes the second payment status correctly", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    expect(selects[1]).toHaveValue("Un-Paid");

    fireEvent.change(selects[1], {
      target: {
        value: "Paid",
      },
    });

    expect(selects[1]).toHaveValue("Paid");
  });

  /* =======================================================
     36. STATUS CHANGE THIRD ROW
  ======================================================= */

  it("changes the third payment status correctly", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    expect(selects[2]).toHaveValue("Paid");

    fireEvent.change(selects[2], {
      target: {
        value: "Un-Paid",
      },
    });

    expect(selects[2]).toHaveValue("Un-Paid");
  });

  /* =======================================================
     37. ROW STATUS UPDATES AFTER CHANGE
  ======================================================= */

  it("updates the table row status after changing payment status", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    const rows =
      screen.getAllByTestId("table-row");

    expect(rows[0]).toHaveAttribute(
      "data-status",
      "Paid",
    );

    fireEvent.change(selects[0], {
      target: {
        value: "Un-Paid",
      },
    });

    expect(rows[0]).toHaveAttribute(
      "data-status",
      "Un-Paid",
    );
  });

  /* =======================================================
     38. STATUS CHANGE BACK
  ======================================================= */

  it("can change a payment status back to Paid", () => {
    renderComponent();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: {
        value: "Paid",
      },
    });

    expect(selects[1]).toHaveValue("Paid");
  });

  /* =======================================================
     39. BUTTON GROUP
  ======================================================= */

  it("renders button group", () => {
    renderComponent();

    expect(
      screen.getByTestId("button-group"),
    ).toBeInTheDocument();
  });

  /* =======================================================
     40. CANCEL BUTTON
  ======================================================= */

  it("renders Cancel button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     41. SAVE BUTTON
  ======================================================= */

  it("renders Save button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });

  /* =======================================================
     42. ACTION BUTTONS
  ======================================================= */

  it("renders Save and Cancel buttons together", () => {
    renderComponent();

    const saveButton =
      screen.getByRole("button", {
        name: "Save",
      });

    const cancelButton =
      screen.getByRole("button", {
        name: "Cancel",
      });

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  /* =======================================================
     43. DOWNLOAD BUTTON ATTRIBUTES
  ======================================================= */

  it("renders download buttons with correct title", () => {
    renderComponent();

    const buttons =
      screen.getAllByTitle("Download");

    buttons.forEach((button) => {
      expect(button).toHaveAttribute(
        "title",
        "Download",
      );
      expect(button).toHaveAttribute(
        "type",
        "button",
      );
    });
  });

  /* =======================================================
     44. IMPORT BUTTON ATTRIBUTES
  ======================================================= */

  it("renders import buttons with correct title", () => {
    renderComponent();

    const buttons =
      screen.getAllByTitle("Import");

    buttons.forEach((button) => {
      expect(button).toHaveAttribute(
        "title",
        "Import",
      );
      expect(button).toHaveAttribute(
        "type",
        "button",
      );
    });
  });

  /* =======================================================
     45. COMPLETE COMPONENT
  ======================================================= */

  it("renders the complete PaymentOverview component", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", {
        name: "Payment Overview",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("plan-card"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("plan-details"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("plan-price"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("payment-table"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("button-group"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });
});
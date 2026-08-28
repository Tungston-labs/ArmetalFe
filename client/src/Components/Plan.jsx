import React, { useState, useEffect, useRef } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { VscSend } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import {
  SectionTitle,
  PlanCard,
  PlanIcon,
  PlanDetails,
  PlanPrice,
  PaymentTable,
  TableHead,
  TableRow,
  TableData,
  ScrollWrapper,
  PlanIconWrapper,
} from "./Plan.Styles";

import API from "../services/api";
import Invoice from "../Pages/superAdmin/print/Invoice";

const PaymentOverview = ({ companyId: propCompanyId }) => {
  const { id: urlCompanyId } = useParams();

  const companyId = propCompanyId || urlCompanyId;

  const invoiceRef = useRef();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [company, setCompany] = useState(null);

  console.log("Company ID:", companyId);

  // =========================================================
  // MONTH NAME -> MONTH NUMBER
  // =========================================================

  const monthNames = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  // =========================================================
  // GET MONTH NUMBER
  // =========================================================

  const getMonthNumber = (entry) => {
    if (!entry) return null;

    // ---------------------------------------------------------
    // If API gives month as a number
    // ---------------------------------------------------------

    if (typeof entry.month === "number") {
      return entry.month;
    }

    // ---------------------------------------------------------
    // If API gives month as string
    // Example: "08"
    // Example: "August"
    // ---------------------------------------------------------

    if (typeof entry.month === "string") {
      const numericMonth = Number(entry.month);

      if (
        !Number.isNaN(numericMonth) &&
        numericMonth >= 1 &&
        numericMonth <= 12
      ) {
        return numericMonth;
      }

      const formattedMonth =
        entry.month.charAt(0).toUpperCase() +
        entry.month.slice(1).toLowerCase();

      if (monthNames[formattedMonth]) {
        return monthNames[formattedMonth];
      }
    }

    // ---------------------------------------------------------
    // If API gives month_display
    // Example: "August"
    // ---------------------------------------------------------

    if (entry.month_display) {
      const monthDisplay = String(entry.month_display).trim();

      // Check direct month name
      const formattedMonth =
        monthDisplay.charAt(0).toUpperCase() +
        monthDisplay.slice(1).toLowerCase();

      if (monthNames[formattedMonth]) {
        return monthNames[formattedMonth];
      }

      // Check if month_display is a date
      const parsedDate = new Date(monthDisplay);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getMonth() + 1;
      }
    }

    // ---------------------------------------------------------
    // If API gives a date
    // ---------------------------------------------------------

    if (entry.date) {
      const parsedDate = new Date(entry.date);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getMonth() + 1;
      }
    }

    // ---------------------------------------------------------
    // If API gives paid_date
    // ---------------------------------------------------------

    if (entry.paid_date) {
      const parsedDate = new Date(entry.paid_date);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getMonth() + 1;
      }
    }

    return null;
  };

  // =========================================================
  // GET ENTRY YEAR
  // =========================================================

  const getEntryYear = (entry) => {
    const currentYear = new Date().getFullYear();

    // ---------------------------------------------------------
    // If API has year
    // ---------------------------------------------------------

    if (entry?.year) {
      const year = Number(entry.year);

      if (!Number.isNaN(year)) {
        return year;
      }
    }

    // ---------------------------------------------------------
    // Try month field
    // ---------------------------------------------------------

    if (entry?.month) {
      const parsedDate = new Date(entry.month);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getFullYear();
      }
    }

    // ---------------------------------------------------------
    // Try month_display
    // ---------------------------------------------------------

    if (entry?.month_display) {
      const parsedDate = new Date(entry.month_display);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getFullYear();
      }
    }

    // ---------------------------------------------------------
    // Try paid_date
    // ---------------------------------------------------------

    if (entry?.paid_date) {
      const parsedDate = new Date(entry.paid_date);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.getFullYear();
      }
    }

    return currentYear;
  };

  // =========================================================
  // FILTER FUTURE MONTHS
  // =========================================================

  const filterCurrentAndPreviousMonths = (subscriptions) => {
    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    return subscriptions.filter((entry) => {
      const monthNumber = getMonthNumber(entry);
      const entryYear = getEntryYear(entry);

      // If month cannot be determined,
      // don't display it.
      if (!monthNumber) {
        return false;
      }

      // -------------------------------------------------------
      // Previous years
      // -------------------------------------------------------

      if (entryYear < currentYear) {
        return true;
      }

      // -------------------------------------------------------
      // Future years
      // -------------------------------------------------------

      if (entryYear > currentYear) {
        return false;
      }

      // -------------------------------------------------------
      // Current year
      // Only current month and previous months
      // -------------------------------------------------------

      return monthNumber <= currentMonth;
    });
  };

  // =========================================================
  // FETCH PAYMENT DATA
  // =========================================================

  useEffect(() => {
    if (companyId) {
      fetchPaymentData(companyId);
    }
  }, [companyId]);

  const fetchPaymentData = async (id) => {
    try {
      const res = await API.get(`/subscriptions/${id}/`);

      console.log("Subscription API Data:", res.data);

      setCompany(res.data.company || null);

      const subscriptions = res.data.subscriptions || [];

      console.log(
        "All subscriptions from API:",
        subscriptions
      );

      // -------------------------------------------------------
      // Remove future months
      // -------------------------------------------------------

      const filteredSubscriptions =
        filterCurrentAndPreviousMonths(subscriptions);

      console.log(
        "Subscriptions up to current month:",
        filteredSubscriptions
      );

      setPaymentData(filteredSubscriptions);

    } catch (error) {
      console.error(
        "Failed to fetch payment data:",
        error
      );

      setCompany(null);
      setPaymentData([]);
    }
  };

  // =========================================================
  // CHANGE PAYMENT STATUS
  // =========================================================

  const handleStatusChange = async (
    subscriptionId,
    currentStatus
  ) => {
    const newStatus =
      currentStatus === "paid"
        ? "unpaid"
        : "paid";

    try {
      await API.patch(
        `/subscriptions/mark-paid/${subscriptionId}/`,
        {
          status: newStatus,
        }
      );

      await fetchPaymentData(companyId);

    } catch (error) {
      console.error(
        "Failed to update payment status:",
        error
      );
    }
  };

  // =========================================================
  // PRINT / DOWNLOAD INVOICE
  // =========================================================

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
  });

  const handleDownload = (entry) => {
    setSelectedInvoice(entry);

    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // =========================================================
  // SEND INVOICE EMAIL
  // =========================================================

  const handleSendEmail = async (entry) => {
    try {
      await API.post("/invoice/send-email/", {
        entry: entry,
        company_id: entry.company,
      });

      alert("Invoice email sent successfully.");

    } catch (error) {
      console.error(
        "Failed to send invoice email:",
        error
      );

      alert("Failed to send invoice email.");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          SECTION TITLE
      ===================================================== */}

      <SectionTitle>
        Payment Overview
      </SectionTitle>

      {/* =====================================================
          PLAN CARD
      ===================================================== */}

      <PlanCard>
        <PlanIconWrapper>
          <PlanIcon>
            <img
              src="/images/plan.png"
              alt="Plan Icon"
            />
          </PlanIcon>
        </PlanIconWrapper>

        <PlanDetails>
          <h3>Enterprise plan</h3>

          <p>
            Pay a fixed amount per employee.
            <br />
            Simple, transparent, and ideal for
            managing individual payroll with ease.
          </p>
        </PlanDetails>

        <PlanPrice></PlanPrice>
      </PlanCard>

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}

      <ScrollWrapper>
        <PaymentTable>
          <thead>
            <tr>
              <TableHead>
                Month
              </TableHead>

              <TableHead>
                Paid Date
              </TableHead>

              <TableHead>
                Amount
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Import
              </TableHead>
            </tr>
          </thead>

          <tbody>
            {paymentData.length === 0 ? (
              <TableRow>
                <TableData colSpan="5">
                  No records found.
                </TableData>
              </TableRow>
            ) : (
              paymentData.map((entry) => (
                <TableRow
                  key={entry.id}
                  status={entry.status}
                >
                  {/* ================= MONTH ================= */}

                  <TableData>
                    {entry.month_display}
                  </TableData>

                  {/* ================= PAID DATE ================= */}

                  <TableData>
                    {entry.paid_date || "-"}{" "}
                    <SlCalender />
                  </TableData>

                  {/* ================= AMOUNT ================= */}

                  <TableData>
                    <strong>
                      {entry.amount}
                    </strong>
                  </TableData>

                  {/* ================= STATUS ================= */}

                  <TableData>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          entry.id,
                          entry.status
                        )
                      }
                      style={{
                        backgroundColor:
                          entry.status === "paid"
                            ? "#4CAF50"
                            : "#f28b82",

                        color: "#fff",

                        border: "none",

                        padding: "6px 12px",

                        borderRadius: "6px",

                        fontWeight: "bold",

                        cursor: "pointer",

                        minWidth: "100px",

                        textTransform: "capitalize",
                      }}
                    >
                      {entry.status}
                    </button>
                  </TableData>

                  {/* ================= ACTIONS ================= */}

                  <TableData
                    style={{
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {/* DOWNLOAD */}

                    <button
                      onClick={() =>
                        handleDownload(entry)
                      }
                      title="Download"
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    >
                      <MdOutlineFileDownload />
                    </button>

                    {/* SEND EMAIL */}

                    <button
                      title="Send Invoice"
                      onClick={() =>
                        handleSendEmail(entry)
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    >
                      <VscSend />
                    </button>
                  </TableData>
                </TableRow>
              ))
            )}
          </tbody>
        </PaymentTable>
      </ScrollWrapper>

      {/* =====================================================
          HIDDEN INVOICE FOR PRINTING
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={invoiceRef}>
          {selectedInvoice && (
            <Invoice
              entry={selectedInvoice}
              company={company}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentOverview;
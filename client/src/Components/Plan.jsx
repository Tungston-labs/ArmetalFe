import React, { useState, useEffect } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { VscSend } from "react-icons/vsc";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { generateInvoiceHTML } from '../utlis/invoiceGenerator';
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
  ScrollWrapper
} from './Plan.Styles';

const PaymentOverview = ({ companyId: propCompanyId }) => {
  const { id: urlCompanyId } = useParams();
  const companyId = propCompanyId || urlCompanyId;

  const [paymentData, setPaymentData] = useState([]);
  const [companyName, setCompanyName] = useState("Company");

  useEffect(() => {
    if (companyId) {
      fetchPaymentData(companyId);
      fetchCompanyName(companyId);
    }
  }, [companyId]);

  const fetchPaymentData = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`http://178.248.112.16:8000/api/subscriptions/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setPaymentData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    }
  };
  const fetchCompanyName = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`http://178.248.112.16:8000/api/companies/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.name) {
        setCompanyName(res.data.name);
      }
    } catch (error) {
      console.error("Failed to fetch company name:", error);
    }
  };



  const handleStatusChange = async (subscriptionId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://178.248.112.16:8000/api/subscriptions/mark-paid/${subscriptionId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPaymentData(companyId);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
const handleDownload = (entry) => {

      const html = generateInvoiceHTML(entry, companyName);
  // const companyName = entry.name || "Your Company Name";
  // const html = generateInvoiceHTML(entry,companyName);
  // const companyName = entry.company_name || "Your Company Name";
  // Open a new browser window
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${entry.month_display} ${entry.year}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #0546A0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .section-title {
            margin-top: 40px;
            font-size: 20px;
            font-weight: bold;
            color: #444;
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function () {
            window.print();
            setTimeout(() => window.close(), 100); // Auto-close after print
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};





  const handleSendEmail = async (entry) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://178.248.112.16:8000/api/invoice/send-email/", {
        entry: entry,
        company_id: entry.company,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Invoice email sent successfully.");
    } catch (error) {
      console.error("Email send failed:", error);
      alert("Failed to send invoice email.");
    }
  };

  return (
    <>
      <SectionTitle>Payment Overview</SectionTitle>

      <PlanCard>
        <div style={{
          background: "#182657",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70px",
          borderRadius: "10px",
          height: "75px"
        }}>
          <PlanIcon>
            <img src="/images/plan.png" alt="Plan Icon" />
          </PlanIcon>
        </div>

        <PlanDetails>
          <h3>Enterprise plan</h3>
          <p>
            Pay a fixed $5 per employee.<br />
            Simple, transparent, and ideal for managing individual payroll with ease.
          </p>
        </PlanDetails>

        <PlanPrice>$5</PlanPrice>
      </PlanCard>

      <ScrollWrapper>
        <PaymentTable>
          <thead>
            <tr>
              <TableHead>Month</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Import</TableHead>
            </tr>
          </thead>
          <tbody>
            {paymentData.length === 0 ? (
              <TableRow>
                <TableData colSpan="5">No records found.</TableData>
              </TableRow>
            ) : (
              paymentData.map((entry) => (
                <TableRow key={entry.id} status={entry.status}>
                  <TableData>{entry.month_display}</TableData>
                  <TableData>{entry.paid_date || '-'} <SlCalender /></TableData>
                  <TableData><strong>{entry.amount} {entry.currency}</strong></TableData>
                  <TableData>
                    <button
                      onClick={() => handleStatusChange(entry.id, entry.status)}
                      style={{
                        backgroundColor: entry.status === 'paid' ? '#4CAF50' : '#f28b82',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        minWidth: '100px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {entry.status}
                    </button>
                  </TableData>
                  <TableData style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => handleDownload(entry)} title="Download" style={{ background: 'transparent', border: 'none', fontSize: '18px' }}>
                      <MdOutlineFileDownload />
                    </button>
                    <button title="Import" onClick={() => handleSendEmail(entry)} style={{ background: 'transparent', border: 'none', fontSize: '18px' }}>
                      <VscSend />
                    </button>
                  </TableData>
                </TableRow>
              ))
            )}
          </tbody>
        </PaymentTable>
      </ScrollWrapper>
    </>
  );
};

export default PaymentOverview;

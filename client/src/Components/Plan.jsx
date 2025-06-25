import React, { useState, useEffect } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { VscSend } from "react-icons/vsc";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { generateInvoiceHTML } from '../utlis/invoiceGenerator';
import html2pdf from 'html2pdf.js';
import { sendInvoiceEmail } from '../utlis/emailService';







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

  useEffect(() => {
    if (companyId) {
      fetchPaymentData(companyId);
    }
  }, [companyId]);

  const fetchPaymentData = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`http://localhost:8000/api/subscriptions/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setPaymentData(res.data);
      } else {
        console.warn("Expected array, got:", res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    }
  };

  const handleStatusChange = async (subscriptionId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:8000/api/subscriptions/mark-paid/${subscriptionId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Refresh payment data
      await fetchPaymentData(companyId);

    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

const handleDownload = (entry) => {
  const html = generateInvoiceHTML(entry, "Your Company Name");
  const opt = {
    margin:       0.5,
    filename:     `invoice_${entry.month_display}_${entry.year}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(html).set(opt).save();
};
const handleSendEmail = async (entry) => {
  try {
    const token = localStorage.getItem("accessToken");

    await axios.post("http://localhost:8000/api/invoice/send-email/", {
      entry: entry,
      company_id: entry.company,  // now sending company ID
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
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
                  <TableData>
                    {entry.paid_date || '-'} <SlCalender />
                  </TableData>
                  <TableData>
                    <strong>{entry.amount} {entry.currency}</strong>
                  </TableData>
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
                    <button title="Import" onClick={()=>handleSendEmail(entry)} style={{ background: 'transparent', border: 'none', fontSize: '18px' }}>
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

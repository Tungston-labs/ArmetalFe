import React, { useState } from 'react';
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
  StatusSelect,
  IconButton,
  ButtonGroup,
  CancelButton,
  SaveButton
} from './Payroll1.Styles';

const initialData = [
  { month: 'January', date: '12-12-25', amount: 1500, status: 'Paid' },
  { month: 'February', date: '12-12-25', amount: 1500, status: 'Paid' },
  { month: 'March', date: '12-12-24', amount: 1500, status: 'Paid' },
  { month: 'April', date: '12-12-24', amount: 1500, status: 'Paid' },
  { month: 'May', date: '12-12-24', amount: 1500, status: 'Un-Paid' }
];

const PaymentOverview = () => {
  const [paymentData, setPaymentData] = useState(initialData);

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...paymentData];
    updatedData[index].status = newStatus;
    setPaymentData(updatedData);
  };

  return (
    <>
      <SectionTitle>Payment Overview</SectionTitle>

      <PlanCard>
        <div
          style={{
            background: "#182657",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "70px",
            borderRadius: "10px",
            height: "75px"
          }}
        >
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

      <PaymentTable>
        <thead>
          <tr>
            <TableHead>Month</TableHead>
            <TableHead>Paid date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Import</TableHead>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((entry, index) => (
            <TableRow key={index} status={entry.status}>
              <TableData>{entry.month}</TableData>
              <TableData>{entry.date} 📅</TableData>
              <TableData><strong>{entry.amount}</strong></TableData>
              <TableData>
                <StatusSelect
                  value={entry.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Un-Paid">Un-Paid</option>
                </StatusSelect>
              </TableData>
              <TableData>
                <IconButton title="Download">⬇️</IconButton>
                <IconButton title="Import">▶️</IconButton>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </PaymentTable>

      <ButtonGroup>
        <CancelButton>Cancel</CancelButton>
        <SaveButton>Save</SaveButton>
      </ButtonGroup>
    </>
  );
};

export default PaymentOverview;

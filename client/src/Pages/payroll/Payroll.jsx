import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPayrollDetail } from '../../Redux/payrollSlice';
import {
  Container, Header, Title, Badge, PrintIcon, GridLayout, InfoTable, InfoRow,
  Label, Value, SectionTitle, TableWrapper, Table, TableHeader, TableData,
  TotalRow, Footer, RightHeader, LeftHeader
} from './Payroll.styles';
import { BsPrinter } from "react-icons/bs";
import { printElement } from '../../services/utlis/printPayroll';


const PayrollDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { payrollDetail, loading, error } = useSelector((state) => state.payroll);
  const ComponentRef = useRef();
  const handleprint = () =>{
    printElement (ComponentRef.current);
  };
  useEffect(() => {
    if (id) dispatch(getPayrollDetail(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading payroll details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payrollDetail) return <div>No payroll data found.</div>;

  const {
    employee_id,
    employee_name,
    department,
    designation,
    working_days,
    days_present,
    leave_taken,
    casual_leave,
    paid_leave,
    gross_earnings,
    total_deductions,
    net_pay,
    payment_mode,
    account_number,
    status,
    earnings,
    deductions,
  } = payrollDetail;

  return (
  <div ref={ComponentRef}>
    <Container>
      <Header>
        <LeftHeader><Title>Employee Details</Title></LeftHeader>
        <RightHeader>
          <Badge>{status || 'Unpaid'}</Badge>
          <PrintIcon onClick={handleprint}><BsPrinter /></PrintIcon>
        </RightHeader>
      </Header>

      <GridLayout>
        <InfoTable>
          <InfoRow><Label>Employee Name</Label><Value>{employee_name}</Value></InfoRow>
          <InfoRow><Label>Department</Label><Value>{department}</Value></InfoRow>
          <InfoRow><Label>No. of Working Days</Label><Value>{working_days}</Value></InfoRow>
        </InfoTable>
        <InfoTable>
          <InfoRow><Label>Employee ID</Label><Value>{employee_id}</Value></InfoRow>
          <InfoRow><Label>Designation</Label><Value>{designation}</Value></InfoRow>
          <InfoRow><Label>Days Present</Label><Value>{days_present}</Value></InfoRow>
        </InfoTable>
      </GridLayout>

      <GridLayout>
        <TableWrapper>
          <SectionTitle>Net Pay Summary</SectionTitle>
          <Table>
            <thead>
              <tr><TableHeader>Field Label</TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              <tr><TableData>Gross Earnings</TableData><TableData>{gross_earnings}</TableData></tr>
              <tr><TableData>Total Deductions</TableData><TableData>{total_deductions}</TableData></tr>
              <tr><TableData>Net Pay</TableData><TableData>{net_pay}</TableData></tr>
              <tr><TableData>Payment Mode</TableData><TableData>{payment_mode}</TableData></tr>
              <tr><TableData>Bank Account</TableData><TableData>{account_number}</TableData></tr>
            </tbody>
          </Table>
        </TableWrapper>

        <TableWrapper>
          <SectionTitle>Leave Details</SectionTitle>
          <Table>
            <thead>
              <tr><TableHeader>Leave Type</TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              <tr><TableData>Leave Taken</TableData><TableData>{leave_taken}</TableData></tr>
              {/* <tr><TableData>Casual Leave</TableData><TableData>{casual_leave}</TableData></tr> */}
              <tr><TableData>Loss of Pay</TableData><TableData>
  {payrollDetail.lop_amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) ?? '₹0.00'}
  {payrollDetail.lop_days > 0 && ` (${payrollDetail.lop_days} day${payrollDetail.lop_days > 1 ? 's' : ''})`}
</TableData>
</tr>
            </tbody>
          </Table>
        </TableWrapper>
      </GridLayout>

      <GridLayout>
        <TableWrapper>
          <SectionTitle>Salary Earnings</SectionTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>Earnings</TableHeader>
                <TableHeader>Days</TableHeader>
                <TableHeader>Hours</TableHeader>
                <TableHeader>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              {earnings?.map((item, index) => (
                <tr key={index}>
                  <TableData>{item.label}</TableData>
                  <TableData>{item.days ?? '-'}</TableData>
                  <TableData>{item.hours ?? '-'}</TableData>
                  <TableData>{item.amount}</TableData>
                </tr>
              ))}
              <TotalRow>
                <TableData colSpan="3"><strong>Total Earnings</strong></TableData>
                <TableData><strong>{gross_earnings}</strong></TableData>
              </TotalRow>
            </tbody>
          </Table>
        </TableWrapper>

        <TableWrapper>
          <SectionTitle>Salary Deductions</SectionTitle>
          <Table>
            <thead>
              <tr><TableHeader>Deductions</TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              {deductions?.map((item, index) => (
                <tr key={index}>
                  <TableData>{item.label}</TableData>
                  <TableData>{item.value}</TableData>
                </tr>
              ))}
              <TotalRow>
                <TableData><strong>Total Deduction</strong></TableData>
                <TableData><strong>{total_deductions}</strong></TableData>
              </TotalRow>
            </tbody>
          </Table>
        </TableWrapper>
      </GridLayout>

      <Footer>
        Net Pay: <strong>{net_pay?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</strong>
      </Footer>
    </Container>
</div>
  );
};

export default PayrollDetails;

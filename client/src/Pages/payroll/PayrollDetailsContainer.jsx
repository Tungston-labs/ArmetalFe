import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPayrollDetail } from '../../Redux/payrollSlice';
import {
  Container, Header, Title, Badge, PrintIcon, GridLayout, InfoTable, InfoRow,
  Label, Value, TableWrapper, Table, TableData
, RightHeader, LeftHeader,

  BackTitle,
 
  BackIcon
} from './Payroll.styles';
import { BsPrinter } from "react-icons/bs";
import { printElement } from '../../services/utlis/printPayroll';
import { useNavigate } from "react-router-dom";
const PayrollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payrollDetail, loading, error } = useSelector((state) => state.payroll);
  const ComponentRef = useRef();
  const handleprint = () => {
    printElement(ComponentRef.current);
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
    joining_date,
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
          <LeftHeader>
            <BackTitle onClick={() => navigate("/payrolldetails")}>
              <BackIcon />
              <Title>Employee Details</Title>
            </BackTitle>
          </LeftHeader>
          <RightHeader>
            <Badge>{status || 'Unpaid'}</Badge>
            <PrintIcon onClick={handleprint}><BsPrinter /></PrintIcon>
          </RightHeader>
        </Header>

        <GridLayout>
          <InfoTable>
            <InfoRow><Label>Employee Name</Label><Value>{employee_name}</Value></InfoRow>
            <InfoRow><Label>Department</Label><Value>{department}</Value></InfoRow>
            <InfoRow><Label>Account Number</Label><Value>{account_number}</Value></InfoRow>
          </InfoTable>
          <InfoTable>
            <InfoRow><Label>Employee ID</Label><Value>{employee_id}</Value></InfoRow>
            <InfoRow><Label>Designation</Label><Value>{designation}</Value></InfoRow>
            <InfoRow><Label>Joining Date</Label><Value>{joining_date}</Value></InfoRow>
          </InfoTable>
        </GridLayout>

        <GridLayout>
          <TableWrapper>



            <Table>
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><TableData>Basic Pay</TableData><TableData>{gross_earnings}</TableData></tr>
                <tr><TableData>House Rent</TableData><TableData>{total_deductions}</TableData></tr>
                <tr><TableData>Transport Allowance</TableData><TableData>{net_pay}</TableData></tr>
                <tr><TableData>Special Allowance</TableData><TableData>{payment_mode}</TableData></tr>

              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper>

            <Table>
              <thead>
                <tr>
                  <th>Work Summary </th>
                  <th>Days</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData> Total No. of Days</TableData>
                  <TableData>{working_days}</TableData></tr>
                <tr>
                  <TableData>Loss of Pay</TableData>
                  <TableData>
                    {payrollDetail.lop_amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) ?? '₹0.00'}
                    {payrollDetail.lop_days > 0 && ` (${payrollDetail.lop_days} day${payrollDetail.lop_days > 1 ? 's' : ''})`}
                  </TableData>
                </tr>
                <TableData>No of Days Paid </TableData>
                <TableData>{days_present} </TableData>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>


        <GridLayout>
          <TableWrapper>

            <Table>
              <thead>
                <tr>
                  <th>Pay Summary </th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Gross Pay</TableData>
                  <TableData>{gross_earnings}</TableData></tr>
                <tr>
                  <TableData>Deductions </TableData>
                  <TableData>{total_deductions}</TableData>
                </tr>
                <TableData>Net Pay</TableData>
                <TableData>{net_pay} </TableData>
              </tbody>
            </Table>


          </TableWrapper>
        </GridLayout>
      </Container>
    </div>
  );
};

export default PayrollDetails;
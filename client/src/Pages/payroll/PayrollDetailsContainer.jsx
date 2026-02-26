import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPayrollDetail } from "../../Redux/payrollSlice";
import {
  Container, Header, Title, Badge, PrintIcon, GridLayout, InfoTable, InfoRow,
  Label, Value, TableWrapper, Table, TableData
  , RightHeader, LeftHeader,

  BackTitle,

  BackIcon
} from './Payroll.styles';
import { BsPrinter } from "react-icons/bs";
import { printElement } from "../../services/utlis/printPayroll";

const PayrollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payrollDetail, loading, error } = useSelector(
    (state) => state.payroll
  );

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
    gross_earnings,
    total_deductions,
    net_pay,
    payment_mode,
    account_number,
    status,
    earnings,
    deductions,
    lop_days,
    lop_amount,
  } = payrollDetail;

  return (
    <div ref={ComponentRef}>
      <Container>
        <Header>
          <LeftHeader>
            <BackTitle onClick={() => navigate("/payrolldetails")}>
              <BackIcon className="no-print" />
              <Title>Employee Details</Title>
            </BackTitle>
          </LeftHeader>
          <RightHeader>
            <Badge>{status || 'Unpaid'}</Badge>
            <PrintIcon className="no-print" onClick={handleprint}><BsPrinter /></PrintIcon>
          </RightHeader>
        </Header>

        {/* Employee Info */}
        <GridLayout>
          <InfoTable>
            <InfoRow>
              <Label>Employee Name</Label>
              <Value>{employee_name}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Department</Label>
              <Value>{department}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Account Number</Label>
              <Value>{account_number}</Value>
            </InfoRow>
          </InfoTable>

          <InfoTable>
            <InfoRow>
              <Label>Employee ID</Label>
              <Value>{employee_id}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Designation</Label>
              <Value>{designation}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Joining Date</Label>
              <Value>{joining_date}</Value>
            </InfoRow>
          </InfoTable>
        </GridLayout>

        {/* Earnings + Work Summary */}
        <GridLayout>
          {/* Earnings Table */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings && earnings.length > 0 ? (
                  earnings.map((item, index) => (
                    <tr key={index}>
                      <TableData>{item.label}</TableData>
                      <TableData>
                        {Number(item.amount).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </TableData>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TableData colSpan="2">No earnings data</TableData>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>

          {/* Work Summary */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Work Summary</th>
                  <th>Days / Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Total Working Days</TableData>
                  <TableData>{working_days}</TableData>
                </tr>
                <tr>
                  <TableData>No of Days Paid</TableData>
                  <TableData>{days_present}</TableData>
                </tr>
                <tr>
                  <TableData>Loss of Pay</TableData>
                  <TableData>
                    {Number(lop_amount || 0).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                    {lop_days > 0 &&
                      ` (${lop_days} day${lop_days > 1 ? "s" : ""})`}
                  </TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* Pay Summary + Deductions */}
        <GridLayout>
       

          {/* Pay Summary */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Pay Summary</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Gross Pay</TableData>
                  <TableData>{gross_earnings}</TableData>
                </tr>
                <tr>
                  <TableData>Deductions</TableData>
                  <TableData>{total_deductions}</TableData>
                </tr>
                <tr className="net-pay">
                  <TableData>Net Pay</TableData>
                  <TableData>{net_pay}</TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>
      </Container>
    </div>
  );
};

export default PayrollDetails;
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPayrollDetail } from "../../Redux/payrollSlice";
import {
  Container,
  Header,
  Badge,
  PrintIcon,
  GridLayout,
  InfoTable,
  InfoRow,
  Label,
  Value,
  TableWrapper,
  Table,
  TableData,
  BackTitle,
  BackIcon,
} from "./Payroll.styles";
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

  const handlePrint = () => {
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
    account_number,
    status,
    earnings,
    lop_days,
    lop_amount,
    company,
    basic_salary,
    salary_increment,
    month,
    year,
  } = payrollDetail;

  const monthName = new Date(year, month - 1).toLocaleString("en-IN", {
    month: "long",
  });

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <div ref={ComponentRef}>
      <Container>

        {/* ================= BACK ================= */}
        <Header>
          <BackTitle onClick={() => navigate("/payrolldetails")}>
            <BackIcon className="no-print" />
          </BackTitle>
        </Header>

        {/* ================= COMPANY HEADER ================= */}
        {company && (
          <div
            style={{
              backgroundColor: "#1f2937",
              color: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Company Info */}
            <div>
              <h2 style={{ margin: 0 }}>{company.name}</h2>
              <p style={{ margin: "4px 0" }}>{company.address}</p>
              <p style={{ margin: "4px 0" }}>{company.email}</p>
              <p style={{ margin: "4px 0" }}>{company.contact_number}</p>
            </div>

            {/* Logo */}
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt="Company Logo"
                style={{
                  height: "90px",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        )}

        {/* ================= PAYSLIP TITLE ================= */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            Payslip – {monthName} {year}
          </h2>
        </div>

        {/* ================= EMPLOYEE INFO ================= */}
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

        {/* ================= EARNINGS & WORK SUMMARY ================= */}
        <GridLayout>

          {/* Earnings */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData><strong>Total Salary</strong></TableData>
                  <TableData><strong>{formatCurrency(basic_salary)}</strong></TableData>
                </tr>

                <tr>
                  <TableData>Increment</TableData>
                  <TableData>{formatCurrency(salary_increment)}</TableData>
                </tr>

                {earnings?.map((item, index) => (
                  <tr key={index}>
                    <TableData>{item.label}</TableData>
                    <TableData>{formatCurrency(item.amount)}</TableData>
                  </tr>
                ))}
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
                    {formatCurrency(lop_amount)}
                    {lop_days > 0 &&
                      ` (${lop_days} day${lop_days > 1 ? "s" : ""})`}
                  </TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* ================= PAY SUMMARY ================= */}
        <GridLayout>
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
                  <TableData>{formatCurrency(gross_earnings)}</TableData>
                </tr>
                <tr>
                  <TableData>Deductions</TableData>
                  <TableData>{formatCurrency(total_deductions)}</TableData>
                </tr>
                <tr className="net-pay">
                  <TableData><strong>Net Pay</strong></TableData>
                  <TableData><strong>{formatCurrency(net_pay)}</strong></TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* ================= STATUS + PRINT (BOTTOM RIGHT) ================= */}
        <div
          className="no-print"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            background: "#ffffff",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Badge>{status || "Unpaid"}</Badge>
          <PrintIcon onClick={handlePrint}>
            <BsPrinter />
          </PrintIcon>
        </div>

      </Container>

      {/* Hide print controls when printing */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PayrollDetails;
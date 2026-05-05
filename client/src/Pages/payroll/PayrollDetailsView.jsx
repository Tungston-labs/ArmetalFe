import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPayrollDetail } from "../../Redux/payrollSlice";
import { BsPrinter } from "react-icons/bs";
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
  CompanyHeader,
  CompanyInfo,
  CompanyName,
  CompanyText,
  CompanyLogo,
  CompanyTag,
  SectionDivider,
  IncentiveRow,
} from "./PayrollDetailsView.styles";

const PayrollDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const { payrollDetail, loading, error } = useSelector((s) => s.payroll);

  useEffect(() => {
    if (id) dispatch(getPayrollDetail(id));
  }, [dispatch, id]);

  if (loading)        return <div>Loading payroll details...</div>;
  if (error)          return <div>Error: {error}</div>;
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
    deductions,
    incentive,              // single number e.g. 8000
    lop_days,
    lop_amount,
    company,
    basic_salary,
    total_increment_amount,
    month,
    year,
  } = payrollDetail;

  const monthName = new Date(year, month - 1).toLocaleString("en-IN", { month: "long" });

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <div>
      <Container>

        {/* ── BACK ── */}
        <Header>
          <BackTitle onClick={() => navigate("/payrolldetails")} className="no-print">
            <BackIcon />
          </BackTitle>
          <div
            className="no-print"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <Badge status={status}>{status || "Unpaid"}</Badge>
            <PrintIcon onClick={() => window.print()}>
              <BsPrinter />
            </PrintIcon>
          </div>
        </Header>

        {/* ── COMPANY HEADER ── */}
        {company && (
          <CompanyHeader>
            <CompanyInfo>
              <CompanyTag>Payslip Issued By</CompanyTag>
              <CompanyName>{company.name}</CompanyName>
              <CompanyText>{company.address}</CompanyText>
              <CompanyText>{company.email}</CompanyText>
              <CompanyText>{company.contact_number}</CompanyText>
            </CompanyInfo>
            {company.logo_url && (
              <CompanyLogo src={company.logo_url} alt="Company Logo" />
            )}
          </CompanyHeader>
        )}

        {/* ── PAYSLIP TITLE ── */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: 0 }}>Payslip – {monthName} {year}</h2>
        </div>

        {/* ── EMPLOYEE INFO ── */}
        <SectionDivider>Employee Information</SectionDivider>
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

        {/* ── EARNINGS & WORK SUMMARY ── */}
        <SectionDivider>Earnings &amp; Work Summary</SectionDivider>
        <GridLayout>
          <TableWrapper>
            <Table>
              <thead>
                <tr><th>Earnings</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <TableData><strong>Basic Salary</strong></TableData>
                  <TableData><strong>{formatCurrency(basic_salary)}</strong></TableData>
                </tr>
                {total_increment_amount > 0 && (
                  <tr>
                    <TableData>Increment</TableData>
                    <TableData>{formatCurrency(total_increment_amount)}</TableData>
                  </tr>
                )}
                {earnings?.map((item, i) => (
                  <tr key={i}>
                    <TableData>{item.label}</TableData>
                    <TableData>{formatCurrency(item.amount)}</TableData>
                  </tr>
                ))}
                {/* Simple incentive row — hidden when 0 or null */}
                {incentive > 0 && (
                  <IncentiveRow>
                    <TableData>Incentive</TableData>
                    <TableData>{formatCurrency(incentive)}</TableData>
                  </IncentiveRow>
                )}
                <tr className="total-row">
                  <TableData><strong>Gross Earnings</strong></TableData>
                  <TableData><strong>{formatCurrency(gross_earnings)}</strong></TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper>
            <Table>
              <thead>
                <tr><th>Work Summary</th><th>Days / Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Total Working Days</TableData>
                  <TableData>{working_days}</TableData>
                </tr>
                <tr>
                  <TableData>Days Present</TableData>
                  <TableData>{days_present}</TableData>
                </tr>
                <tr>
                  <TableData>Loss of Pay</TableData>
                  <TableData>
                    {formatCurrency(lop_amount)}
                    {lop_days > 0 && ` (${lop_days} day${lop_days > 1 ? "s" : ""})`}
                  </TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* ── DEDUCTIONS ── */}
        <SectionDivider>Deductions</SectionDivider>
        <GridLayout>
          <TableWrapper>
            <Table>
              <thead>
                <tr><th>Statutory Deductions</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {deductions?.map((item, i) => (
                  <tr key={i}>
                    <TableData>{item.label}</TableData>
                    <TableData>{formatCurrency(item.amount)}</TableData>
                  </tr>
                ))}
                <tr className="total-row">
                  <TableData><strong>Total Deductions</strong></TableData>
                  <TableData><strong>{formatCurrency(total_deductions)}</strong></TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper>
            <Table>
              <thead>
                <tr><th>Other Deductions</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Loss of Pay</TableData>
                  <TableData>{formatCurrency(lop_amount)}</TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* ── PAY SUMMARY ── */}
        <SectionDivider>Pay Summary</SectionDivider>
        <GridLayout>
          <TableWrapper>
            <Table>
              <thead>
                <tr><th>Description</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Gross Earnings</TableData>
                  <TableData>{formatCurrency(gross_earnings)}</TableData>
                </tr>
                {incentive > 0 && (
                  <tr className="incentive-summary-row">
                    <TableData>Incentive</TableData>
                    <TableData>+ {formatCurrency(incentive)}</TableData>
                  </tr>
                )}
                <tr>
                  <TableData>Total Deductions</TableData>
                  <TableData>− {formatCurrency(total_deductions)}</TableData>
                </tr>
                {lop_amount > 0 && (
                  <tr>
                    <TableData>Loss of Pay</TableData>
                    <TableData>− {formatCurrency(lop_amount)}</TableData>
                  </tr>
                )}
                <tr className="net-pay">
                  <TableData><strong>Net Pay (Take Home)</strong></TableData>
                  <TableData><strong>{formatCurrency(net_pay)}</strong></TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

      </Container>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
          .net-pay td { font-weight: bold; border: 1px solid #000; }
        }
      `}</style>
    </div>
  );
};

export default PayrollDetails;
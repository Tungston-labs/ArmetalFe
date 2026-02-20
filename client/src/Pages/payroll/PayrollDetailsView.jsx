import React, { forwardRef } from "react";
import {
  Container, Header, Title, Badge, PrintIcon, GridLayout,
  InfoTable, InfoRow, Label, Value, TableWrapper, Table,
  TableData, TotalRow, RightHeader, LeftHeader,
  SectionTitles, BackTitle, BackIcon
} from "./Payroll.styles";
import { BsPrinter } from "react-icons/bs";
import Loader from "../../Components/Loader"
const PayrollDetailsView = forwardRef(
  ({ payrollDetail, loading, error, onPrint, onBack }, ref) => {

    if (loading) return <div><Loader/></div>;
    if (error) return <div>Error: {error}</div>;
    if (!payrollDetail) return <div>No payroll data found.</div>;

    const {
      employee_id,
      employee_name,
      department,
      designation,
      working_days,
      days_present,
      gross_earnings,
      status,
      earnings,
      deductions,
    } = payrollDetail;

    return (
      <div ref={ref}>
        <Container>
          <Header>
            <LeftHeader>
              <BackTitle onClick={onBack}>
                <BackIcon />
                <Title>Employee Details</Title>
              </BackTitle>
            </LeftHeader>

            <RightHeader>
              <Badge status={status}>
                {status || "Unpaid"}
              </Badge>
              <PrintIcon onClick={onPrint}>
                <BsPrinter />
              </PrintIcon>
            </RightHeader>
          </Header>


          <GridLayout>
            <InfoTable>
              <InfoRow><Label>Employee Name</Label><Value>{employee_name}</Value></InfoRow>
              <InfoRow><Label>Department</Label><Value>{department}</Value></InfoRow>
              <InfoRow><Label>Account Number</Label><Value>{working_days}</Value></InfoRow>
            </InfoTable>

            <InfoTable>
              <InfoRow><Label>Employee ID</Label><Value>{employee_id}</Value></InfoRow>
              <InfoRow><Label>Designation</Label><Value>{designation}</Value></InfoRow>
              <InfoRow><Label>Date Of Joining</Label><Value>{days_present}</Value></InfoRow>
            </InfoTable>
          </GridLayout>

     <GridLayout>
            <TableWrapper>
              <SectionTitles></SectionTitles>
              <Table>
                <thead>
                  <tr>
                    <th>Earnings</th>  
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings?.map((item, index) => (
                    <tr key={index}>
                      <TableData>{item.label}</TableData>
                      <TableData>₹{item.amount}</TableData>
                    </tr>
                  ))}
                  <TotalRow>
                    <TableData colSpan="1"><strong>Total Earnings</strong></TableData>
                    <TableData><strong>₹{gross_earnings}</strong></TableData>
                  </TotalRow>
                </tbody>
              </Table>
            </TableWrapper>

            <TableWrapper>
              <SectionTitles></SectionTitles>
              <Table>
                <thead>
                  <tr>
                    <th>Work Summary</th>
                    <th>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {deductions?.map((item, index) => (
                    <tr key={index}>
                      <TableData>{item.label}</TableData>
                      <TableData>₹{item.value}</TableData>
                    </tr>
                  ))}
              
                </tbody>
              </Table>
            </TableWrapper>
          </GridLayout>

          <GridLayout>
            <TableWrapper>
              <SectionTitles></SectionTitles>
              <Table>
                <thead>
                  <tr>
                    <th>Pay Summary</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings?.map((item, index) => (
                    <tr key={index}>
                      <TableData>{item.label}</TableData>
                      <TableData>₹{item.amount}</TableData>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            {/* <TableWrapper>
              <SectionTitles></SectionTitles>
              <Table>
                <thead>
                  <tr>
                    <th>Deductions</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {deductions?.map((item, index) => (
                    <tr key={index}>
                      <TableData>{item.label}</TableData>
                      <TableData>₹{item.value}</TableData>
                    </tr>
                  ))}
                  <TotalRow>
                    <TableData><strong>Total Deduction</strong></TableData>
                    <TableData><strong>₹{total_deductions}</strong></TableData>
                  </TotalRow>
                </tbody>
              </Table>
            </TableWrapper> */}
          </GridLayout>

        
        </Container>
      </div>
    );
  }
);

export default PayrollDetailsView;
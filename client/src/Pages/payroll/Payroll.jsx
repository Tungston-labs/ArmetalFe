// components/PayrollDetails.jsx
import React from 'react';
import {
  Container,
  Header,
  Title,
  Badge,
  PrintIcon,
  GridLayout,
  InfoTable,
  InfoRow,
  Label,
  Value,
  SectionTitle,
  TableWrapper,
  Table,RightHeader,
  TableHeader,
  TableData,
  TotalRow,
  Footer,LeftHeader
} from './Payroll.styles';
import { BsPrinter } from "react-icons/bs";
const PayrollDetails = () => {
  return (
    <Container>
     <Header>
  <LeftHeader>
    <Title>Employee Details</Title>
  </LeftHeader>
  <RightHeader>
    <Badge>Unpaid</Badge>
    <PrintIcon><BsPrinter/></PrintIcon>
  </RightHeader>
</Header>


      <GridLayout>
        <InfoTable>
          <InfoRow><Label>Employee name</Label><Value>Ajay kumar M.A</Value></InfoRow>
          <InfoRow><Label>Department</Label><Value>UI UX Designer</Value></InfoRow>
          <InfoRow><Label>No. of Working Days</Label><Value>25</Value></InfoRow>
        </InfoTable>
        <InfoTable>
          <InfoRow><Label>Employee ID</Label><Value>EMP123652</Value></InfoRow>
          <InfoRow><Label>Designation</Label><Value>Bank transfer</Value></InfoRow>
          <InfoRow><Label>Days Present</Label><Value>25</Value></InfoRow>
        </InfoTable>
      </GridLayout>

      <SectionTitle>Net pay Summary</SectionTitle>
      <GridLayout>
        <TableWrapper>
          <Table>
            <thead>
              <tr><TableHeader>Field Label</TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              <tr><TableData>Gross Earnings</TableData><TableData>1200</TableData></tr>
              <tr><TableData>Total deduction</TableData><TableData>1500</TableData></tr>
              <tr><TableData>Net pay</TableData><TableData>1255</TableData></tr>
              <tr><TableData>Payment mode</TableData><TableData>Bank transfer</TableData></tr>
              <tr><TableData>Bank Account</TableData><TableData>****4512</TableData></tr>
            </tbody>
          </Table>
        </TableWrapper>
        <TableWrapper>
          <Table>
            <thead>
              <tr><TableHeader> </TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              <tr><TableData>Leave taken</TableData><TableData>1</TableData></tr>
              <tr><TableData>Casual leave</TableData><TableData>0</TableData></tr>
              <tr><TableData>Paid leave</TableData><TableData>0</TableData></tr>
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
              <tr><TableData>Basic salary</TableData><TableData>1200</TableData><TableData>1200</TableData><TableData>1200</TableData></tr>
              <tr><TableData>Housing allowance</TableData><TableData>-</TableData><TableData>-</TableData><TableData>1500</TableData></tr>
              <tr><TableData>Transportation allowance</TableData><TableData>-</TableData><TableData>-</TableData><TableData>1255</TableData></tr>
              <TotalRow>
                <TableData colSpan="3"><strong>Total Earnings</strong></TableData>
                <TableData><strong>10,000</strong></TableData>
              </TotalRow>
            </tbody>
          </Table>
        </TableWrapper>

        <TableWrapper>
          <SectionTitle>Salary Deduction</SectionTitle>
          <Table>
            <thead>
              <tr><TableHeader>Deductions</TableHeader><TableHeader>Value</TableHeader></tr>
            </thead>
            <tbody>
              <TotalRow>
                <TableData><strong>Total Deduction</strong></TableData>
                <TableData><strong>0</strong></TableData>
              </TotalRow>
            </tbody>
          </Table>
        </TableWrapper>
      </GridLayout>

      <Footer>
        Net pay : Ten Thousand <span>10,000</span>
      </Footer>
    </Container>
  );
};

export default PayrollDetails;

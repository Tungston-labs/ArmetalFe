import React from 'react';
import {
  Container, Header, PlanBox, PlanTitle, PlanDesc, Price,
  Table, Row, Cell, Input, Select, IconCell, ButtonGroup, Button
} from './Payroll1.Styles';
import { FaDownload, FaPlay } from 'react-icons/fa';

const paymentData = [
  { month: 'January', date: '12-12-25', amount: 1500, status: 'Paid' },
  { month: 'February', date: '12-12-25', amount: 1500, status: 'Paid' },
  { month: 'March', date: '12-12-24', amount: 1500, status: 'Paid' },
  { month: 'April', date: '12-12-24', amount: 1500, status: 'Paid' },
  { month: 'May', date: '12-12-24', amount: 1500, status: 'Un-Paid' },
];

const PaymentOverview = () => {
  return (
    <Container>
      <Header>Payment Overview</Header>

      <PlanBox>
        <div>
          <PlanTitle>Enterprise plan</PlanTitle>
          <PlanDesc>
            Pay a fixed $5 per employee. <br />
            Simple, transparent, and ideal for managing individual payroll with ease.
          </PlanDesc>
        </div>
        <Price>$5</Price>
      </PlanBox>

      <Table>
        <thead>
          <tr>
            <Cell header>Month</Cell>
            <Cell header>Paid date</Cell>
            <Cell header>Amount</Cell>
            <Cell header>Status</Cell>
            <Cell header>Import</Cell>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((item, index) => (
            <Row key={index} unpaid={item.status === 'Un-Paid'}>
              <Cell>{item.month}</Cell>
              <Cell>
                <Input type="text" value={item.date} readOnly />
              </Cell>
              <Cell>{item.amount}</Cell>
              <Cell>
                <Select defaultValue={item.status}>
                  <option>Paid</option>
                  <option>Un-Paid</option>
                </Select>
              </Cell>
              <IconCell>
                <FaDownload style={{ cursor: 'pointer', marginRight: '1rem' }} />
                <FaPlay style={{ cursor: 'pointer' }} />
              </IconCell>
            </Row>
          ))}
        </tbody>
      </Table>

      <ButtonGroup>
        <Button cancel>Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>
    </Container>
  );
};

export default PaymentOverview;

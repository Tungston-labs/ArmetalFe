// BankPaymentForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle, FormSection,
  FormGroup, Input, Select, Row, ButtonGroup, Button, ImageUpload
} from './BankPayment.Styles';

export default function BankPaymentForm() {
  return (
    <Container>
      <Header>
        <div>
          <h2>👨‍💼 Employee</h2>
          <p>Manage your Employee</p>
        </div>
        <RoleInfo>HR Manager</RoleInfo>
      </Header>

      <Stepper>
        <Step active>1<br />Basic Details</Step>
        <Step active>2<br />Bank and payment details</Step>
        <Step>3<br />Documents</Step>
      </Stepper>

      <FormSection>
        <SectionTitle>Bank and payment details</SectionTitle>

        <FormGroup><Input placeholder="Bank name" /></FormGroup>

        <Row>
          <ImageUpload />
        </Row>

        <Row>
          <FormGroup><Input placeholder="Swift code" /></FormGroup>
          <FormGroup><Input placeholder="Payment Mode" /></FormGroup>
        </Row>

        <Row>
          <FormGroup><Input placeholder="Account number" /></FormGroup>
          <FormGroup><Input placeholder="UAN / EPF Account number" /></FormGroup>
        </Row>

        <SectionTitle>Tax and compliance</SectionTitle>
        <Row>
          <FormGroup><Input placeholder="Pan Number" /></FormGroup>
          <FormGroup><Input placeholder="Tax Regima Selected" /></FormGroup>
        </Row>
        <Row>
          <FormGroup>
            <Select>
              <option>TDS Deduction Amount</option>
            </Select>
          </FormGroup>
          <FormGroup><Input placeholder="Selection 80C Declaration" /></FormGroup>
        </Row>

        <SectionTitle>Salary and increment</SectionTitle>
        <Row>
          <FormGroup><Input placeholder="Basic Salary" /></FormGroup>
          <FormGroup>
            <Select>
              <option>Salary increment</option>
            </Select>
          </FormGroup>
        </Row>

        <ButtonGroup>
          <Button secondary>Previous step</Button>
          <Button>Next</Button>
        </ButtonGroup>
      </FormSection>
    </Container>
  );
}

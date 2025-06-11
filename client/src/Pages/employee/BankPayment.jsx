// BankPaymentForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle, FormSection,
  FormGroup, Input, Select, Row, ButtonGroup, Button, ImageUpload,Title,Subtitle
  ,Hr,
} from './BankPayment.Styles';
import Multistep from '../../Components/Multistep'
import Table from '../../Components/Table'
export default function BankPaymentForm() {
  return (
    <Container>
      <Header>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
                <div>
                  <Title>Employee</Title>
                  <Subtitle>Manage your Employee.</Subtitle>
                </div>
              </div>
      
              <RoleInfo>
                <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
                <span>HR Manager</span>
              </RoleInfo>
            </Header>

 <Hr />
      <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "20px" }}>
        <div style={{ width: "50%" }}>
          <Multistep />
        </div>
      </div>

      {/* <FormSection>
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
      </FormSection> */}
      <Table />
    </Container>
  );
}

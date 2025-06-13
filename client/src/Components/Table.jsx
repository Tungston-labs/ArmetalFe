import React from 'react';
import {
  Container,
  Header,
  SectionTitle,
  FormSection,
  Row,
  FormGroup,
  Input,
  Select,
  ImageUpload,
  ButtonGroup,
  Button,
  TwoColumnRows
} from './Table.Styles';
import { useNavigate } from 'react-router-dom';

const BankPaymentForm = () => {
  const navigate = useNavigate();

  const handleNext = () => {
navigate('/documents');   // Update this path as needed
  };

  const handlePrevious = () => {
    
      navigate('/basic-details'); // Update this path as needed
  };

  return (
    <Container>
      <Header>
        <h2>Bank and payment details</h2>
      </Header>

      <FormSection>
        <Row>
          <FormGroup style={{ flex: '1 1 100%' }}>
            <Input type="text" placeholder="Bank name" />
          </FormGroup>
          <ImageUpload>
            <span>📷</span>
          </ImageUpload>
        </Row>

        <Row>
          <TwoColumnRows>
            <Input placeholder="Swift code" />
            <Input placeholder="Payment Mode" />
          </TwoColumnRows>
          <TwoColumnRows>
            <Input placeholder="Account number" />
            <Input placeholder="UAN / EPF Account number " />
          </TwoColumnRows>
        </Row>

        <SectionTitle>Tax and compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            <Input placeholder="Pan Number" />
            <Input placeholder="Tax Regima Selected" />
          </TwoColumnRows>

          <TwoColumnRows>
            <Select>
              <option value="">TDS Deduction Amount</option>
              <option value="10%">10%</option>
              <option value="20%">20%</option>
              <option value="30%">30%</option>
            </Select>
            <Input placeholder="Selection 80C Declaration" />
          </TwoColumnRows>
        </Row>

        <SectionTitle>Salary and increment</SectionTitle>
        <Row>
          <TwoColumnRows>
            <Input placeholder="Basic Salary" />
            <Select>
              <option value="">Salary increment</option>
              <option value="10%">10%</option>
              <option value="20%">20%</option>
              <option value="30%">30%</option>
            </Select>
          </TwoColumnRows>
        </Row>

        <ButtonGroup>
          <Button secondary onClick={handlePrevious}>Previous step</Button>
          <Button onClick={handleNext}>Next</Button>
        </ButtonGroup>
      </FormSection>
    </Container>
  );
};

export default BankPaymentForm;

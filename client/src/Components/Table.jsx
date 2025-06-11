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

const BankPaymentForm = () => {
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
  {/* <FormGroup>
    <Input type="text" placeholder="Payment Mode" />
  </FormGroup> */}
</Row>

{/* <Row>
  <FormGroup>
    <Input type="text" placeholder="Account number" />
  </FormGroup>
  <FormGroup>
    <Input type="text" placeholder="UAN / EPF Account number" />
  </FormGroup>
</Row> */}


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
          {/* <FormGroup>
            <Input type="text" placeholder="Tax Regima Selected" />
          </FormGroup> */}


          {/* <FormGroup>
            <Select>
              <option value="">TDS Deduction Amount</option>
              <option value="10%">10%</option>
              <option value="20%">20%</option>
            </Select>
          </FormGroup> */}


          {/* <FormGroup>
            <Input type="text" placeholder="Selection 80C Declaration" />
          </FormGroup> */}
    

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
          {/* <FormGroup>
            <Select>
              <option value="">Salary increment</option>
              <option value="5%">5%</option>
              <option value="10%">10%</option>
            </Select>
          </FormGroup> */}
        </Row>

        <ButtonGroup>
          <Button secondary>Previous step</Button>
          <Button>Next</Button>
        </ButtonGroup>
      </FormSection>
    </Container>
  );
};

export default BankPaymentForm;

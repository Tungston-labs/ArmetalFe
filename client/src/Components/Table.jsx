// components/Table.jsx
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

const ErrorMsg = ({ msg }) => msg ? (<p style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{msg}</p>) : null;

const Table = ({
  bankName, setBankName,
  swiftCode, setSwiftCode,
  paymentMode, setPaymentMode,
  accountNumber, setAccountNumber,
  uanNumber, setUanNumber,
  panNumber, setPanNumber,
  taxRegime, setTaxRegime,
  tdsAmount, setTdsAmount,
  declaration80C, setDeclaration80C,
  basicSalary, setBasicSalary,
  salaryIncrement, setSalaryIncrement,
  housingAllowance, setHousingAllowance,
  transportation, setTransportation,
  handlePrevious,
  handleNext,
  errors = {}
}) => {
  return (
    <Container>
      <Header>
        <h2>Bank and Payment Details</h2>
      </Header>

      <FormSection>
        <Row>
          <FormGroup style={{ flex: '1 1 100%' }}>
              <ErrorMsg msg={errors.bankName} />
            <Input placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          
          </FormGroup>
          <ImageUpload><span>📷</span></ImageUpload>
        </Row>

        <Row>
          <TwoColumnRows>
            <div>
                 <ErrorMsg msg={errors.swiftCode} />
              <Select placeholder="Swift code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} >
            <option value="">For domestic</option>
        <option value="old">International transfers</option>
      
              </Select>
            </div>
            <div>
                      <ErrorMsg msg={errors.paymentMode} />
              <Select placeholder="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} >
      <option value="">Bank Transfer</option>
        <option value="old">Cash</option>
        <option value="new">Cheque</option>
              </Select>
            </div>
          </TwoColumnRows>
          <TwoColumnRows>
            <div>
                   <ErrorMsg msg={errors.accountNumber} />
              <Input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
         
            </div>
            <div>
                 <ErrorMsg msg={errors.uanNumber} />
              <Input placeholder="UAN / EPF Account number" value={uanNumber} onChange={(e) => setUanNumber(e.target.value)} />
           
            </div>
          </TwoColumnRows>
        </Row>

        <SectionTitle>Tax and Compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            <div>
                    <ErrorMsg msg={errors.panNumber} />
              <Input placeholder="Pan Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
        
            </div>
            <div>
                    <ErrorMsg msg={errors.taxRegime} />
              <Select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)} >
          <option value="">Select Regime</option>
        <option value="old">Old Regime</option>
        <option value="new">New Regime</option>
              </Select>
            </div>
          </TwoColumnRows>
          <TwoColumnRows>
            <div>
                <ErrorMsg msg={errors.tdsAmount} />
              <Select value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)}>
                <option value="">TDS Deduction Amount</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </Select>
            
            </div>
            <div>
                  <ErrorMsg msg={errors.declaration80C} />
              <Select value={declaration80C} onChange={(e) => setDeclaration80C(e.target.value)}>
                <option value="">Declaration under 80C?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
          
            </div>
          </TwoColumnRows>
        </Row>

        <SectionTitle>Salary and Increment</SectionTitle>
        <Row>
          <TwoColumnRows>
            <div>
                   <ErrorMsg msg={errors.basicSalary} />
              <Input placeholder="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
         
            </div>
            <div>
                      <ErrorMsg msg={errors.salaryIncrement} />
              <Select value={salaryIncrement} onChange={(e) => setSalaryIncrement(e.target.value)}>
                <option value="">Salary increment</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </Select>
      
            </div>
          </TwoColumnRows>
          <TwoColumnRows>
            <div>
                  <ErrorMsg msg={errors.housingAllowance} />
              <Input placeholder="Housing allowance" value={housingAllowance} onChange={(e) => setHousingAllowance(e.target.value)} />
          
            </div>
            <div>
                 <ErrorMsg msg={errors.transportation} />
              <Input placeholder="Transportation" value={transportation} onChange={(e) => setTransportation(e.target.value)} />
           
            </div>
          </TwoColumnRows>
        </Row>

        <ButtonGroup>
          <Button secondary onClick={handlePrevious}>Previous Step</Button>
          <Button onClick={handleNext}>Next</Button>
        </ButtonGroup>
      </FormSection>
    </Container>
  );
};

export default Table;

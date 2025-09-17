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
import { Label } from '../Pages/employee/BasicLevel.Styles';
const ErrorMsg = ({ msg }) =>
  msg ? <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{msg}</p> : null;

const Table = ({
  // Read-only props
  readOnly = false,
  records = [],
isEditMode=false,


  bankName, setBankName,
    bankProofImage,
  setBankProofImage,
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

  handleSubmit,
  handlePrevious,
  handleNext,
  errors = {}
}) => {
  console.log("tdsAmount",tdsAmount)
  if (!isEditMode && records.length > 0) {
    return (
  <Container>
      <Header><h2>Bank & Payment History</h2></Header>
      {records.map((record, index) => (
        <FormSection key={record.id || index} style={{ padding: '1rem', marginBottom: '2rem' }}>
            {/* Bank Proof Image */}
          {record.bank_proof_image && (
            <Row style={{ marginTop: '1rem' }}>
              <FormGroup style={{ flex: '1 1 100%' }}>
                <label style={{ fontWeight: '500' }}>Bank Proof</label>
                <a
                  href={record.bank_proof_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '0.5rem',marginLeft:"10px" }}
                >
                  <img
                    src={record.bank_proof_image}
                    alt="Bank Proof"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      padding: '4px'
                    }}
                  />
                </a>
              </FormGroup>
            </Row>
          )}

          <TwoColumnRows>
            <FormGroup>
              <Label>Swift Code</Label>
              <Input value={record.swift_code} readOnly placeholder="Swift Code" /></FormGroup>
            <FormGroup>
                <Label>Payment Mode</Label>
              <Input value={record.payment_mode} readOnly placeholder="Payment Mode" /></FormGroup>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroup>
                 <Label>Account Number</Label>
              <Input value={record.account_number} readOnly placeholder="Account Number" /></FormGroup>
            <FormGroup>
              <Label>UAN Number</Label>
              <Input value={record.uan_epf_number} readOnly placeholder="UAN Number" /></FormGroup>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroup>
             <Label>PAN Number</Label>
              <Input value={record.pan_number} readOnly placeholder="PAN Number" /></FormGroup>
            <FormGroup>
                <Label>Tax Regime</Label>
              <Input value={record.tax_regime} readOnly placeholder="Tax Regime" /></FormGroup>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroup>
                <Label>TDS %"</Label>
              <Input value={record.tds_deduction_amount} readOnly placeholder="TDS %" /></FormGroup>
            <FormGroup>
                  <Label>Declaration"</Label>
              <Input value={record.declaration_80c ? 'Yes' : 'No'} readOnly placeholder="80C Declaration" /></FormGroup>
          </TwoColumnRows>

          <SectionTitle>Salary</SectionTitle>
          <TwoColumnRows>
            <FormGroup>
               <Label>Basic Salary"</Label>
              <Input value={record.basic_salary} readOnly placeholder="Basic Salary" /></FormGroup>
            <FormGroup>
               <Label>Salary Increment"</Label>
              <Input value={record.salary_increment} readOnly placeholder="Salary Increment" /></FormGroup>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroup>
                <Label>Housing Allowance"</Label>
              <Input value={record.housing_allowance} readOnly placeholder="Housing Allowance" /></FormGroup>
            <FormGroup>
                   <Label>Transportation"</Label>
              <Input value={record.transportation} readOnly placeholder="Transportation" /></FormGroup>
          </TwoColumnRows>
        </FormSection>
      ))}
    </Container>
    );
  }

  // Editable Mode
  return (
    <Container>
      <Header>
        <h2>Bank and Payment Details</h2>
      </Header>

      <FormSection>
        <Row>
          <FormGroup style={{ flex: '1 1 100%' }}>
            <ErrorMsg msg={errors.bankName} />
                  <Label>Bank name</Label>
            <Input placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </FormGroup>
    <FormGroup style={{ flex: '1 1 100%', alignItems: 'flex-start' }}>
  <label style={{ fontWeight: '500' }}>Upload Bank Passbook Image</label>
  
  {bankProofImage && (
    <img
      src={URL.createObjectURL(bankProofImage)}
      alt="Bank Proof Preview"
      style={{
        marginTop: '0.75rem',
        width: '160px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        display:"flex"
      }}
    />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setBankProofImage(e.target.files[0])}
    style={{ marginTop: '0.5rem',display:"flex" }}
  />
</FormGroup>

        </Row>

        <Row>
          <TwoColumnRows>
            <div>
              <ErrorMsg msg={errors.swiftCode} />
                 <Label>Swift code</Label>
              <Input placeholder="Swift code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
            </div>
            <div>
              <ErrorMsg msg={errors.paymentMode} />
                 <Label> Payment Mode</Label>
              <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cod">Cash on Delivery</option>
                <option value="cheque">Cheque</option>
              </Select>
            </div>
          </TwoColumnRows>

          <TwoColumnRows>
            <div>
              <ErrorMsg msg={errors.accountNumber} />
                <Label>Account number</Label>
              <Input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
            <div>
              <ErrorMsg msg={errors.uanNumber} />
                 <Label>UAN / EPF Account number</Label>
              <Input placeholder="UAN / EPF Account number" value={uanNumber} onChange={(e) => setUanNumber(e.target.value)} />
            </div>
          </TwoColumnRows>
        </Row>

        <SectionTitle>Tax and Compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            <div>
              <ErrorMsg msg={errors.panNumber} />
                    <Label>PAN Number</Label>
              <Input placeholder="PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
            </div>
            <div>
              <ErrorMsg msg={errors.taxRegime} />
                     <Label> Regime</Label>
              <Select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                <option value="">Select Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </div>
          </TwoColumnRows>

          <TwoColumnRows>
            <div>
              <ErrorMsg msg={errors.tdsAmount} />
                     <Label> TDS Deduction Amount</Label>
              <Select value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)}>
                <option value="">TDS Deduction Amount</option>
                <option value="10.00">10%</option>
                <option value="20.00">20%</option>
                <option value="30.00">30%</option>
              </Select>
            </div>
            <div>
              <ErrorMsg msg={errors.declaration80C} />
                     <Label>Declaration under 80C</Label>
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
                  <Label>Basic Salary</Label>
              <Input placeholder="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
            </div>
            <div>
              <ErrorMsg msg={errors.salaryIncrement} />
                 <Label>Salary increment</Label>
              <Select value={salaryIncrement} onChange={(e) => setSalaryIncrement(e.target.value)}>
                <option value="">Salary increment</option>
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="60">60%</option>
                <option value="70">70%</option>
              </Select>
            </div>
          </TwoColumnRows>

          <TwoColumnRows>
            <div>
              <ErrorMsg msg={errors.housingAllowance} />
               <Label>Housing allowance</Label>
              <Input placeholder="Housing allowance" value={housingAllowance} onChange={(e) => setHousingAllowance(e.target.value)} />
            </div>
            <div>
              <ErrorMsg msg={errors.transportation} />
                    <Label>Transportation</Label>
              <Input placeholder="Transportation" value={transportation} onChange={(e) => setTransportation(e.target.value)} />
            </div>
          </TwoColumnRows>
        </Row>

  <ButtonGroup>
  {!isEditMode ? (
    <Button type="button" onClick={handleNext}>
      Next
    </Button>
  ) : (
    <Button type="button" onClick={handleSubmit}>
      Save
    </Button>
  )}
</ButtonGroup>

      </FormSection>
    </Container>
  );
};

export default Table;
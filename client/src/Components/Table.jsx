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
  TwoColumnRows,
  FileInput,
  ImagePreview
} from './Table.Styles';
import { FormGroups, Label } from '../Pages/employee/BasicLevel.Styles';
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
              <FormGroups style={{ flex: '1 1 100%' }}>
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
                      maxWidth: '8rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      padding: '4px'
                    }}
                  />
                </a>
              </FormGroups>
            </Row>
          )}

          <TwoColumnRows>
            <FormGroups>
              <Label>Swift Code</Label>
              <Input value={record.swift_code} readOnly placeholder="Swift Code" /></FormGroups>
            <FormGroups>
                <Label>Payment Mode</Label>
              <Input value={record.payment_mode} readOnly placeholder="Payment Mode" /></FormGroups>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroups>
                 <Label>Account Number</Label>
              <Input value={record.account_number} readOnly placeholder="Account Number" /></FormGroups>
            <FormGroups>
              <Label>UAN Number</Label>
              <Input value={record.uan_epf_number} readOnly placeholder="UAN Number" /></FormGroups>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroups>
             <Label>PAN Number</Label>
              <Input value={record.pan_number} readOnly placeholder="PAN Number" /></FormGroups>
            <FormGroup>
                <Label>Tax Regime</Label>
              <Input value={record.tax_regime} readOnly placeholder="Tax Regime" /></FormGroup>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroups>
                <Label>TDS %"</Label>
              <Input value={record.tds_deduction_amount} readOnly placeholder="TDS %" /></FormGroups>
            <FormGroups>
                  <Label>Declaration"</Label>
              <Input value={record.declaration_80c ? 'Yes' : 'No'} readOnly placeholder="80C Declaration" /></FormGroups>
          </TwoColumnRows>

          <SectionTitle>Salary</SectionTitle>
          <TwoColumnRows>
            <FormGroups>
               <Label>Basic Salary"</Label>
              <Input value={record.basic_salary} readOnly placeholder="Basic Salary" /></FormGroups>
            <FormGroups>
               <Label>Salary Increment"</Label>
              <Input value={record.salary_increment} readOnly placeholder="Salary Increment" /></FormGroups>
          </TwoColumnRows>
          <TwoColumnRows>
            <FormGroups>
                <Label>Housing Allowance"</Label>
              <Input value={record.housing_allowance} readOnly placeholder="Housing Allowance" /></FormGroups>
            <FormGroups>
                   <Label>Transportation"</Label>
              <Input value={record.transportation} readOnly placeholder="Transportation" /></FormGroups>
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
          <FormGroups style={{ flex: '1 1 100%' }}>
       
                  <Label>Bank name</Label>
                       <ErrorMsg msg={errors.bankName} />
            <Input placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </FormGroups>
    <FormGroups style={{ flex: '1 1 100%', alignItems: 'flex-start' }}>
  <Label style={{ fontWeight: '500' }}>Upload Bank Passbook Image</Label>
  
{bankProofImage && <ImagePreview src={URL.createObjectURL(bankProofImage)} alt="Bank Proof Preview" />}
<FileInput type="file" accept="image/*" onChange={(e) => setBankProofImage(e.target.files[0])} />


</FormGroups>

        </Row>

        <Row>
          <TwoColumnRows>
            <FormGroups>
      
                 <Label>Swift code</Label>
                         <ErrorMsg msg={errors.swiftCode} />
              <Input placeholder="Swift code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
            </FormGroups>
            <FormGroups>
          
                 <Label> Payment Mode</Label>
                     <ErrorMsg msg={errors.paymentMode} />
              <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cod">Cash on Delivery</option>
                <option value="cheque">Cheque</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
          
                <Label>Account number</Label>
                    <ErrorMsg msg={errors.accountNumber} />
              <Input placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </FormGroups>
            <FormGroups>
           
                 <Label>UAN / EPF Account number</Label>
                    <ErrorMsg msg={errors.uanNumber} />
              <Input placeholder="UAN / EPF Account number" value={uanNumber} onChange={(e) => setUanNumber(e.target.value)} />
            </FormGroups>
          </TwoColumnRows>
        </Row>

        <SectionTitle>Tax and Compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            <FormGroups>
          
                    <Label>PAN Number</Label>
                        <ErrorMsg msg={errors.panNumber} />
              <Input placeholder="PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
            </FormGroups>
            <FormGroups>
           
                     <Label> Regime</Label>
                        <ErrorMsg msg={errors.taxRegime} />
              <Select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                <option value="">Select Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
      
                     <Label> TDS Deduction Amount</Label>
                             <ErrorMsg msg={errors.tdsAmount} />
              <Select value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)}>
                <option value="">TDS Deduction Amount</option>
                <option value="00.00">0%</option>
                <option value="10.00">10%</option>
                <option value="20.00">20%</option>
                <option value="30.00">30%</option>
              </Select>
            </FormGroups>
            <FormGroups>
         
                     <Label>Declaration under 80C</Label>
                          <ErrorMsg msg={errors.declaration80C} />
              <Select value={declaration80C} onChange={(e) => setDeclaration80C(e.target.value)}>
                <option value="">Declaration under 80C?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>
        </Row>

        <SectionTitle>Salary and Increment</SectionTitle>
        <Row>
          <TwoColumnRows>
            <FormGroups>
           
                  <Label>Basic Salary</Label>
                     <ErrorMsg msg={errors.basicSalary} />
              <Input placeholder="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
            </FormGroups>
            <FormGroups>
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
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
          
               <Label>Housing allowance</Label>
                 <ErrorMsg msg={errors.housingAllowance} />
              <Input placeholder="Housing allowance" value={housingAllowance} onChange={(e) => setHousingAllowance(e.target.value)} />
            </FormGroups>
            <FormGroups>
           
                    <Label>Transportation</Label>
                       <ErrorMsg msg={errors.transportation} />
              <Input placeholder="Transportation" value={transportation} onChange={(e) => setTransportation(e.target.value)} />
            </FormGroups>
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
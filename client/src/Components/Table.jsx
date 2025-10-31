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
  ButtonGroup,
  Button,
  TwoColumnRows,
  FileInput,
  ImagePreview
} from './Table.Styles';
import { FormGroups, Label } from '../Pages/employee/BasicLevel.Styles';

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{msg}</p>
  ) : null;

const Table = ({
  // Form state props
  bankName,
  setBankName,
  bankProofImage,
  setBankProofImage,
  swiftCode,
  setSwiftCode,
  paymentMode,
  setPaymentMode,
  accountNumber,
  setAccountNumber,
  uanNumber,
  setUanNumber,
  panNumber,
  setPanNumber,
  taxRegime,
  setTaxRegime,
  tdsAmount,
  setTdsAmount,
  declaration80C,
  setDeclaration80C,
  basicSalary,
  setBasicSalary,
  salaryIncrement,
  setSalaryIncrement,
  housingAllowance,
  setHousingAllowance,
  transportation,
  setTransportation,

  handleSubmit,
  errors = {}
}) => {
  return (
    <Container>
      <Header>
        <h2>Bank and Payment Details</h2>
      </Header>

      <FormSection>
        {/* --- Bank Name + Proof Upload --- */}
        <Row>
          <FormGroups style={{ flex: '1 1 100%' }}>
            <Label>Bank Name</Label>
            <ErrorMsg msg={errors.bankName} />
            <Input
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </FormGroups>

          {/* <FormGroups style={{ flex: '1 1 100%' }}>
            <Label>Upload Bank Passbook Image</Label>
            {bankProofImage && (
              <ImagePreview
                src={
                  bankProofImage instanceof File
                    ? URL.createObjectURL(bankProofImage)
                    : bankProofImage
                }
                alt="Bank Proof Preview"
              />
            )}
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setBankProofImage(e.target.files[0])}
            />
          </FormGroups> */}
        </Row>

        {/* --- Bank Info --- */}
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>Swift Code</Label>
              <ErrorMsg msg={errors.swiftCode} />
              <Input
                placeholder="Swift Code"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>Payment Mode</Label>
              <ErrorMsg msg={errors.paymentMode} />
              <Select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cod">Cash on Delivery</option>
                <option value="cheque">Cheque</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
              <Label>Account Number</Label>
              <ErrorMsg msg={errors.accountNumber} />
              <Input
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>UAN / EPF Account Number</Label>
              <ErrorMsg msg={errors.uanNumber} />
              <Input
                placeholder="UAN / EPF Account Number"
                value={uanNumber}
                onChange={(e) => setUanNumber(e.target.value)}
              />
            </FormGroups>
          </TwoColumnRows>
        </Row>

        {/* --- Tax & Compliance --- */}
        <SectionTitle>Tax and Compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>PAN Number</Label>
              <ErrorMsg msg={errors.panNumber} />
              <Input
                placeholder="PAN Number"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>Tax Regime</Label>
              <ErrorMsg msg={errors.taxRegime} />
              <Select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
              >
                <option value="">Select Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
              <Label>TDS Deduction Amount</Label>
              <ErrorMsg msg={errors.tdsAmount} />
              <Select
                value={tdsAmount}
                onChange={(e) => setTdsAmount(e.target.value)}
              >
                <option value="">Select TDS %</option>
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </Select>
            </FormGroups>

            <FormGroups>
              <Label>Declaration under 80C</Label>
              <ErrorMsg msg={errors.declaration80C} />
              <Select
                value={declaration80C}
                onChange={(e) => setDeclaration80C(e.target.value)}
              >
                <option value="">Declaration under 80C?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </FormGroups>
          </TwoColumnRows>
        </Row>

        {/* --- Salary & Increment --- */}
        <SectionTitle>Salary and Increment</SectionTitle>
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>Basic Salary</Label>
              <ErrorMsg msg={errors.basicSalary} />
              <Input
                placeholder="Basic Salary"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>Salary Increment</Label>
              <ErrorMsg msg={errors.salaryIncrement} />
              <Select
                value={salaryIncrement}
                onChange={(e) => setSalaryIncrement(e.target.value)}
              >
                <option value="">Salary Increment %</option>
                {[...Array(11).keys()].map((i) => (
                  <option key={i * 10} value={i * 10}>
                    {i * 10}%
                  </option>
                ))}
              </Select>
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
              <Label>Housing Allowance</Label>
              <ErrorMsg msg={errors.housingAllowance} />
              <Input
                placeholder="Housing Allowance"
                value={housingAllowance}
                onChange={(e) => setHousingAllowance(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>Transportation</Label>
              <ErrorMsg msg={errors.transportation} />
              <Input
                placeholder="Transportation"
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
              />
            </FormGroups>
          </TwoColumnRows>
        </Row>

        {/* --- Save Button --- */}
        {/* <ButtonGroup>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </ButtonGroup> */}
      </FormSection>
    </Container>
  );
};

export default Table;

import React from "react";
import {
  Container,
  Header,
  SectionTitle,
  FormSection,
  Row,
  Input,
  Select,
  ButtonGroup,
  Button,
  TwoColumnRows,
  FormGroups,
  Label,
} from "./Table.Styles";

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
      {msg}
    </p>
  ) : null;

const Table = ({
  country,  
  bankName,
  setBankName,
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
  errors = {},
  showNextButton = false,
  handleNext,
}) => {
  return (
    <Container>
      <Header>
        <h2>Bank and Payment Details</h2>
      </Header>

      <FormSection>
        {/* Bank Name */}
        <Row>
          <FormGroups>
            <Label>Bank Name</Label>
            <Input
              placeholder="Enter Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
         <ErrorMsg msg={errors.bankName} />
          </FormGroups>
        </Row>

        {/* Bank Info */}
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>Swift Code</Label>
              <ErrorMsg msg={errors.swiftCode} />
              <Input
                placeholder="Enter Swift Code"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
              />
            </FormGroups>

            <FormGroups>
              <Label>Payment Mode</Label>
         
              <Select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
              </Select>
                   <ErrorMsg msg={errors.paymentMode} />
            </FormGroups>
          </TwoColumnRows>
        </Row>

        {/* Account Info */}
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>Account Number</Label>
         
              <Input
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
                   <ErrorMsg msg={errors.accountNumber} />
            </FormGroups>

            {country !== "IN" && (
              <FormGroups>
                <Label>UAN / EPF Number</Label>
            
                <Input
                  placeholder="Enter UAN / EPF Account Number"
                  value={uanNumber}
                  onChange={(e) => setUanNumber(e.target.value)}
                />
                    <ErrorMsg msg={errors.uanNumber} />
              </FormGroups>
            )}
          </TwoColumnRows>
        </Row>

        {/* Tax & Compliance */}
        <SectionTitle>Tax and Compliance</SectionTitle>
        <Row>
          <TwoColumnRows>
            {country === "IN" && (
              <FormGroups>
                <Label>PAN Number</Label>
              
                <Input
                  placeholder="Enter PAN Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                />
                  <ErrorMsg msg={errors.panNumber} />
              </FormGroups>
            )}

          
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
                <ErrorMsg msg={errors.taxRegime} />
              </FormGroups>
        
          </TwoColumnRows>

            <TwoColumnRows>
              <FormGroups>
                <Label>TDS Deduction Amount</Label>
               
                <Select
                  value={tdsAmount}
                  onChange={(e) => setTdsAmount(e.target.value)}
                >
                  <option value="">Select TDS %</option>
                  {[0, 10, 20, 30].map((i) => (
                    <option key={i} value={i}>
                      {i}%
                    </option>
                  ))}
                </Select>
                 <ErrorMsg msg={errors.tdsAmount} />
              </FormGroups>

              <FormGroups>
                <Label>Declaration under 80C</Label>
               
                <Select
                  value={declaration80C}
                  onChange={(e) => setDeclaration80C(e.target.value)}
                >
                  <option value="">Declaration under 80C?</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
                 <ErrorMsg msg={errors.declaration80C} />
              </FormGroups>
            </TwoColumnRows>
     
        </Row>

        {/* Salary & Increment */}
        <SectionTitle>Salary and Increment</SectionTitle>
        <Row>
          <TwoColumnRows>
            <FormGroups>
              <Label>Basic Salary</Label>
            
              <Input
                placeholder="Enter Basic Salary"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
                <ErrorMsg msg={errors.basicSalary} />
            </FormGroups>

            <FormGroups>
              <Label>Salary Increment</Label>
           
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
                 <ErrorMsg msg={errors.salaryIncrement} />
            </FormGroups>
          </TwoColumnRows>

          <TwoColumnRows>
            <FormGroups>
              <Label>Housing Allowance</Label>
     
              <Input
                placeholder="Enter Housing Allowance"
                value={housingAllowance}
                onChange={(e) => setHousingAllowance(e.target.value)}
              />
                       <ErrorMsg msg={errors.housingAllowance} />
            </FormGroups>

            <FormGroups>
              <Label>Transportation</Label>
             
              <Input
                placeholder="Enter Transportation"
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
              />
               <ErrorMsg msg={errors.transportation} />
            </FormGroups>
          </TwoColumnRows>
        </Row>

        {showNextButton && (
          <ButtonGroup>
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          </ButtonGroup>
        )}
      </FormSection>
    </Container>
  );
};

export default Table;

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Grid2,
  Input,
  Select,
  Label,
  ErrorText,
  FileInput,
  SaveButton,
  Container,
  PreviewImage,
  PdfLink,
  PreviewBox,
  UploadButton,
} from "./ViewTableBank.Styles";

const ViewTableBank = ({
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
  errors = {},
    bankProofImage,   
  setBankProofImage,
}) => {
  return (
    <Container>

  
      <Card>
        <CardHeader>Bank & Payment Details</CardHeader>

        <CardBody>
          <Grid2>
            <div>
              <Label>Bank Name</Label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
              <ErrorText>{errors.bankName}</ErrorText>
            </div>

            <div>
              <Label>Swift Code</Label>
              <Input value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
              <ErrorText>{errors.swiftCode}</ErrorText>
            </div>
          </Grid2>

          <Grid2>
            <div>
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
              </Select>
            </div>

            <div>
              <Label>Account Number</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <ErrorText>{errors.accountNumber}</ErrorText>
            </div>
          </Grid2>

         {/* <div style={{ marginTop: "1rem" }}> */}
  {/* <Label>Bank Proof (optional)</Label> */}

  {/* {bankProofImage && (
    <PreviewBox>
      {typeof bankProofImage === "string" &&
      bankProofImage.endsWith(".pdf") ? (
        <PdfLink href={bankProofImage} target="_blank">
          📄 View Bank Proof (PDF)
        </PdfLink>
      ) : (
        <PreviewImage
          src={
            bankProofImage instanceof File
              ? URL.createObjectURL(bankProofImage)
              : bankProofImage
          }
          alt="Bank Proof"
        />
      )}
    </PreviewBox>
  )} */}

  {/* <UploadButton>
    Upload Bank Proof
    <FileInput
      type="file"
      accept="image/*,application/pdf"
      onChange={(e) => setBankProofImage(e.target.files?.[0] || null)}
    />
  </UploadButton>
</div> */}
        </CardBody>
      </Card>

      {/* ---------- CARD 2: TAX & COMPLIANCE ---------- */}
      <Card>
        <CardHeader>Tax & Compliance</CardHeader>

        <CardBody>
          <Grid2>
            <div>
              <Label>PAN Number</Label>
              <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
              <ErrorText>{errors.panNumber}</ErrorText>
            </div>

            <div>
              <Label>Tax Regime</Label>
              <Select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                <option value="">Select Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </div>
          </Grid2>

          <Grid2>
            <div>
              <Label>TDS Deduction Amount</Label>
              <Select value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)}>
                <option value="">Select TDS %</option>
                {[0, 10, 20, 30].map((i) => (
                  <option key={i} value={i}>{i}%</option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Declaration under 80C</Label>
              <Select value={declaration80C} onChange={(e) => setDeclaration80C(e.target.value)}>
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          </Grid2>
        </CardBody>
      </Card>

      {/* ---------- CARD 3: SALARY & INCREMENT ---------- */}
      <Card>
        <CardHeader>Salary & Increment</CardHeader>

        <CardBody>
          <Grid2>
            <div>
              <Label>Basic Salary</Label>
              <Input value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              <ErrorText>{errors.basicSalary}</ErrorText>
            </div>

            <div>
              <Label>Salary Increment</Label>
              <Select
                value={salaryIncrement}
                onChange={(e) => setSalaryIncrement(e.target.value)}
              >
                {[...Array(11).keys()].map((i) => (
                  <option key={i * 10} value={i * 10}>
                    {i * 10}%
                  </option>
                ))}
              </Select>
            </div>
          </Grid2>

          <Grid2>
            <div>
              <Label>Housing Allowance</Label>
              <Input
                value={housingAllowance}
                onChange={(e) => setHousingAllowance(e.target.value)}
              />
            </div>

            <div>
              <Label>Transportation</Label>
              <Input
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
              />
            </div>
          </Grid2>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ViewTableBank;

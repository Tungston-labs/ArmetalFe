import React,{useState} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Grid2,
  Input,
  Label,
  ErrorText,
  Container,
  TableWrapper,
  Table,
  Th,
  Td,
  AddButton,
 
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
   
  
}) => {
  const [increments, setIncrements] = useState([]);

  const addIncrement = () => {
    setIncrements((prev) => [
      ...prev,
      { date: "", increment: "", total: 0 },
    ]);
  };


  const handleChange = (index, field, value) => {
    setIncrements((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              total:
                field === "increment"
                  ? calculateTotal(item.total, value)
                  : item.total,
            }
          : item
      )
    );
  };

  const calculateTotal = (current, increment) => {
    const total = parseFloat(current) || 0;
    const incr = parseFloat(increment) || 0;
    return (total + incr).toFixed(2);
  };
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
               <div>
              <Label>Basic Salary</Label>
              <Input value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              <ErrorText>{errors.basicSalary}</ErrorText>
            </div>
          </Grid2>

          <Grid2>
            {/* <div>
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="">Select Payment Mode</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
              </Select>
            </div> */}

            <div>
              <Label>Account Number</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <ErrorText>{errors.accountNumber}</ErrorText>
            </div>
             <div>
              <Label>PAN Number</Label>
              <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
              <ErrorText>{errors.panNumber}</ErrorText>
            </div>
          
          </Grid2>
        </CardBody>
      </Card>

      {/* <Card> */}
        {/* <CardHeader>Tax & Compliance</CardHeader> */}
{/* 
        <CardBody>
          <Grid2>
            <div>
              <Label>PAN Number</Label>
              <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
              <ErrorText>{errors.panNumber}</ErrorText>
            </div> */}
            
{/* 
            <div>
              <Label>Tax Regime</Label>
              <Select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                <option value="">Select Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </div> */}
          {/* </Grid2> */}

          {/* <Grid2> */}
            {/* <div>
              <Label>TDS Deduction Amount</Label>
              <Select value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)}>
                <option value="">Select TDS %</option>
                {[0, 10, 20, 30].map((i) => (
                  <option key={i} value={i}>{i}%</option>
                ))}
              </Select>
            </div> */}

            {/* <div>
              <Label>Declaration under 80C</Label>
              <Select value={declaration80C} onChange={(e) => setDeclaration80C(e.target.value)}>
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div> */}
          {/* </Grid2> */}
        {/* </CardBody>
      </Card> */}


      {/* <Card> */}
        {/* <CardHeader>Salary & Increment</CardHeader> */}
{/* 
        <CardBody>
          <Grid2> */}
            {/* <div>
              <Label>Basic Salary</Label>
              <Input value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              <ErrorText>{errors.basicSalary}</ErrorText>
            </div> */}

            {/* <div>
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
            </div> */}
          {/* </Grid2>
        </CardBody>
      </Card>
       */}

<Card>
      <CardHeader>Salary Increment History</CardHeader>
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Increment %</Th>
            <Th>Total Amount</Th>
          </tr>
        </thead>
        <tbody>
          {increments.length > 0 ? (
            increments.map((item, index) => (
              <tr key={index}>
                <Td>
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(e) => handleChange(index, "date", e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={item.increment}
                    onChange={(e) =>
                      handleChange(index, "increment", e.target.value)
                    }
                  />
                </Td>
                <Td>₹ {item.total}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={3} style={{ textAlign: "center", padding: "10px" }}>
                No increments added
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
      <AddButton onClick={addIncrement}>+ Add Increment</AddButton>
    </TableWrapper>
</Card>


    </Container>
  );
};

export default ViewTableBank;

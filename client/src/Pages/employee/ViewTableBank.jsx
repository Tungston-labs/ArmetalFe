import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
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
  Select,
  SaveBtn,
} from "./ViewTableBank.Styles";

import {
  fetchSalaryIncrements,
  addSalaryIncrement,
} from "../../Redux/salaryIncrementSlice";

const ViewTableBank = ({
  employeeId,
  country,
  bankName,
  setBankName,
  swiftCode,
  setSwiftCode,
  ifscCode,
  setIfscCode,
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
}) => {
  const dispatch = useDispatch();

  const { increments = [] } = useSelector((state) => state.salaryIncrement);

  const [showNewRow, setShowNewRow] = useState(false);

  const [newIncrement, setNewIncrement] = useState({
    date: "",
    increment_amount: "",
  });
  const saveIncrement = async () => {
    if (!newIncrement.date || !newIncrement.increment_amount) {
      alert("Please enter date and increment amount");
      return;
    }

    try {
      await dispatch(
        addSalaryIncrement({
          employeeId,
          data: {
            employee: employeeId,
            date: newIncrement.date,
            increment_amount: Number(newIncrement.increment_amount),
          },
        }),
      ).unwrap();

      setNewIncrement({
        date: "",
        increment_amount: "",
      });

      setShowNewRow(false);

      dispatch(fetchSalaryIncrements(employeeId));
    } catch (err) {
      console.log(err);
      alert("Failed to add increment");
    }
  };
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchSalaryIncrements(employeeId));
    }
  }, [dispatch, employeeId]);

  const addIncrement = async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
      await dispatch(
        addSalaryIncrement({
          employeeId,
          data: {
            employee: employeeId,
            date: today,
            increment_amount: 0,
          },
        }),
      ).unwrap();

      dispatch(fetchSalaryIncrements(employeeId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Card>
        <CardHeader>Bank & Payment Details</CardHeader>

        <CardBody>
          <Grid2>
            <div>
              <Label>Bank Name</Label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <ErrorText>{errors.bankName}</ErrorText>
            </div>

            <div>
              <Label>{country === "IN" ? "IFSC Code" : "SWIFT Code"}</Label>

              <Input
                value={country === "IN" ? ifscCode : swiftCode}
                onChange={(e) =>
                  country === "IN"
                    ? setIfscCode(e.target.value.toUpperCase())
                    : setSwiftCode(e.target.value.toUpperCase())
                }
                maxLength={country === "IN" ? 11 : 20}
              />

              <ErrorText>
                {country === "IN" ? errors.ifscCode : errors.swiftCode}
              </ErrorText>
            </div>

            <div>
              <Label>Basic Salary</Label>
              <Input
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
              <ErrorText>{errors.basicSalary}</ErrorText>
            </div>
          </Grid2>

          <Grid2>
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
              <Input
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
              />
              <ErrorText>{errors.panNumber}</ErrorText>
            </div>
            <div>
              <Label>Tax Regime</Label>
              <Select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
              >
                <option value="">Select Tax Regime</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </Select>
            </div>

            <div>
              <Label>TDS Amount</Label>
              <Input
                type="number"
                value={tdsAmount}
                onChange={(e) => setTdsAmount(e.target.value)}
              />
            </div>
          </Grid2>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Salary Increment History</CardHeader>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Increment Amount</Th>
                <Th>Total Salary</Th>
              </tr>
            </thead>

            <tbody>
              {increments.length > 0 ? (
                increments.map((item) => (
                  <tr key={item.id}>
                    <Td>{item.date}</Td>
                    <Td>{item.increment_amount}</Td>
                    <Td>{item.total_salary}</Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    No increments added
                  </Td>
                </tr>
              )}

              {showNewRow && (
                <tr>
                  <Td>
                    <Input
                      type="date"
                      value={newIncrement.date}
                      onChange={(e) =>
                        setNewIncrement({
                          ...newIncrement,
                          date: e.target.value,
                        })
                      }
                    />
                  </Td>

                  <Td>
                    <Input
                      type="number"
                      placeholder="Increment Amount"
                      value={newIncrement.increment_amount}
                      onChange={(e) =>
                        setNewIncrement({
                          ...newIncrement,
                          increment_amount: e.target.value,
                        })
                      }
                    />
                  </Td>

                  <Td>
                    <SaveBtn type="button" onClick={saveIncrement}>
                      Save
                    </SaveBtn>
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>

          <AddButton type="button" onClick={() => setShowNewRow(true)}>
            + Add Increment
          </AddButton>
        </TableWrapper>
      </Card>
    </Container>
  );
};

export default ViewTableBank;

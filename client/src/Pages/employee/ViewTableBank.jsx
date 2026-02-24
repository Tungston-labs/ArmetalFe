import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalaryIncrements,
  addSalaryIncrement,
} from "../../Redux/salaryIncrementSlice";

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
  panNumber,
  setPanNumber,
  basicSalary,
  setBasicSalary,
  errors = {},
}) => {

  const dispatch = useDispatch();

  const { increments, loading } = useSelector(
    (state) => state.salaryIncrement
  );

  const [date, setDate] = useState("");
  const [incrementAmount, setIncrementAmount] = useState("");

  // Fetch increment history
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchSalaryIncrements(employeeId));
    }
  }, [employeeId, dispatch]);

  // Add Increment
  const handleAddIncrement = () => {

    if (!date || !incrementAmount || !employeeId) return;

    dispatch(
      addSalaryIncrement({
        employeeId,
        data: {
          employee: employeeId,
          date,
          increment_amount: Number(incrementAmount),
        },
      })
    )
      .unwrap()
      .then(() => {
        setDate("");
        setIncrementAmount("");

        dispatch(fetchSalaryIncrements(employeeId));
      });
  };

  return (
    <Container>

      {/* BANK DETAILS */}
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
              />
            </div>

            <div>
              <Label>Basic Salary</Label>
              <Input
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
            </div>

          </Grid2>
        </CardBody>
      </Card>

      {/* INCREMENT HISTORY */}
      <Card>
        <CardHeader>Salary Increment History</CardHeader>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Increment Amount</Th>
                <Th>Salary</Th>
              </tr>
            </thead>

            <tbody>
              {(increments || []).length > 0 ? (
                (increments || []).map((item) => (
                  <tr key={item.id}>
                    <Td>{item.date}</Td>
                    <Td>
                      ₹ {Number(item.increment_amount).toLocaleString("en-IN")}
                    </Td>
                    <Td>
                      ₹ {Number(item.total_salary).toLocaleString("en-IN")}
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={2} style={{ textAlign: "center" }}>
                    No increments found
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>

          <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Increment Amount"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
            />

            <AddButton onClick={handleAddIncrement}>
              {loading ? "Saving..." : "+ Add"}
            </AddButton>
          </div>

        </TableWrapper>
      </Card>

    </Container>
  );
};

export default ViewTableBank;
import React, { useState } from "react";
import {
  Overlay,
  Modal,
  Header,
  HeaderLeft,
  Title,
  Subtitle,
  CloseBtn,
  Body,
  EmployeeCard,
  Avatar,
  EmpInfo,
  EmpName,
  EmpSub,
  Row,
  Field,
  Label,
  Input,
  TextArea,
  Footer,
  CancelBtn,
  SaveBtn,
} from "../IncentiveModal/IncentiveModal.styles";

import { useDispatch } from "react-redux";
// import { updatePayrollDeduction } from "../../../Redux/payrollSlice";

const DeductionModal = ({ onClose, employee, month, year }) => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const newErrors = {};

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!type?.trim()) {
      newErrors.type = "Deduction type is required";
    }

    if (remarks.length > 200) {
      newErrors.remarks = "Remarks cannot exceed 200 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await dispatch(
        updatePayrollDeduction({
          employeeId: employee.employee,
          month,
          year,
          deduction_amount: amount,
          deduction_type: type,
          deduction_reason: remarks,
        })
      ).unwrap();

      onClose(true);
    } catch (err) {
      console.log("Deduction Error:", err);

      if (
        err?.error === "Deduction already added for this employee for this month." ||
        err?.message === "Deduction already added for this employee for this month."
      ) {
        onClose(true);
        return;
      }

      if (typeof err === "object") {
        setErrors(err);
      } else {
        setErrors({
          general: err || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <HeaderLeft>
            <Title>Add Deduction</Title>
            <Subtitle>
              {new Date().toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </Subtitle>
          </HeaderLeft>

          <CloseBtn onClick={() => onClose(false)}>
            ✕
          </CloseBtn>
        </Header>

        <Body>
          <EmployeeCard>
            <Avatar>
              {employee?.employee_name?.slice(0, 2).toUpperCase()}
            </Avatar>

            <EmpInfo>
              <EmpName>{employee?.employee_name}</EmpName>
              <EmpSub>
                {employee?.employee_id} · {employee?.department || "N/A"}
              </EmpSub>
            </EmpInfo>
          </EmployeeCard>

          <Row>
            <Field>
              <Label>Deduction Amount</Label>

              <Input
                type="number"
                placeholder="e.g. 2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {errors.amount && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.amount}
                </p>
              )}
            </Field>

            <Field>
              <Label>Deduction Type</Label>

              <Input
                type="text"
                placeholder="e.g. Late Attendance"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />

              {errors.type && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.type}
                </p>
              )}
            </Field>
          </Row>

          <Field>
            <Label>Reason / Remarks</Label>

            <TextArea
              placeholder="Briefly describe the reason for this deduction..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            {errors.remarks && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.remarks}
              </p>
            )}
          </Field>
        </Body>

        <Footer>
          {errors.general && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              {errors.general}
            </p>
          )}

          <CancelBtn onClick={() => onClose(false)}>
            Cancel
          </CancelBtn>

          <SaveBtn
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Deduction"}
          </SaveBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default DeductionModal;
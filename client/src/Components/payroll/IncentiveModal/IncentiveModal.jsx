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
} from "./IncentiveModal.styles";
import { useDispatch } from "react-redux";
import { updatePayrollIncentive } from "../../../Redux/payrollSlice";
const IncentiveModal = ({ onClose, employee, month, year }) => {
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
    if (!type || !type.trim()) {
      newErrors.type = "Incentive type is required";
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
        updatePayrollIncentive({
          employeeId: employee.employee,
          month,
          year,
          incentive_amount: amount,
          incentive_type: type,
          incentive_reason: remarks,
        }),
      ).unwrap();

      onClose(true);
    } catch (err) {
      console.log("Incentive Error:", err);
      if (
        err?.error ===
          "Incentive already added for this employee for this month." ||
        err?.message ===
          "Incentive already added for this employee for this month."
      ) {
        onClose(true); // ✅ make button Added
        return;
      }
      if (typeof err === "object") {
        setErrors(err);
      } else {
        setErrors({ general: err || "Something went wrong" });
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
            <Title>Add Incentive</Title>
            <Subtitle>
              {new Date().toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </Subtitle>
          </HeaderLeft>
          <CloseBtn onClick={() => onClose(false)}>✕</CloseBtn>{" "}
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
              <Label>Incentive Amount</Label>
              <Input
                type="number"
                placeholder="e.g. 8000"
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
              <Label>Incentive Type</Label>
              <Input
                type="text"
                placeholder="e.g. Sales Bonus"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              {errors.type && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
              )}
            </Field>
          </Row>
          <Field>
            <Label>Reason / Remarks</Label>
            <TextArea
              placeholder="Briefly describe the reason for this incentive..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            {errors.remarks && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.remarks}</p>
            )}
          </Field>
        </Body>
        <Footer>
          {errors.general && (
            <p style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>
              {errors.general}
            </p>
          )}
          <CancelBtn onClick={() => onClose(false)}>Cancel</CancelBtn>{" "}
          {/* ✅ false */}
          <SaveBtn onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Incentive"}
          </SaveBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};
export default IncentiveModal;

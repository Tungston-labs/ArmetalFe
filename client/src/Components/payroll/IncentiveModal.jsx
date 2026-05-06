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
// import { addEmployeeIncentive } from "../../Redux/payrollSlice";
const IncentiveModal = ({ onClose, employee }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [remarks, setRemarks] = useState("");
    const [errors, setErrors] = useState({});


    const [loading, setLoading] = useState(false);

const handleSave = async () => {
    const newErrors = {};

    // Amount validation
    if (!amount) {
        newErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
    }

    // Type validation
    if (!type || !type.trim()) {
        newErrors.type = "Incentive type is required";
    }

    // Optional: remarks limit
    if (remarks.length > 200) {
        newErrors.remarks = "Remarks cannot exceed 200 characters";
    }

    // If errors exist → stop
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setErrors({});
    setLoading(true);

    try {
        await dispatch(
            addEmployeeIncentive({
                employeeId: employee.employee,
                amount,
                type,
                remarks,
            })
        ).unwrap();

        onClose();
    } catch (err) {
        // ✅ Backend error handling
        if (typeof err === "object") {
            setErrors(err); // if backend sends field errors
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
                {/* Header */}
                <Header>
                    <HeaderLeft>
                        <Title>Add Incentive</Title>
                        <Subtitle>
                            {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
                        </Subtitle>
                    </HeaderLeft>

                    <CloseBtn onClick={onClose}>✕</CloseBtn>
                </Header>

                {/* Body */}
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
                            <Label>Incentive Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 8000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {errors.amount && <p style={{ color: "red", fontSize: "12px" }}>{errors.amount}</p>}
                        </Field>

                        <Field>
                            <Label>Incentive Type</Label>
                            <Input
                                type="text"
                                placeholder="e.g. Sales Bonus"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                            {errors.type && <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>}
                        </Field>
                    </Row>

                    <Field>
                        <Label>Reason / Remarks</Label>
                        <TextArea
                            placeholder="Briefly describe the reason for this incentive..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                        {errors.remarks && <p style={{ color: "red", fontSize: "12px" }}>{errors.remarks}</p>}
                    </Field>
                </Body>

                {/* Footer */}
                <Footer>
                    <CancelBtn onClick={onClose}>Cancel</CancelBtn>
                    <SaveBtn onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Incentive"}
                    </SaveBtn>
                </Footer>
            </Modal>
        </Overlay>
    );
};

export default IncentiveModal;
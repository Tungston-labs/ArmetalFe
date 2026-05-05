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

const IncentiveModal = ({ onClose, employee }) => {
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [remarks, setRemarks] = useState("");

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
                        </Field>

                        <Field>
                            <Label>Incentive Type</Label>
                            <Input
                                type="text"
                                placeholder="e.g. Sales Bonus"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Field>
                    </Row>

                    <Field>
                        <Label>Reason / Remarks</Label>
                        <TextArea
                            placeholder="Briefly describe the reason for this incentive..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </Field>
                </Body>

                {/* Footer */}
                <Footer>
                    <CancelBtn onClick={onClose}>Cancel</CancelBtn>
                    <SaveBtn>Save Incentive</SaveBtn>
                </Footer>
            </Modal>
        </Overlay>
    );
};

export default IncentiveModal;
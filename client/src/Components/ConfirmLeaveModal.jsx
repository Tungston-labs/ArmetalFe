import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import {
  ModalOverlay,
  ModalContainer,
  Message,
  ButtonRow,
  ModalButton,
} from "./ConfirmLeaveModal.Styles";

const ConfirmLeaveModal = ({
  onConfirm,   // ✅ parent callback
  actionType = "approve",
  leaveId,
  zIndex = 2000,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ initialize navigate

  if (!leaveId) {
    console.error("Leave ID not provided to ConfirmLeaveModal!");
    return null;
  }

  const actionText = actionType === "reject" ? "Reject leave" : "Approve leave";

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();   // ✅ call parent logic
    setLoading(false);
  };

  const handleCancel = () => {
    navigate(-1); // ✅ go back to the previous page
  };

  return ReactDOM.createPortal(
    <ModalOverlay style={{ zIndex }}>
      <ModalContainer style={{ zIndex: zIndex + 1 }}>
        <Message>
          Are you sure you want to {actionText}?
        </Message>
        <ButtonRow>
          <ModalButton variant="cancel" onClick={handleCancel} disabled={loading}>
            Cancel
          </ModalButton>
          <ModalButton variant="confirm" onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : "Yes"}
          </ModalButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default ConfirmLeaveModal;

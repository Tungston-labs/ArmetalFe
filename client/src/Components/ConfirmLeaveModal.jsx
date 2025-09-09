import React, { useState } from "react";
import ReactDOM from "react-dom";
import API from "../services/api"; // make sure API instance is imported
import {
  ModalOverlay,
  ModalContainer,
  Message,
  BoldText,
  ButtonRow,
  ModalButton,
} from "./ConfirmLeaveModal.Styles";

const ConfirmLeaveModal = ({
  onClose,
  onConfirm,   // ✅ new callback from parent
  actionType = "approve",
  leaveId,
  zIndex = 2000,
}) => {
  const [loading, setLoading] = useState(false);

  if (!leaveId) {
    console.error("Leave ID not provided to ConfirmLeaveModal!");
    return null;
  }

  const actionText = actionType === "reject" ? "Reject leave" : "Approve leave";

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();   // ✅ use parent’s Redux + navigation logic
    setLoading(false);
  };

  return ReactDOM.createPortal(
    <ModalOverlay style={{ zIndex }}>
      <ModalContainer style={{ zIndex: zIndex + 1 }}>
        <Message>
          Are you sure ??? <br />
        </Message>
        <ButtonRow>
          <ModalButton variant="cancel" onClick={onClose} disabled={loading}>
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

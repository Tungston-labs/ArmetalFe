import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  ModalOverlay,
  ModalContainer,
  Message,
  ButtonRow,
  ModalButton,
} from "./ConfirmLeaveModal.Styles";

const ConfirmLeaveModal = ({
  show,
  onConfirm,
  onClose,
  actionType = "approve",
  leaveId,
  zIndex = 2000,
}) => {
  const [loading, setLoading] = useState(false);
  if (!show) {
    return null;
  }

  if (!leaveId) {
    return null;
  }

  const actionText =
    actionType === "reject" || actionType === "rejected"
      ? "Reject leave"
      : "Approve leave";

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(); // ✅ call parent logic
    setLoading(false);
  };

  const handleCancel = () => onClose();

  return ReactDOM.createPortal(
    <ModalOverlay style={{ zIndex }}>
      <ModalContainer style={{ zIndex: zIndex + 1 }}>
        <Message>Are you sure you want to {actionText}?</Message>
        <ButtonRow>
          <ModalButton
            variant="cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </ModalButton>
          <ModalButton
            variant="confirm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Yes"}
          </ModalButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>,
    document.body,
  );
};

export default ConfirmLeaveModal;

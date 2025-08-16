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

  // API call to update leave status
  const handleConfirm = async () => {
    if (!leaveId) return;

    const status = actionType === "approve" ? "approved" : "rejected";

    try {
      setLoading(true);
      const response = await API.patch(`/leave/admin/${leaveId}/`, { status });
      console.log("Leave updated successfully:", response.data);
      onClose(); // close modal after success
    } catch (error) {
      console.error("Error updating leave status:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay style={{ zIndex }}>
      <ModalContainer style={{ zIndex: zIndex + 1 }}>
        <Message>
          Are you sure you want to <br />
          {actionText} <BoldText>(ID: {leaveId})?</BoldText>
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

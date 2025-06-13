import React from 'react';
import {
  ModalOverlay,
  ModalContainer,
  Message,
  BoldText,
  ButtonRow,
  ModalButton
} from './ConfirmLeaveModal.Styles';

const ConfirmLeaveModal = ({ onClose, onConfirm, actionType = 'approve' }) => {
  const actionText = actionType === 'decline' ? 'decline leave' : 'Approve leave';

  return (
    <ModalOverlay>
      <ModalContainer>
        <Message>
          Are you sure you want to <br />
          {actionText}<BoldText>?</BoldText>
        </Message>
        <ButtonRow>
          <ModalButton variant="cancel" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="confirm" onClick={onConfirm}>
            Yes
          </ModalButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmLeaveModal;

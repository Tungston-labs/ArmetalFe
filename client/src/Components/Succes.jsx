import React from 'react';
import {
  ModalOverlay,
  ModalBox,
  SuccessImage,
  Title,
  Message,
  ButtonGroup,
  ModalButton
} from './Succes.Stles';

const SuccessModal = ({ onClose, onAddAnother }) => {
  return (
    <ModalOverlay>
      <ModalBox>
         <Message>New employee added.</Message>
        <SuccessImage src="/images/succes.png" alt="Success" />
        <Title>Success!</Title>
    
        <ButtonGroup>
          <ModalButton variant="dark" onClick={onClose}>Close</ModalButton>
          <ModalButton variant="light" onClick={onAddAnother}>Add another</ModalButton>
        </ButtonGroup>
      </ModalBox>
    </ModalOverlay>
  );
};

export default SuccessModal;

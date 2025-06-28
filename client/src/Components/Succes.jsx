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

const SuccessModal = ({ onClose, onAddAnother, navigate }) => {
  return (
    <ModalOverlay>
      <ModalBox>
        <Message>New employee added.</Message>
        <SuccessImage src="/images/succes.png" alt="Success" />
        <Title>Success!</Title>

        <ButtonGroup>
          <ModalButton
            variant="dark"
            onClick={() => {
              onClose();
              navigate('/employee'); // 👈 Navigate to employee list
            }}
          >
            Close
          </ModalButton>
          <ModalButton
            variant="light"
            onClick={() => {
              onAddAnother();
              navigate('/employee'); // 👈 Navigate to add-basic-form
            }}
          >
            Add another
          </ModalButton>
        </ButtonGroup>
      </ModalBox>
    </ModalOverlay>
  );
};

export default SuccessModal;

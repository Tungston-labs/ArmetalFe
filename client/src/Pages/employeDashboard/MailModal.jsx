import React from "react";
import {
  ModalOverlay,
  ModalBox,
  ModalHeader,
  CloseBtn,
  Input,
  TextArea,
  SendBtn,
  Row,
  Label
} from "./MailModal.styles";

const MailModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span>New Message</span>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <Row>
          <Label>To </Label>
          <Input type="email" defaultValue={employee?.email} />
        </Row>

        <Row>
          <Label>Subject </Label>
          <Input type="text" placeholder="Enter subject" />
        </Row>

        <TextArea placeholder="Write your message..." />

        <SendBtn>Send</SendBtn>
      </ModalBox>
    </ModalOverlay>
  );
};

export default MailModal;

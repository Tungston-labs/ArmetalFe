import React, { useState } from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Form,
  FormRow,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  Label,
  CloseButton,
  Select,
} from "./NewFinance.Styles";
import { FaArrowLeft } from "react-icons/fa6";

const FinanceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    date: "",
    paymentType: "",
    moneyInOut: "",
    amount1: "",
    amount2: "",
    note: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={onClose}><FaArrowLeft /></CloseButton>
          <ModalTitle>New Finance Entry</ModalTitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <div>
              <Label>Category</Label>
              <Input
                type="text"
                name="category"
                placeholder="Enter Category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                placeholder="Enter date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </FormRow>

          <FormRow>
           <div>
  <Label>Payment type</Label>
  <Select
    name="paymentType"
    value={formData.paymentType}
    onChange={handleChange}
  >
    <option value="">Select Payment Type</option>
    <option value="Payment In">Payment In</option>
    <option value="Payment Out">Payment Out</option>
  </Select>
</div>
            <div>
              <Label>Enter amount</Label>
              <Input
                type="number"
                name="amount1"
                placeholder="Enter amount"
                value={formData.amount1}
                onChange={handleChange}
              />
            </div>
          </FormRow>
          <div>
            <Label>Note</Label>
            <TextArea
              name="note"
              placeholder="Enter note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <ButtonGroup>
            <Button type="button" variant="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="submit">
              Submit
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FinanceModal;

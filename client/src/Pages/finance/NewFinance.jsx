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
} from "./NewFinance.Styles";
import { FaArrowLeft } from "react-icons/fa6";

const FinanceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
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
              <Label>Sub Category</Label>
              <Input
                type="text"
                name="subCategory"
                placeholder="Enter Category"
                value={formData.subCategory}
                onChange={handleChange}
              />
            </div>
          </FormRow>

          <FormRow>
            <div>
              <Label>Payment type</Label>
              <Input
                type="text"
                name="paymentType"
                placeholder="Enter Category"
                value={formData.paymentType}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Money in or out</Label>
              <Input
                type="text"
                name="moneyInOut"
                placeholder="Enter Category"
                value={formData.moneyInOut}
                onChange={handleChange}
              />
            </div>
          </FormRow>

          <FormRow>
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
            <div>
              <Label>Enter amount</Label>
              <Input
                type="number"
                name="amount2"
                placeholder="Enter amount"
                value={formData.amount2}
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

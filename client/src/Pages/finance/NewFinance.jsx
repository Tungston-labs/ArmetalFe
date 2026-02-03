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
const getTodayDate = () => new Date().toISOString().split("T")[0];
const CATEGORY_OPTIONS = [
  { label: "Salary", value: "SALARY" },
  { label: "Reimbursement", value: "REIMBURSEMENT" },
  { label: "Travel", value: "TRAVEL" },
  { label: "Food", value: "FOOD" },
  { label: "Other", value: "OTHER" },
];

const PAYMENT_TYPE_OPTIONS = [
  { label: "Income", value: "IN" },
  { label: "Expense", value: "OUT" },
];

const initialFormState = {
  category: "",
  date: getTodayDate(), 
  paymentType: "",
  amount1: "",
  note: "",
};

const FinanceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});


  if (!isOpen) return null;
 const resetForm = () => {
  setFormData({
    ...initialFormState,
    date: getTodayDate(), 
  });
  setErrors({});
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.paymentType)
      newErrors.paymentType = "Payment type is required";
    if (!formData.amount1)
      newErrors.amount1 = "Amount is required";
    else if (Number(formData.amount1) <= 0)
      newErrors.amount1 = "Amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Wait for save to complete
    await onSave({
      category: formData.category,
      paymentType: formData.paymentType,
      amount1: formData.amount1,
      date: formData.date,
      note: formData.note,
    });

    resetForm();   // ✅ CLEAR FORM
  };

  const handleClose = () => {
    resetForm();   // ✅ Clear when closing manually too
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={handleClose}>
            <FaArrowLeft />
          </CloseButton>
          <ModalTitle>New Finance Entry</ModalTitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <div>
              <Label>Category *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.category && <p className="error">{errors.category}</p>}
            </div>

            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <p className="error">{errors.date}</p>}
            </div>
          </FormRow>

          <FormRow>
            <div>
              <Label>Payment Type *</Label>
              <Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="">Select Payment Type</option>
                {PAYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.paymentType && (
                <p className="error">{errors.paymentType}</p>
              )}
            </div>

            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                name="amount1"
                value={formData.amount1}
                onChange={handleChange}
              />
              {errors.amount1 && (
                <p className="error">{errors.amount1}</p>
              )}
            </div>
          </FormRow>

          <div>
            <Label>Note</Label>
            <TextArea
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <ButtonGroup>
            <Button type="button" variant="cancel" onClick={handleClose}>
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

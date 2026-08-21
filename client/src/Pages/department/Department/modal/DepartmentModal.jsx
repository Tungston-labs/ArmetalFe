import React, { useEffect, useState } from "react";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  Form,
  FormRow,
  FormGroup,
  Label,
  Required,
  Input,
  Select,
  ButtonRow,
  CancelButton,
  SubmitButton,
} from "./DepartmentModal.styles";

const emptyForm = {
  departmentName: "",
  departmentCode: "",
  headOfDepartment: "",
  teamLead: "",
};

const DepartmentModal = ({
  isOpen,
  onClose,
  mode = "add",
  departmentData = null,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(emptyForm);

  const isEdit = mode === "edit";

  // Fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (isEdit && departmentData) {
        setFormData({
          departmentName:
            departmentData.departmentName || "",
          departmentCode:
            departmentData.departmentCode || "",
          headOfDepartment:
            departmentData.headOfDepartment || "",
          teamLead:
            departmentData.teamLead || "",
        });
      } else {
        setFormData(emptyForm);
      }
    }
  }, [isOpen, isEdit, departmentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.departmentName.trim() ||
      !formData.departmentCode ||
      !formData.teamLead
    ) {
      return;
    }

    if (onSubmit) {
      onSubmit({
        ...formData,
        ...(isEdit && departmentData
          ? { id: departmentData.id }
          : {}),
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData(emptyForm);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <ModalHeader>
          <ModalTitle>
            {isEdit ? "Edit Department" : "Add Department"}
          </ModalTitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <FormRow>

            {/* Department Name */}
            <FormGroup>
              <Label>
                Department Name <Required>*</Required>
              </Label>

              <Input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="Development"
              />
            </FormGroup>

            {/* Department Code */}
            <FormGroup>
              <Label>
                Department Code <Required>*</Required>
              </Label>
 <Input
                type="text"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                placeholder="DEV-001"
              />

              
            </FormGroup>

          </FormRow>

          {/* Row 2 */}
          <FormRow>

            {/* Head Of Department */}
            <FormGroup>
              <Label>
                Head Of The Department
              </Label>

              <Select
                name="headOfDepartment"
                value={formData.headOfDepartment}
                onChange={handleChange}
              >
                <option value="">
                  Select Head
                </option>

                <option value="Riswin">
                  Riswin
                </option>

                <option value="John">
                  John
                </option>

                <option value="David">
                  David
                </option>
              </Select>
            </FormGroup>

            {/* Team Lead */}
            <FormGroup>
              <Label>
                Team Lead <Required>*</Required>
              </Label>

              <Select
                name="teamLead"
                value={formData.teamLead}
                onChange={handleChange}
              >
                <option value="">
                  Select Team Lead
                </option>

                <option value="Ajay">
                  Ajay
                </option>

                <option value="Alex">
                  Alex
                </option>

                <option value="Robert">
                  Robert
                </option>
              </Select>
            </FormGroup>

          </FormRow>

          {/* Buttons */}
          <ButtonRow>

            <CancelButton
              type="button"
              onClick={handleClose}
            >
              CANCEL
            </CancelButton>

            <SubmitButton type="submit">
              {isEdit ? "UPDATE" : "CREATE"}
            </SubmitButton>

          </ButtonRow>

        </Form>
      </Modal>
    </Overlay>
  );
};

export default DepartmentModal;
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
  ErrorMessage,
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
  departments = [],
}) => {
  const [formData, setFormData] = useState(emptyForm);

  const [errors, setErrors] = useState({
    departmentName: "",
    departmentCode: "",
    general: "",
  });

  const isEdit = mode === "edit";

  // =====================================================
  // FILL FORM
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && departmentData) {
      setFormData({
        departmentName:
          departmentData.departmentName ||
          departmentData.name ||
          "",

        departmentCode:
          departmentData.departmentCode ||
          departmentData.department_code ||
          departmentData.code ||
          "",

        headOfDepartment:
          departmentData.headOfDepartment ||
          departmentData.head_of_department ||
          departmentData.department_head ||
          "",

        teamLead:
          departmentData.teamLead ||
          departmentData.team_lead ||
          "",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({
      departmentName: "",
      departmentCode: "",
      general: "",
    });
  }, [isOpen, isEdit, departmentData]);

  // =====================================================
  // CHECK UNIQUE DEPARTMENT NAME
  // =====================================================

  const checkUniqueName = (value) => {
    const name = String(value || "")
      .trim()
      .toLowerCase();

    if (!name) {
      return "";
    }

    const duplicate = departments.some((department) => {
      // Ignore current department while editing
      if (
        isEdit &&
        departmentData &&
        Number(department.id) ===
          Number(departmentData.id)
      ) {
        return false;
      }

      const existingName = String(
        department.name ||
          department.departmentName ||
          ""
      )
        .trim()
        .toLowerCase();

      return existingName === name;
    });

    if (duplicate) {
      return "Department name already exists.";
    }

    return "";
  };

  // =====================================================
  // CHECK UNIQUE DEPARTMENT CODE
  // =====================================================

  const checkUniqueCode = (value) => {
    const code = String(value || "")
      .trim()
      .toLowerCase();

    if (!code) {
      return "";
    }

    const duplicate = departments.some((department) => {
      // Ignore current department while editing
      if (
        isEdit &&
        departmentData &&
        Number(department.id) ===
          Number(departmentData.id)
      ) {
        return false;
      }

      const existingCode = String(
        department.department_code ||
          department.departmentCode ||
          department.code ||
          ""
      )
        .trim()
        .toLowerCase();

      return existingCode === code;
    });

    if (duplicate) {
      return "Department code already exists.";
    }

    return "";
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Department Name
    if (name === "departmentName") {
      setErrors((prev) => ({
        ...prev,
        departmentName:
          checkUniqueName(value),
        general: "",
      }));
    }

    // Department Code
    if (name === "departmentCode") {
      setErrors((prev) => ({
        ...prev,
        departmentCode:
          checkUniqueCode(value),
        general: "",
      }));
    }

    // Other fields
    if (
      name !== "departmentName" &&
      name !== "departmentCode"
    ) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    const newErrors = {
      departmentName: "",
      departmentCode: "",
      general: "",
    };

    // Department Name
    if (!formData.departmentName.trim()) {
      newErrors.departmentName =
        "Department name is required.";
    } else {
      newErrors.departmentName =
        checkUniqueName(
          formData.departmentName
        );
    }

    // Department Code
    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode =
        "Department code is required.";
    } else {
      newErrors.departmentCode =
        checkUniqueCode(
          formData.departmentCode
        );
    }

    // Team Lead
    if (!formData.teamLead) {
      newErrors.general =
        "Please select a team lead.";
    }

    setErrors(newErrors);

    return (
      !newErrors.departmentName &&
      !newErrors.departmentCode &&
      !newErrors.general
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
    };

    // Add ID only when editing
    if (isEdit && departmentData?.id) {
      submitData.id = departmentData.id;
    }

    console.log(
      isEdit
        ? "Updating department:"
        : "Creating department:",
      submitData
    );

    if (!onSubmit) {
      return;
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error(
        "Department modal submit error:",
        error
      );

      // =================================================
      // BACKEND DEPARTMENT CODE ERROR
      // =================================================

      if (error?.department_code) {
        const message = Array.isArray(
          error.department_code
        )
          ? error.department_code[0]
          : error.department_code;

        setErrors((prev) => ({
          ...prev,
          departmentCode: message,
        }));

        return;
      }

      // =================================================
      // BACKEND DEPARTMENT NAME ERROR
      // =================================================

      if (error?.name) {
        const message = Array.isArray(
          error.name
        )
          ? error.name[0]
          : error.name;

        setErrors((prev) => ({
          ...prev,
          departmentName: message,
        }));

        return;
      }

      // =================================================
      // GENERAL BACKEND ERROR
      // =================================================

      let message =
        error?.detail ||
        error?.message ||
        "Unable to save department. Please try again.";

      if (Array.isArray(message)) {
        message = message[0];
      }

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    setFormData(emptyForm);

    setErrors({
      departmentName: "",
      departmentCode: "",
      general: "",
    });

    onClose();
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleClose}>
      <Modal
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <ModalHeader>
          <ModalTitle>
            {isEdit
              ? "Edit Department"
              : "Add Department"}
          </ModalTitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {/* =================================================
              ROW 1
          ================================================= */}

          <FormRow>
            {/* Department Name */}

            <FormGroup>
              <Label>
                Department Name{" "}
                <Required>*</Required>
              </Label>

              <Input
                type="text"
                name="departmentName"
                value={
                  formData.departmentName
                }
                onChange={handleChange}
                placeholder="Development"
                autoComplete="off"
              />

              {errors.departmentName && (
                <ErrorMessage>
                  {errors.departmentName}
                </ErrorMessage>
              )}
            </FormGroup>

            {/* Department Code */}

            <FormGroup>
              <Label>
                Department Code{" "}
                <Required>*</Required>
              </Label>

              <Input
                type="text"
                name="departmentCode"
                value={
                  formData.departmentCode
                }
                onChange={handleChange}
                placeholder="DEV-001"
                autoComplete="off"
              />

              {errors.departmentCode && (
                <ErrorMessage>
                  {errors.departmentCode}
                </ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          {/* =================================================
              ROW 2
          ================================================= */}

          <FormRow>
            {/* Head Of Department */}

            <FormGroup>
              <Label>
                Head Of The Department
              </Label>

              <Select
                name="headOfDepartment"
                value={
                  formData.headOfDepartment
                }
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
                Team Lead{" "}
                <Required>*</Required>
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

          {/* =================================================
              GENERAL ERROR
          ================================================= */}

          {errors.general && (
            <ErrorMessage>
              {errors.general}
            </ErrorMessage>
          )}

          {/* =================================================
              BUTTONS
          ================================================= */}

          <ButtonRow>
            <CancelButton
              type="button"
              onClick={handleClose}
            >
              CANCEL
            </CancelButton>

            <SubmitButton
              type="submit"
              disabled={
                Boolean(
                  errors.departmentName ||
                    errors.departmentCode
                )
              }
            >
              {isEdit
                ? "UPDATE"
                : "CREATE"}
            </SubmitButton>
          </ButtonRow>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default DepartmentModal;
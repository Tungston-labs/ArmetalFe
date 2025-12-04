import React, { useState, useEffect } from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  BackButton,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  FormGrid,
  FieldGroup,
  Label,
  InputField,
  SelectField,
  Option,
  ButtonContainer,
  CancelButton,
  SaveButton,
  SelectWrapper,
  DropdownIcon
} from './AddProjectModalStyles';

const EditProjectModal = ({ isOpen, onClose, onSave, projectData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    projectName: '',
    punchInType: '',
    latitude: '',
    longitude: '',
    status: '',   // <-- NEW FIELD ADDED
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form
  useEffect(() => {
    if (projectData) {
      let punchType = projectData.punchInType?.toLowerCase();
      if (punchType === "on site") punchType = "on_site";
      if (punchType === "variant") punchType = "variant";
      if (punchType === "bench") punchType = "bench";

      setFormData({
        projectName: projectData.projectName || '',
        punchInType: punchType || '',
        latitude: projectData.latitude || '',
        longitude: projectData.longitude || '',
        status: projectData.status || 'in_progress',  // <-- PREFILL STATUS
      });
    }
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.projectName.trim())
      newErrors.projectName = "Project name is required";

    if (!formData.punchInType)
      newErrors.punchInType = "Punch in type is required";

    // Latitude & Longitude required ONLY if NOT bench
    if (formData.punchInType !== "bench") {
      if (!formData.latitude)
        newErrors.latitude = "Latitude is required";
      if (!formData.longitude)
        newErrors.longitude = "Longitude is required";
    }

    if (!formData.status)
      newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = () => {
  if (!validate()) return;

  const payload = {
    ...formData,
    latitude: formData.punchInType === "bench" ? null : formData.latitude,
    longitude: formData.punchInType === "bench" ? null : formData.longitude,
  };

  onSave(payload);
  onClose();
};


  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <BackButton onClick={onClose}>&larr;</BackButton>
          <HeaderContent>
            <HeaderTitle>Edit Field</HeaderTitle>
            <HeaderSubtitle>Update the project details below.</HeaderSubtitle>
          </HeaderContent>
        </ModalHeader>

        <FormGrid>

          {/* PROJECT NAME */}
          <FieldGroup>
            <Label>Project name</Label>
            <InputField
              type="text"
              name="projectName"
              placeholder="Project name"
              value={formData.projectName}
              onChange={handleChange}
            />
            {errors.projectName && <span style={{ color: 'red' }}>{errors.projectName}</span>}
          </FieldGroup>

          {/* PUNCH TYPE */}
          <FieldGroup>
            <Label>Punch in type</Label>
            <SelectWrapper>
              <SelectField
                name="punchInType"
                value={formData.punchInType}
                onChange={handleChange}
              >
                <Option value="" disabled>Select type</Option>
                <Option value="on_site">On Site</Option>
                <Option value="variant">Variant</Option>
                <Option value="bench">Bench</Option>
              </SelectField>
              <DropdownIcon />
            </SelectWrapper>
            {errors.punchInType && <span style={{ color: 'red' }}>{errors.punchInType}</span>}
          </FieldGroup>

          {/* LATITUDE */}
          <FieldGroup>
            <Label>Latitude</Label>
            <InputField
              type="text"
              name="latitude"
              placeholder="Enter latitude"
              value={formData.latitude}
              onChange={handleChange}
              disabled={formData.punchInType === "bench"}   // <--- Disable
            />

            {errors.latitude && <span style={{ color: 'red' }}>{errors.latitude}</span>}
          </FieldGroup>

          {/* LONGITUDE */}
          <FieldGroup>
            <Label>Longitude</Label>
            <InputField
              type="text"
              name="longitude"
              placeholder="Enter longitude"
              value={formData.longitude}
              onChange={handleChange}
              disabled={formData.punchInType === "bench"}   // <--- Disable
            />

            {errors.longitude && <span style={{ color: 'red' }}>{errors.longitude}</span>}
          </FieldGroup>

          {/* STATUS (NEW FIELD) */}
          <FieldGroup>
            <Label>Status</Label>
            <SelectWrapper>
              <SelectField
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <Option value="" disabled>Select Status</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="completed">Completed</Option>
                <Option value="on_hold">On Hold</Option>
                <Option value="cancelled">Cancelled</Option>
              </SelectField>
              <DropdownIcon />
            </SelectWrapper>
            {errors.status && <span style={{ color: 'red' }}>{errors.status}</span>}
          </FieldGroup>

        </FormGrid>

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSave}>Update</SaveButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditProjectModal;

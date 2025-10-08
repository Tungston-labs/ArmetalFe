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
} from './AddProjectModalStyles'; // Reuse same styles

const EditProjectModal = ({ isOpen, onClose, onSave, projectData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    projectName: '',
    punchInType: '',
    latitude: '',
    longitude: '',
  });

  // Pre-fill form when modal opens with projectData
  useEffect(() => {
    if (projectData) {
      setFormData({
        projectName: projectData.projectName || '',
        punchInType: projectData.punchInType || '',
        latitude: projectData.latitude || '',
        longitude: projectData.longitude || '',
      });
    }
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        
        <ModalHeader>
          <BackButton onClick={onClose}>
            &larr;
          </BackButton>
          <HeaderContent>
            <HeaderTitle>Edit Field</HeaderTitle>
            <HeaderSubtitle>Update the project details below.</HeaderSubtitle>
          </HeaderContent>
        </ModalHeader>

        <FormGrid>
          <FieldGroup>
            <Label>Project name</Label>
            <InputField
              type="text"
              name="projectName"
              placeholder="Project name"
              value={formData.projectName}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Punch in type</Label>
            <SelectWrapper>
              <SelectField
                name="punchInType"
                value={formData.punchInType}
                onChange={handleChange}
              >
                <Option value="" disabled>Select type</Option>
                <Option value="manual">Manual</Option>
                <Option value="gps">GPS</Option>
              </SelectField>
              <DropdownIcon />
            </SelectWrapper>
          </FieldGroup>

          <FieldGroup>
            <Label>Latitude</Label>
            <InputField
              type="text"
              name="latitude"
              placeholder="Enter latitude"
              value={formData.latitude}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Longitude</Label>
            <InputField
              type="text"
              name="longitude"
              placeholder="Enter longitude"
              value={formData.longitude}
              onChange={handleChange}
            />
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

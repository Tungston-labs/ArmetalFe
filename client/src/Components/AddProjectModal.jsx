import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import { createProject, getProjects } from '../Redux/fieldShiftSlice';

const AddProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const initialForm = {
    projectName: '',
    punchInType: '',
    latitude: '',
    longitude: '',
    employees: [],
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  // Reset form every time modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
      setErrors({});
      setApiError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.punchInType) newErrors.punchInType = 'Punch in type is required';
    if (formData.latitude && isNaN(Number(formData.latitude))) newErrors.latitude = 'Latitude must be a number';
    if (formData.longitude && isNaN(Number(formData.longitude))) newErrors.longitude = 'Longitude must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setApiError('');

    try {
      const payload = {
        name: formData.projectName,
        punch_type: formData.punchInType,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        employees: formData.employees,
      };

      await dispatch(createProject(payload)).unwrap();
      await dispatch(getProjects());
      setFormData(initialForm); // ✅ reset after save
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <BackButton onClick={onClose}>&larr;</BackButton>
          <HeaderContent>
            <HeaderTitle>Add Project</HeaderTitle>
            <HeaderSubtitle>Manage all projects within the organization.</HeaderSubtitle>
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
            {errors.projectName && <span style={{ color: 'red' }}>{errors.projectName}</span>}
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
                <Option value="on_site">On Site</Option>
                <Option value="variant">Variant</Option>
              </SelectField>
              <DropdownIcon />
            </SelectWrapper>
            {errors.punchInType && <span style={{ color: 'red' }}>{errors.punchInType}</span>}
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
            {errors.latitude && <span style={{ color: 'red' }}>{errors.latitude}</span>}
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
            {errors.longitude && <span style={{ color: 'red' }}>{errors.longitude}</span>}
          </FieldGroup>
        </FormGrid>

        {apiError && <p style={{ color: 'red', marginTop: '10px' }}>{apiError}</p>}

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </SaveButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddProjectModal;

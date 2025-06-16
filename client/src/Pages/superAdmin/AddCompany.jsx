import React, { useState, useEffect } from 'react';
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Input,
  CheckboxGroup,
  CheckboxLabel,
  ButtonGroup,
  Button,
  Hr,
  FormField,
  Label
} from './AddCompany.Styles';
import { GoArrowLeft } from "react-icons/go";
import { useDispatch } from 'react-redux';
import { addCompany, editCompany } from '../../Redux/superAdminSlice';

const AddCompanyModal = ({ onClose, isEdit = false, selectedCompany = null }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    location: '',
    contact_number: '',
    modules: [],
  });

  const allModules = ["dashboard", "employee", "department", "daily_task", "payroll", "holiday"];

  // Pre-fill form data in edit mode
  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked = allModules.filter((mod) => selectedCompany.modules?.[mod]);
      setFormData({
        name: selectedCompany.name || '',
        address: selectedCompany.address || '',
        email: selectedCompany.email || '',
        location: selectedCompany.location || '',
        contact_number: selectedCompany.contact_number || '',
        modules: modulesChecked,
      });
    }
  }, [isEdit, selectedCompany]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModuleChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(value)
        ? prev.modules.filter(m => m !== value)
        : [...prev.modules, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert modules array → object
    const modulesObject = {};
    allModules.forEach(mod => {
      modulesObject[mod] = formData.modules.includes(mod);
    });

    const finalData = {
      ...formData,
      modules: modulesObject,
    };

    try {
      if (isEdit && selectedCompany?.id) {
        await dispatch(editCompany({ id: selectedCompany.id, data: finalData })).unwrap();
      } else {
        await dispatch(addCompany(finalData)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Company save failed", err);
    }
  };

  return (
    <FormWrapper>
      <BackHeader>
        <GoArrowLeft onClick={onClose} style={{ cursor: "pointer" }} />
        <span>{isEdit ? "Edit Company" : "Add Company"}</span>
      </BackHeader>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <div>
            <FormField>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Company name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div>
            <FormField>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                placeholder="Company location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormField>

            <FormField>
              <Label>Contact Number</Label>
              <Input
                type="text"
                name="contact_number"
                placeholder="Contact number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </FormSection>

        <h4>Privileges</h4>
        <CheckboxGroup>
          {allModules.map((module) => (
            <CheckboxLabel key={module}>
              <input
                type="checkbox"
                value={module}
                checked={formData.modules.includes(module)}
                onChange={handleModuleChange}
              />
              {module.charAt(0).toUpperCase() + module.slice(1).replace('_', ' ')}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>

        <Hr />

        <ButtonGroup>
          <Button type="button" cancel onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};

export default AddCompanyModal;

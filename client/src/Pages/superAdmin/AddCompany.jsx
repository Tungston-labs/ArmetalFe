import React, { useState } from 'react';
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
import { addCompany } from '../../Redux/superAdminSlice';

const AddCompanyModal = ({ onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    location: '',
    contact_number: '',
    modules: []
  });

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
  
    // Convert modules array → object format
    const allModules = ["dashboard", "employee", "department", "daily_task", "payroll", "holiday"];
    const modulesObject = {};
    allModules.forEach((mod) => {
      modulesObject[mod] = formData.modules.includes(mod);
    });
  
    const finalData = {
      ...formData,
      modules: modulesObject,
    };
  
    try {
      await dispatch(addCompany(finalData)).unwrap();
      onClose();
    } catch (err) {
      console.error("Add Company failed", err);
    }
  };
  

  return (
    <FormWrapper>
      <BackHeader>
        <GoArrowLeft onClick={onClose} style={{ cursor: "pointer" }} />
        <span>Add Company</span>
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
        {["dashboard", "employee", "department", "daily_task", "payroll", "holiday"].map((module) => (
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
          <Button type="submit">Save</Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};

export default AddCompanyModal;

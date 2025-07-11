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

  const countryOptions = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "AU", name: "Australia" },
    { code: "CA", name: "Canada" },
  ];

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    location: '',
    country: '',
    contact_number: '',
    modules: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const allModules = ["dashboard", "employee", "department", "daily_task", "payroll", "holiday"];

  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked = allModules.filter((mod) => selectedCompany.modules?.[mod]);
      setFormData({
        name: selectedCompany.name || '',
        address: selectedCompany.address || '',
        email: selectedCompany.email || '',
        location: selectedCompany.location || '',
        country: selectedCompany.country || '',
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

    const errors = {};

    if (!formData.name.trim()) errors.name = "Company name is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email is required.";
    if (!formData.location.trim()) errors.location = "Location is required.";
    if (!formData.country) errors.country = "Country is required.";
    if (!formData.contact_number.trim() || !/^\d{7,15}$/.test(formData.contact_number)) {
      errors.contact_number = "Valid contact number is required.";
    }
    if (formData.modules.length === 0) errors.modules = "Select at least one module.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
              {formErrors.name && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.name}</p>}
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
              {formErrors.address && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.address}</p>}
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
              {formErrors.email && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.email}</p>}
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
              {formErrors.location && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.location}</p>}
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
              {formErrors.contact_number && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.contact_number}</p>}
            </FormField>

            <FormField>
              <Label>Country</Label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fdfdfd',
                  color: '#333',
                }}
              >
                <option value="">-- Select Country --</option>
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {formErrors.country && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.country}</p>}
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
        {formErrors.modules && <p style={{ color: 'blue', marginTop: '4px' }}>{formErrors.modules}</p>}

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

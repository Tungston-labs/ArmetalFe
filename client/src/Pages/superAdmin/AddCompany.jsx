import React, { useState } from 'react';
import {
  Container,
  Header,
  Title,
  Subtitle,
  FormWrapper,
  FormSection,
  Input,
  CheckboxGroup,
  CheckboxLabel,
  ButtonGroup,
  Button,
  HRManager,
  TopBar,
  SearchInput,
  TitleSection,
  BackHeader,
  Hr,
  FormField,
  Label
} from './AddCompany.Styles';

import { LuArrowLeft } from "react-icons/lu";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch } from 'react-redux';
import { addCompany } from '../../Redux/superAdminSlice'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const AddCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    location: '',
    contact_number: '',
    modules: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      modules: checked
        ? [...prev.modules, value]
        : prev.modules.filter(m => m !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCompany(formData)).unwrap();
      navigate('/superadmin/companies'); // change as needed
    } catch (err) {
      console.error("Failed to add company:", err);
    }
  };

  return (
    <Container>
      <Header>
        <TopBar>
          <TitleSection>
            <LuArrowLeft style={{ width: "36px", height: 36 }} />
            <img src="/images/superadmin.png" alt="Payroll Icon" style={{ height: "51px" }} />
            <div>
              <Title>Super admin</Title>
              <Subtitle>Manage all departments within the organization.</Subtitle>
            </div>
          </TitleSection>
          <HRManager>
            <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
        </TopBar>
      </Header>

      <FormWrapper>
        <BackHeader>
          <GoArrowLeft />
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

              {/* Company ID is auto-generated — remove input */}
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
            {["dashboard", "employee", "department", "daily_task"].map((module) => (
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
            <Button type="button" cancel onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </ButtonGroup>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default AddCompany;

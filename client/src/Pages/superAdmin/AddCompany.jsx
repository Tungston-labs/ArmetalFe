import React from 'react';
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
const AddCompany = () => {
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

        <form>
        <FormSection>
  <div>
    <FormField>
      <Label>Company Name</Label>
      <Input type="text" placeholder="Company name" />
    </FormField>

    <FormField>
      <Label>Address</Label>
      <Input type="text" placeholder="Address" />
    </FormField>

    <FormField>
      <Label>Email</Label>
      <Input type="email" placeholder="E-mail" />
    </FormField>
  </div>

  <div>
    <FormField>
      <Label>Location</Label>
      <Input type="text" placeholder="Company location" />
    </FormField>

    <FormField>
      <Label>Company ID</Label>
      <Input type="text" placeholder="Company ID" />
    </FormField>

    <FormField>
      <Label>Contact Number</Label>
      <Input type="text" placeholder="Contact number" />
    </FormField>
  </div>
</FormSection>


          <h4>Privileges</h4>
          <CheckboxGroup>
            <CheckboxLabel><input type="checkbox" /> Dashboard</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" /> Employee</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" /> Department</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" /> Daily task</CheckboxLabel>
          </CheckboxGroup>
 <Hr /> 
          <ButtonGroup>
            <Button cancel>Cancel</Button>
            <Button>Save</Button>
          </ButtonGroup>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default AddCompany;

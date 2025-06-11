// src/Pages/EditCompany.jsx
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
import { LuArrowLeft } from 'react-icons/lu';
import { GoArrowLeft } from 'react-icons/go';

const EditCompany = () => {
  return (
    <Container>
      <Header>
        <TopBar>
          <TitleSection>
            <LuArrowLeft style={{ width: '36px', height: 36 }} />
            <img src="/images/superadmin.png" alt="Payroll Icon" style={{ height: '51px' }} />
            <div>
              <Title>Super admin</Title>
              <Subtitle>Edit company details and privileges.</Subtitle>
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
          <span>Edit Company</span>
        </BackHeader>

        <form>
          <FormSection>
            <div>
              <FormField>
                <Label>Company Name</Label>
                <Input type="text" placeholder="Company name" defaultValue="Acme Corp" />
              </FormField>

              <FormField>
                <Label>Address</Label>
                <Input type="text" placeholder="Address" defaultValue="123 Main St" />
              </FormField>

              <FormField>
                <Label>Email</Label>
                <Input type="email" placeholder="E-mail" defaultValue="info@acme.com" />
              </FormField>
            </div>

            <div>
              <FormField>
                <Label>Location</Label>
                <Input type="text" placeholder="Company location" defaultValue="New York" />
              </FormField>

              <FormField>
                <Label>Company ID</Label>
                <Input type="text" placeholder="Company ID" defaultValue="ACM123" />
              </FormField>

              <FormField>
                <Label>Contact Number</Label>
                <Input type="text" placeholder="Contact number" defaultValue="9876543210" />
              </FormField>
            </div>
          </FormSection>

          <h4>Privileges</h4>
          <CheckboxGroup>
            <CheckboxLabel><input type="checkbox" defaultChecked /> Dashboard</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" defaultChecked /> Employee</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" /> Department</CheckboxLabel>
            <CheckboxLabel><input type="checkbox" /> Daily task</CheckboxLabel>
          </CheckboxGroup>

          <Hr />

          <ButtonGroup>
            <Button cancel>Cancel</Button>
            <Button>Update</Button>
          </ButtonGroup>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default EditCompany;

// AddEmployeeForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, FormSection, Input,
  TextArea, Button, Title, Subtitle, SectionTitle,
  InfoGrid,
  FlexRow,
  ProfileImage,
  // ActionButton,
  ApproveButton,
  Hr,
  InfoSection,
  FullWidthInput,
  TwoColumnRow,
  TwoColumnRows,
  TwoColumn
} from './BasicLevel.Styles';
import Multistep from '../../Components/Multistep'
import { useNavigate } from 'react-router-dom';
export default function AddEmployeeForm() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>

        <RoleInfo>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </RoleInfo>
      </Header>
      <Hr />
      <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "20px" }}>
        <div style={{ width: "50%" }}>
          <Multistep />
        </div>
      </div>
     

      <InfoGrid>
        <div style={{ width: "10%" }}>
          <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Employee" />
        </div>
        <div style={{ display: "flex", width: "90%", justifyContent: "space-between" }}>
          <TwoColumn>
            <Input placeholder="Name" />
            <Input placeholder="Employee ID" />
            <Input placeholder="Email ID" />
          </TwoColumn>

          <InfoSection>
            <FullWidthInput placeholder="Address" />
            <TwoColumnRow>
              <Input placeholder="DOB" />
              <Input placeholder="Gender" />
            </TwoColumnRow>
          </InfoSection>
          {/* <TwoColumn>
                   <Input placeholder="Address" />
                  
                </TwoColumn> */}
          {/* <ThreeColumn>
         
                  <Input placeholder="DOB" />
                  <Input placeholder="Gender" />
                </ThreeColumn> */}
        </div>
      </InfoGrid>
      <Hr />
      <SectionTitle>Job Details</SectionTitle>
      <TwoColumnRows>
        <Input placeholder="Job position / Designation" />
        <Input placeholder="21/12/2025" />
      </TwoColumnRows>
      <TwoColumnRows>
        <Input placeholder="Department" />
        <Input placeholder="Full time" />
      </TwoColumnRows>
      <TwoColumnRows>
        <Input placeholder="Department" />
        <Input placeholder=" Developenment" />
      </TwoColumnRows>
      <SectionTitle>Employee Legal & ID Information</SectionTitle>
      <Input placeholder="Passport number" value="Passport number" />
      <Input placeholder="Work Permit" value="Work Permit" />
      <Input placeholder="Visa expiry Date" value="Visa expiry Date" />
      <Input placeholder="Iqama Number " value="Iqama Number " />
      <Input placeholder="Employement Contract" value="Employement Contract" />
      <Input placeholder="Insurance number" value="Insurance number" />

      <FlexRow>
      <ApproveButton onClick={() => navigate('/bank-payment')}>
  Next
</ApproveButton>
      </FlexRow>
    </Container>
  );
}

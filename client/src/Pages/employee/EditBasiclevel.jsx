// AddEmployee.jsx
import React from 'react';
import {
  Container, Header, ProfileSection, Input, Select, Row, Tabs, Tab,
  SectionTitle, ButtonContainer, NextButton, ProfileImg, RoleBadge, TopRightButton
} from './EditBasicLevel.Styles';

export default function AddEmployee() {
  return (
    <Container>
      <Header>
        <div>
          <h2>👨‍💼 Employee</h2>
          <p>Manage your Employee</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <RoleBadge>HR Manager</RoleBadge>
          <TopRightButton>Edit</TopRightButton>
        </div>
      </Header>

      <h3>Add Employee</h3>
      <ProfileSection>
        <ProfileImg src="https://i.pravatar.cc/100?img=7" alt="Profile" />
        <Row>
          <Input placeholder="Ajay Kumar" />
          <Input placeholder="Ajaykumar dummy dummy dummy 1231 dummy" />
        </Row>
        <Row>
          <Input placeholder="254125" />
          <Input placeholder="12/12/1980" />
        </Row>
        <Row>
          <Input placeholder="Ajaykumar@gmail.com" />
          <Input placeholder="Male" />
        </Row>
      </ProfileSection>

      <Tabs>
        <Tab active>Basic Details</Tab>
        <Tab>Bank and payment details</Tab>
        <Tab>Documents</Tab>
      </Tabs>

      <SectionTitle>Job Details</SectionTitle>
      <Row>
        <Input placeholder="Developer" />
        <Input placeholder="21/12/2002" />
      </Row>
      <Row>
        <Select>
          <option>Department</option>
        </Select>
        <Select>
          <option>Full time</option>
        </Select>
      </Row>
      <Row>
        <Input placeholder="Pranav G" />
        <Select>
          <option>Developpement</option>
        </Select>
      </Row>

      <SectionTitle>Employee Legal & ID Information</SectionTitle>
      <Input placeholder="Passport number" />
      <Input placeholder="Work Permit" />
      <Input placeholder="Visa expiry Date" />
      <Input placeholder="Iqama Number" />
      <Input placeholder="Employement Contract" />
      <Input placeholder="Visa expiry date" />
      <Input placeholder="Insurance number" />

      <ButtonContainer>
        <NextButton>Next</NextButton>
      </ButtonContainer>
    </Container>
  );
}

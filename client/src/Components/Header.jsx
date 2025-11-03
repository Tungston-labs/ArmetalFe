import React from 'react';
import {
  ProfileContainer,
  Header,
  HeaderContent,
  BackArrow,
  IconGroup,
  TitleGroup,
  Title,
  Subtitle,
  ProfileCard,
  ProfileImageWrapper,
  ProfileImage,
  ContentArea,
  InputBox,
  BioBox,
  DataRow,
  BioRow
} from './Header.Styles';

// Using a generic person icon and avatar for the example
const EmployeeProfile = ({ employee }) => {
  return (
    <ProfileContainer>
      <Header>
        <HeaderContent>
          <BackArrow>&larr;</BackArrow>
          <IconGroup>
            {/* Substitute with a proper people icon component (e.g., <FaUsers />) */}
            👥
          </IconGroup>
          <TitleGroup>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee</Subtitle>
          </TitleGroup>
        </HeaderContent>
        {/* User Avatar on the right */}
        <img 
          src="https://via.placeholder.com/40" // Replace with a user avatar image
          alt="User Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
      </Header>

      <ProfileCard>
        <ProfileImageWrapper>
          <ProfileImage 
            src={employee.imageUrl || 'https://via.placeholder.com/200?text=Profile+Image'} 
            alt="Employee Profile"
          />
        </ProfileImageWrapper>

        <ContentArea>
          {/* Row 1: Name and Bio */}
          <DataRow>
            <InputBox type="text" value={employee.name} readOnly />
          </DataRow>
          
          <BioRow>
            <BioBox value={employee.bio} readOnly />
          </BioRow>

          {/* Row 2: Phone and Bio (Bio continues) */}
          <DataRow>
            <InputBox type="text" value={employee.phone} readOnly />
          </DataRow>

          {/* Row 3: Email, DOB, Gender */}
          <DataRow>
            <InputBox type="email" value={employee.email} readOnly />
          </DataRow>

          <DataRow>
            <InputBox type="text" value={employee.dob} readOnly />
          </DataRow>

          <DataRow>
            <InputBox type="text" value={employee.gender} readOnly />
          </DataRow>
          
        </ContentArea>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default EmployeeProfile;
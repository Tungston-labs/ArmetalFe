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
  LeftColumn,
  RightColumn,
  InputBox,
  BioBox,
  InfoRow,
} from './Header.Styles';


const EmployeeProfile = ({ employee = {} }) => {
  return (
    <>
 
    <ProfileContainer>
    
      <ProfileCard>
        <ProfileImageWrapper>
         <ProfileImage
  src={
    employee?.profile_pic
      ? employee.profile_pic
      : 'https://via.placeholder.com/200x200.png?text=Profile+Image'
  }
  alt="Employee Profile"
/>
        </ProfileImageWrapper>

        <ContentArea>
          <LeftColumn>
            <InputBox type="text" value={employee.name || ''} readOnly />
            <InputBox type="text" value={employee?.employee_id || ''} readOnly />
            <InputBox type="email" value={employee?.email || ''} readOnly />
          </LeftColumn>
          <RightColumn>
            <BioBox
              value={
                employee?.address ||
                ''
              }
              readOnly
            />

            <InfoRow>
              <InputBox type="text" value={employee?.dob || ''} readOnly />
              <InputBox type="text" value={employee?.gender || ''} readOnly />
            </InfoRow>
          </RightColumn>
        </ContentArea>
      </ProfileCard>
      <hr></hr>
    </ProfileContainer>
     </>
  );
};

export default EmployeeProfile;

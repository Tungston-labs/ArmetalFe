import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import {
  ProfileContainer,
  ProfileCard,
  ProfileImageWrapper,
  ProfileImage,
  PlusIconWrapper,
  ContentArea,
  LeftColumn,
  RightColumn,
  InputBox,
  BioBox,
  InfoRow,
  BackArrowWrapper,
  UserIconWrapper, 
} from "./Header.Styles";
import { GoArrowLeft } from "react-icons/go";
import { PiUserCirclePlusThin } from "react-icons/pi";
const Header = ({ employee = {}, editable = false, onChange, onImageChange, onBack }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      onImageChange(file); // only pass File, not URL
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        {onBack && (
          <BackArrowWrapper onClick={onBack}>
        <GoArrowLeft   style={{  color: "#1034ad"}}/>
          </BackArrowWrapper>
        )}

<ProfileImageWrapper>
  {employee?.profile_pic ? (
    <ProfileImage
      src={
        employee.profile_pic instanceof File
          ? URL.createObjectURL(employee.profile_pic)
          : employee.profile_pic
      }
      alt="Employee Profile"
      onClick={handleImageClick}
      editable={editable}
    />
  ) : (
    <UserIconWrapper onClick={handleImageClick} editable={editable}>
      <PiUserCirclePlusThin size={120} />
    </UserIconWrapper>
  )}

  {editable && (
    <PlusIconWrapper onClick={handleImageClick}>
      <FiPlus size={24} />
    </PlusIconWrapper>
  )}

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }}
  />
</ProfileImageWrapper>


        <ContentArea>
          <LeftColumn>
            <InputBox
              type="text"
              name="name"
              value={employee.name || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InputBox
              type="text"
              name="employee_id"
              value={employee.employee_id || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InputBox
              type="email"
              name="email"
              value={employee.email || ""}
              readOnly={!editable}
              onChange={onChange}
            />
          </LeftColumn>

          <RightColumn>
            <BioBox
              name="address"
              value={employee.address || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InfoRow>
              <InputBox
                type="text"
                name="dob"
                value={employee.dob || ""}
                readOnly={!editable}
                onChange={onChange}
              />
              <InputBox
                type="text"
                name="gender"
                value={employee.gender || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </InfoRow>
          </RightColumn>
        </ContentArea>
      </ProfileCard>
      <hr />
    </ProfileContainer>
  );
};

export default Header;

import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { PiUserCirclePlusThin } from "react-icons/pi";
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
      onImageChange(file);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        {onBack && (
          <BackArrowWrapper onClick={onBack}>
            <GoArrowLeft size={24} color="#1034ad" />
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
              <PiUserCirclePlusThin size={120} color="#ccc" />
            </UserIconWrapper>
          )}

          {editable && (
            <PlusIconWrapper onClick={handleImageClick}>
              <FiPlus size={24} color="#fff" />
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
              placeholder="Full Name"
              value={employee.name || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InputBox
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={employee.employee_id || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InputBox
              type="email"
              name="email"
              placeholder="Email"
              value={employee.email || ""}
              readOnly={!editable}
              onChange={onChange}
            />
          </LeftColumn>

          <RightColumn>
            <BioBox
              name="address"
              placeholder="Address"
              value={employee.address || ""}
              readOnly={!editable}
              onChange={onChange}
            />
            <InfoRow>
              <InputBox
                type="text"
                name="dob"
                placeholder="Date of Birth"
                value={employee.dob || ""}
                readOnly={!editable}
                onChange={onChange}
              />
              <InputBox
                type="text"
                name="gender"
                placeholder="Gender"
                value={employee.gender || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </InfoRow>
          </RightColumn>
        </ContentArea>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Header;

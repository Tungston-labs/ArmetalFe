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
  OutlinedField,
  OutlinedLabel,
} from "./Header.Styles";

const Header = ({
  employee = {},
  editable = false,
  onChange,
  onImageChange,
  onBack,
}) => {
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

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
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
            <OutlinedField>
              <OutlinedLabel>Full Name</OutlinedLabel>
              <InputBox
                type="text"
                name="name"
                value={employee.name || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </OutlinedField>
            <OutlinedField>
              <OutlinedLabel>Employee Code</OutlinedLabel>
              <InputBox
                type="text"
                name="employee_code"
                value={employee.employee_code || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </OutlinedField>
            <OutlinedField>
              <OutlinedLabel>Email</OutlinedLabel>
              <InputBox
                type="email"
                name="email"
                value={employee.email || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </OutlinedField>
          </LeftColumn>

          <RightColumn>
            <OutlinedField>
              <OutlinedLabel>Address</OutlinedLabel>
              <BioBox
                name="address"
                value={employee.address || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </OutlinedField>
            <InfoRow>
              <OutlinedField>
                <OutlinedLabel>Date of Birth</OutlinedLabel>
                <InputBox
                  type={editable ? "date" : "text"}
                  name="dob"
                  value={
                    editable
                      ? employee.dob
                        ? employee.dob.split("T")[0]
                        : ""
                      : formatDate(employee.dob)
                  }
                  readOnly={!editable}
                  onChange={onChange}
                />
              </OutlinedField>
              <OutlinedField>
                <OutlinedLabel>Gender</OutlinedLabel>
                <InputBox
                  type="text"
                  name="gender"
                  value={employee.gender || ""}
                  readOnly={!editable}
                  onChange={onChange}
                />
              </OutlinedField>
            </InfoRow>
          </RightColumn>
        </ContentArea>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Header;

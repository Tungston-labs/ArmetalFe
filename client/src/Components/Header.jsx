// src/Components/Header.jsx
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
} from "./Header.Styles";

const Header = ({ employee = {}, editable = false, onChange, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      const imageURL = URL.createObjectURL(file); // preview image
      onImageChange(file, imageURL);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileImageWrapper>
          {/* Profile image clickable */}
          <ProfileImage
            src={
              employee?.profile_pic
                ? employee.profile_pic
                : "https://via.placeholder.com/200x200.png?text=Profile+Image"
            }
            alt="Employee Profile"
            onClick={handleImageClick}
             editable={editable}
          />

          {/* Plus icon on top */}
          {editable && (
            <PlusIconWrapper onClick={handleImageClick}>
              <FiPlus size={24} />
            </PlusIconWrapper>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </ProfileImageWrapper>

        {/* Employee Info Section */}
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

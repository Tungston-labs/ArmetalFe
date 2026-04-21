import React from "react";
import {
  Container,
  ProfileWrapper,
  UploadWrapper,
  ProfileLabel,
  ProfileImage,
  IconWrapper,
  HiddenFileInput,
  InfoWrapper,
  LeftColumn,
  RightColumn,
  FieldGroup,
  FieldLabel,
  Input,
  TextArea,
  Select,
  ErrorText,
} from "./EmployeeHeader.Styles";
import { PiUserCirclePlusThin } from "react-icons/pi";

const EmployeeHeader = ({ formData, setFormData, setIsFormDirty, errors }) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files ? files[0] : value }));
    setIsFormDirty(true);
  };

  return (
    <Container>
      {/* Profile on Top */}
      <ProfileWrapper>
        <UploadWrapper>
          <ProfileLabel htmlFor="profile-upload">
            {formData.profile_pic ? (
              <ProfileImage
                src={URL.createObjectURL(formData.profile_pic)}
                alt="Profile"
              />
            ) : (
              <IconWrapper>
                <PiUserCirclePlusThin size={80} />
              </IconWrapper>
            )}
          </ProfileLabel>
          <HiddenFileInput
            id="profile-upload"
            type="file"
            accept="image/*"
            name="profile_pic"
            onChange={handleChange}
          />
        </UploadWrapper>
      </ProfileWrapper>

      {/* Form Fields */}
      <InfoWrapper>
        <LeftColumn>
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Date of Birth</FieldLabel>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors?.dob && <ErrorText>{errors.dob}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Gender</FieldLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
            {errors?.gender && <ErrorText>{errors.gender}</ErrorText>}
          </FieldGroup>
        </LeftColumn>

        <RightColumn>
          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.email && <ErrorText>{errors.email}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Address</FieldLabel>
            <TextArea
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.address && <ErrorText>{errors.address}</ErrorText>}
          </FieldGroup>
        </RightColumn>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;

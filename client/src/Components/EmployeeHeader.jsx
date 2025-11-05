import React from "react";
import {
  Container,
  InfoWrapper,
  LeftColumn,
  RightColumn,
  Input,
  TextArea,
  Row,
  Select,
  UploadWrappers,
  ProfileLabel,
  ProfileImages,
  IconWrappers,
  PlusButtons,
  HiddenFileInputs,
  ErrorText,
  FieldGroup,
  FieldLabel,
} from "./EmployeeHeader.Styles";
import { PiUserCirclePlusThin } from "react-icons/pi";

const EmployeeHeader = ({ formData, setFormData, setIsFormDirty, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setIsFormDirty(true);
  };

  return (
    <Container>
      <InfoWrapper>
        {/* Profile Upload */}
        <UploadWrappers>
          <ProfileLabel htmlFor="profile-upload">
            {formData.profile_pic ? (
              <ProfileImages
                src={URL.createObjectURL(formData.profile_pic)}
                alt="Profile"
              />
            ) : (
              <IconWrappers>
                <PiUserCirclePlusThin size={50} />
              </IconWrappers>
            )}
          </ProfileLabel>
          <PlusButtons htmlFor="profile-upload">+</PlusButtons>
          <HiddenFileInputs
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFormData((p) => ({
                ...p,
                profile_pic: e.target.files[0],
              }));
              setIsFormDirty(true);
            }}
          />
        </UploadWrappers>

        {/* Left Column */}
        <LeftColumn>
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors?.email && <ErrorText>{errors.email}</ErrorText>}
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
        </LeftColumn>

        {/* Right Column */}
        <RightColumn>
          <FieldGroup>
            <FieldLabel>Address</FieldLabel>
            <TextArea
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors?.address && <ErrorText>{errors.address}</ErrorText>}
          </FieldGroup>

          <Row>
            <FieldGroup style={{ width: "50%" }}>
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
          </Row>
        </RightColumn>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;

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

const EmployeeHeader = ({ formData, setFormData, setIsFormDirty, errors ,setErrors}) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const handleChange = (e) => {
  const { name, value, files, type } = e.target;

  if (type === "file") {
    const file = files?.[0];

    if (!file) return;

    // Allow only images
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Please upload a valid image.",
      }));
      return;
    }

    // Maximum size
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Image size must be less than 5 MB.",
      }));
      return;
    }

    // Clear previous error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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

  {errors?.profile_pic && (
    <ErrorText>{errors.profile_pic}</ErrorText>
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
            <FieldLabel>Employee ID</FieldLabel>
            <Input
              type="text"
              name="employee_code"
              placeholder="Enter employee code "
              value={formData.employee_code}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.employee_id && <ErrorText>{errors.employee_code}</ErrorText>}
          </FieldGroup>

         <FieldGroup>
  <FieldLabel>Username</FieldLabel>
  <Input
    type="text"
    name="employee_id"
    placeholder="Enter email address"
    value={formData.email}        
    onChange={handleChange}
    autoComplete="off"
  />
  {errors?.employee_id && <ErrorText>{errors.employee_id}</ErrorText>}
</FieldGroup>
        </RightColumn>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;

import React from "react";
import {
  Container,
  ProfileWrapper,
  UploadWrapper,
  AvatarShell,
  ProfileLabel,
  AvatarCircle,
  ProfileImage,
  IconWrapper,
  HoverOverlay,
  CameraBadge,
  RemoveBadge,
  HiddenFileInput,
  HelperText,
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
import { PiUserCirclePlusThin, PiCameraThin } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const EmployeeHeader = ({ formData, setFormData, setIsFormDirty, errors, setErrors }) => {
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, [name]: "Please upload a valid image." }));
        return;
      }

      if (file.size > MAX_SIZE) {
        setErrors((prev) => ({ ...prev, [name]: "Image size must be less than 5 MB." }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setIsFormDirty(true);
  };

  const removeProfilePic = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, profile_pic: null }));
    setErrors((prev) => ({ ...prev, profile_pic: "" }));
    setIsFormDirty(true);
  };

  return (
    <Container>
      {/* Profile on Top */}
      <ProfileWrapper>
        <UploadWrapper>
          <AvatarShell>
            <ProfileLabel htmlFor="profile-upload">
              <AvatarCircle>
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

                <HoverOverlay>
                  <PiCameraThin size={20} />
                  <span>{formData.profile_pic ? "Change" : "Upload"}</span>
                </HoverOverlay>
              </AvatarCircle>
            </ProfileLabel>

            <CameraBadge onClick={() => document.getElementById("profile-upload").click()}>
              <PiCameraThin size={16} />
            </CameraBadge>

            {formData.profile_pic && (
              <RemoveBadge type="button" onClick={removeProfilePic} title="Remove photo">
                <AiOutlineClose size={12} />
              </RemoveBadge>
            )}
          </AvatarShell>

          <HiddenFileInput
            id="profile-upload"
            type="file"
            accept="image/*"
            name="profile_pic"
            onChange={handleChange}
          />

          <HelperText>JPG, PNG · Max 5 MB</HelperText>
          {errors?.profile_pic && <ErrorText>{errors.profile_pic}</ErrorText>}
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
            <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            {errors?.dob && <ErrorText>{errors.dob}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Gender</FieldLabel>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
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
              placeholder="Enter employee code"
              value={formData.employee_code}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.employee_code && <ErrorText>{errors.employee_code}</ErrorText>}
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
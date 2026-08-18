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

const EmployeeHeader = ({
  formData,
  setFormData,
  setIsFormDirty,
  errors,
  setErrors,
}) => {
  const MAX_SIZE = 5 * 1024 * 1024;

  /**
   * Handles normal form fields and profile image upload.
   */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Profile image upload
    if (type === "file") {
      const file = files?.[0];

      // No file selected
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Please upload a valid image.",
        }));

        return;
      }

      // Validate file size
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

      // Store selected file
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setIsFormDirty(true);

      return;
    }

    // Normal form field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsFormDirty(true);
  };

  /**
   * Removes the currently selected profile picture.
   */
  const removeProfilePic = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFormData((prev) => ({
      ...prev,
      profile_pic: null,
    }));

    setErrors((prev) => ({
      ...prev,
      profile_pic: "",
    }));

    setIsFormDirty(true);
  };

  /**
   * Opens the hidden profile image input.
   */
  const openFilePicker = () => {
    const fileInput = document.getElementById("profile-upload");

    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Container>
      {/* =====================================================
          PROFILE SECTION
      ====================================================== */}
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

            {/* 
              IMPORTANT:
              CameraBadge may be a styled div in EmployeeHeader.Styles.
              Using `as="button"` makes the rendered HTML an actual button.
            */}
            <CameraBadge
              as="button"
              type="button"
              aria-label="Open profile image picker"
              onClick={openFilePicker}
            >
              <PiCameraThin size={16} />
            </CameraBadge>

            {formData.profile_pic && (
              <RemoveBadge
                type="button"
                onClick={removeProfilePic}
                title="Remove photo"
                aria-label="Remove profile photo"
              >
                <AiOutlineClose size={12} />
              </RemoveBadge>
            )}
          </AvatarShell>

          {/* Hidden profile image input */}
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

      {/* =====================================================
          FORM FIELDS
      ====================================================== */}
      <InfoWrapper>
        {/* ===================================================
            LEFT COLUMN
        ==================================================== */}
        <LeftColumn>
          {/* Name */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-name">Name</FieldLabel>

            <Input
              id="employee-name"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />

            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          {/* Date of Birth */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-dob">Date of Birth</FieldLabel>

            <Input
              id="employee-dob"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            {errors?.dob && <ErrorText>{errors.dob}</ErrorText>}
          </FieldGroup>

          {/* Gender */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-gender">Gender</FieldLabel>

            <Select
              id="employee-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>

            {errors?.gender && <ErrorText>{errors.gender}</ErrorText>}
          </FieldGroup>

          {/* Address */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-address">Address</FieldLabel>

            <TextArea
              id="employee-address"
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="off"
            />

            {errors?.address && <ErrorText>{errors.address}</ErrorText>}
          </FieldGroup>
        </LeftColumn>

        {/* ===================================================
            RIGHT COLUMN
        ==================================================== */}
        <RightColumn>
          {/* Email */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-email">Email</FieldLabel>

            <Input
              id="employee-email"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />

            {errors?.email && <ErrorText>{errors.email}</ErrorText>}
          </FieldGroup>

          {/* Employee ID */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-code">Employee ID</FieldLabel>

            <Input
              id="employee-code"
              type="text"
              name="employee_code"
              placeholder="Enter employee code"
              value={formData.employee_code}
              onChange={handleChange}
              autoComplete="off"
            />

            {errors?.employee_code && (
              <ErrorText>{errors.employee_code}</ErrorText>
            )}
          </FieldGroup>

          {/* Username */}
          <FieldGroup>
            <FieldLabel htmlFor="employee-username">Username</FieldLabel>

            <Input
              id="employee-username"
              type="text"
              name="employee_id"
              placeholder="Enter username"
              value={formData.employee_id}
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

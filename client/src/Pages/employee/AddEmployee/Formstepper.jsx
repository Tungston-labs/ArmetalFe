import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  StepperWrapper,
  AvatarShell,
  ProfileImageWrapper,
  ProfileImage,
  ProfileHoverOverlay,
  ProfilePlaceholder,
  CameraBadge,
  RemoveBadge,
  HiddenProfileInput,
  StepperContent,
  StepItem,
  StepIcon,
  StepTitle,
  StepLine,
  ActiveUnderline,
} from "./EmployeeForm.styles";

import { PiUser, PiUserCirclePlusThin, PiCameraThin } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const MAX_SIZE = 5 * 1024 * 1024;

const FormStepper = ({
  steps = ["Basic Details", "Bank Details", "Documents"],
  activeStep = 0,
  profileImageSrc = null,
  onProfileImageChange,
  routes = [
    "/basic-details",
    "/bank-payment",
    "/documents",
  ],
}) => {
  const navigate = useNavigate();
  const [localImage, setLocalImage] = useState(profileImageSrc);
  const [imageError, setImageError] = useState("");

  const handleStepClick = (index) => {
    const route = routes[index];

    if (route) {
      navigate(route);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setImageError("Image size must be less than 5 MB.");
      return;
    }

    setImageError("");
    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    if (onProfileImageChange) {
      onProfileImageChange(file, previewUrl);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalImage(null);
    setImageError("");

    if (onProfileImageChange) {
      onProfileImageChange(null, null);
    }
  };

  return (
    <StepperWrapper>
      {/* Profile Image with Upload */}
      <AvatarShell>
        <ProfileImageWrapper>
          {localImage ? (
            <ProfileImage src={localImage} alt="Employee" />
          ) : (
            <ProfilePlaceholder>
              <PiUserCirclePlusThin size={40} />
            </ProfilePlaceholder>
          )}

          <ProfileHoverOverlay
            onClick={() => document.getElementById("stepper-profile-upload").click()}
          >
            <PiCameraThin size={16} />
            <span>{localImage ? "Change" : "Upload"}</span>
          </ProfileHoverOverlay>
        </ProfileImageWrapper>

        <CameraBadge
          onClick={() => document.getElementById("stepper-profile-upload").click()}
        >
          <PiCameraThin size={14} />
        </CameraBadge>

        {localImage && (
          <RemoveBadge type="button" onClick={removeImage} title="Remove photo">
            <AiOutlineClose size={11} />
          </RemoveBadge>
        )}

        <HiddenProfileInput
          id="stepper-profile-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </AvatarShell>

      <StepperContent>
        {steps.map((label, index) => {
          const isActive = index === activeStep;

          return (
            <React.Fragment key={label}>
              {/* Line */}
              <StepLine />

              {/* Step */}
              <StepItem
                $active={isActive}
                $clickable
                onClick={() => handleStepClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleStepClick(index);
                  }
                }}
              >
                <StepIcon $active={isActive}>
                  <PiUser size={23} />
                </StepIcon>

                <StepTitle $active={isActive}>
                  {label}
                </StepTitle>

                {isActive && <ActiveUnderline />}
              </StepItem>
            </React.Fragment>
          );
        })}
      </StepperContent>
    </StepperWrapper>
  );
};

export default FormStepper;
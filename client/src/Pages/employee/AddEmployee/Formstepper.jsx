import React from "react";
import { useNavigate } from "react-router-dom";

import {
  StepperWrapper,
  ProfileImageWrapper,
  ProfileImage,
  StepperContent,
  StepItem,
  StepIcon,
  StepTitle,
  StepLine,
  ActiveUnderline,
} from "./EmployeeForm.styles";

import { PiUser } from "react-icons/pi";

const FormStepper = ({
  steps = ["Basic Details", "Bank Details", "Documents"],
  activeStep = 0,
  profileImageSrc = "/images/profile.png",
  routes = [
    "/add-employee",
    "/bank",
    "/documents",
  ],
}) => {
  const navigate = useNavigate();

  const handleStepClick = (index) => {
    const route = routes[index];

    if (route) {
      navigate(route);
    }
  };

  return (
    <StepperWrapper>
      {/* Profile Image */}
      <ProfileImageWrapper>
        <ProfileImage
          src={profileImageSrc}
          alt="Employee"
        />
      </ProfileImageWrapper>

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
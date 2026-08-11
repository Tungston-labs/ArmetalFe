import React from "react";
import {
  HeaderContainer,
  LeftSection,
  RightSection,
  PageTitle,
  Breadcrumb,
  BreadcrumbItem,
  ActionButton,
  TitleRow,
  BackButton,
} from "./ReusableHeader.styles";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ReusableHeader = ({
  title,
  breadcrumbs = [],
  buttonText,
  onButtonClick,
  children,
  showBack = false,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <TitleRow>
          {showBack && (
            <BackButton onClick={handleBack}>
              <IoArrowBack />
            </BackButton>
          )}

          <PageTitle>{title}</PageTitle>
        </TitleRow>

        <Breadcrumb>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
          ))}
        </Breadcrumb>
      </LeftSection>

      <RightSection>
        {children}

        {buttonText && (
          <ActionButton onClick={onButtonClick}>
            {buttonText}
          </ActionButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default ReusableHeader;
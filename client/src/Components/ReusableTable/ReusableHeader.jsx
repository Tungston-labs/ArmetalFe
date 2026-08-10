import React from "react";
import {
  HeaderContainer,
  LeftSection,
  RightSection,
  PageTitle,
  Breadcrumb,
  BreadcrumbItem,
  ActionButton,
} from "./ReusableHeader.styles";

const ReusableHeader = ({
  title,
  breadcrumbs = [],
  buttonText,
  onButtonClick,
  children,
}) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <PageTitle>{title}</PageTitle>

        <Breadcrumb>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </LeftSection>

      <RightSection>
        {children}

        {buttonText && (
          <ActionButton onClick={onButtonClick}>
            + {buttonText}
          </ActionButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default ReusableHeader;
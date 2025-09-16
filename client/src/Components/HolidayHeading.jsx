import React from "react";
import { 
  HeaderContainer, 
  LeftSection, 
  BackButton, 
  TitleContainer, 
  Icon, 
  Title, 
  Subtitle, 
  SearchBox, 
  SearchInput 
} from "./HolidayHeading.styles";

import { FiArrowLeft, FiSearch } from "react-icons/fi";
import HolidayIcon from "../assets/payroll.svg"; 

const Header = () => {
  return (
    <HeaderContainer>
      {/* Left Section */}
      <LeftSection>
       
        <TitleContainer>
          <Icon src={HolidayIcon} alt="holiday" />
          <div>
            <Title>holiday</Title>
            <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
          </div>
        </TitleContainer>
      </LeftSection>

      {/* Search */}
      {/* <SearchBox>
        <FiSearch size={16} />
        <SearchInput placeholder="Search by Employee name" />
      </SearchBox> */}
    </HeaderContainer>
  );
};

export default Header;

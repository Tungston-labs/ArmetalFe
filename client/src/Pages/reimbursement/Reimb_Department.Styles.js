import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';


export const DepartmentContainer = styled.div`
  padding: 2rem;
  background-color: rgb(255, 255, 255);
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color:  #3250B5;
  margin: 0;
  margin-left: 2px;
  font-family: Raleway;
`;
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  font-family:satoshi;
  color:#3250B5;
`;
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .left-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon-box {
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    display: inline-block;
    color: blue;
  }

  img {
    height: 74px;
  }
`;


export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 22px;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 16px;
    font-family: 'Raleway';
  }
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
`;

export const InitialCircle = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
  color: #ECF8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 100px;
  font-family: Satoshi;
  padding-right: 18px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: #CAD2ED; 
  }


`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Satoshi;
  background: #304EB0;
  color: white;
  padding: 0.5rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 18px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

   &:hover {
    background-color: #3f60cbff;
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.2rem; // left padding for icon space
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  min-width: 100%;
`;
export const SearchWrapper = styled.div`
  position: relative;
  width: 220px;
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
`;

export const CardGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 1.5rem;
`;

export const DepartmentCard = styled.div`
  background: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  // 💡 Hover effect
  &:hover {
    .initial-circle {
      background-color:rgb(255, 255, 255);
    // color: #1a73e8;
    }

    .dept-name,
    .head-name,
    .subtitle,
    .card-value {
      color:rgb(62, 101, 200);
    }

    .arrow-icon {
      background-color:rgb(51, 51, 192);
      color: white;
    }
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: #000;
    font-family: 'Satoshi';
    
  }

  .head-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .head-name {
      font-size: 0.85rem;
      margin: 0;
      font-weight: 500;
      color: #000;
    }
  }
`;


export const HeadInfo = styled.div`
  margin-top: 0.5rem;

  small {
    font-size: 0.9rem;
    color: #888;
    display: block;
    line-height: 100%;
    letter-spacing: 0%;
  }

  .head-row {
    display: flex;
    align-items: center; /* vertically centers content by default */
    margin-top: 0.5rem; /* pushes the row a little down from the small text */
    
    img {
      width: 36px; /* adjust size if needed */
      height: 36px;
      border-radius: 50%;
      margin-right: 0.5rem;
      object-fit: cover;
    }

    .head-name {
      font-weight: 600;
      font-size: 1rem;
      color: #333;
    }
  }
`;


export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .card-value {
    font-weight: 600;
    font-size: 1.5rem;
    color: #000;
    font-family: Satoshi;
// font-weight: 700;
// font-style: Bold;
// font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

  }

  .arrow-icon {
  background: rgb(255, 255, 255);
  color: rgb(52, 52, 124);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-left:5px;
  }

`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;
export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;

  div {
    padding: 10px 15px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;
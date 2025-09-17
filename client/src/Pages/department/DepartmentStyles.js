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

// Typography (Title, Subtitle)
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) { /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) { /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) { /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) { /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) { /* 8K */
    font-size: 4rem;
  }
`;

export const Subtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
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
  width: clamp(35px, 3vw, 90px);
  height: clamp(35px, 3vw, 90px);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
  color: #ECF8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: Satoshi;
  font-size: clamp(5rem, 3vw, 9rem); /* responsive font */
  padding-right: clamp(5px, 1vw, 18px);
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: #CAD2ED; 
  }

  /* Extra-large screens (2K TVs) */
  @media (min-width: 2560px) {
    width: 120px;
    height: 120px;
    font-size: 10rem;
    padding-right: 25px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    width: 150px;
    height: 150px;
    font-size: 15rem;
    padding-right: 30px;
  }
`;



export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Satoshi;
  background: #304EB0;
  color: white;
  padding: clamp(0.4rem, 0.8vw, 0.8rem) clamp(1rem, 2vw, 2rem); /* vertical | horizontal */
  border-radius: 8px;
  border: none;
  font-size: clamp(0.8rem, 1vw, 1.5rem); /* responsive font size */
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3f60cbff;
  }
`;


// Search Input
export const SearchInput = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.2rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: clamp(0.8rem, 1vw, 2.5rem);
  min-width: 100%;
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: clamp(150px, 20%, 350px); /* scales between 150px and 300px depending on screen */
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: clamp(8px, 1vw, 16px); /* responsive horizontal spacing */
  transform: translateY(-50%);
  color: #888;
  font-size: clamp(0.9rem, 1.5vw, 1.5rem); /* responsive font size */
`;


// Card Grid
export const CardGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;
export const DepartmentCard = styled.div`
  background: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    .initial-circle {
      background-color: rgb(255, 255, 255);
      color: #1a73e8;
    }

    .dept-name,
    .head-name,
    .subtitle,
    .card-value {
      color: rgb(62, 101, 200);
    }

    .arrow-icon {
      background-color: rgb(51, 51, 192);
      color: white;
    }
  }

  h3 {
    font-size: clamp(1rem, 1.2vw, 2rem); /* responsive */
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
      width: clamp(24px, 1.2vw, 30px);
      height: clamp(24px, 1.2vw, 30px);
      border-radius: 50%;
      object-fit: cover;
    }

    .head-name {
      font-size: clamp(0.8rem, 0.9vw, 2rem);
      margin: 0;
      font-weight: 500;
      color: #000;
    }
  }
`;



export const HeadInfo = styled.div`
  margin-top: 0.5rem;

  small {
    font-size: clamp(0.75rem, 1vw, 2rem); /* responsive */
    color: #888;
    display: block;
  }
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  .card-value {
    font-weight: 600;
    font-size: clamp(1rem, 1.5vw, 1.5rem); /* responsive */
    color: #000;
  }

  .arrow-icon {
    background: rgb(255, 255, 255);
    color: rgb(52, 52, 124);
    width: clamp(36px, 2vw, 40px);
    height: clamp(36px, 2vw, 40px);
    border-radius: 50%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    display: flex;
    align-items: center;
    justify-content: center;
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
  padding: 1rem; /* ensures space on very small screens */
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: clamp(1rem, 2vw, 2.5rem); /* responsive padding */
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1000;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);

  /* ✅ Responsive scaling */
  font-size: clamp(0.9rem, 1vw, 1.1rem);

  @media (max-width: 768px) {
    max-width: 95%; /* take almost full width on tablets */
  }

  @media (min-width: 1920px) {
    max-width: 800px; /* wider modal for Full HD */
  }

  @media (min-width: 2560px) {
    max-width: 1000px; /* 2K screens */
  }

  @media (min-width: 3840px) {
    max-width: 1200px; /* 4K screens */
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: clamp(1rem, 1.5vw, 1.8rem);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #304eb0;
  }
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
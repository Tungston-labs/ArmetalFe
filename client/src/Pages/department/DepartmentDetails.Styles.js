import styled from 'styled-components';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

export const Container = styled.div`
  background: white;

  /* ✅ Responsive padding */
  padding: clamp(1rem, 2vw, 2rem);

  /* ✅ On very large screens (like 4K) give more space */
  @media (min-width: 1920px) and (max-width: 2559px) {
    padding: 3rem;
  }

  @media (min-width: 2560px) {
    padding: 4rem;
  }

  /* ✅ On small screens reduce padding */
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;


export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

export const IconTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 1.4rem;
  }
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  // img {
  //   height: 51px;
  // }

  // Prevent every div from becoming a column (remove this block ↓)
  // div {
  //   display: flex;
  //   flex-direction: column;
  // }
`;

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

// export const SubTitle = styled.p`
//   font-size: 0.9rem;
//   color: #666;
//   font-family:raleway;
// `;
export const FormSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 20rem;
  margin-bottom: 2rem;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;
export const InputGroup = styled.div`
  width: calc(40% - 1rem);
  display: flex;
  flex-direction: column;
`;
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top:-5%;
  width:90px;
  font-family:satoshi;
background: linear-gradient(181deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size:15px;
  cursor: pointer;
`;
export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 220px;
`;
export const Label = styled.label`
  color: gray;
  margin-bottom: 0.5rem;

  /* ✅ Responsive font size */
  font-size: clamp(0.85rem, 1vw, 1.2rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.3rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
`;

export const Input = styled.input`
  background: white;
  border: 1px solid #052DB4;
  border-radius: 4px;
  width: 100%;

  /* ✅ Responsive padding & font */
  padding: clamp(0.4rem, 0.8vw, 0.75rem) clamp(0.6rem, 1vw, 1rem);
  font-size: clamp(0.85rem, 1vw, 1.1rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.2rem;
    padding: 0.75rem 1.25rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
    padding: 1rem 1.5rem;
  }
`;


export const TableWrapper = styled.div`
//   overflow-x: auto;
  background-color:white;

`;

export const StyledTable = styled.table`
   width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
 text-align: left;
  font-family: 'Satoshi';

  /* Scroll on small screens */
  // display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  td {
    text-align: left;
    padding: clamp(4px, 0.5vw, 12px); /* responsive padding */
    white-space: nowrap;
    background-color: white;
    border: none;
    font-size: clamp(0.8rem, 1vw, 1.5rem); /* responsive font */
  }

  th {
 text-align: left;
    background-color: #304EB0;
    color: white;
    font-family: Raleway;
    padding: clamp(6px, 0.5vw, 16px); /* responsive padding */
    font-size: clamp(0.9rem, 1vw, 1.8rem); /* responsive font */
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
  }

  /* Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #E6ECFF;
  }

  tbody tr td:first-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }

  @media (min-width: 2560px) {
    td, th {
      font-size: clamp(1.2rem, 1.5vw, 1.8rem); /* large screens like 2K/4K */
      padding: clamp(8px, 1vw, 24px);
    }
  }

  @media (min-width: 3840px) {
    td, th {
      font-size: clamp(1.5rem, 2vw, 2rem); /* ultra-large screens like 8K */
      padding: clamp(10px, 2vw, 32px);
    }
  }
`;
export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ danger }) => (danger ? '#f44336' : '#333')};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;

  padding: 0.3rem ;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
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
// export const StyledIcon = styled(HiOutlinePencilSquare)`
//   width: 20px;
//   height: 20px;
//   margin-right: 0.5rem;
//   color: white;
//   vertical-align: middle;
// `;
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
export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */
  
  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 1vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }`;
export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;
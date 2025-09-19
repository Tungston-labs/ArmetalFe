// EmployeeAttendance.styles.js
import styled from "styled-components";
import { FiSearch } from 'react-icons/fi'; // Make sure this is imported in your file
import { IoEyeOutline } from "react-icons/io5";

export const ViewButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

export const ViewIcon = styled(IoEyeOutline)`
  color: #5f53a5;
  font-size: clamp(14px, 1.2vw, 24px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    font-size: 28px;
  }

  /* 4K */
  @media (min-width: 3840px) {
    font-size: 36px;
  }

  /* 8K */
  @media (min-width: 7680px) {
    font-size: 50px;
  }
`;


export const Header = styled.div`
 //  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  .title {
    display: flex;
    align-items: center;
    gap: 1rem;

    h2 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
    }

    img {
      height: 40px;
    }
  }

  .right {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const RoleBadge = styled.div`
  background: white;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.85rem;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
`;

export const TopRightBox = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  input[type="date"] {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

export const TabBar = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
  flex-wrap: wrap;
`;



export const TableTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
`;



export const TableRow = styled.tr`
  background-color: ${(props) => (props.$header ? '#f0f0f0' : 'white')};
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  background: #d6dee9;
  color: #000;
`;

export const TableCell = styled.td`
 padding: 0.8rem;
  vertical-align: middle;
`;

export const EmployeeImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;


export const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
`;



export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
`;

export const Container = styled.div`
  padding: 2rem;
  font-family: Satoshi;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  // gap: 10px;
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

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0.3rem;
  // border: 1px solid black;
  // border-radius: 8px;
  font-size: 0.95rem;
  color: #333;

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

export const Tabs = styled.div`
  display: flex;
  // gap: clamp(0.2rem, 0.3vw, 2rem);
  font-family: Raleway;
  font-weight: 700;
  font-size: clamp(0.7rem, 0.9vw, 2.5rem); 
  line-height: 100%;
  text-align: center;
  margin: 2rem ;
  flex-wrap: wrap;
justify-content: space-around;
  @media (max-width: 1024px) {
    gap: clamp(0.4rem, 1vw, 1.5rem);
    font-size: clamp(0.6rem, 0.8vw, 1.6rem);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: clamp(0.3rem, 1vw, 1rem);
    font-size: clamp(0.5rem, 0.7vw, 1.2rem);
  }
`;

export const Tab = styled.div`
  padding: clamp(6px, 0.4vw, 16px) clamp(12px, 0.8vw, 32px);
  cursor: pointer;
  font-family: Raleway;
  font-weight: 500;
  font-size: clamp(0.8rem, 0.9vw, 2rem);
  line-height: 100%;
  text-align: center;
  border-bottom: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
  background: ${({ active }) => (active ? "#304EB0" : "transparent")};
  border-radius: 6px;

  @media (max-width: 1024px) {
    padding: clamp(5px, 0.4vw, 14px) clamp(10px, 0.8vw, 26px);
    font-size: clamp(0.7rem, 0.8vw, 1.6rem);
  }

  @media (max-width: 1440px) {
    padding: clamp(5px, 0.6vw, 20px) clamp(10px, 0.8vw, 26px);
    font-size: clamp(0.7rem, 1vw, 2rem);
  }
  @media (max-width: 768px) {
    padding: clamp(4px, 0.3vw, 10px) clamp(6px, 0.6vw, 18px);
    font-size: clamp(0.6rem, 0.7vw, 1.2rem);
  }

  @media (min-width: 2560px) {
    font-size: clamp(1rem, 1.2vw, 2rem);
  }

  @media (min-width: 3840px) {
    font-size: clamp(1.2rem, 1.5vw, 2.5rem);
  }
`;


export const ActionArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1rem;
  gap: 1rem;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;



export const AddButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background: #2744a3;
  }
`;



export const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 450px; /* optional max width */
`;

export const SearchInput = styled.input`
  padding: 1.2rem 1.5rem 1.2rem 2.5rem; /* left padding for icon */
  border: 1px solid #172554;
  border-radius: 6px;
  width: 100%;
  font-family: 'Satoshi';
  height: clamp(35px, 3vw, 50px);
  font-size: clamp(0.9rem, 1vw, 1.5rem);

  @media (min-width: 1440px) {
    font-size: clamp(1.2rem, 0.8vw, 1.5rem);
    height: clamp(45px, 2vw, 60px);
  }

  @media (min-width: 2560px) {
    font-size: 1.8rem;
    height: 70px;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    height: 90px;
  }
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: clamp(10px, 1vw, 25px);
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: clamp(1.2rem, 1.5vw, 1.5rem);
  pointer-events: none;
`;




export const DepartmentSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
`;





export const Table = styled.table`
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

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
  padding: 0.6rem;
  gap: 4px;

  span {
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
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
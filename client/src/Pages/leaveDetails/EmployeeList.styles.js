import styled from "styled-components";
import { FiSearch } from 'react-icons/fi';

export const Container = styled.div`
  padding: 2rem;
 font-family: Satoshi;
  background:white;
`;

export const Header = styled.div`
  display: flex;
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

export const RightSection = styled.div`
  // display: flex;
  align-items: center;
  justify-content: flex-end; /* aligns items to the right */
  gap: 1rem;
  flex-wrap: wrap; /* allows wrapping on small screens */
`;


export const Tabs = styled.div`
  display: flex;
  gap: clamp(1rem, 2vw, 5rem); /* responsive gap for all screens */
  font-family: Raleway;
  font-weight: 700;
  font-size: clamp(1rem, 1.2vw, 5rem); /* font scales from mobile to ultra-large screens */
  line-height: 100%;
  text-align: center;
  margin: 1.5rem 0;
  flex-wrap: wrap; /* wrap on smaller screens */

  @media (max-width: 1024px) {
    gap: clamp(0.8rem, 2vw, 2rem);
    font-size: clamp(0.9rem, 1vw, 2rem);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: clamp(0.5rem, 1.5vw, 1.5rem);
    font-size: clamp(0.8rem, 1vw, 1.5rem);
  }
`;

export const Tab = styled.div`
  padding: clamp(8px, 0.5vw, 20px) clamp(16px, 1vw, 40px); /* responsive padding */
  cursor: pointer;
  font-family: Raleway;
  font-weight: 500;
  font-size: clamp(1rem, 1vw, 2.5rem); /* fully responsive font */
  line-height: 100%;
  text-align: center;
  border-bottom: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
  background: ${({ active }) => (active ? "#304EB0" : "transparent")};
  border-radius: 6px;

  @media (max-width: 1024px) {
    padding: clamp(6px, 0.5vw, 16px) clamp(12px, 1vw, 30px);
    font-size: clamp(0.9rem, 0.9vw, 2rem);
  }

  @media (max-width: 768px) {
    padding: clamp(4px, 0.5vw, 12px) clamp(8px, 1vw, 20px);
    font-size: clamp(0.8rem, 0.8vw, 1.5rem);
  }

  @media (min-width: 2560px) { /* 2K / 4K screens */
    font-size: clamp(1.5rem, 1.5vw, 2rem);
  }

  @media (min-width: 3840px) { /* 4K / 8K ultra-wide screens */
    font-size: clamp(2rem, 2vw, 3rem);
  }
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



// export const Row = styled.tr``;

// export const Cell = styled.td`
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;

//   svg {
//     cursor: pointer;
//   }
// `;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

export const ActionIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start; /* changed from flex-end to flex-start */
  gap: 0.3rem;
  margin-top: 1.5rem;
  // padding: 0.6rem;

  span {
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.7rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
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
  font-size: 1rem;
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

// export const HeaderSection = styled.div`
//   // display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 1rem;
//   // background:yellow;
// `;

// export const TitleSection = styled.div`
//   display: flex;
  
//   align-items: center;
//   // background:red;
//   // margin-top:3%;
// `;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  // background:black;
  margin-top:-8%;
`;
// export const Title = styled.h2`
//   font-size: 1.4rem;
//   margin: 0;
// //  font-family:satoshi;
//  margin-top:10px;
//  color:#3250B5;
//  font-family: "Satoshi";
// font-weight: 700;
// // font-style: Bold;
// // font-size: 22px;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;

// `;

// export const Subtitle = styled.p`
//   font-size: 1rem;
//    color:#3250B5;
//    margin-top:5px;
//   font-size:raleway;
//   font-family: Raleway;
// font-style: Light;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;

// `;

// export const DepartmentSelect = styled.select`
//   padding: 8px 12px;
//   font-size: 14px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   background: white;
//   margin-top:20px;
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

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column; /* stack top & bottom */
  gap: 1rem;
  width: 100%;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
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


export const AddButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: clamp(0.3rem, 0.5vw, 1rem);
  font-size: clamp(0.9rem, 1vw, 1rem);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2744a3;
  }

  @media (min-width: 1440px) {
    font-size: clamp(0.9rem, 0.8vw, 1rem);
    padding: clamp(0.8rem, 1vw, 1rem) clamp(1.5rem, 2vw, 2rem);
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 3rem;
    gap: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.2rem 4rem;
    gap: 1.2rem;
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
  padding: clamp(0.4rem, 0.8vw, 0.8rem) clamp(1rem, 2vw, 2rem) clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.8rem, 1.5vw, 1.5rem);
  font-size: clamp(0.875rem, 1vw, 1.25rem);
  border-radius: clamp(4px, 0.5vw, 8px);
  border: 1px solid #ccc;
  background: white;
  height: clamp(35px, 3vw, 50px);
  min-width: clamp(150px, 20vw, 300px);

  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right clamp(8px, 1vw, 15px) center;
  background-color: white;
  background-size: clamp(12px, 1vw, 18px);

  @media (min-width: 1440px) {
    font-size: clamp(1rem, 0.8vw, 1.5rem);
    min-width: 250px;
    height: 45px;
  }

  @media (min-width: 2560px) {
    font-size: 1.8rem;
    min-width: 350px;
    height: 55px;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
    min-width: 450px;
    height: 65px;
  }
`;



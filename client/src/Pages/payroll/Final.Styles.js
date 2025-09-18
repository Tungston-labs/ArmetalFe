import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";

export const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: white;
  padding: 25px;
`

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
  // gap: 0.75rem;
  padding: 0.3rem ;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* allows stacking on small screens */
  gap: clamp(8px, 1vw, 20px); /* spacing between items */
  margin-bottom: clamp(10px, 1vw, 20px);
`;

export const HeaderImage = styled.img`
  height: 60px;
  @media (max-width: 768px) {
    margin-top: 10px;
    height: 50px;
  }
`;
const BackIcon = styled(FaArrowLeft)`
  color: #2f57ef;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #1e3fa3;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between; /* left + right separation */
  align-items: center;
  flex-wrap: wrap; /* responsive wrapping on smaller screens */
  gap: clamp(8px, 1vw, 20px);
`;

export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 16px);
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
export const SearchInput = styled.input`
  width: 100%;
  max-width: 450px; /* optional: limit width */
  margin-top: 15px;
  padding: clamp(8px, 1vw, 15px);
  border: 1px solid #172554;
  border-radius: 6px;
  background: #fff;
  font-family: Satoshi;
  font-size: clamp(0.9rem, 1vw, 1.2rem); 
  height: clamp(35px, 3vw, 50px);

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: clamp(0.8rem, 1vw, 1rem);
    padding: 10px;
    height: 40px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px;
    height: 35px;
  }

  /* 2K+ screens */
  @media (min-width: 2560px) {
    font-size: 1.5rem;
    height: 60px;
    padding: 18px;
  }

  /* 4K+ screens */
  @media (min-width: 3840px) {
    font-size: 2rem;
    height: 75px;
    padding: 20px;
  }
`;




export const BulkActionBar = styled.div`
  background: #3352ba;
  color: #fff;
  padding: clamp(8px, 1vw, 20px);
  margin: 20px 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* let it stack on smaller screens */
  gap: clamp(8px, 1vw, 16px);

  input[type="checkbox"] {
    margin-right: clamp(6px, 0.5vw, 12px);
    transform: scale(clamp(0.9, 1vw, 1.3)); /* responsive checkbox size */
  }

  strong {
    font-size: clamp(0.9rem, 1vw, 1.4rem);
  }

  select {
    background: #fff;
    color: #000;
    min-width: 120px;
    padding: clamp(4px, 0.5vw, 8px);
    font-size: clamp(0.9rem, 1vw, 1.2rem);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    select {
      width: 100%; /* dropdown full width on mobile */
    }
  }

  @media (min-width: 2560px) {
    strong {
      font-size: clamp(1.2rem, 1.5vw, 1.6rem);
    }
    select {
      font-size: clamp(1.2rem, 1.5vw, 1.6rem);
      padding: clamp(6px, 1vw, 12px);
    }
  }

  @media (min-width: 3840px) {
    strong {
      font-size: clamp(1.4rem, 2vw, 1.8rem);
    }
    select {
      font-size: clamp(1.4rem, 2vw, 1.8rem);
      padding: clamp(8px, 2vw, 16px);
    }
  }
`;

export const TableWrapper = styled.div`
  margin-top: 10px;
  // overflow-x: auto;
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


export const Th = styled.th`
  background-color: #e1e8ec;
  text-align: left;
  font-weight: 600;

  @media (min-width: 2560px) {
    font-size: 22px;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 20px;
  }
  @media (max-width: 1023px) {
    font-size: 13px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Td = styled.td`
  padding: 0.3rem;
  background: #fff;
  color: #000;
  text-align: center;
  font-family: Satoshi;
  font-size: 0.9rem;
  font-weight: 400;

  @media (min-width: 2560px) {
    font-size: 20px;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 18px;
  }
  @media (max-width: 1023px) {
    font-size: 0.8rem;
  }
  @media (max-width: 767px) {
    font-size: 0.75rem;
  }
`;

export const Tr = styled.tr`
  box-shadow: 0 0 0 1px #00000047;
  overflow: hidden;
`;

export const Select = styled.select`
  padding: clamp(4px, 0.6vw, 10px) clamp(16px, 1vw, 28px) clamp(4px, 0.6vw, 10px) clamp(6px, 0.8vw, 12px);
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Satoshi, sans-serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(0.8rem, 1vw, 1.1rem);

  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right 8px center;
  background-color: white;
  background-size: clamp(12px, 1vw, 18px);

  /* Mobile full-width */
  @media (max-width: 767px) {
    width: 100%;
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
  }
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

// styles.js or your styled-components file
export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;

  span {
    padding: 0.2rem 0.5rem;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;

    &.active {
      background-color: #2f4cac;
      color: white;
    }
  }
`;
export const Icon = styled.img`
  width: 52px;
  height: 52px;
`;
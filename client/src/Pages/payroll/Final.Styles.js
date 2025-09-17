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
    flex-wrap: wrap;
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
  align-items: center;
  justify-content: space-between; /* Push left & right sides apart */
  width: 100%;
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
  padding: 15px;
  margin-top:15px;
  border: 1px solid #172554;
  border-radius: 6px;
// border: 1px solid #5F53A5;
background: #FFF;
// color: rgba(0, 0, 0, 0.50);
font-family: Satoshi;
font-size: 17px;
// font-style: italic;
// font-weight: 300;
// line-height: normal;
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
  text-align: center;

  td {
    text-align: center;
    white-space: nowrap;
    background-color: white;
    border: none;
  }

  th {
    text-align: center;
    background-color: #3352ba;
    color: white;
    padding: 0.7rem;
    font-family: Raleway;
    font-weight: 700;
    font-size: 17px;
    line-height: 100%;
  }

  tbody tr:nth-child(even) td {
    background-color: #e6ecff;
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
    font-family: Satoshi;
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

  /* ✅ Responsive Breakpoints */
  /* 4K Screens (Ultra HD) */
  @media (min-width: 2560px) {
    th, td {
      font-size: 3rem;
      padding: 1.2rem;
    }
  }

  /* QHD / 2K (1440p screens) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    th, td {
      font-size: 20px;
      padding: 1rem;
    }
  }

  /* Standard Desktops & Laptops */
  @media (min-width: 1024px) and (max-width: 1919px) {
    th, td {
      font-size: 16px;
      padding: 0.7rem;
    }
  }

  /* Tablets */
  @media (min-width: 768px) and (max-width: 1023px) {
    th, td {
      font-size: 14px;
      padding: 0.5rem;
    }
    border-spacing: 0 6px;
  }

  /* Mobiles */
  @media (max-width: 767px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;

    th, td {
      font-size: 12px;
      padding: 0.4rem;
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
  padding: 5px 25px 5px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Satoshi;
  font-weight: 300;
  font-style: italic;
  font-size: 17px;

  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right 8px center;
  background-color: white;
  background-size: 16px;

  /* Responsive font scaling */
  @media (min-width: 2560px) {
    font-size: 20px;
    padding: 10px 28px 10px 12px;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 18px;
    padding: 8px 26px 8px 10px;
  }
  @media (max-width: 1023px) {
    font-size: 15px;
    padding: 6px 20px 6px 8px;
  }
  @media (max-width: 767px) {
    font-size: 13px;
    padding: 5px 16px 5px 6px;
  }
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
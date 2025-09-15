import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";

export const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: white;
  padding: 20px;
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
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
color:#3352BA;
`;

export const Subtitle = styled.p`
  margin-top: -5px;
 
  font-family: Raleway;
font-weight: 300;
font-style: Light;
font-size: 1rem;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
color:#3352BA;
`;

export const SearchInput = styled.input`
  padding: 8px;
  margin-top:15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  border-radius: 7px;
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
    // padding: 0.7rem;
    white-space: nowrap;
    background-color: white;
    border: none; /* remove cell borders */
  }

  th {
     text-align: center;
    background-color: #3352BA;
    color: white;
    padding: 0.7rem;
    font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;


  }
/* ✅ Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #E6ECFF;
  }
  /* ✅ Apply box-shadow only to tbody rows */
  tbody tr {
  box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
font-family:satoshi;
    
  }

  /* Optional: radius for only first and last td of each row */
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
`;

export const Th = styled.th`
  background-color: #E1E8EC;
  // padding: 10px;
  text-align: left;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 0.3rem;
  background: #fff;
  color: #000;
text-align: center;
font-family: Satoshi;
font-size: 0.9rem;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

export const Tr = styled.tr`
  // background-color: #fff;
  // border-radius: 8px;
 box-shadow: 0 0 0 1px #00000047;
  overflow: hidden;
`;

export const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
font-family: Satoshi;
font-weight: 300;
font-style: Light Italic;
font-size: 17px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;


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
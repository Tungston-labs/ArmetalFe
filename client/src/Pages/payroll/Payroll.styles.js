import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";

export const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: #FBFEF3;
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
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
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
`;

export const Title = styled.h2`
  margin-left: 10px;
  font-size: 22px;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  margin-top: -10px;
  margin-left:10px;
`;

export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
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

  th, td {
    text-align: left;
    padding: 0.75rem;
    white-space: nowrap;
    background-color: white;
    border: none; /* remove cell borders */
  }

  th {
    background-color: #5F53A53B;
    color: #333;
  }

  /* ✅ Apply box-shadow only to tbody rows */
  tbody tr {
  box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
  }

  /* Optional: radius for only first and last td of each row */
  tbody tr td:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }
`;

export const Th = styled.th`
  background-color: #E1E8EC;
  padding: 10px;
  text-align: left;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 10px;
  background: #fff;
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
`;

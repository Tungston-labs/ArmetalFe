// EmployeeAttendance.styles.js
import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background: #FBFEF3;
  font-family: 'Segoe UI', sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleSection = styled.div`
  h2 {
    margin: 0;
  }
  p {
    color: #888;
    font-size: 0.9rem;
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

export const Tab = styled.div`
  padding: 0.6rem 1.2rem;
  border-bottom: ${({ active }) => (active ? '3px solid #2c3e94' : 'none')};
  color: ${({ active }) => (active ? '#2c3e94' : '#444')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;
`;

export const SearchInput = styled.input`
  margin-left: auto;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const TableTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
`;

export const TableRow = styled.tr`
  background-color: ${({ header }) => (header ? '#edf1f7' : 'white')};
  border-bottom: 1px solid #ccc;
`;

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
`;

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
//   display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EmployeeImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

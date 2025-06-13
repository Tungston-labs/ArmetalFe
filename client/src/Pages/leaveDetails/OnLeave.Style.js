// EmployeeAttendance.styles.js
import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background: #FBFEF3;
  font-family: 'Segoe UI', sans-serif;
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
    font-family:raleway;
  }

  /* ✅ Apply box-shadow only to tbody rows */
  tbody tr {
   box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
   font-family:satoshi;
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

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fff;
  }
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
export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  gap: 0.75rem;
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
`;
export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-left:10px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left:10px;
  margin-top:-1px;
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
`;

export const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 300px;
`;

export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
  width: 120px;
`;
export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  font-family:raleway;
  border-bottom: 2px solid #ddd;
`;

export const Tab = styled.div`
  padding-bottom: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  border-bottom: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "#1e3a8a" : "#555")};
`;

// EmployeeAttendance.styles.js
import styled from "styled-components";
import { FiSearch } from 'react-icons/fi'; // Make sure this is imported in your file



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
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;


export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  color: #3250B5;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
margin-top:10px;
margin-bottom:5px;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #3250B5;
font-family: Raleway;
font-weight: 300;
font-style: Light;
font-size: 16px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;


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
  gap: 2rem;
  margin: 1.7rem 0;
  // border-bottom: 2px solid #ddd;
  
`;

export const Tab = styled.div`
  padding:5px  20px;
  cursor: pointer;
  background:#304EB0;
  font-weight: 500;
  background: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
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
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  width:100%;

`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 20%;
`;



export const DepartmentSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
`;


export const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
  

  th, td {
    text-align: left;
    padding: 0.5rem;
    white-space: nowrap;
    
  }
    tbody tr {
  outline: 0.100rem solid #d3d3d3;
  border-radius: 0px;
}


  th {
    background-color:rgb(18, 50, 158);
    font-family: raleway;
    color:white;
    padding: 0.75rem;
    
  }

  tbody tr:nth-child(even) {
    background-color: #e6f0ff;
    
  }

  tbody tr:nth-child(odd) {
    background-color: #ffffff;
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
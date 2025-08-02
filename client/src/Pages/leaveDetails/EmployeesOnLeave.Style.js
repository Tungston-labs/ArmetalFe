import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';


export const DepartmentContainer = styled.div`
  padding: 2rem;
  background-color: rgb(255, 255, 255);
`;










export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 22px;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 16px;
    font-family: 'Raleway';
  }
`;



export const InitialCircle = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  color: rgb(228, 247, 246);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 100px;
  font-family: Satoshi;
  padding-right: 18px;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Satoshi;
  background: linear-gradient(to right, rgb(72, 139, 222),rgb(44, 81, 229));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
`;



export const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
`;

export const CardGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const DepartmentCard = styled.div`
  background: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  // 💡 Hover effect
  &:hover {
    .initial-circle {
      background-color:rgb(255, 255, 255);
      color:rgb(208, 208, 219);
    }

    .dept-name,
    .head-name,
    .subtitle,
    .card-value {
      color:rgb(62, 101, 200);
    }

    .arrow-icon {
      background-color:rgb(51, 51, 192);
      color: white;
    }
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: #000;
    font-family: 'Satoshi';
  }

  .head-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .head-name {
      font-size: 0.85rem;
      margin: 0;
      font-weight: 500;
      color: #000;
    }
  }
`;


export const HeadInfo = styled.div`
  margin-top: 0.5rem;

  small {
    font-size: 0.9rem;
    color: #888;
    display: block;
  }
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  .card-value {
    font-weight: 600;
    font-size: 1.5rem;
    color: #000;
  }

  .arrow-icon {
  background: rgb(255, 255, 255);
  color: rgb(52, 52, 124);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

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
  width: 120px;
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
  font-size: 22px;
  margin: 0;
  margin-left: 10px;
  color: #1e3a8a;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  margin-top: -1px;
  color: #1e3a8a;


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
  border: 1px solid black;
  border-radius: 8px;
  background-color:rgb(178, 196, 243);
  font-size: 0.95rem;
  color: #333;

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

export const Tabs = styled.div`
  display: flex;
  gap: 0rem;
  margin: 1.5rem 0;
`;

export const Tab = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#1e3a8a" : "#fff")};
  color: ${({ active }) => (active ? "white" : "#555")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
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







export const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 250px;
`;



export const DepartmentSelect = styled.select`
  width: 220px;
  padding: 0.75rem 1rem;
  border: 1 rem black;
  border-bottom: 2px solid #ccc;
  background-color: #fff;
  font-weight: bold;
  font-size: 14px;
  color: #000;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-bottom: 2px solid #5f53a5;
  }

  option {
    font-weight: normal;
    padding: 10px;
  }
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

// LeaveRequest.styles.js
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';

export const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
  background:white;
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
export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;


export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.7rem 0;
  font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 1rem;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
text-align: center;

  // border-bottom: 2px solid #ddd;
`;

export const Tab = styled.div`
  padding:7px  20px;
  cursor: pointer;
  font-weight: 500;
  background:#304EB0;

        background: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
 
`;


export const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 23%;
  max-width: 400px;
  margin-top:-18px;
`;

export const SearchInput = styled.input`
  padding: 1.2rem 1rem 1.2rem 2.5rem; /* left padding for icon */
  border: 1px solid #172554;
  border-radius: 6px;
  width: 100%;
  font-family: satoshi;
  height: 40px;
  font-size: 0.95rem;
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.2rem;
  pointer-events: none;
`;

export const AddButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
  text-align: center;
  td {
    text-align: center;
    padding: 0.5rem;
    white-space: nowrap;
    background-color: white;
    border: none;
  }

  th {
    background-color: #304EB0;
    color: white;
    font-family: raleway;
    padding: 0.8rem;
      text-align: center;
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
    font-family: 'satoshi';
  }

  /* ✅ Background color for even rows */
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
`;

export const TableHead = styled.th`
  text-align: center;
  padding: 1rem;
  background: #d6dee9;
  color: #000;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fff;
  }
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  vertical-align: middle;
`;

export const ProfileImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 0.6rem;
  vertical-align: middle;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

export const DeclineButton = styled.button`
  // background-color: #f87171;
  color: white;
  padding: 0.4rem 0.8rem;
  // border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
border-radius: 7px;
border: 1px solid #FF2304;
background: rgba(255, 35, 4, 0.50);
  &:hover {
    background-color: #dc2626; /* a darker red */
    transform: scale(1.02);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;


export const ApproveButton = styled.button`
  // background-color: #94a3b8;
  color: white;
  padding: 0.4rem 0.8rem;
  // border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
border-radius: 7px;
border: 1px solid #172554;
background: #304EB0;
  &:hover {
    background-color: #64748b; /* darker bluish-gray */
    transform: scale(1.02);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;`;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  padding: 0.3rem ;
  // border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
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

export const HeaderSection = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
`;
export const DepartmentSelect = styled.select`
  padding: 8px 30px 8px 12px; /* room for arrow */
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
  height: 40px;
  min-width: 200px;

  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right 10px center;
  background-color: white;
  background-size: 14px;
`;

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  margin-top: 10px;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 100%;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #3250b5;
  margin-top: 5px;
  font-family: Raleway;
  font-weight: 300;
  line-height: 100%;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.2rem;
  margin-top: 1.5rem;
  padding: 0.5rem;

  span {
    padding: 0.2rem 0.6rem;
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
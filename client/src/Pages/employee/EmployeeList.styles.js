import styled from "styled-components";
import { FiSearch } from 'react-icons/fi'; // Make sure this is imported in your file


export const Container = styled.div`
  padding: 2rem;
 font-family: Satoshi;
  background:white;
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

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
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
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 250px;
  margin-top:10px;
  height:20px;
  font-family:satoshi;
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



export const DepartmentSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;

  td {
    text-align: left;
    // padding: 0.rem;
    white-space: nowrap;
    background-color: white;
    border: none;
  }
    tbody tr {
  outline: 0.100rem solid #d3d3d3;
  border-radius: 0px;
}


  th {
    background-color: #304EB0;
    color: white;
    font-family: raleway;
    padding: 0.8rem;
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

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
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
  // display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  // background:yellow;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  // background:red;
  margin-top:-2%;
`;

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
export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
  margin-left:10px;
 font-family:satoshi;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left:10px;
  margin-top:-1px;
  font-size:raleway;
`;

export const DepartmentSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
`;

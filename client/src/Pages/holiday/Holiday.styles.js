// src/Pages/holiday/Holiday.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
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
export const Header = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top:20px;

  img {
    height: 51px;
  }

  div {
    display: flex;
    flex-direction: column;
  }
`;


export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
    font-family: Satoshi;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-left: 2px;
  font-family:raleway;
`;
// export const Title = styled.h1`
//   font-size: 2rem;
//   margin: 0;
//   text-transform: capitalize;
// `;

// export const Subtitle = styled.p`
//   font-size: 1rem;
//   color: #666;
// `;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const FormSection = styled.div`
  display: flex;
  gap: 27px;
  margin-bottom: 30px;

`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width:40%;
    background-color:#FBFEF3;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width:25%;
    background-color:white;
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;
export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
  width: 120px;
`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;



export const AddButton = styled.button`
  background-color: #172554;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  width:10%;
  font-size:18px
`;

export const TableWrapper = styled.div`
  // overflow-x: auto;
  margin-top:10px;
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
    background-color: white;
    border: none; /* remove cell borders */
  }

  th {
    background-color: #5F53A53B;
    color: #333;
        padding: 0.75rem;
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
export const Th = styled.th`
  text-align: left;
  padding: 10px;
   background-color: #E1E8EC;
  // border-bottom: 1px solid #ddd;
`;

export const Td = styled.td`
  padding: 10px;
  // border-bottom: 1px solid #eee;
    background: #fff;
`;
export const Tr = styled.tr`
  overflow: hidden;
`;
export const TrashIcon = styled.span`
  cursor: pointer;
`;

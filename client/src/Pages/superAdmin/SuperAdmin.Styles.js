// src/Components/CompanyTable.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
background: #FBFEF3;
  min-height: 100vh;
`;
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .avatar {
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .avatar {
      margin-top: 10px;
    }
  }
`;
export const Icon = styled.div`
  font-size: 1rem;
 
`;
export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
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
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;


export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #2a2a86, #3e64ff);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
  max-width: 300px;
`;

export const TableWrapper = styled.div`
  // overflow-x: auto;
  border-radius: 10px;
`;

export const Table = styled.table`
width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
  font-size:19px;

  th, td {
    text-align: left;
    padding: 0.1rem;
    white-space: nowrap;
    background-color: white;
    border: none; /* remove cell borders */
  }

  th {
    background-color: #5F53A53B;
    color: #333;
    font-family:raleway;
      padding: 0.75rem;
  }

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
  padding: 12px;
  background: #e7eaf6;
  color: #111;
  font-size: 14px;
`;

export const Td = styled.td`
  padding: 12px;
  background: #fff;
  font-size: 14px;
  white-space: nowrap;
`;

export const IconButton = styled.button`
  background: inherit;
  color: ${({ danger }) => (danger ? 'red' : '#1e293b')};
  border: none;
  padding: 8px;
  font-size:1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ImpersonateButton = styled.button`
  background: #475569;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Aligns items to the left */

  button {
    padding: 8px 12px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background: #172554;
      color: white;
    }

    &:hover {
      background: #e2e8f0;
    }
  }
`;


// components/PayrollDetailsStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #111;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  gap:5px;
`;

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const RightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
`;

export const Badge = styled.span`
  background: #ffdddd;
  color: red;
  padding: 0.3rem 0.6rem;
  border: 1px solid red;
  border-radius: 6px;
  font-size: 0.75rem;
`;

export const PrintIcon = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
`;


export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
`;

export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Label = styled.div`
  font-weight: 500;
`;

export const Value = styled.div`
  font-weight: normal;
`;

export const SectionTitle = styled.h3`
  text-decoration:underline;
  font-size: 1.1rem;
  margin-top: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  td, th {
    border: 1px solid #999;
    padding: 0.4rem;
    text-align: left;
  }
`;

export const TableHeader = styled.th`
 margin-top:20px;
   border-bottom: 1px solid #ccc;
`;

export const TableData = styled.td`
  font-size: 0.9rem;
`;

export const TotalRow = styled.tr`
  font-weight: bold;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f3f3f3;
  padding: 1rem;
  margin-top: 2rem;
  font-weight: bold;

  span {
    font-weight: bold;
  }
`;

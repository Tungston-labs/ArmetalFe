import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  font-family: sans-serif;
`;

export const Header = styled.h2`
  margin-bottom: 1.5rem;
`;

export const PlanBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e6eefe;
  border: 2px solid #c6d6f5;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
`;

export const PlanTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

export const PlanDesc = styled.p`
  font-size: 0.85rem;
  color: #444;
`;

export const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

export const Row = styled.tr`
  background-color: ${({ unpaid }) => (unpaid ? '#fceaea' : '#f1f9f5')};
  border-bottom: 1px solid #ccc;
`;

export const Cell = styled.td`
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  font-weight: ${({ header }) => (header ? 'bold' : 'normal')};
  text-align: left;
`;

export const Input = styled.input`
  width: 100px;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Select = styled.select`
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const IconCell = styled.td`
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: ${({ cancel }) => (cancel ? '#f97373' : '#909dc1')};
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
`;

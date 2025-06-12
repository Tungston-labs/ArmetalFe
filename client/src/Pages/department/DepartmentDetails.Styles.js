import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: #FBFEF3;

`;

export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

export const IconTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 1.4rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
`;

export const SubTitle = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

export const FormSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const InputGroup = styled.div`
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const TableWrapper = styled.div`
//   overflow-x: auto;
  background-color:white;

`;

export const StyledTable = styled.table`
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
  }

  /* ✅ Apply box-shadow only to tbody rows */
  tbody tr {
 box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
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

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ danger }) => (danger ? '#f44336' : '#333')};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

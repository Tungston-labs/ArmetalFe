import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

export const CardHeader = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #304EB0;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: red;
  margin-top: 3px;
`;

export const FileInput = styled.input`
  margin-top: 0.5rem;
`;

export const SaveButton = styled.button`
  padding: 10px 16px;
  background: #304EB0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
`;

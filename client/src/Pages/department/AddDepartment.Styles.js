import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
`;

export const BackArrow = styled.div`
  font-size: 1.2rem;
  cursor: pointer;
`;

export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
  font-family:satoshi;
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  flex: ${({ fullWidth }) => (fullWidth ? '1 1 100%' : '1 1 45%')};
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex: 1 1 100%;
  margin-top: 1.5rem;
`;

export const CancelButton = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #ff7a6b;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e85f54;
  }
`;

export const SaveButton = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #6c7380;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #4e545f;
  }
`;
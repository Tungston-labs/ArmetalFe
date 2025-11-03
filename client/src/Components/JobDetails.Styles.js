import styled from "styled-components";

export const FormContainer = styled.form`
  width: 100%;
  margin: 40px auto;
  padding: 30px;

`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #222;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #052db4;
  border-radius: 6px;
  font-size: 15px;
  background-color: #fff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #052db4;
  border-radius: 6px;
  font-size: 15px;
  background-color: #fff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

export const FileInputLabel = styled.label`
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed #052db4;
  border-radius: 6px;
  font-size: 15px;
  color: #052db4;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f1f5ff;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

export const NextButton = styled.button`
  background-color: #052db4;
  color: #fff;
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #031d78;
  }
`;


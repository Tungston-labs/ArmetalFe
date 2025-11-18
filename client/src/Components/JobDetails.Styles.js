import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin: auto;
  padding: 20px;
  // background: #fff;
  // border-radius: 12px;
  // box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const FormGroup = styled.div`
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
  color: #172554;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #052DB4;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #052DB4;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  &:focus {
    border-color: #6366f1;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const FileInputLabel = styled.label`
  padding: 10px 12px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  &:hover {
    border-color: #6366f1;
    color: #4f46e5;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center; 
  gap: 12px;
  margin-top: 20px;
`;
export const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #304EB0;
  color: white;
  font-weight: 500;
  border:1px solid #172554;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #172554;
  }

  &:disabled {
    background-color: #172554;
    cursor: not-allowed;
  }
`;
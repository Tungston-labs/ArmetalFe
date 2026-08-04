import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: auto;
  padding: 20px;
  // background: #fff;
  // border-radius: 12px;
  // box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
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
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const Select = styled.select`
  padding:7px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
  &:focus {
    border-color: #6366f1;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const FileInputLabel = styled.label`
  padding:8px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
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
  color: red;
 font-size: 0.85em;
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

export const LeaveContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const TotalLeaveBox = styled.div`
 padding: 8px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
    margin-bottom: 10px;
  &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);

  }
`;

export const AddLeaveButton = styled.button`
  padding: 8px 12px;
  border: 1px dashed #304EB0;
  border-radius: 6px;
  background: transparent;
  color: #304EB0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #304EB0;
    color: white;
  }
`;

export const LeaveItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

export const LeaveLabel = styled.span`
  min-width: 140px;
  font-size: 14px;
  font-weight: 500;
  color: #172554;
`;

export const LeaveInput = styled(Input)`
  flex: 1;
`;
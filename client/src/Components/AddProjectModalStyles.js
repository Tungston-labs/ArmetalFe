import styled, { css } from 'styled-components';
import { MdOutlineArrowDropDown } from "react-icons/md";
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto; 
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

// --- Header Styles ---

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  margin-right: 15px;
  padding: 0;
  line-height: 1;
`;

export const HeaderContent = styled.div``;

export const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #3352BA;
`;

export const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #3352BA;
  margin: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; 
  margin-bottom: 40px; 
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
`;

const BaseInputStyle = css`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box; 

  &:focus {
    border-color: #007bff; 
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: #999;
  }
`;

export const InputField = styled.input`
  ${BaseInputStyle}
`;

export const SelectField = styled.select`
  ${BaseInputStyle}
  appearance: none; 
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px; 
`;

export const Option = styled.option``;


export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; 
  gap: 15px;
 
  margin-top: -20px; 
  padding-bottom: 20px;
`;

const BaseButton = css`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
`;

export const CancelButton = styled.button`
  ${BaseButton}
  background-color: #FD907B;
  color: white;
  border: 1px solid #FF2304;

  &:hover {
    background-color: #e55;
    border-color: #e55;
  }
`;

export const SaveButton = styled.button`
  ${BaseButton}
  background-color: #3352BA; 
  color: white;
  border: 1px solid #172554;

  &:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
`;

// --- Additional Frame 1811 Styles ---

export const AdditionalFrame = styled.div`
  display: grid;
  /* Frame 1811 looks like 3 equally sized columns */
  grid-template-columns: repeat(3, 1fr); 
  gap: 15px;
  /* The frame title "Frame 1811" isn't explicitly shown as a styled element,
     but you could add it with a simple <h3> element above this grid */
  padding-top: 15px; 
  border-top: 1px solid #eee;
`;
export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownIcon = styled(MdOutlineArrowDropDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* So clicks go to select */
  color: #333;
  font-size: 24px;
`;

import styled from "styled-components";
import { MdOutlineArrowDropDown } from "react-icons/md";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  color: #fff;

  @media (max-width: 576px) {
    max-width: 95%;
    border-radius: 10px;
  }
`;

export const ModalHeader = styled.div`
  background: #3352ba;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: #c7d2fe;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 20px 20px 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
`;

export const Label = styled.label`
  font-size: 12px;
  color: #000;
  margin-bottom: 5px;
  display: block;
  font-weight: 500;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: #000;
  font-size: 13px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3352ba;
    box-shadow: 0 0 0 2px rgba(51, 82, 186, 0.15);
  }

  &::placeholder {
    color: #999;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 9px 32px 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: #000;
  font-size: 13px;
  appearance: none;
  background: white;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3352ba;
    box-shadow: 0 0 0 2px rgba(51, 82, 186, 0.15);
  }
`;

export const Option = styled.option``;

export const DropdownIcon = styled(MdOutlineArrowDropDown)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #333;
  font-size: 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #555;
  background: transparent;
  color: #000;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SaveButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #3352ba;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #2f47a0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
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

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 15px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 10px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 8px;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    padding: 40px;
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 1024px) {
    max-width: 550px;
    padding: 18px;
  }

  @media (max-width: 768px) {
    max-width: 480px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 14px;
    border-radius: 8px;
  }

  @media (min-width: 1440px) {
    max-width: 700px;
    padding: 25px;
  }

  @media (min-width: 2560px) {
    max-width: 900px;
    padding: 35px;
    border-radius: 12px;
  }
    @media (min-width: 3840px) {
    max-width: 1500px;
    padding: 55px;
    border-radius: 12px;
  }
`;

/* ---------------- Header Styles ---------------- */

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  padding-bottom: 20px;

  @media (max-width: 768px) {
    padding-bottom: 15px;
  }

  @media (max-width: 480px) {
    padding-bottom: 10px;
  }

  @media (min-width: 2560px) {
    padding-bottom: 25px;
  }
    @media (min-width: 3840px) {
    padding-bottom: 35px;
  }
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

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }

  @media (min-width: 1440px) {
    font-size: 28px;
  }

  @media (min-width: 2560px) {
    font-size: 34px;
  }
  @media (min-width: 3840px) {
    font-size: 4rem;
  }
`;

export const HeaderContent = styled.div``;

export const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #3352ba;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }

  @media (min-width: 1440px) {
    font-size: 22px;
  }

  @media (min-width: 2560px) {
    font-size: 28px;
  }

  @media (min-width: 3840px) {
    font-size: 3rem;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #3352ba;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }

  @media (min-width: 1440px) {
    font-size: 16px;
  }

  @media (min-width: 2560px) {
    font-size: 18px;
  }
    @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

/* ---------------- Form Grid ---------------- */

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 25px;
  }

  @media (min-width: 1440px) {
    gap: 25px;
  }

  @media (min-width: 2560px) {
    gap: 30px;
    margin-bottom: 50px;
  }
    @media (min-width: 3840px) {
    gap: 35px;
    margin-bottom: 50px;
  }
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

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }

  @media (min-width: 1440px) {
    font-size: 16px;
  }

  @media (min-width: 2560px) {
    font-size: 18px;
  }
   @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 10px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 7px 8px;
  }

  @media (min-width: 1440px) {
    font-size: 17px;
    padding: 12px 14px;
  }

  @media (min-width: 2560px) {
    font-size: 20px;
    padding: 14px 16px;
    border-radius: 6px;
  }

    @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 16px 18px;
    border-radius: 6px;
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

/* ---------------- Buttons ---------------- */
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: -20px;
  padding-bottom: 20px;

  @media (max-width: 1024px) {
    gap: 12px;
    margin-top: -15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: -10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  @media (min-width: 1440px) {
    gap: 18px;
  }

  @media (min-width: 2560px) {
    gap: 25px;
  }
`;

const BaseButton = css`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;

  @media (max-width: 1024px) {
    font-size: 15px;
    padding: 9px 18px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 12px;
  }

  @media (min-width: 1440px) {
    font-size: 0.7rem;
    padding: 12px 24px;
  }

  @media (min-width: 2560px) {
    font-size: 20px;
    padding: 14px 28px;
    border-radius: 6px;
  }
   @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 14px 28px;
    border-radius: 6px;
  }
`;

export const CancelButton = styled.button`
  ${BaseButton}
  background-color: #fd907b;
  color: white;
  border: 1px solid #ff2304;

  &:hover {
    background-color: #e55;
    border-color: #e55;
  }
`;

export const SaveButton = styled.button`
  ${BaseButton}
  background-color: #3352ba;
  color: white;
  border: 1px solid #172554;

  &:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
`;
/* ---------------- Additional Frame ---------------- */

export const AdditionalFrame = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (min-width: 1440px) {
    gap: 20px;
  }

  @media (min-width: 2560px) {
    gap: 25px;
    padding-top: 20px;
  }
   @media (min-width: 3840px) {
    gap: 25px;
    padding-top: 20px;
  }
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
  pointer-events: none;
  color: #333;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
    right: 10px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    right: 8px;
  }

  @media (min-width: 1440px) {
    font-size: 28px;
  }

  @media (min-width: 2560px) {
    font-size: 34px;
    right: 16px;
  }
   @media (min-width: 3840px) {
    font-size: 3rem;
    right: 16px;
  }
`;
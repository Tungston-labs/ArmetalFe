import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.48);

  overflow-y: auto;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 648px;

  max-height: calc(100vh - 40px);

  padding: 24px 15px 24px;

  background: #ffffff;

  border: 1px solid #111111;
  border-radius: 20px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);

  overflow-y: auto;

  @media (max-width: 768px) {
    max-width: 600px;
    padding: 22px 15px;
  }

  @media (max-width: 480px) {
    max-height: calc(100vh - 20px);

    padding: 18px 12px;

    border-radius: 15px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 4px 0 10px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #111111;
font-family: "Poppins";
font-weight: 600;
font-style: SemiBold;
font-size: 20px;
line-height: 100%;
letter-spacing: 0px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const CloseButton = styled.button`
  width: 29px;
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e2e2e2;
  border-radius: 5px;

  background: #ffffff;
  color: #3858c8;

  font-size: 22px;
  font-weight: 300;

  line-height: 1;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #3858c8;
    color: #ffffff;
    border-color: #3858c8;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;

  background: #e5e5e5;

  margin-bottom: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 11px;
`;

export const FormGroup = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 7px;
`;

export const Label = styled.label`
  color: #333333;
font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 20px;
letter-spacing: -0.05px;
vertical-align: middle;
  line-height: 1.3;
`;

export const Required = styled.span`
  color: #e53935;
`;

export const Input = styled.input`
  width: 100%;
  height: 36px;

  padding: 0 11px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;

  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 12px;

  transition: border-color 0.2s ease;

  &::placeholder {
    color: #a4a4a4;
  }

  &:focus {
    border-color: #3858c8;
  }

  &:hover {
    border-color: #cfcfcf;
  }

  @media (max-width: 480px) {
    height: 38px;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 36px;

  padding: 0 11px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;

  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 12px;

  cursor: pointer;

  &:focus {
    border-color: #3858c8;
  }

  @media (max-width: 480px) {
    height: 38px;
  }
`;

export const FieldsRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 11px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;

  gap: 11px;

  margin-top: 4px;
`;

export const CancelButton = styled.button`
  height: 32px;

  padding: 0 16px;

  border: none;
  border-radius: 4px;

  background: #ff8b20;
  color: #ffffff;

  font-size: 11px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #e9760d;
  }
`;

export const CreateButton = styled.button`
  height: 32px;

  padding: 0 20px;

  border: none;
  border-radius: 4px;

  background: #3858c8;
  color: #ffffff;

  font-size: 11px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #2949b8;
  }
`;
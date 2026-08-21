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
  max-width: 1040px;

  max-height: calc(100vh - 40px);

  background: #ffffff;
  border-radius: 5px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);

  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 600px;
  }

  @media (max-width: 480px) {
    max-height: calc(100vh - 20px);
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 28px;

  background: #3352BA;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const CloseButton = styled.button`
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;

  background: transparent;
  color: #ffffff;

  font-size: 20px;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #ffffff;
  }
`;

export const Divider = styled.div`
  display: none;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 18px;

  padding: 24px 28px 28px;
  overflow-y: auto;
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 7px;
`;

export const Label = styled.label`
  color: #333333;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.05px;
  vertical-align: middle;
`;

export const Required = styled.span`
  color: #e53935;
`;

export const Input = styled.input`
  width: 100%;
  height: 38px;

  padding: 0 11px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;

  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 13px;

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
`;

export const Select = styled.select`
  width: 100%;
  height: 38px;

  padding: 0 11px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;

  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 13px;

  cursor: pointer;

  &:focus {
    border-color: #3858c8;
  }
`;

/* Top row: Project Name, Project Type, Latitude, Longitude, Priority */
export const FieldsRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;

  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

/* Bottom row: Start Date, Project Status, Add Employee (wider) */
export const SecondFieldsRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 2fr;

  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;

  margin-top: 6px;
`;

export const CancelButton = styled.button`
  height: 38px;

  padding: 0 24px;

  border: none;
  border-radius: 6px;

  background: #3b4ccb;
  color: #ffffff;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #2e3ea8;
  }
`;

export const CreateButton = styled.button`
  height: 38px;

  padding: 0 24px;

  border: none;
  border-radius: 6px;

  background: #ff8b20;
  color: #ffffff;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #e9760d;
  }
`;
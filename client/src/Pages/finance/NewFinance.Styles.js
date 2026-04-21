import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 600px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;

leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 5px;
  color:#00000080;
  font-family: Satoshi;
font-weight: 400;
font-style: Regular;

leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: none;
  min-height: 100px;
  min-width:550px;
  font-size: 14px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const Button = styled.button`
  flex: 1;
  padding: 12px;
  margin: 0 5px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  ${({ variant }) =>
    variant === "cancel"
      ? `
        background: white;
        border: 1px solid black;
        color: black;
      `
      : `
        background: #3352BA;
        color: white;
      `}
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
`;

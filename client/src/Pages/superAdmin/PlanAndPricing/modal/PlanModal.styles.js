import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const Modal = styled.div`
  width: 800px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 14px;
  padding: 28px;

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #202224;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: #f4f4f4;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ececec;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Rows = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #000;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #ff8c1a;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
background-color: white;
  &:focus {
    border-color: #ff8c1a;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #ff8c1a;
  }
`;

export const PriceInputWrapper = styled.div`
  position: relative;
`;

export const Currency = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-weight: 600;
`;

export const FeatureSection = styled.div`
  /* border: 1px solid #ececec; */
  border-radius: 10px;
  /* padding: 18px; */
`;

export const FeatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

export const AddFeatureButton = styled.button`
  border: none;
  background: #E0822D;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #ef7f06;
  }
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

export const FeatureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: #fafafa; */
  /* border: 1px solid #ececec; */
  /* padding: 12px 15px; */
  border-radius: 8px;
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;

  input {
    width: 18px;
    height: 18px;
    accent-color: #ff8c1a;
  }
`;

export const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #e53935;
  font-size: 20px;
  cursor: pointer;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
`;

export const CancelButton = styled.button`
  border: 1px solid #d9d9d9;
  background: white;
  color: #444;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background: #f7f7f7;
  }
`;

export const SubmitButton = styled.button`
  border: none;
  background: #ff8c1a;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background: #ef7f06;
  }
`;
export const Required = styled.span`
  color: #e53935;
  margin-left: 3px;
  font-weight: 600;
`;
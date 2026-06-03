import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  /* background: #2b2b2b; */
  background: white;
  border-radius: 12px;
  overflow: hidden;
  /* border: 1px solid #3a3a3a; */
  color: #fff;
`;

export const Header = styled.div`
  background: #3352BA;
  padding: 16px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 15px;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: #c7d2fe;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
`;

export const Body = styled.div`
  padding: 20px;
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 18px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3352BA;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: 600;
`;

export const EmpInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmpName = styled.p`
  margin: 0;
  font-size: 13px;
  color: black;
`;

export const EmpSub = styled.span`
  font-size: 11px;
  color: #000;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const Field = styled.div`
  margin-bottom: 14px;
`;

export const Label = styled.label`
  font-size: 12px;
  color: #000;
  margin-bottom: 5px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  /* background: #1f1f1f; */
  color: #000;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #3f57b3;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
  resize: vertical;
color: #000;
  &:focus {
    outline: none;
    border-color: #3f57b3;
  }
`;

export const Footer = styled.div`
  padding: 14px 20px;


  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const CancelBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #555;
  background: transparent;
  color: #000;
  cursor: pointer;
`;

export const SaveBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #3352BA;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #2f47a0;
  }
`;
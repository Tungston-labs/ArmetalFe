import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ zIndex }) => zIndex || 1000};
  pointer-events: auto;
`;

export const ModalContainer = styled.div`
  background: white;
  width: 90%;
  max-width: 1200px;
  padding: 30px;
  border-radius: 10px;
  max-height: 90%;
  overflow-y: auto;
  z-index: ${({ zIndex }) => zIndex || 1001};
  pointer-events: auto;
`;




export const ModalHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const InputField = styled.input.attrs({ readOnly: true })`
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid lightgray;
  border-radius: 5px;

  &::before {
    content: attr(label);
    display: block;
    color: gray;
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background-color: #2f43b8;
  color: white;

  th {
    padding: 12px;
    text-align: left;
  }
`;

export const TableRow = styled.tr`
  background-color: ${({ $highlighted }) => ($highlighted ? "#f1f4ff" : "white")};
`;

export const TableData = styled.td`
  padding: 12px;
  vertical-align: middle;
  
`;

export const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;   // space between buttons
  margin-top: 20px;
  flex-wrap: wrap; // ensures buttons don't overflow on small screens
`;

export const ApproveButton = styled.button`
  background-color: #2f43b8;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  min-width: 100px; // optional, for consistent sizing
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #1e2a90; // slightly darker blue on hover
    transform: scale(1.05); // subtle zoom effect
  }
`;


export const DeclineButton = styled.button`
  background-color: #ff6f61;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  min-width: 100px;
  margin-left: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #ff4a3a; /* slightly darker/redder on hover */
    transform: scale(1.05); /* subtle zoom effect */
  }
`;



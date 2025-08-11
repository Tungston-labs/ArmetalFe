import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  background: white;
  width: 90%;
  max-width: 1200px;
  padding: 30px;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 90%;
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
  background-color: ${({ highlighted }) => (highlighted ? "#f1f4ff" : "white")};
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
  gap: 15px;
  margin-top: 20px;
`;

export const ApproveButton = styled.button`
  background-color: #2f43b8;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

export const DeclineButton = styled.button`
  background-color: #ff6f61;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

import styled, { css } from "styled-components";

const colors = {
  primary: "#F78926",
  primaryHover: "#e87814",
  border: "#ECECEC",
  text: "#2D2D2D",
  secondaryText: "#7B7B7B",
  background: "#FFFFFF",
  hover: "#FFF8F1",
  success: "#16A34A",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 5px;
  background: #ffffff;

  &::-webkit-scrollbar {
    height: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d7d7d7;
    border-radius: 10px;
  }
`;
export const StyledTable = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Thead = styled.thead`
  position:sticky;
  top:0;
  z-index:5;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  transition:.3s;

  &:hover{
      background:${colors.hover};
  }
`;

export const Th = styled.th`
  background: #F78926;
  color: white;
  padding:14px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
    
  }
`;

export const Td = styled.td`
  padding:10px 15px;
  border-bottom:1px solid ${colors.border};
  white-space:nowrap;
  font-size:14px;
  color:${colors.text};
  font-weight: 400;
`;

export const EmployeeCell = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
`;


export const EmployeeInfo = styled.div`
  display:flex;
  flex-direction:column;
`;

export const EmployeeName = styled.div`
  font-size:15px;
  font-weight:500;
  color:${colors.text};
`;

export const EmployeeEmail = styled.div`
  font-size:12px;
  color:${colors.secondaryText};
  margin-top:3px;
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 80px;
  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${({ $status }) =>
    $status === "Present" &&
    css`
      color: #15803d;
      background: #dcfce7;
    `}

  ${({ $status }) =>
    $status === "Absent" &&
    css`
      color: #dc2626;
      background: #fee2e2;
    `}

  ${({ $status }) =>
    $status === "On Leave" &&
    css`
      color: #d97706;
      background: #fef3c7;
    `}

  ${({ $status }) =>
    $status === "Half Day" &&
    css`
      color: #2563eb;
      background: #dbeafe;
    `}

  ${({ $status }) =>
    $status === "N/A" &&
    css`
      color: #6b7280;
      background: #f3f4f6;
    `}
`;
export const ActionWrapper = styled.div`
  display:flex;
  gap:8px;
`;

export const IconButton = styled.button`
  width:34px;
  height:34px;
  border-radius:8px;
  border:1px solid ${colors.border};
  background:white;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:.25s;

  &:hover{
      background:#f5f5f5;
  }

  svg{
      font-size:15px;
  }
`;

export const EmptyState = styled.div`
  text-align:center;
  padding:50px;
  color:#888;
`;

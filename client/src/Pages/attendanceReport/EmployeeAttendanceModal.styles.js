import styled from "styled-components";

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  max-width: 95%;
  height: 100%;
  background: #f9fafb;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.25);
  transform: translateX(${({ isOpen }) => (isOpen ? "0%" : "100%")});
  transition: transform 0.4s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e5e7eb;
  border-radius: 8px 0 0 8px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #111827;
  }
`;

export const CloseIcon = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;

  &:hover {
    color: #dc2626;
  }
`;

export const ModalBody = styled.div`
  padding: 24px 20px;
  overflow-y: auto;
  flex: 1;
`;
export const EmployeeInfo = styled.div`
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 6px solid #3b82f6; /* blue accent on the left */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  }

  p {
    margin: 8px 0;
    font-size: 1rem;
    color: #374151;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e0f2fe; /* subtle hover effect per line */
      border-radius: 8px;
      padding: 4px 8px;
    }
  }
`;

export const Label = styled.strong`
  color: #1e40af; /* darker blue for emphasis */
  font-weight: 600;
  font-size: 0.95rem;
`;

export const Value = styled.span`
  color: #111827;
  font-weight: 500;
  font-size: 0.95rem;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background: #ffffff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0,0,0,0.05);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px; 

  th {
    text-align: left;
    padding: 12px 10px;
    color: #6b7280;
    font-weight: 600;
    font-size: 0.95rem;
  }

  td {
    padding: 12px 10px;
    color: #111827;
    font-size: 0.95rem;
    background: #f9fafb;
    border-radius: 6px;
  }
`;

export const LopTd = styled.td`
  color: ${({ lop }) => (lop > 0 ? "#b91c1c" : "#111827")};
  font-weight: ${({ lop }) => (lop > 0 ? 700 : 500)};
`;

export const Tr = styled.tr`
  transition: all 0.2s ease;

  td {
    color: ${({ lop }) => (lop > 0 ? "#b91c1c" : "#111827")};
    background: ${({ lop }) => (lop > 0 ? "#fff1f2" : "transparent")};
    font-weight: ${({ lop }) => (lop > 0 ? 600 : 500)};
    transition: all 0.2s ease;
  }

  &:hover td {
      background: ${({ lop }) => (lop > 0 ? "#ffe4e6" : "#f9fafb")};
  }
`;


export const TotalRow = styled.tr`
  font-weight: bold;
  background-color: #e0e7ff;

  td {
    padding: 14px 10px;
    font-size: 0.95rem;
    color: #1e3a8a;
    border-radius: 6px;
  }
`;

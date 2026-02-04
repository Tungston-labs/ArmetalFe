import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  width: 750px;
  max-width: 95%;
  max-height: 90vh;
  background: #f9fafb;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleIn 0.3s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
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


export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;

  th {
    text-align: left;
    padding: 14px 12px;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    background-color: #304EB0;

  }

  td {
    padding: 10px 12px;
    font-size: 0.95rem;
    background: #ffffff;
    border-top: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
  }
`;


export const LopTd = styled.td`
  color: ${({ $lop }) => ($lop > 0 ? "#b91c1c" : "#111827")};
  font-weight: ${({ $lop }) => ($lop > 0 ? 700 : 500)};
`;

export const Tr = styled.tr`
  transition: all 0.25s ease;

  /* Row background when LOP > 0 */
  td {
    background: ${({ $lop }) => ($lop > 0 ? "#fee2e2" : "#ffffff")};
  }

  &:hover td {
    background: ${({ $lop }) => ($lop > 0 ? "#fecaca" : "#f8fafc")};
    transform: scale(1.002);
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
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const SummaryCard = styled.div`
  background: ${({ green, yellow, red }) =>
    green
      ? "#ecfdf5"
      : yellow
      ? "#fffbeb"
      : red
      ? "#fee2e2"
      : "#eff6ff"};
  border-left: 6px solid
    ${({ green, yellow, red }) =>
      green
        ? "#10b981"
        : yellow
        ? "#f59e0b"
        : red
        ? "#dc2626"
        : "#3b82f6"};
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
`;

export const CardValue = styled.h3`
  font-size: 26px;
  font-weight: 800;
  color: #111827;
`;
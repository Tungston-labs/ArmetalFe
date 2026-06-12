import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

export const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const SummaryValue = styled.h3`
  margin: 0;
  font-size: 28px;
  color: #2563eb;
`;

export const SummaryLabel = styled.p`
  margin-top: 8px;
  color: #6b7280;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  background: #304EB0;
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  color: white;
`;

export const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

export const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  background: ${({ status }) => {
    switch (status) {
      case "Approved":
        return "#dcfce7";
      case "Pending":
        return "#fef3c7";
      case "Rejected":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case "Approved":
        return "#15803d";
      case "Pending":
        return "#b45309";
      case "Rejected":
        return "#dc2626";
      default:
        return "#374151";
    }
  }};
`;
export const MonthInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;
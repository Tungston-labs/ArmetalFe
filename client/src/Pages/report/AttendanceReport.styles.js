import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
  /* background: #f8fafc; */
  min-height: 100vh;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MonthInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  min-width: 180px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 75vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

export const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  min-width: 100%;
  width: max-content;
`;

export const Th = styled.th`
  padding: 14px 12px;
  background: #304EB0;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  border-bottom: 1px solid #dbeafe;


  ${({ $sticky, left }) =>
    $sticky &&
    `
      position: sticky;
      left: ${left};
      z-index: 30;
      min-width: 180px;
      background: #304EB0;
    `}
`;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: #f9fafb;
  }

  &:hover td {
    background: #eff6ff;
  }
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
  font-size: 13px;
  white-space: nowrap;
  background: inherit;

  ${({ $sticky, left }) =>
    $sticky &&
    `
      position: sticky;
      left: ${left};
      z-index: 20;
      min-width: 180px;
      text-align: left;
      font-weight: 500;
      background: white;
       text-align: center;
    `}
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;

  background: ${({ status }) => {
    switch (status) {
      case "P":
        return "#dcfce7";
      case "A":
        return "#fee2e2";
      case "L":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case "P":
        return "#15803d";
      case "A":
        return "#dc2626";
      case "L":
        return "#d97706";
      default:
        return "#6b7280";
    }
  }};
`;
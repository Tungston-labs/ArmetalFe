import styled from "styled-components";

// Overlay
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 16px;
`;

// Modal Container
export const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 950px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
`;

// Header with Close Button
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #1034ad;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #333;
`;

// Top Cards
export const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

export const Card = styled.div`
  flex: 1;
  min-width: 140px;
  background: #f5f8ff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(16, 52, 173, 0.1);
`;

export const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

export const CardValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #1034ad;
`;

// Scrollable Table
export const AttendanceTableWrapper = styled.div`
  overflow-y: auto;
  max-height: 400px;
`;

export const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  position: sticky;
  top: 0;
  background: #f9f9f9;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: left;
  font-weight: 600;
    text-align: center;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f7f9fc;
  }
  &:hover {
    background: #e6f0ff;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
    text-align: center;
`;


export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case "present":
        return "#28a745"; 
      case "leave":
        return "#fd7e14"; 
      case "holiday":
        return "#17a2b8"; 
      case "absent":
      default:
        return "#dc3545";
    }
  }};
`;

import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f5f6fa;
`;

export const Card = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 14px;
    cursor: pointer;
  }
`;

export const DonutWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DonutText = styled.div`
  position: absolute;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }

  p {
    font-size: 12px;
    color: #555;
  }
`;

export const Legend = styled.div`
  margin-top: 15px;
`;

export const LegendItem = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;

  &::before {
    content: "●";
    color: ${(props) => props.color};
    margin-right: 8px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

export const TableHeader = styled.th`
  text-align: left;
  font-size: 14px;
  padding: 8px 0;
  color: #555;
`;

export const TableCell = styled.td`
  font-size: 14px;
  padding: 8px 0;
`;

export const HolidaysList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HolidayItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fbff;
  padding: 12px;
  border-radius: 12px;
`;

export const HolidayIcon = styled.div`
  font-size: 24px;
`;

export const HolidayInfo = styled.div`
  flex-grow: 1;
  margin-left: 10px;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #777;
  }
`;

export const HolidayDate = styled.div`
  font-size: 12px;
  color: #444;
  font-weight: 500;
`;

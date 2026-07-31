import styled from "styled-components";
 export const Container = styled.div`
 width: 100%;
  min-width: 0;
 `;

export const CalendarContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  width:100%;
  box-sizing:border-box;

`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    font-size: 20px;
    font-weight: 700;

    span {
      font-size: 18px;
      color: #4463eb;
      margin-left: 5px;
    }
  }

  .nav button {
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 3px 8px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;

  .week {
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 600;
  }
`;

export const DayCell = styled.div`
  text-align: center;
  padding: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: ${({ isHoliday }) => (isHoliday ? "#ff4a4a" : "#333")};
  background: ${({ isSelected }) => (isSelected ? "#4357e3" : "transparent")};
  color: ${({ isSelected }) => (isSelected ? "#fff" : "")};
  border: ${({ isSelected }) => (isSelected ? "none" : "")};
`;

export const HolidayMark = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #ff4a4a;
`;

export const UpcomingWrapper = styled.div`
  margin-top: 20px;

  .titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

  }
  `;

export const HolidayItem = styled.div`
  background: #fff;
  padding: 15px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #eee;
  margin-top: 12px;
  gap: 15px;

  .info {
    flex: 1;

    h4 {
      font-size: 15px;
      margin: 0;
      font-weight: 600;
    }

    p {
      margin: 2px 0;
      color: #777;
      font-size: 13px;
    }
  }

  .date {
    font-size: 14px;
    color: #444;
  }
`;

export const HolidayIcon = styled.div`
  width: 42px;
  height: 42px;
  background: #3b54e3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 10px;
`;

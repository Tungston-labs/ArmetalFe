import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  max-width: 3840px;
  margin: 0 auto;
  padding: 1rem;
`;

export const LeftSection = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
`;

export const RightSection = styled.div`
  flex: 1 1 35%;
  min-width: 300px;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1rem, 1.5vw, 2rem);
  margin: 1.5rem 0 1rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3rem;
`;

export const DepartmentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

export const DepartmentCard = styled.div`
  flex: 0 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 1rem;
  display: flex;
  align-items: center;
  min-width: 250px;
  position: relative;

  h3 {
    font-size: clamp(0.9rem, 1.2vw, 1.5rem);
    margin: 0;
  }
`;

export const InitialCircle = styled.div`
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-weight: bold;
  color: #3352BA;
  margin-right: 1rem;
`;

export const DeptInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0;
  }
`;

export const DeptHead = styled.p`
  margin: 0;
  font-size: clamp(0.7rem, 1vw, 1rem);
  color: #666;
`;

export const DeptCount = styled.div`
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  font-weight: bold;
`;

export const CalendarWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  h3 {
    font-size: clamp(1rem, 1.5vw, 1.5rem);
    font-weight: bold;
  }

  span {
    color: #3352BA;
    margin-left: 0.3rem;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

export const CalendarDay = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: clamp(0.7rem, 1vw, 1rem);
  background: ${({ isToday, isHeader, isHoliday }) =>
    isHeader ? "transparent" :
    isToday ? "#3352BA" :
    isHoliday ? "#FF6B6B" :
    "#F9F9F9"};
  color: ${({ isToday, isHeader, isHoliday }) =>
    isToday ? "#fff" : isHoliday ? "#fff" : "#000"};
  font-weight: ${({ isToday, isHeader }) => (isToday || isHeader ? "bold" : "normal")};
  cursor: ${({ isHeader }) => (isHeader ? "default" : "pointer")};
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

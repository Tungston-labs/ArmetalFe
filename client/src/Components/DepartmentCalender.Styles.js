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
  font-size: clamp(1rem, 1.2vw, 2rem);
  margin: 1.5rem 0 1rem;
  font-weight: bold;
  border-bottom: 1px solid blue;
  padding-bottom: 0.3rem;
font-family: Satoshi;
font-weight: 700;
font-style: Bold;
// font-size: 26px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

  display: flex;             
  align-items: center;
  justify-content: space-between;

  svg {
    color: #3352ba;   /* default color */
    transition: color 0.3s ease;
    cursor: pointer;
  }

  svg:hover {
    color: blue;   
  }
`;


export const DepartmentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
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
  // border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 1rem;
  display: flex;
  align-items: center;
  min-width: 250px;
  min-height: 150px;
  position: relative;
`;

export const InitialCircle = styled.div`
  font-size: clamp(2rem, 5vw, 7rem);
  font-weight: bold;
  color: #B5E2FF;
  margin-right: 1rem;
  font-family: Raleway;
font-weight: 700;
font-style: Bold;
// font-size: 110px;
leading-trim: CAP_HEIGHT;
line-height: 100%;
letter-spacing: 0%;

`;

export const DeptInfo = styled.div`
  flex: 1;
`;

export const DeptHead = styled.p`
  margin: 0;
  font-size: clamp(0.7rem, 1vw, 1rem);
  color: #666;
`;

export const DeptCount = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
`;


export const CardIcon = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 1.25rem; // adjust icon size
  color: #3352ba;     // or any color you like
  cursor: pointer;

  &:hover {
    color: #1d3aa8; // optional hover effect
  }
`;

export const CalendarWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const NavArrow = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
  color: #3352BA;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
`;

export const CalendarDay = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: clamp(0.7rem, 1vw, 1rem);
  background: ${({ isToday }) => (isToday ? "#3352BA" : "transparent")};
  color: ${({ isToday, isSunday }) =>
    isToday ? "#fff" : isSunday ? "red" : "#000"};
  font-weight: ${({ isToday }) => (isToday ? "bold" : "normal")};
  cursor: ${({ isHeader }) => (isHeader ? "default" : "pointer")};
  border: ${({ isSunday }) => (isSunday ? "1px solid red" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
`;
// Employee presence donut + contract expiry
export const PresenceWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const DonutChart = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  text-align: center;

  .circle {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    border-radius: 50%;
    background: conic-gradient(
      blue 0% 70%, 
      red 70% 100%
    );
  }
`;

export const PresenceText = styled.div`
  margin-top: 1rem;
  h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;

// Employee contract expiry
export const EmployeeExpiryWrapper = styled.div`
  flex: 2;
  background: #fff;
  border-radius: 7px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

export const EmployeeRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 80px 1.5fr;
  gap: 0.5rem;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
`;

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

export const EmpName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

export const EmpId = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

export const EmpEmail = styled.div`
  font-size: 0.8rem;
  color: #555;
`;

// Holiday list
export const HolidayList = styled.div`
  margin-top: 1rem;
`;

export const HolidayItem = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const HolidayIcon = styled.div`
  border-radius: 12px;
  background: #3352ba;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  img {
    width: 26px;  // Adjust size as needed
    height: 26px;
  }
`;


export const HolidayInfo = styled.div`
  flex: 1;
  p {
    font-size: 0.75rem;
    color: #666;
    margin: 0;
  }
`;

export const HolidayTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

export const HolidayDate = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
`;
export const ChartConatiner = styled.div`
background:#fff;
`;

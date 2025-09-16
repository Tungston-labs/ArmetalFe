import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  // background: #f8f9fc;
  padding: 20px;
`;

export const Section = styled.div`
  // background: #fff;
  border-radius: 12px;
  padding: 20px;
  // box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const AttendanceHeader = styled(Header)``;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #3352BA;
  font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const RightArrow = styled.div`
  cursor: pointer;
  color: #2d63f3;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskCard = styled.div`
  display: flex;
  // align-items: flex-start;
  padding: 14px;
  border-radius: 8px;
  background: #fff;
  // border-left: 4px solid #2d63f3;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
`;
export const Divider = styled.div`
  width: 5px;
  background-color: #3352BA; /* light gray */
  margin: 0 12px;
  height: auto;
align-self: stretch;

`;


export const TaskLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const TaskDate = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #2c2c2c;
  white-space: nowrap; /* ensures it stays in one line */
`;

export const TaskTime = styled.div`
  font-size: 13px;
  color: #777;
`;

export const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TaskRole = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

export const TaskDescription = styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.4;
`;

export const Table = styled.table`
  width: 100%;
  border-spacing: 0 12px; /* horizontal = 0, vertical = 12px */
  text-align: center;
  background-color: white;
  /* Remove border-collapse */
`;


export const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

export const TableCell = styled.td`
  padding: 12px 10px;
  text-align: center;
  font-size: 14px;
  color: #333;
  
`;

export const TimeIn = styled.span`
  color: green;
  font-weight: 600; 
   text-align: center;
`;

export const TimeOut = styled.span`
  color: red;
  font-weight: 600;
    text-align: center;
`;


import styled from "styled-components";
import NoAttendance from "../../assets/puchtime.svg"; 

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  // background: #f8f9fc;
  // padding: 20px;
`;

export const Section = styled.div`
  // background: #fff;
  border-radius: 12px;
  padding: 10px;
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
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-style: bold;
  line-height: 1;
  letter-spacing: 0;
  color: #3352BA;
  font-size: 20px; /* default */

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 0.5rem;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 0.9rem;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1.5rem;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 1.8rem;
  }
     @media (min-width: 2101px) {
    font-size: 2rem;
  }
  
`;


export const RightArrow = styled.div`
  cursor: pointer;
  color: #2d63f3;
  font-size: 24px; /* default size */

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 18px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 20px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 24px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 32px;
  }
`;


export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const Wrapper = styled.div`
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px; 
`;

export const Image = styled.img`
  width: 200px;
  height: auto;
   @media (min-width: 2200px) {
    width:400px
  }
`

export const Message = styled.p`
  margin-top: 10px;
  color: #3352ba;
  font-size: 16px;
  font-weight: 500;
   @media (min-width: 2200px) {
   font-size: 32px;
  font-weight: 500;
   }
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
export const AttendanceSection = styled.div`
  display: flex;
  flex-direction: column;   
  align-items: center;      
  justify-content: center;  
  gap: 10px;                
  padding: 20px;
  background: white;
  border-radius: 12px;

  @media (min-width: 2200px) {
   padding: 20px;
  }
`;

export const AttendanceImage = styled.img`
  width: 200px;
  height:190px;
   @media (min-width: 2200px) {
    width:400px;
    height:340px;
  }
`;

export const Text = styled.span`
  color: #3352ba;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  @media (min-width: 2200px) {
   font-size: 32px;
  font-weight: 500;
  }
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
  padding-left:10px;
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
  text-align: center;
  font-size: 14px;
  color: #333;
   @media (min-width: 2200px) {
    font-size: 34px;
    padding-top: 20px;
  }
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


// src/pages/Dashboard.styles.js
import styled from "styled-components";
import Calendar from 'react-calendar';

export const Container = styled.div`
  padding: 2rem;
  // max-width: 1200px;
  margin: auto;
  background: #F4F4F4;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  background: #f7f9fc;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  gap: 1rem;
`;

export const LeftIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
`;
export const VerticalBar = styled.div`
  width: 4px;
  background-color: #3352BA;  /* Blue color vertical bar */
  border-radius: 2px;
  height: 80%; /* Adjust height as needed */
`;

export const CardContent = styled.div`
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  display:flex;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  // margin-bottom: rem;

  h3 {
    margin: 0;
    font-size:1.2rem;
    font-family:"satoshi"
  }
    span{
    font-size:1.8rem;
    }
`;

export const CardList = styled.ul`
  list-style: none;
  padding: 0.9px;
  font-size: 0.9rem;
  font-family:"satoshi"
  li {
    margin-bottom: 0.5rem;
    
  }
`;
export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;
export const Icon = styled.div`
  position: absolute;
  bottom: 0rem;
  right: 1rem;
  color: #3352BA;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #1a2a7a; /* Darker blue on hover */
    transform: scale(1.2); /* Slightly enlarge */
  }
`;


// export const Icon = styled.div`
//   position: absolute;
//   bottom: 1rem;
//   right: 1rem;
//   color: #003366;
//   font-size: 1.2rem;
//   cursor: pointer;
// `;

export const DepartmentGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;

  /* Optional: Hide scrollbar in a nice way */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;


export const DepartmentCard = styled.div`
  flex: 1;
  min-width: 280px;
  background: #fff;
  border: 1px solid #ddd;
//   border-left: 10px solid #cce0ff;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;

  h4 {
    margin: 0;
    font-size:1.2rem;
    font-family:"raleway"
  }

  p {
    margin: 4px 0;
    font-size: 1rem;
      font-family:"raleway"
  }

  strong {
    font-size: 1rem;
    color: #003366;
      font-family:"raleway"
  }
`;

export const Label = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: #B5E2FF;
  font-family:"raleway";
`;

export const Heading = styled.h3`
  // margin-top: 2rem;
  font-weight: bold;
  font-size:1.6rem;
  font-family:"satoshi";
`;

export const PresenceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1rem;
`;

export const ChartContainer = styled.div`
  flex: 1;
  min-width: 280px;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
      font-family:"satoshi"
  }

  p {
    font-weight: bold;
      font-family:"satoshi"
  }
`;

export const SubText = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  font-family:"raleway"
`;

export const ContractList = styled.div`
  flex: 2;
  min-width: 300px;
  background:white;
  padding:10px;
`;

export const ContractItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.1rem 0;
  // border-bottom: 1px solid #eee;
font-family:"satoshi";
  span {
    flex: 1;
    font-size: 0.85rem;
  }
`;

export const Avatar = styled.div`
  font-size: 1.5rem;
  color: #999;
`;
export const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const LeftContent = styled.div`
  flex: 2;
  min-width: 300px;
`;

export const RightPanel = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const VisaCard = styled(Card)`
  // flex: 1;
  min-width: 280px;
  background: #f7f9fc;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;


export const CalendarCard = styled(Card)`
  background: #F4F4F4;
  
// margin-top:1rem;
//   h3 {
//     font-size: 1.2rem;
//     font-weight: 600;
//   }

//   strong {
//     color: #003366;
//   }
`;

export const HolidayCard = styled(Card)`
  background: #f4f4f4;
  margin-top: -10%;
  flex-direction: column; /* 👈 Ensure items stack vertically */
  align-items: stretch;
`;

export const HolidayItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.4rem 1rem;
//   margin-top: 0.5rem;
  background: white;

  div {
    display: flex;
    flex-direction: column;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: #777;
  }

  span {
    font-size: 0.9rem;
    color: #333;
    white-space: nowrap;
  }
`;

export const StyledCalendar = styled(Calendar)`
  width: 100%;
  
//   border-radius: 10px;
//   margin-top: 10px;

  /* Customize the calendar styles if you want */
  .react-calendar__tile {
    border-radius: 6px;
  }
  .react-calendar__tile--active {
    background: #003366;
    color: white;
  }
  /* Add any more styles you want here */
`;
// export const CalendarWrapper = styled.div`
//   width: 100%;
//   border-radius: 10px;
// //   margin-top: 10px;

//   .react-calendar {
//     width: 100%;
//     border: none;
//     font-family: Arial, sans-serif;
//     background-color: #fff;
//     border-radius: 10px;
//     font-size: 0.75rem; /* 🔽 smaller text reduces row height */
//   }

//   .react-calendar__tile {
//     border-radius: 6px;
//     padding: 1px 1px;  /* 🔽 reduce padding */
//     height: 25px;      /* 🔽 smaller height per day */
//     line-height: 1;
//   }

//   .react-calendar__tile--active {
//     background: #003366;
//     color: white;
//   }

//   .react-calendar__tile--now {
//     background: #cce0ff;
//   }

//   .react-calendar__month-view__weekdays {
//     text-align: center;
//     text-transform: uppercase;
//     font-weight: 600;
//     font-size: 0.7rem; /* 🔽 smaller weekdays */
//     color: #666;
//     padding: 4px 0;
//   }
// `;

export const CalendarWrapper = styled.div`
  .rmdp-wrapper {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1px;
    background: #fff;
    // color:#3352BA;
  }

  .rmdp-calendar {
    width: 100%;
  }

  .rmdp-day {
    border-radius: 6px;
    margin: 2px;
    padding: 3px;
    font-size: 12px;
    transition: 0.3s ease;
  }

  .rmdp-day.rmdp-today {
    // background-color: #cce0ff;
    color: #003366;
  }

//   .rmdp-day.rmdp-selected {
//     background-color: #003366;
//     color: #fff;
//   }

  .rmdp-week-day {
    font-weight: bold;
    font-size: 0.7rem;
    color: #666;
    text-align: center;
  }

  .rmdp-header {
    justify-content: center;
    font-weight: bold;
    color: #3352BA;
    margin-bottom: 10px;
  }

  .rmdp-arrow {
    color: #003366;
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
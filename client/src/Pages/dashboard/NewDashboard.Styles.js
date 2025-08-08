// src/pages/Dashboard.styles.js
import styled from "styled-components";
import Calendar from 'react-calendar';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  background: #F4F4F4;
  min-height: 100vh;
   @media (min-width: 1440px) {
    max-width: 1500px;
    padding: 2.5rem;
  }

  @media (min-width: 1920px) {
    max-width: 1700px;
    padding: 3rem;
  }
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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



// DEPARTMENT GRID
export const DepartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  /* Optional: Custom horizontal scroll for overflow (for legacy flex fallback) */
  overflow-x: auto;
  padding-bottom: 1rem;

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


// DEPARTMENT CARD
export const DepartmentCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;

  h4 {
    margin: 0;
    font-size: 1.2rem;
    font-family: "raleway";

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  p {
    margin: 4px 0;
    font-size: 1rem;
    font-family: "raleway";

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  strong {
    font-size: 1rem;
    color: #003366;
    font-family: "raleway";

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// LABEL (Big Number Text)
export const Label = styled.div`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: bold;
  color: #B5E2FF;
  font-family: "raleway";
`;


// SECTION HEADING
export const Heading = styled.h3`
  font-weight: bold;
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-family: "satoshi";
`;

export const PresenceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1rem;
  

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;
export const ChartContainer = styled.div`
  flex: 1;
  min-width: 280px;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-sizing: border-box;

  h1 {
    font-size: clamp(1.8rem, 4vw, 3rem);
    margin-bottom: 0.5rem;
    font-family: "satoshi";
  }

  p {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: bold;
    font-family: "satoshi";
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;
export const SubText = styled.div`
  margin-top: 2rem;
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  font-family: "raleway";
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  text-align: center;
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
    @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
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
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  margin: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
  }

  @media (min-width: 1440px) {
    max-width: 600px;
  }

  @media (min-width: 1920px) {
    max-width: 700px;
  }
`;

export const HolidayCard = styled(Card)`
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  width: 100%;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 1440px) {
    padding: 1rem;
  }
`;

export const HolidayItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  background: white;
  transition: all 0.3s ease;
margin-top:-0px;
  div {
    display: flex;
    flex-direction: column;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    font-family: "Satoshi", sans-serif;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: #777;
    font-family: "Raleway", sans-serif;
  }

  span {
    font-size: 0.9rem;
    color: #333;
    white-space: nowrap;
    font-family: "Satoshi", sans-serif;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.8rem;

    span {
      align-self: flex-end;
      font-size: 0.85rem;
    }

    h4 {
      font-size: 0.95rem;
    }

    p {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 1440px) {
    padding: 0.5rem;
    width:90%;
    h4 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.9rem;
    }

    span {
      font-size: 1rem;
    }
  }
`;


export const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 100%;
  font-family: 'Raleway', sans-serif;

  .react-calendar {
    width: 100%;
    border: none;
    background: #fff;
    border-radius: 10px;
    padding: 1rem;
  }

  .react-calendar__tile {
    border-radius: 6px;
    padding: 10px 6px;
    font-size: 0.9rem;
    transition: background 0.3s ease;
  }

  .react-calendar__tile--active {
    background: #003366;
    color: white;
  }

  .react-calendar__tile:enabled:hover {
    background: #e6f0ff;
    cursor: pointer;
  }

  .react-calendar__navigation {
    margin-bottom: 1rem;
    button {
      font-size: 1rem;
      color: #003366;
    }
  }

  /* Weekday & Day Headers */
  .react-calendar__month-view__weekdays {
    text-align: center;
    font-weight: 600;
    font-size: 0.8rem;
    color: #666;
  }

  /* Responsiveness */
  @media (max-width: 768px) {
    .react-calendar__tile {
      padding: 8px 4px;
      font-size: 0.75rem;
    }

    .react-calendar__navigation button {
      font-size: 0.9rem;
    }

    .react-calendar {
      padding: 0.5rem;
    }
  }

  @media (min-width: 1440px) {
    .react-calendar__tile {
      padding: 12px 8px;
      font-size: 1rem;
    }

    .react-calendar__navigation button {
      font-size: 1.1rem;
    }
  }
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
    padding: 4px;
    background: #fff;
  }

  .rmdp-calendar {
    width: 100%;
    font-size: 14px;
  }

  .rmdp-day {
    border-radius: 6px;
    margin: 2px;
    padding: 6px;
    font-size: 0.8rem;
    transition: 0.3s ease;
  }

  .rmdp-day.rmdp-today {
    color: #003366;
  }

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
    font-size: 1rem;
  }

  .rmdp-arrow {
    color: #003366;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .rmdp-calendar {
      font-size: 12px;
    }

    .rmdp-day {
      padding: 4px;
      font-size: 0.7rem;
    }

    .rmdp-header {
      font-size: 0.9rem;
    }
  }

  /* Large screen enhancements */
  @media (min-width: 1440px) {
    .rmdp-calendar {
      font-size: 15px;
    }

    .rmdp-day {
      font-size: 0.9rem;
      padding: 7px;
    }

    .rmdp-header {
      font-size: 1.1rem;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
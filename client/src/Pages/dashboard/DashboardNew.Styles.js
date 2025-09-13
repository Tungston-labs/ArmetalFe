import styled from "styled-components";

export const Container = styled.div`
  // width: 100%;
  // min-height: 100vh; 
  padding: 3rem;
  box-sizing: border-box;
  background: #f4f4f4;
`;

export const CardGrid = styled.div`
  display: grid;
  gap: 1rem;

  /* Default (desktop) */
  grid-template-columns: repeat(3, 1fr);

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


export const Card = styled.div`
  background: white;
  border-radius: 10px;
  display: flex;
  // align-items: flex-start;
  padding: 1rem;
  position: relative;
    font-family:"satoshi";
`;

export const LeftIcon = styled.div`
  flex-shrink: 0;
`;

export const VerticalBar = styled.div`
  width: clamp(2px, 0.5vw, 6px); /* auto-scales between 2px–6px */
  background: #3352BA;
  margin: 0 clamp(0.5rem, 2vw, 1.5rem);

  /* Adjust height if it's meant to fill parent */
  height: 100%;

  @media (max-width: 768px) {
    width: clamp(2px, 1vw, 4px);
    margin: 0 0.5rem;
  }

  @media (max-width: 480px) {
    width: 2px;
    margin: 0 0.3rem;
  }
`;


export const CardContent = styled.div`
  flex: 1;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;

`;
export const CardList = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
  font-size: 0.9rem;

  li {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Desktop: 3 columns */
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    align-items: center;
    text-align: left;
  }

  /* Tablet: 2 columns */
  @media (max-width: 1024px) {
    li {
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 8px;
    }
  }

  /* Mobile: 1 column */
  @media (max-width: 600px) {
    li {
      grid-template-columns: 1fr;
      grid-row-gap: 6px;
    }
  }
`;



export const Icon = styled.div`
  position: absolute;
  right: 10px;
  bottom: 1px;
  cursor: pointer;
  color: blue;
  transition: transform 0.3s ease, color 0.3s ease;
font-size:20px;
  &:hover {
    transform: scale(1.3); /* Zoom in */
    color: darkblue; /* Optional color change */
  }
`;




export const DepartmentGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 1.5rem;
width:66%;
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
  min-height: 150px;
  min-width: 250px;
  max-width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* ✅ allows wrapping on smaller screens */
  box-sizing: border-box;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-family: "Raleway", sans-serif;
    word-break: break-word;
  }

  p {
    margin: 4px 0;
    font-size: 1rem;
    font-family: "Raleway", sans-serif;
    word-break: break-word;
  }

  strong {
    font-size: 1rem;
    color: #003366;
    font-family: "Raleway", sans-serif;
  }

  /* ✅ Responsive behavior */
  @media (max-width: 1024px) {
    min-width: 200px;
    padding: 0.8rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    min-width: 100%;
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    h4,
    p,
    strong {
      font-size: 0.9rem;
    }
  }
`;


export const Label = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #B5E2FF;
  font-family:"raleway";
`;

export const Heading = styled.h3`
   margin-top:1.5rem;
  font-weight: bold;
  font-size:1.8rem;
  font-family:"satoshi";
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 26px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;
export const DepartmentCalendarWrapper = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  align-items: flex-start;
  margin-bottom:3%;
`;

// export const DepartmentGrid = styled.div`
//   display: flex;
//   gap: 1rem;
//   flex-wrap: wrap;
//   width: 66%;
// `;

export const CalendarWrapper = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  min-width: 300px;
  margin-top: -50px;
  box-sizing: border-box;

  /* Ensure proper height scaling */
  width: 100%;
  max-width: 100%;
  overflow-x: auto;

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    padding: 0.9rem;
    margin-top: -40px;
  }

  @media (max-width: 992px) {
    padding: 0.8rem;
    margin-top: -30px;
  }

  @media (max-width: 768px) {
    padding: 0.7rem;
    margin-top: -20px;
    min-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-top: -10px;
    min-width: 100%;
  }
`;

export const PresenceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 3rem;
  width:100%;

`;

export const ChartContainer = styled.div`
  flex: 1;
  min-width: 200px;
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
  min-width: 200px;
  background: white;
  padding: 10px;

  /* Tablet */
  @media (max-width: 1024px) {
    flex: 1;
    min-width: 250px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex: 1 1 100%; /* takes full width */
    min-width: 100%;
  }
`;


export const ContractItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 1fr 1fr; /* avatar | name | emp_id | date */
  align-items: center;
  padding: 0.3rem 0;
  font-family: "satoshi";

  p, small, span {
    margin: 0;
    white-space: nowrap; /* prevent awkward wrapping */
    overflow: hidden;
    text-overflow: ellipsis;
  }

  small {
    font-size: 0.85rem;
    color: #666;
    font-family: "satoshi";
  }

  /* Tablet screens */
  @media (max-width: 1024px) {
    grid-template-columns: 40px 1fr 1fr; /* Hide date */
    
    span:last-child {
      display: none; /* Hide date column */
    }
  }

  /* Mobile screens */
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr; /* Only avatar + name */

    small, span {
      display: none; /* Hide emp_id and date */
    }
  }
`;



export const Avatar = styled.div`
  font-size: 1.5rem;
  color: #999;
`;
export const HolidayCard = styled(Card)`
  background: #f4f4f4;
  margin-top: -2%;
  flex-direction: column; 
  align-items: stretch;
  gap:5px;
`;

export const HolidayItem = styled.div`
  display: flex;
  width: 20rem;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  padding: 0.5rem 1rem;
  background: white;

  div {
    display: flex;
    flex-direction: column;
    max-width: 70%; /* limit width for text truncation */
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    white-space: nowrap;       /* single line */
    overflow: hidden;          /* hide overflow */
    text-overflow: ellipsis;   /* show "..." for long text */
    cursor: default;
  }

  /* Show full name on hover */
  // h4:hover {
  //   overflow: visible;
  //   white-space: normal;
  //   position: absolute;
  //   background: #fff;
  //   padding: 4px 8px;
  //   box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  //   z-index: 10;
  //   max-width: 300px; /* optional: limit hover width */
  // }

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

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top:-7%;
`;

export const UserMenuWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #3352BA;
`;

export const DropdownIcon = styled.div`
  font-size: 14px;
  color: #3352BA;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
  border-radius: 6px;
  overflow: hidden;
  min-width: 150px;
  z-index: 10;

  div {
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;

    &:hover {
      background: #f5f5f5;
    }
  }
    `;
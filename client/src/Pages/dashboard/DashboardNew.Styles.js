import styled from "styled-components";

export const Container = styled.div`
  // width: 100%;
  min-height: 100vh; /* Always at least the full viewport height */
  padding: 3rem;
  box-sizing: border-box;
  background: #f4f4f4;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Always 3 cards */
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  position: relative;
`;

export const LeftIcon = styled.div`
  flex-shrink: 0;
`;

export const VerticalBar = styled.div`
  width: 2px;
  background: #ddd;
  margin: 0 1rem;

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
  padding: 10px;
  margin: 0;
  font-size: 0.8rem;
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
  min-height:150px;
  min-width: 250px;
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
    font-size:1rem;
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
  font-size: 4rem;
  font-weight: bold;
  color: #B5E2FF;
  font-family:"raleway";
`;

export const Heading = styled.h3`
   margin-top: 1rem;
  font-weight: bold;
  font-size:1.8rem;
  font-family:"satoshi";
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
  margin-top:-50px;
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
export const HolidayCard = styled(Card)`
  background: #f4f4f4;
  margin-top: -1%;
  flex-direction: column; 
  align-items: stretch;
  gap:10px;
`;

export const HolidayItem = styled.div`
  display: flex;
  width:20rem;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
//   border-radius: 8px;
  padding: 0.5rem 1rem;
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
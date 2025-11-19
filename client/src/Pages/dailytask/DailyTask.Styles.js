// SchedulerStyles.js
import styled, { keyframes } from 'styled-components';

// --- Theme Variables ---
const PRIMARY_BLUE = '#3273dc';
const LIGHT_GRAY = '#f5f6fa';
const DARK_GRAY = '#333';
const WHITE = '#ffffff';
const WARNING_ORANGE = '#f39c12';
const TEXT_GRAY = '#555';

const BREAKPOINTS = {
  mobile: '600px',
  tablet: '992px',
};

// --- Main Layout Components ---

export const SchedulerContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${WHITE};
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const Input = styled.input`
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 250px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 100%;
  }
`;

export const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
  color: ${TEXT_GRAY};
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 100%;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

// --- Employee Sidebar ---
export const EmployeeSidebar = styled.div`
  width: 280px;
  background-color: ${WHITE};
  padding: 20px 0;
  overflow-y: auto;
  max-height: 500px;

  /* Scroll Design */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #c8d5e6ff;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #436ad6ff;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    color: ${DARK_GRAY};
    padding: 0 20px 10px 20px;
    margin-bottom: 10px;
    position: sticky;
    top: 0;
    background: ${WHITE};
    z-index: 10;
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 300px;
  }
`;

export const EmployeeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  margin: 10px 20px;
  border-radius: 12px;
  background-color: ${(props) => (props.isSelected ? '#eef3ff' : '#ffffff')};
  border: 1px solid ${(props) => (props.isSelected ? '#3273dc' : '#e6e6e6')};
  box-shadow: 0px 2px 5px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #f7f9fc;
    transform: translateY(-1px);
  }
`;

export const EmployeeDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
`;

export const EmployeeAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color:#172554;
  color: ${WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;

  /* Hide ONLY between 1024px and 1440px */
  @media (min-width: 1024px) and (max-width: 1440px) {
    display: none;
  }
`;


export const TaskIcon = styled.span`
  font-size: 20px;
  color: #aaa;
`;

// --- Date Picker Area ---

export const DatePickerArea = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px; /* Constrain width of date area */
  border-right: 1px solid #eee;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-width: 100%;
  }
`;

export const DateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 300;
  color: ${DARK_GRAY};
  margin-bottom: 20px;

  span {
    margin: 0 15px;
    font-weight: 600;
  }
`;


export const CalendarIcon = styled.div`
  width: 22px;
  height: 22px;
  background-image: url('/calendar.svg');
  background-size: cover;
  cursor: pointer;
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

export const DateGrid = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding-bottom: 10px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    overflow-x: auto;
    justify-content: initial;
  }
    @media (max-width: ${BREAKPOINTS.tablet}) {
  gap:1rem;
  }
`;
export const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 90px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
 background: ${(props) =>
  props.isSelected
    ? "linear-gradient(180deg, #172554 0%, #3352ba 100%)"
    : "#f3f1f1ff"};
color: ${(props) => (props.isSelected ? "#fff" : "#000")};
  color: ${props => (props.isSelected ? WHITE : TEXT_GRAY)};
  border: 1px solid ${props => (props.isSelected ? PRIMARY_BLUE : LIGHT_GRAY)};
 cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
   opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
  .month {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.9;
    margin-bottom: 4px;
  }

  .date {
    font-size: 22px;
    font-weight: 800;
    margin: 4px 0;

  }

  .day {
    margin-top: 4px;
    font-size: 11px;
    text-transform: uppercase;
    opacity: 0.9;
    text-decoration:underline;
  }
`;


// --- Task Area ---

export const TaskArea = styled.div`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;

  /* NEW: internal scrolling */
  max-height: 500px; 
  overflow-y: auto;

  /* Smooth scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #d9e3f4;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #436ad6;
    border-radius: 10px;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    color: ${DARK_GRAY};
    padding-bottom: 10px;
    margin-bottom: 10px;
    position: sticky;
    top: 0;
    background: ${WHITE};      /* Header stays visible while scrolling */
    z-index: 5;
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-height: 400px;
    max-height: none;
    overflow-y: visible;
  }
`;


export const EmptyState = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${LIGHT_GRAY};
  border-radius: 10px;
  padding: 40px 20px;
  margin-top: 5px;
`;

export const FolderIconContainer = styled.div`
  width: 200px;
  height: 150px;
  position: relative;
  margin-bottom: 20px;
`;

// Custom SVG-like Folder Icon
export const FolderIcon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    &::before {
        content: "";
        position: absolute;
        width: 180px;
        height: 100px;
        background: #e0e6ec; /* Light gray base */
        border-radius: 10px;
        transform: rotate(3deg);
        z-index: 1;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    &::after {
        content: "";
        position: absolute;
        top: 20px;
        left: 20px;
        width: 180px;
        height: 120px;
        background: ${PRIMARY_BLUE};
        border-radius: 10px;
        z-index: 2;
        border: 2px solid ${WHITE};
    }
`;

export const WarningIcon = styled.div`
  position: absolute;
  bottom: 0px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: ${WARNING_ORANGE};
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  z-index: 3;
  
  &::after {
    content: '!';
    font-size: 30px;
    font-weight: 900;
    color: ${WHITE};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -10%);
  }
`;

export const EmptyStateText = styled.p`
  color: ${TEXT_GRAY};
  font-size: 15px;
  max-width: 300px;
  line-height: 1.4;
`;
// Row for Date Header
// export const DateHeaderRow = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 22px;
//   font-weight: 300;
//   color: ${DARK_GRAY};
//   margin-bottom: 20px;

//   span {
//     margin: 0 15px;
//     font-weight: 600;
//   }
// `;

// Main flex panel for Employee + Task
export const MainPanel = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 1px;
  min-height: 300px;
  // border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
  }
`;

export const TaskCard = styled.div`
  width: 100%;
  background: #f6fbf7;
  border: 1px solid #d8e2dc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  .left {
    flex: 1;
  }

  .project {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .task {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .desc-title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  .description {
    font-size: 14px;
    line-height: 22px;
    color: #444;
  }

  .right {
    text-align: right;
    min-width: 100px;
  }

  .hours {
    font-size: 20px;
    font-weight: 600;
  }
  .hours span {
    font-size: 14px;
  }

  .time {
    position: absolute;
    right: 20px;
    bottom: 10px;
    font-size: 12px;
    color: #777;
  }
    
`;
export const DateHeaderRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin: 20px 0;
`;

export const Arrow = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #000;
  padding: 6px;
  
  &:hover {
    opacity: 0.6;
  }
`;
export const DateContent = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;

 .left-date {
    font-size: 3rem;
    font-weight: 700;
  }
    // .right-block {
    // display: flex;
    // flex-direction: column;
    // line-height: 1.1;

     .month {
 font-family: "Satoshi";
font-weight: 700;
font-style: Bold;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
text-align: center;

    }

    .day {
      font-family: "Satoshi";
font-weight: 400;
font-style: Regular;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

    }

  .calendar-wrapper {
    position: relative;
  }

  .calendar-popup {
    position: absolute;
    top: 40px;
    left: 0;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    z-index: 9999;
  }
`;


export const EmptyStateTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;






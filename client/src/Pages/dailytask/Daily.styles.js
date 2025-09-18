// DailyTask.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background:white;
   font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }

 
`;

export const RoleInfo = styled.div`
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
`;

export const DateSelector = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* distribute search and date */
  flex-wrap: wrap;
  font-size: 22px;

  input[type="date"] {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.9rem;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    margin: 0 0.5rem;
    cursor: pointer;
  }

  /* Left search + department wrapper */
  .search-department {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    min-width: 250px;
  }

  .calendar-header {
    display: flex;
    justify-content: center; 
    align-items: center; 
    gap: 1.5rem;
    flex: 2; /* center portion */
  }

  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .calendar-icon {
    color: #3250b5;
    font-size: 2rem;
  }

  .date-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .day {
    font-size: 3rem;
    font-weight: bold;
  }

  .month {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .weekday {
    font-size: 1.2rem;
    font-weight: 400;
  }

  @media (max-width: 1024px) {
    justify-content: center;
    gap: 2rem;

    .search-department {
      order: 2;
      width: 100%;
      flex-direction: row;
      gap: 1rem;
      justify-content: center;
    }

    .calendar-header {
      order: 1;
      width: 100%;
      justify-content: center;
      margin-top: 1rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    .search-department,
    .calendar-header {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }
`;



export const SearchInput = styled.input`
  padding: 0.6rem;
  font-size:0.9rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 250px;
  border-radius: 7px;
border: 1px solid #172554;
background: #FFF;
`;

export const Calendar = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center; 
  align-items: center; 
  gap: 4rem;
  width: 100%;
  height:84px;
  
`;

export const Day = styled.div`
  padding: 0.6rem 1rem;
   background: ${({ active }) => (active ? 'linear-gradient(180deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%)' : '#eee')};
  // background: linear-gradient(180deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  height:84px;


  strong {
    display: block;
  }
`;

export const EmployeesPanel = styled.div`
  width: 25%;
   background:white;

  padding: 0.1rem;
  border-radius: 12px;
  max-height: 60vh;
  overflow-y: auto;
  // box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top:20px;
  
`;
export const DepartmentDropdown = styled.select`
  padding: 0.6rem;
  font-size: 0.9rem;
  border-radius: 7px;
  border: 1px solid #172554;
  background: #fff;
  min-width: 250px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3352BA;
  }
`;


export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  background: ${({ active }) => (active ? '#E0E3EE' : '#fff')};
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 7px;
border: 0.2px ;
// box-shadow: 0 0 4.2px 0 rgba(0, 0, 0, 0.25);
box-shadow: 0px 0px 4.2px 0px rgba(0, 0, 0, 0.25);

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;
export const Head = styled.h2`
  font-size: 19px;
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-family: Raleway;
font-weight: 700;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
`;

export const TaskPanel = styled.div`
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-y: auto;
  max-height: 60vh;
 margin-top:-1rem;
 border-radius: 9px;
border: 0.2px solid #000;
background: #FFF;
box-shadow: 0 0 4.3px 0 rgba(0, 0, 0, 0.25);

`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #E1E8EC;
  padding: 2rem;
  border-radius: 11px;
height:30px;
  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }
`;

export const TaskCard = styled.div`
  background: #F2F5ED;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    margin: 0;
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 14px;
    color: #333;
  }
h5{
   margin: 0;
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 14px;
    color: #333;
}
  p {
    margin: 0;
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 13px;
    color: #444;
  }

  small {
    color: gray;
    font-size: 12px;
    font-family: 'Satoshi';
  }
`;


// export const Description = styled.p`

//   font-size: 0.9rem;
//   margin: 0.8rem 0;
// `;

export const TimeBox = styled.div`
  font-weight: bold;
`;
export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  // gap: 0.75rem;
  padding: 0.3rem ;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  // background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) { /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) { /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) { /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) { /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) { /* 8K */
    font-size: 4rem;
  }
`;

export const Subtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */
  
  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 2vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  // gap: 1rem;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;
export const Description = styled.p`
  font-size: 0.9rem;
  margin: 0.8rem 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  white-space: pre-wrap;
`;
export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;

  div {
    padding: 10px 15px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;
export const Heading = styled.h2`
font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 19px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;
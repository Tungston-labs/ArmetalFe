// DailyTask.styles.js
import styled from "styled-components";
import { FaRegCalendarAlt } from "react-icons/fa";

export const Container = styled.div`
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
  background: white;
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
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
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
    flex: 2;

    @media (min-width: 1025px) {
    margin-left: -10rem;

             }
  }

  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
 
  .calendar-icon {
    color: #3250b5;
    font-size: 2rem;
    cursor: pointer;
  }

  @media (min-width: 2000px) {
    .calendar-icon {
      font-size: 4rem;
    }
  }

  @media (min-width: 3500px) {
    .calendar-icon {
      font-size: 5rem;
    }
  }

  .date-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .day {
    font-size: 2rem;
    font-weight: bold;
  }

  .month {
    font-size: 1rem;
    font-weight: 700;
  }

  .weekday {
    font-size: 1rem;
    font-weight: 400;
  }

    @media (min-width: 769px)and (max-width: 1023px) {
     
    .day {
      font-size: 2.5rem;
    }
    .month {
      font-size: 1.2rem;
    }
    .weekday {
      font-size: 1.2rem;
    }
  }
    @media (min-width: 1024px)and (max-width: 1440px) {
    .day {
      font-size: 2rem;
    }
    .month {
      font-size: 1.1rem;
    }
    .weekday {
      font-size: 1rem;
    }
  }
  @media (min-width: 1441px)and (max-width: 1919px) {
    .day {
      font-size: 3rem;
    }
    .month {
      font-size: 1.5rem;
    }
    .weekday {
      font-size: 1.4rem;
    }
  }
 
  @media (min-width: 1920px)and (max-width: 2559px) {
    .day {
      font-size: 4rem;
    }
    .month {
      font-size: 2rem;
    }
    .weekday {
      font-size: 1.6rem;
    }
  }
  @media (min-width: 2560px) and (max-width: 3840px) {
    .day {
      font-size: 5rem;
    }
    .month {
      font-size: 3rem;
    }
    .weekday {
      font-size: 2.5rem;
    }
  }
  @media (min-width: 3841px) {
    .day {
      font-size: 4rem;
    }
    .month {
      font-size: 2rem;
    }
    .weekday {
      font-size: 1.6rem;
    }
  }
  @media (max-width: 1024px) {
    justify-content: center;
    gap: 2rem;
   flex-direction: column;
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
  font-size: 0.9rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 250px;
  border-radius: 7px;
  border: 1px solid #172554;
  background: #fff;

  @media (min-width: 2000px) {
    padding: 1.1rem;
    min-width: 350px;
    font-size: 1.7rem;
  }
  @media (min-width: 3500px) {
    padding: 1.6rem;
    min-width: 450px;
    font-size: 2rem;
  }
`;

export const Calendar = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  width: 100%;
  height: 84px;

    

  @media (min-width: 1920px) and (max-width: 2559px) {
    gap: 2rem;
    height: 100px;
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    gap: 2rem;
    height: 70px;
  }


  @media (min-width: 1024px) and (max-width: 1439px) {
    gap: 1rem;
    height: 70px;
  }
@media (min-width: 769px) and (max-width: 1023px) {
    gap: 0.8rem;
    height: 100px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    height: auto;
  }
  @media (min-width: 2560px) and (max-width: 3499px) {
    gap: 5rem;
    height: 100px;
  }
  @media (min-width: 3500px) {
    gap: 6rem;
    height: 200px;
  }
`;

export const Day = styled.div`
  padding: 0.6rem 1rem;
  background: ${({ active }) =>
    active
      ? "linear-gradient(180deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%)"
      : "#eee"};
  // background: linear-gradient(180deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  height: 84px;

  strong {
    display: block;
  }
    @media (max-width: 768px)  {
    padding: 1rem ;
    height:65px;
    font-size: 10px;
  }
    @media (min-width: 769px) and (max-width: 1023px) {
    padding: 1rem ;
    height:65px;
    font-size: 10px;
  }
     @media (min-width: 1024px) and (max-width: 1440px) {
    padding: 1rem ;
    height:75px;
    font-size: 13px;
  }
  @media (min-width: 2000px) {
    padding: 1.2rem 1.5;
    height: 124px;
    font-size: 25px;
  }
  @media (min-width: 3500px) {
    padding: 1.4rem 2rem;
    height: 154px;
    font-size: 35px;
  }
`;

export const EmployeesPanel = styled.div`
  background: #fff;
  padding: 0.5rem;
  margin-top: 20px;
  border: none;
  transition: all 0.3s ease;
  border-radius: 12px;
  min-height: 40vh;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 1440px) {
    width: 30%;
    min-height: 45vh;
    max-height: 60vh;
  }

  /* 📱 Tablets */
  @media (max-width: 1024px) {
    width: 40%;
    min-height: 50vh;
    max-height: 70vh;
    border-radius: 10px;
  }
@media (min-width: 769px) and (max-width: 1023px) {
    width: 100%;
    min-height: 35vh;
    max-height: 50vh;

    margin-top: 10px;
  }
  /* 📱 Large mobile devices */
  @media (max-width: 768px) {
    width: 100%;
    min-height: 35vh;
    max-height: 55vh;
    /* padding: 0.5rem; */
    margin-top: 10px;
  }

  /* 🖥️ 4K and ultra-wide displays */
  @media (min-width: 2560px) {
    width: 20%;
    min-height: 50vh;
    max-height: 70vh;
    border-radius: 14px;
    padding: 1rem;
  }
`;





export const DepartmentDropdown = styled.select`
  padding: 0.6rem 2rem 0.6rem 0.6rem; 
  font-size: 0.9rem;
  border-radius: 7px;
  border: 1px solid #172554;
  background: #fff;
  min-width: 250px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3352ba;
  }

  @media (min-width: 2000px) {
    padding: 1.6rem;
    min-width: 450px;
    font-size: 2rem;
  }
  @media (min-width: 3500px) {
    padding: 1.6rem;
    min-width: 500px;
    font-size: 2rem;
  }
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  background: ${({ active }) => (active ? "#E0E3EE" : "#fff")};
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 7px;
  border: 0.2px;
  box-shadow: 0px 0px 4.2px 0px rgba(0, 0, 0, 0.25);

  @media (min-width: 2000px) {
    padding: 1.1rem;
  }
  @media (min-width: 3500px) {
    padding: 2.2rem;
  }
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;

    @media (min-width: 3500px) {
      width: 55px;
      height: 55px;
    }
    @media (min-width: 2000px) {
      width: 70px;
      height: 70px;
    }
    
  }
  span {
    @media (min-width: 2000px) {
      font-size: 30px;
    }
    @media (min-width: 3500px) {
      font-size: 50px;
    }
       @media (max-width:1920px) {
      font-size: 20px;
    }
       @media (max-width: 1440px) {
      font-size: 15px;
    }
       @media (max-width: 1024px) {
      font-size: 15px;
    }
       @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;


export const Head = styled.h2`
  font-size: 19px;
  font-family: "Satoshi", sans-serif;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-family: Raleway;
  font-weight: 700;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  @media (min-width: 2000px) {
    font-size: 30px;
    margin-top: 2.2rem;
  }
  @media (min-width: 3500px) {
    font-size: 40px;
    margin-top: 2.5rem;
  }
`;

export const TaskPanel = styled.div`
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 9px;
  border: 0.2px solid #000;
  box-shadow: 0 0 4.3px 0 rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  max-height: 60vh;
  margin-top: -1rem;
  transition: all 0.3s ease;

  /* ✅ Medium screens (laptops / desktops) */
  @media (max-width: 1440px) {
    padding: 0.9rem;
    max-height: 58vh;
  }

  /* ✅ Tablets */
  @media (max-width: 1024px) {
    padding: 0.8rem;
    border-radius: 8px;
    margin-top: 0;
    max-height: 70vh;
  }

  /* ✅ Large mobile devices */
  @media (min-width: 768px)  and (max-width: 1023px) {
    padding: 0.75rem;
    border-radius: 8px;
    max-height: 50vh;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);

  }

  /* ✅ Small mobile devices */
  @media (max-width: 480px) {
    padding: 0.6rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    box-shadow: none;
    border: 0.5px solid #ccc;
  }

  /* ✅ Ultra-wide / 4K screens */
  @media (min-width: 2560px) {
    padding: 2rem;
    border-radius: 12px;
    max-height: 70vh;
  }
`;


export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #e1e8ec;
  padding: 2rem;
  border-radius: 11px;
  height: 30px;
  @media (min-width: 2000px) {
    height: 50px;
    padding: 3rem;
  }
  @media (min-width: 3500px) {
    height: 70px;
    padding: 4rem;
  }
  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    @media (min-width: 2000px) {
      width: 60px;
      height: 60px;
    }
    @media (min-width: 3500px) {
      width: 58px;
      height: 58px;
    }
  }
  h3 {
    @media (min-width: 2000px) {
      font-size: 40px;
    }
    @media (min-width: 3500px) {
      font-size: 60px;
    }
  }
`;

export const TaskCard = styled.div`
  background: #f2f5ed;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.3s ease;

  h4,
  h5 {
    margin: 0;
    font-family: "Satoshi", sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #333;
  }

  p {
    margin: 0;
    font-family: "Satoshi", sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #333;
  }

  small {
    color: gray;
    font-size: 12px;
    font-family: "Satoshi", sans-serif;
  }

  /* 📱 Small mobile screens */
  @media (max-width: 480px) {
    padding: 0.7rem;
    gap: 0.4rem;

    h4,
    h5 {
      font-size: 12px;
    }

    p {
      font-size: 11px;
    }

    small {
      font-size: 10px;
    }
  }

  /* 💻 Tablets and small laptops */
  @media (max-width: 1024px) and (min-width: 481px) {
    padding: 0.9rem;
    gap: 0.45rem;

    h4,
    h5 {
      font-size: 13px;
    }

    p {
      font-size: 12px;
    }

    small {
      font-size: 11px;
    }
  }

  /* 🖥️ Larger desktops */
  @media (min-width: 1440px) {
    padding: 1.2rem;
    h4,
    h5 {
      font-size: 16px;
    }
    p {
      font-size: 15px;
    }
    small {
      font-size: 13px;
    }
  }

  /* 🖥️ 4K and ultrawide displays */
  @media (min-width: 2560px) {
    padding: 2rem;
    border-radius: 14px;

    h4,
    h5 {
      font-size: 20px;
    }

    p {
      font-size: 18px;
    }

    small {
      font-size: 15px;
    }
  }
  @media (min-width:3840px) {
    padding: 2rem;
    border-radius: 14px;

    h4,
    h5 {
      font-size: 40px;
    }

    p {
      font-size: 35px;
    }

    small {
      font-size: 30px;
    }
  }
`;


export const TimeBox = styled.div`
  font-weight: bold;
  font-family: "Satoshi", sans-serif;
  color: #333;
  transition: all 0.3s ease;

  /* 📱 Small mobile screens */
  @media (max-width: 480px) {
    font-size: 12px;
  }

  /* 💻 Tablets and small laptops */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 13px;
  }

  /* 🖥️ Desktops */
  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }

  /* 🖥️ Large monitors (2K–4K) */
  @media (min-width: 1441px) {
    font-size: 18px;
  }

  /* 🖥️ Ultra-wide / 4K+ displays */
  @media (min-width: 2560px) {
    font-size: 22px;
  }

   @media (min-width: 3840px) {
    font-size: 28px;
  }
`;


export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  // gap: 0.75rem;
  padding: 0.3rem;
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

  @media (min-width: 480px) {
    /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) {
    /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) {
    /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) {
    /* 8K */
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
  }
`;

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
export const NoTaskWrapper = styled.div`
  text-align: center;
  padding: 2rem;
  align-content: end;
  @media (min-width: 2000px) {
    padding: 4rem;
  }
  @media (min-width: 3500px) {
    padding: 6rem;
  }
  img {
    width: 400px;
    height: 350px;
    opacity: 0.8;
    margin-bottom: 0;
    @media (min-width: 2000px) {
      width: 800px;
      height: 750px;
    }
    @media (min-width: 3500px) {
      width: 1000px;
      height: 900px;
    }
     @media (min-width: 769px) and (max-width: 1023px) {
      width: 220px;
      height: 220px;
  }
    @media (max-width: 768px) {
      width: 250px;
      height: 250px;
  }
  }
`;
export const Heading = styled.h2`
  font-family: Raleway;
  font-weight: 700;
  font-style: Bold;
  font-size: 19px;
  line-height: 100%;
  letter-spacing: 0%;

  /* Keep heading sticky inside EmployeesPanel */
  position: sticky;
  top: 0;
  background: white; /* match panel background */
  z-index: 5;
  padding: 0.5rem 0.8rem; /* optional: adds some spacing */
  border-bottom: 1px solid #eee; /* optional divider */

  @media (min-width: 2000px) {
    font-size: 39px;
  }

  @media (min-width: 3500px) {
    font-size: 49px;
  }
`;
export const TaskLayout = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: flex-start;

  /* For small devices: keep side-by-side (40% / 60%) */
  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: nowrap;

    & > div:first-child {
      width: 40%;
    }

    & > div:last-child {
      width: 60%;
    }
  }

  /* For extra small screens, stack vertically */
  @media (max-width: 480px) {
    flex-direction: column;

    & > div:first-child,
    & > div:last-child {
      width: 100%;
    }
  }

  /* For medium and large screens: normal layout */
  @media (min-width: 769px) {
    flex-direction: row;

    & > div:first-child {
      width: 30%;
    }

    & > div:last-child {
      flex: 1;
    }
  }
`;

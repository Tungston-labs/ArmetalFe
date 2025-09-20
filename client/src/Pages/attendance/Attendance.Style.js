// src/components/TimesheetPage.styles.js
import styled from 'styled-components';

import { LuArrowLeft } from "react-icons/lu";

export const BackArrow = styled(LuArrowLeft)`
  cursor: pointer;
  width: clamp(20px, 2vw, 50px);
  height: clamp(20px, 2vw, 50px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    width: 60px;
    height: 60px;
  }

  /* 4K */
  @media (min-width: 3840px) {
    width: 80px;
    height: 80px;
  }

  /* 8K */
  @media (min-width: 7680px) {
    width: 120px;
    height: 120px;
  }
`;

export const Container = styled.div`
  background: white;
  padding: 2rem;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ProfileImage = styled.img`
  width: clamp(50px, 5vw, 300px);   /* minimum 50px, maximum 300px */
  height: clamp(50px, 5vw, 300px);  /* keeps image square */
  border-radius: clamp(5%, 5vw, 20%); /* corners scale proportionally */
  object-fit: cover;
`;


export const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;



export const DateNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const DateNavCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  font-weight: bold;

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  span {
    min-width: 180px;
    text-align: center;
  }
`;

export const DateBox = styled.div`
  input[type='date'] {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
  }
`;




export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;

  th {
    background: #304EB0;
    padding: clamp(0.5rem, 1vw, 0.8rem);
    text-align: center;
    color: white;
    font-size: clamp(0.85rem, 1vw, 1rem);
  }

  @media (max-width: 768px) {
    th {
      font-size: 1rem;
      padding: 0.5rem;
    }
  }

  @media (min-width: 2560px) {
    th {
      font-size: 2rem;
      padding: 1rem;
    }
  }

  @media (min-width: 3840px) { /* 4K */
    th {
      font-size: 2.5rem;
      padding: 1.5rem;
    }
  }

  @media (min-width: 7680px) { /* 8K */
    th {
      font-size: 2rem;
      padding: 2rem;
    }
  }
`;

export const TableRow = styled.tr`
  background: #fff;
  border: 1px solid #ddd;
`;

export const TimeCell = styled.td`
  padding: clamp(0.5rem, 1vw, 0.8rem);
  text-align: center;
  width: 20%;
  font-weight: bold;
  font-size: clamp(0.85rem, 1vw, 0.95rem);

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background: #304EB0;
    color: white;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #FD907B;
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.8rem;
  }

  @media (min-width: 7680px) {
    font-size: 2%.2;
    padding: 2rem;
  }
`;

export const TimeRange = styled.td`
  text-align: center;
  color: #555;
  font-size: clamp(0.75rem, 0.9vw, 0.85rem);
  padding: clamp(0.5rem, 0.8vw, 0.8rem);

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 1rem;
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.3rem;
    padding: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.7rem;
    padding: 2rem;
  }
`;

export const TimeIcon = styled.span`
  margin-right: 0.5rem;
  color: #888;
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: clamp(0.5rem, 1vw, 0.8rem);
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
    padding: 2rem;
  }
`;


export const SectionTitle = styled.h4`
  // margin-top: 2rem;
  margin-bottom: 0.5rem;
  // color:black;

`;

export const TwoColumn = styled.div`
  // display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  width: 40%;
`;


export const Input = styled.input`
  padding: clamp(0.4rem, 1vw, 1rem) clamp(0.8rem, 2vw, 1.5rem);
  border: 1px solid #052DB4;
  border-radius: clamp(6px, 1vw, 12px);
  width: clamp(90%, 99%, 100%);
  margin-bottom: clamp(0.5rem, 1vw, 1.5rem);
  color: black;
  background: #FFF;
  font-size: clamp(14px, 1vw, 20px);

  &:focus {
    outline: none;
    border-color: #304EB0;
    box-shadow: 0 0 0 2px rgba(48, 78, 176, 0.2);
  }

  /* 2K / QHD screens */
  @media (min-width: 2560px) {
    padding: 1.5rem 2.5rem;
    font-size: 2rem;
    border-radius: 16px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    padding: 2rem 3rem;
    font-size: 2.5rem;
    border-radius: 20px;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    padding: 3rem 4rem;
    font-size: 3rem;
    border-radius: 25px;
  }
`;


export const InfoSection = styled.div`
  width: 55%;
  // padding: 1rem 0;
  // margin-left:10%;
`;

export const FullWidthInput = styled.input`
  width: 97%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  height:40%;
  border-radius: 7px;
border: 1px solid #052DB4;
background: #FFF;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:97%;
`;
export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:99%;
`;
export const InfoGrid = styled.div`
  display: flex;
  gap: 1rem;
  // margin-bottom: 2rem;
  width:100%;
      // justify-content: space-between;

`;
export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(10px, 2vw, 40px);
  position: relative; /* for absolute centering of DateDetails on large screens */

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1vw, 20px);  // spacing adjusts with screen width

  strong {
    font-weight: 600;
    font-size: clamp(14px, 1.2vw, 28px); // scales for very large screens
  }

  div {
    font-size: clamp(14px, 1vw, 26px); // scales font from mobile to 8K
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    gap: 12px;

    strong {
      font-size: 18px;
    }

    div {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    gap: 8px;

    strong {
      font-size: 16px;
    }

    div {
      font-size: 14px;
    }
  }
`;


export const DateDetails = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 25px); /* responsive gap between items */

  .date-block {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1vw, 20px);
  }

  h1 {
    font-size: clamp(28px, 4vw, 80px); /* responsive main date number */
    font-weight: 600;
    margin: 0;
  }

  .month-day {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(2px, 0.5vw, 8px);

    strong {
      font-size: clamp(14px, 1.5vw, 28px); /* responsive month */
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: clamp(12px, 1.2vw, 22px); /* responsive day */
      color: #555;
    }
  }

  @media (max-width: 1440px) {
    gap: 15px;

    h1 {
      font-size: clamp(24px, 3vw, 50px);
    }

    .month-day strong {
      font-size: clamp(12px, 1.2vw, 20px);
    }

    .month-day p {
      font-size: clamp(10px, 1vw, 18px);
    }
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .date-block {
      flex-direction: column;
      gap: 8px;
    }

    h1 {
      font-size: clamp(20px, 5vw, 40px);
    }

    .month-day {
      align-items: center;
      strong {
        font-size: clamp(12px, 2vw, 22px);
      }
      p {
        font-size: clamp(10px, 1.5vw, 18px);
      }
    }
  }

  @media (min-width: 2560px) { /* 2K / QHD */
    gap: 30px;
    h1 {
      font-size: 90px;
    }
    .month-day strong {
      font-size: 30px;
    }
    .month-day p {
      font-size: 24px;
    }
  }

  @media (min-width: 3840px) { /* 4K */
    gap: 40px;
    h1 {
      font-size: 120px;
    }
    .month-day strong {
      font-size: 36px;
    }
    .month-day p {
      font-size: 28px;
    }
  }

  @media (min-width: 7680px) { /* 8K */
    gap: 60px;
    h1 {
      font-size: 180px;
    }
    .month-day strong {
      font-size: 50px;
    }
    .month-day p {
      font-size: 40px;
    }
  }
`;



export const DayBoxes = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 24px); /* responsive gap */
  justify-content: center;

  @media (min-width: 2560px) { /* 2K / QHD */
    gap: 3rem;
  }

  @media (min-width: 3840px) { /* 4K */
    gap: 4rem;
  }

  @media (min-width: 7680px) { /* 8K */
    gap: 5rem;
  }
`;

export const DayBox = styled.div`
  background-color: #f3f3f3;
  padding: clamp(6px, 1vw, 14px);
  width: clamp(60px, 8vw, 120px);
  text-align: center;
  border-radius: 6px;

  strong {
  text-decoration: underline;
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 20px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    font-size: 1.8rem;
  }

  /* 4K */
  @media (min-width: 3840px) {
    font-size: 2rem;
  }

  /* 8K */
  @media (min-width: 7680px) {
    font-size: 2.5rem;
  }
}


 div {
  margin-top: clamp(4px, 0.5vw, 8px);
  font-size: clamp(12px, 1vw, 18px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    font-size: 1.8rem;
    margin-top: 0.8rem;
  }

  /* 4K */
  @media (min-width: 3840px) {
    font-size: 2rem;
    margin-top: 1rem;
  }

  /* 8K */
  @media (min-width: 7680px) {
    font-size: 3rem;
    margin-top: 1.2rem;
  }
}


  p {
    font-size: clamp(10px, 0.8vw, 24px);
    color: #888;
  }

  @media (min-width: 2560px) {
    width: 150px;
    padding: 1.rem;
    
  }

  @media (min-width: 3840px) {
    width: 180px;
    padding: 1.8rem;
  }

  @media (min-width: 7680px) {
    width: 220px;
    padding: 2rem;
  }
`;

export const ActiveDayBox = styled(DayBox)`
  background-color: #3f51b5;
  color: white;
`;


export const TotalHours = styled.p`
  margin-top: clamp(10px, 1.5vw, 30px);
  font-size: clamp(14px, 1.2vw, 24px);
  font-weight: 500;

  strong {
    font-weight: 700;
  }

  /* Large screens (2K / QHD) */
  @media (min-width: 2560px) {
    font-size: 2.5rem;
    margin-top: 3rem;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 3rem;
    margin-top: 4rem;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    font-size: 4rem;
    margin-top: 5rem;
  }
`;

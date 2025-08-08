// src/components/TimesheetPage.styles.js
import styled from 'styled-components';

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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 50px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 30px;
  }
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
    padding: 0.8rem;
    text-align: center;
    color:white;
  }
`;

export const TableRow = styled.tr`
  background: #fff;
  border: 1px solid ;
  
`;


 export const TimeCell = styled.td`

  padding: 0.8rem;
  text-align: center;
  width: 20%;
  font-weight: bold;
  font-size: 0.95rem;

  &:first-child {
    border-top-left-radius: 1px;
     background: #304EB0;
 color:white;

    border-bottom-left-radius: 1px;
  }

  &:last-child {
    border-top-right-radius: 1px;
      background: #FD907B;
  
    border-bottom-right-radius: 1px;
  }

`;


export const TimeRange = styled.td`
  text-align: center;
  color: #555;
  font-size: 0.85rem;
  padding: 0.8rem;
`;

export const TimeIcon = styled.span`
  margin-right: 0.5rem;
  color: #888;
`;
export const TextArea = styled.textarea`
  width: 99%;
  min-height: 120px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
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
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 99%;
  margin-bottom: 1rem;
  color:black;
  border-radius: 7px;
border: 1px solid #052DB4;
background: #FFF;
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
  // justify-content: space-between;
  padding: 20px;
  gap: 12rem;
`;

export const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  strong {
    font-weight: 600;
    color: #333;
  }
  div {
    font-size: 16px;
    font-weight: bold;
  }
`;

export const DateDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .date-block {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h1 {
    font-size: 40px;
    font-weight: 600;
    margin: 0;
  }

  .month-day {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    strong {
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #555;
    }
  }
`;

export const DayBoxes = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
justify-content: center;
`;

export const DayBox = styled.div`
  background-color: #f3f3f3;
  padding: 10px;
  width: 80px;
  text-align: center;
  border-radius: 6px;
  strong {
    text-decoration: underline;
    font-weight: 600;
  }
  div {
    margin-top: 5px;
    font-size: 16px;
  }
  p {
    font-size: 12px;
    color: #888;
  }
`;

export const ActiveDayBox = styled(DayBox)`
  background-color: #3f51b5;
  color: white;
`;
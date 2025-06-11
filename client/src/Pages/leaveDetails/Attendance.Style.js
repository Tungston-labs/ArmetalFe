// src/components/TimesheetPage.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  background: #fafcee;
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
    background: #D7D7E1;
    padding: 0.8rem;
    text-align: center;
  }
`;

export const TableRow = styled.tr`
  background: #fff;
  border: 1px solid ;
  
`;


 export const TimeCell = styled.td`
  background: #ecffc8;
  padding: 0.8rem;
  text-align: center;
  width: 20%;
  font-weight: bold;
  font-size: 0.95rem;
 

  &:first-child {
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
  }

  &:last-child {
    border-top-right-radius: 1px;
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
  // color:#999999;

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
  color:#999999;
  
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
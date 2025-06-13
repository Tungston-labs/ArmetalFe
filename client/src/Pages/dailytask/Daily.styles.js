// DailyTask.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background:#FBFEF3;
   font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }

  p {
    font-size: 0.9rem;
    color: gray;
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
  justify-content: space-between;
  flex-wrap: wrap;
font-size:22px;
  input[type="date"] {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  button {
    background: none;
    border: none;
    font-size: 1.2rem;
    margin: 0 0.5rem;
    cursor: pointer;
  }
`;

export const SearchInput = styled.input`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 250px;
`;

export const Calendar = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center;     /* Vertically center (if needed) */
  gap: 5rem;
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
   background:#FBFEF3;

  padding: 1rem;
  border-radius: 12px;
  max-height: 60vh;
  overflow-y: auto;
  // box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top:20px;
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  background: ${({ active }) => (active ? '#E0E3EE' : '#fff')};
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;

export const TaskPanel = styled.div`
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-y: auto;
  max-height: 60vh;
 margin-top:35px;
 
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #E1E8EC;
  padding: 1rem;
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
  padding: .50rem;
  border:1px solid;
  border-radius: 10px;

  // height:50px;

  h4 {
    margin-bottom: 0.4rem;
      margin-top:0px
  }

  small {
    color: gray;
  }
`;

export const Description = styled.p`
  font-size: 0.9rem;
  margin: 0.8rem 0;
`;

export const TimeBox = styled.div`
  font-weight: bold;
`;
export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  gap: 0.75rem;
  padding: 0.3rem ;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0 0;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;

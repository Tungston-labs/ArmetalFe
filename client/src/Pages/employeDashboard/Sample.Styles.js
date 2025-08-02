import styled from "styled-components";



export const ProfileCard = styled.div`
//   background: #fff;
// background:red;
  border-radius: 10px;
  // overflow: hidden;
 
  img {
    width: 100%;
    height: 50%;
    object-fit: cover;

  }
  .details {
    padding: 20px;
    p {
      margin-top:-20px;
      font-size: 14px;
      color: #333;
       font-family: 'Satoshi', sans-serif;
    }
    strong {
      font-weight: 600;
      display: block;
       font-family: 'Satoshi', sans-serif;
    }
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two cards per row */
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack on small screens */
  }
`;

export const SvgImage = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 6px;
  display: inline-block;
`;

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 9px;
  padding: 0.8rem;
  border: 0.2px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 75px; /* Add a fixed height if needed for alignment */

  h3 {
    font-size: 18px;
    margin: 0;
     font-family: 'Satoshi', sans-serif;
  }

  p {
    margin: 5px 0 10px;
    font-size: 13px;
    color: #555;
    display: flex;
    justify-content: space-between;
     font-family: 'Satoshi', sans-serif;
  }

  button {
    background: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    color: #3f51b5;
    cursor: pointer;
 font-family: 'Raleway', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: auto; /* Ensures it stays at the bottom */
  }
`;


export const TimeTrackingCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  border-radius: 9px;
border: 0.2px solid #000;
background: #FFF;
  h4 {
    color: #3352BA;
    margin-bottom: 10px;
    margin-top:-5px;
    font-size:1.2rem;
  }
  p {
    margin: 15px 0;
    font-siz:0.9rem;
  }
  a {
    display: inline-block;
    margin-top: 10px;
    color: #3f51b5;
    font-weight: 600;
    font-size:1rem;
    text-decoration: none;
  }
`;

// export const TaskSection = styled.div`
//   background: #fff;
//   border-radius: 10px;
//   padding: 15px 20px;
//   margin-top:20px;
// `;

export const TaskTitle = styled.h4`
  margin-bottom: 15px;
  margin-top:-1px;
  color: #3352BA;
  font-size: 1.2rem;
 font-family: 'Raleway', sans-serif;
`;

export const TaskItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 10px 0;
  background:white;
  border-bottom: 1px solid #eee;
  align-items: flex-start;
  &:last-child {
    border-bottom: none;
  }
  a {
    margin-left: auto;
    color: #3f51b5;
    text-decoration: none;
    font-size: 18px;
  }
`;

export const TaskMeta = styled.div`
  min-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center; /* optional: center text horizontally */

  span {
    font-size: 13px;
    color: #777;
  }

  strong {
    font-size: 16px;
    color: #111;
  }
`;


export const TaskText = styled.div`

  h5 {
    margin: 0;
    font-size: 12px;
    color: #444;
  }
  p {
    margin: 5px 0 0;
    font-size: 13px;
    color: #666;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 20px;
  background: #F4F4F4;
  // height: 100vh;
  width:50%;
  box-sizing: border-box;
`;

export const TopSection = styled.div`
  display: flex;
  // width:50%;
  // flex: 1;
  gap: 20px;
  flex-wrap: wrap;
//   background:pink;
  // height:10%;
`;

export const LeftColumn = styled.div`
  flex: 1;
  // width:50%;
  display: flex;
  flex-direction: column;
  background:white;
  height:100%;
  border-radius: 9px;
border: 0.2px solid #000;
background: #FFF;
`;

export const RightColumn = styled.div`
  flex: 2;
  // width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
//   background:blue;
`;

// Keep all other styles same (ProfileCard, InfoGrid, etc.)

export const TaskSection = styled.div`
  background: #F4F4F4;
  // border-radius: 10px;
  // padding: 12px;
  margin-top: -30px;
 font-family: 'Satoshi', sans-serif;
  max-height: 300px; 
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 16px; /* Optional spacing between tasks */
`;


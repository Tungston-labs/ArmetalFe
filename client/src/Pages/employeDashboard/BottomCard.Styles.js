import styled from "styled-components";
import NoAttendance from "../../assets/puchtime.svg";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const Section = styled.div`
  border-radius: 12px;
  padding: 10px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const AttendanceHeader = styled(Header)``;

export const Title = styled.h3`
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-style: bold;
  line-height: 1;
  letter-spacing: 0;
  color: #3352BA;
  font-size: 20px; /* default */

  @media (max-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1.5rem;
  }

  @media (min-width: 1601px) {
    font-size: 1.8rem;
  }
     @media (min-width: 2101px) {
    font-size: 2rem;
  }
  
`;

export const RightArrow = styled.div`
  margin-left: auto;
  align-self: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
background-color: #3352BA;
border-radius: 50%;
  &:hover {
    transform: scale(1.2);
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 1.2rem;
  }
`;

export const RightArrows = styled.div`
  margin-left: auto;
  align-self: center;
  cursor: pointer;
  font-size: 1.4rem;
  color: #3352BA;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: #1e3a8a;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 1.2rem;
  }
`;



export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1600px) {
    max-height: 360px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
      @media (max-width: 1920px) {
    max-height: 450px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
      @media (max-width: 2560px) {
    max-height: 450px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
          @media (max-width: 3840px) {
    max-height: 450px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
          @media (min-width: 3841px) {
    max-height: 480px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
`;

export const Wrapper = styled.div`
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px; 
`;

export const Image = styled.img`
  width: 200px;
  height: auto;
   @media (min-width: 2200px) {
    width:400px
  }
`

export const Message = styled.p`
  margin-top: 10px;
  color: #3352ba;
  font-size: 16px;
  font-weight: 500;
   @media (min-width: 2200px) {
   font-size: 32px;
  font-weight: 500;
   }
   `;

export const TaskCard = styled.div`
  display: flex;
  padding: 14px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
`;

export const AttendanceSection = styled.div`
  display: flex;
  flex-direction: column;   
  align-items: center;      
  justify-content: center;  
  gap: 10px;                
  padding: 20px;
  background: white;
  border-radius: 12px;

  @media (min-width: 2200px) {
   padding: 20px;
  }
`;

export const AttendanceImage = styled.img`
  width: 200px;
  height:100px;
   @media (min-width: 2200px) {
    width:400px;
    height:340px;
  }
`;

export const Text = styled.span`
  color: #3352ba;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  @media (min-width: 2200px) {
   font-size: 32px;
  font-weight: 500;
  }
`;
export const Divider = styled.div`
  width: 5px;
  background-color: #3352BA; /* light gray */
  margin: 0 12px;
  height: auto;
  align-self: stretch;

`;


export const TaskLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* keeps both left-aligned */
`;

export const TaskDate = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: #172554;
  white-space: nowrap;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    white-space: normal;
  }
`;

export const TaskTime = styled.div`
  font-size: 13px;
  color: #172554;
  margin-top: 2px;
  line-height: 1.4;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-top: 4px;
  }
`;

export const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 2;

  @media (max-width: 768px) {
    gap: 3px;
  }

  @media (max-width: 480px) {
    gap: 2px;
    text-align: center;
    align-items: center;
  }
`;

export const TaskRole = styled.div`
  /* font-size: 12px; */
  color: black;
  font-weight: 500;
  word-break: break-word;

@media (min-width: 2560px) and (max-width:3840px) {
    font-size: 1.5rem;
  }

@media (min-width: 1920px) and (max-width:2559px) {
    font-size: 1.4rem;
  }

@media (min-width: 1600px) and (max-width:1919px) {
    font-size: 1.2rem;
  }

@media (min-width: 1020px) and (max-width: 1599px) {
    font-size: 1.2rem;
  }
  @media (min-width: 768px) and (max-width:1019px) {
    font-size: 1.2rem;
  }
  @media (max-width: 768px) {
    font-size: 11.5px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    font-weight: 600;
  }
`;

export const TaskDescription = styled.div`

  color: black;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;

@media (min-width: 2560px) and (max-width:3840px) {
    font-size: 1.5rem;
  }

 @media (min-width: 1920px) and (max-width:2559px) {
    font-size: 1.2rem;
  } 

  @media (min-width: 1600px) and (max-width:1919px) {
    font-size: 1rem;
  }

   @media (min-width: 1020px) and (max-width:1619px) {
    font-size: 1rem;
  }
   @media (min-width: 769px) and (max-width:1019px) {
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 12.5px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    text-align: center;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 1600px) {
    max-height: 350px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
    @media (max-width: 1920px) {
    max-height: 450px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
     @media (max-width: 2560px) {
    max-height: 500px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
     @media (max-width: 3840px) {
    max-height: 450px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
     @media (min-width: 3841px) {
    max-height: 480px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3352ba66;
      border-radius: 8px;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-spacing: 0 12px;
  text-align: center;
  background-color: white;
  border-collapse: separate;

  thead {
    position: sticky;
    top: 0;
    background: #f6f8ff;
    z-index: 2;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;


export const TableRow = styled.tr`
  border-bottom: 10px solid #fdfbfbff;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9faff;
  }
`;

export const TableCell = styled.td`
  text-align: center;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
  padding: 0.6rem;
border-bottom:8px solid #f4f8ff;
  @media (min-width: 2200px) {
    font-size: 34px;
    padding-top: 20px;
  }
`;
export const TimeWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  vertical-align: middle;

  @media (max-width: 768px) {
    gap: 4px;
  }

  @media (min-width: 1920px) {
    gap: 10px;
  }

  @media (min-width: 2560px) {
    gap: 14px;
  }

  @media (min-width: 3840px) {
    gap: 18px;
  }
`;

export const TimeText = styled.span`
  display: inline-block;
  line-height: 1.2;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (min-width: 1440px) {
    font-size: 1.25rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.75rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const ClockIcon = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
  display: inline-block;
  vertical-align: middle;

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
  }

  @media (min-width: 1920px) {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 2560px) {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 3840px) {
    width: 28px;
    height: 28px;
  }
`;
export const TimeIn = styled.span`
  color: #008000; /* green */
  font-weight: 600;
  text-align: center;
  display: inline-block;
  font-size: clamp(0.8rem, 0.5vw + 0.6rem, 1.6rem);
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  min-width: 70px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.2rem 0.5rem;
    min-width: 55px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    min-width: 50px;
  }

  /* 🖥️ For large desktop (2K) */
  @media (min-width: 1920px) {
    font-size: 1.4rem;
    padding: 0.4rem 1rem;
    min-width: 90px;
  }

  /* 🖥️ For 4K resolution screens */
  @media (min-width: 2560px) {
    font-size: 1.8rem;
    padding: 0.5rem 1.2rem;
    min-width: 110px;
  }
`;

export const TimeOut = styled.span`
  color: #d32f2f; /* red */
  font-weight: 600;
  text-align: center;
  display: inline-block;
  font-size: clamp(0.8rem, 0.5vw + 0.6rem, 1.6rem);
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  min-width: 70px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.2rem 0.5rem;
    min-width: 55px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    min-width: 50px;
  }

  /* 🖥️ For large desktop (2K) */
  @media (min-width: 1920px) {
    font-size: 1.4rem;
    padding: 0.4rem 1rem;
    min-width: 90px;
  }

  /* 🖥️ For 4K resolution screens */
  @media (min-width: 2560px) {
    font-size: 1.8rem;
    padding: 0.5rem 1.2rem;
    min-width: 110px;
  }
`;


import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 18px 28px;
  font-family: "Inter", "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  /* max-width: 1200px; */
  margin: 0 auto;
`;

/* Header */
export const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  h2 {
    margin: 0;
    font-size: 18px;
    color: #30408d;
  }
`;
export const SummaryCol = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
  width: 100%;
`;

export const ButtonAct = styled.div`
  background-color: #304eb0;
  color: #fff;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  align-items: center;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 20px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 32px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
`;
export const SmallRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: #6b6b6b;
  margin-bottom: 8px;

  span,
  strong {
    font-family: "Satoshi", Arial, sans-serif;
    font-weight: 700;
    font-style: normal;
    line-height: 100%;
    letter-spacing: 0;
    color: inherit;

    width: 220px;
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 14px;
      width: 180px;
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      font-size: 14px;
      width: 200px;
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
      font-size: 14px;
      width: 210px;
    }
    @media (min-width: 1441px) and (max-width: 1700px) {
      font-size: 16px;
      width: 250px;
    }

    @media (min-width: 1701px) and (max-width: 2060px) {
      font-size: 18px;
      width: 300px;
    }
    @media (min-width: 2060px) and (max-width: 2600px) {
      font-size: 20px;
      width: 350px;
    }
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 20px;
      width: 400px;
    }

    @media (min-width: 3841px) {
      font-size: 32px;
      width: 450px;
    }
  }

  strong {
    color: #000;
  }
`;

export const Small = styled.div`
  font-size: 12px;
  color: #6b6b6b;
`;

export const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileRow = styled.div`
  display: flex;
  gap: 18px;
  align-items: stretch;

  border-bottom: 1px solid #00000054;
  @media (max-width: 560px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Avatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width:768px){
  width: 100px;
    height: 200px;

  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 110px;
    height: 125px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 100px;
    height: 125px;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    width: 120px;
    height: 125px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    width: 140px;
    height: 140px;
  }

  @media (min-width: 2060px) and (max-width: 2600px) {
    width: 160px;
    height: 180px;
  }

  @media (min-width: 2601px) and (max-width: 3840px) {
    width: 180px;
    height: 180px;
  }

  @media (min-width: 3841px) {
    width: 200px;
    height: 200px;
  }
`;


export const ProfileDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 10px;

  .InputRow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .left-column {
    display: grid;
    grid-template-rows: repeat(3, auto); /* 3 inputs */
    gap: 10px;
  }

  .right-column {
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 10px;
  }

  .dual-inputs {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
    }
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoInput = styled.input`
  border-radius: 6px;
  border: 1px solid #052db4;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 20px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 32px;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 18px;
  padding-top: 8px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
export const DateNav = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 560px) {
    position: static;
    transform: none;
    justify-content: center;
    margin-top: 12px;
  }
  @media (max-width: 900px) {
    position: static;
    transform: translateX(-20%);

    transform: none;
    justify-content: center;
    margin-top: 12px;
  }
`;

export const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

export const CalendarIcon = styled(FaRegCalendarAlt)`
  font-size: 2rem;
  color: #333;
`;

export const DayNumber = styled.div`
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 0.5rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 1.5rem;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 1.8rem;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 2.2rem;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 2.5rem;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 3rem;
  }

  @media (min-width: 3841px) {
    font-size: 3.5rem;
  }
`;

export const MonthDay = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DayTabs = styled.div`
  display: flex;
  gap: 2rem;
  padding: 12px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

export const DayTab = styled.button`
  min-width: 72px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#30408d" : "#e6e6e6")};
  background: ${({ active }) => (active ? "#3352BA" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#444")};
  padding: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ active }) =>
    active ? "0 3px 8px rgba(48,64,141,0.08)" : "none"};
  transition: all 0.18s ease;
`;

export const DayLabel = styled.div`
  font-weight: 700;
  font-size: 14px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 13px;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
  }

  @media (min-width: 2061px) and (max-width: 2600px) {
    font-size: 15px;
  }

  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 16px;
  }

  @media (min-width: 3841px) {
    font-size: 22px;
  }
`;

export const DayDate = styled.div`
  font-size: 12px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 11px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 13px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 13px;
  }

  @media (min-width: 2061px) and (max-width: 2600px) {
    font-size: 14px;
  }

  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 16px;
  }

  @media (min-width: 3841px) {
    font-size: 20px;
  }
`;

export const DayMonth = styled.div`
  font-size: 12px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 11px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 13px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 13px;
  }

  @media (min-width: 2061px) and (max-width: 2600px) {
    font-size: 14px;
  }

  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 16px;
  }

  @media (min-width: 3841px) {
    font-size: 20px;
  }
`;
export const TableWrapper = styled.div`
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(53, 63, 98, 0.04);
  overflow: hidden;
`;

export const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 20% 30%;
  background: #30408d;
  color: #fff;
  padding: 12px 16px;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    text-align: left;
  }
`;

export const TableHeaderCell = styled.div`
  font-weight: 600;
`;

export const TimesRow = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 20% 30%;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  background: ${({ even }) => (even ? "#fafafa" : "#fff")};
  border-bottom: 1px solid #f1f1f1;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
`;

export const TimeCell = styled.div``;

export const TimeBtn = styled.button`
  background: ${({ variant }) => (variant === "out" ? "#ff9e96" : "#2f52ab")};
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: default;
  font-weight: 600;
  font-size: 14px;
`;

export const LocationCell = styled.div`
  font-size: 13px;
  color: #333;
`;

export const IconBtn = styled.div`
  background: #fff;
  padding: 6px 8px;
  cursor: pointer;
`;

export const TimeCellInline = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
export const TimeHeader = styled.div``;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #3352ba;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 10px;
  &:hover {
    transform: translateX(-3px);
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

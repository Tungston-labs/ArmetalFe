
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
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  font-size: 18px;
`;

/* Title */
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

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

export const SmallRow = styled(Row)`
  font-size: 12px;
  color: #6b6b6b;
`;

export const Small = styled.div`
  font-size: 12px;
  color: #6b6b6b;
`;

/* Grid container */
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
  border-radius: 8px;
  border: 1px solid #052DB4;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
  width: 100%;
  box-sizing: border-box;
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

  .date-container {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;

    .day-number {
      font-size: 24px;
    }

    .month-day {
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }
  }

  .nav-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 560px) {
    position: static;
    transform: none;
    justify-content: center;
    margin-top: 12px;
  }
`;

export const DayTabs = styled.div`
  display: flex;
  gap:2rem;
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
  box-shadow: ${({ active }) => (active ? "0 3px 8px rgba(48,64,141,0.08)" : "none")};
  transition: all 0.18s ease;
`;

export const TableWrapper = styled.div`
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(53,63,98,0.04);
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

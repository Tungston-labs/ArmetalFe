import styled from "styled-components";

export const Wrapper = styled.div`
  height: 80vh;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

export const GridContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1.2fr 2fr 1.2fr;
  gap: 1.5rem;

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1.5fr 1fr;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .big-number {
    font-size: 4rem;
    font-weight: 700;
  }

  p {
    margin-top: -10px;
    font-size: 1rem;
  }

  .legend {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: .4rem;

    .blue-dot,
    .red-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }

    .blue-dot {
      background: #2c59ff;
    }
    .red-dot {
      background: #ff5b5b;
    }
  }
`;

export const TableWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;

  .info p,
  .id,
  .email {
    font-size: 0.9rem;
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const CalendarWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HolidayItem = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 1rem;
  align-items: center;

  background: #f9f9f9;
  padding: 1rem;
  border-radius: 12px;

  .details .title {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .details .subtitle {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .date {
    font-size: 0.9rem;
  }
`;

export const HolidayIcon = styled.div`
  font-size: 1.6rem;
`;

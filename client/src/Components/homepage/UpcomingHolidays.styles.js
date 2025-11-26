import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  @media (min-width: 1920px) {
    margin-bottom: 20px;
  }
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 22px;
  }
`;

export const SmallMeta = styled.span`
  color: #64748b;
  font-size: 13px;

  @media (max-width: 600px) {
    font-size: 11px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;

  @media (min-width: 1920px) {
    gap: 16px;
  }
`;

export const ListItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 600px) {
    gap: 8px;
  }

  @media (min-width: 1920px) {
    gap: 20px;
  }
`;

export const DayBox = styled.div`
  min-width: 72px;
  text-align: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: ${({ highlight }) =>
    highlight ? "linear-gradient(180deg,#fef3c7,#fde68a)" : "#f1f5f9"};
  border: ${({ highlight }) =>
    highlight ? "2px solid #f59e0b" : "1px solid #e2e8f0"};
  color: ${({ highlight }) => (highlight ? "#92400e" : "#0f172a")};

  display: flex;
  flex-direction: column;
  justify-content: center;

  .date {
    font-weight: 700;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 18px;
    }
  }

  .days {
    font-size: 12px;
    color: rgba(15,23,42,0.7);
    margin-top: 4px;

    @media (max-width: 600px) {
      font-size: 10px;
    }

    @media (min-width: 1920px) {
      font-size: 14px;
    }
  }

  @media (max-width: 600px) {
    min-width: 60px;
    padding: 6px 6px;
  }

  @media (min-width: 1920px) {
    min-width: 90px;
    padding: 14px 10px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1920px) {
    gap: 6px;
  }
`;

export const Name = styled.span`
  font-weight: 600;
  color: #0f172a;

  @media (max-width: 600px) {
    font-size: 13px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }
`;

export const Type = styled.span`
  color: #64748b;
  font-size: 13px;
  margin-top: 4px;

  @media (max-width: 600px) {
    font-size: 11px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }
`;

export const ViewAll = styled.button`
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;

  &:hover {
    background: rgba(37,99,235,0.06);
  }

  @media (max-width: 600px) {
    padding: 6px 0;
    font-size: 13px;
  }

  @media (min-width: 1920px) {
    padding: 12px 0;
    font-size: 18px;
  }
`;

export const NoData = styled.div`
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 12px 0;

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 8px 0;
  }

  @media (min-width: 1920px) {
    font-size: 18px;
    padding: 20px 0;
  }
`;

export const CalendarIcon = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
  }

  @media (min-width: 1920px) {
    width: 72px;
    height: 72px;
  }

  .cal-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1; /* Image stays behind */
  }

  .cal-month {
    position: absolute;
    top: 15px;
    width: 100%;
    text-align: center;
    font-size: 11px;
    font-weight: 800;
    color: #e11d1dff;
    z-index: 5;
    pointer-events: none;

    @media (max-width: 600px) {
      font-size: 9px;
      top: 10px;
    }

    @media (min-width: 1920px) {
      font-size: 16px;
      top: 20px;
    }
  }

  .cal-day {
    position: absolute;
    bottom: 4px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    z-index: 5;
    pointer-events: none;

    @media (max-width: 600px) {
      font-size: 12px;
      bottom: 2px;
    }

    @media (min-width: 1920px) {
      font-size: 24px;
      bottom: 6px;
    }
  }
`;

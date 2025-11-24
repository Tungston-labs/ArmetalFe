// UpcomingHolidays.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
  font-weight: 700;
`;

export const SmallMeta = styled.span`
  color: #64748b;
  font-size: 13px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`;

export const ListItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const DayBox = styled.div`
  min-width: 72px;
  text-align: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: ${({ highlight }) => (highlight ? "linear-gradient(180deg,#fef3c7,#fde68a)" : "#f1f5f9")};
  border: ${({ highlight }) => (highlight ? "2px solid #f59e0b" : "1px solid #e2e8f0")};
  color: ${({ highlight }) => (highlight ? "#92400e" : "#0f172a")};

  .date {
    font-weight: 700;
    font-size: 14px;
  }
  .days {
    font-size: 12px;
    color: rgba(15,23,42,0.7);
    margin-top: 4px;
  }
`;


export const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.span`
  font-weight: 600;
  color: #0f172a;
`;

export const Type = styled.span`
  color: #64748b;
  font-size: 13px;
  margin-top: 4px;
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
`;

export const NoData = styled.div`
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 12px 0;
`;

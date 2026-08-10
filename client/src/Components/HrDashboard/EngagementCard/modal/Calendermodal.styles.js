import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 150ms ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 300px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.3);
  padding: 16px;
  animation: pop 160ms ease;

  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
`;

export const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

export const NavButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const CloseButton = styled(NavButton)`
  margin-left: 4px;
  color: #9ca3af;
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
`;

export const Weekday = styled.div`
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  padding: 4px 0;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const Day = styled.button`
  aspect-ratio: 1;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: ${({ empty }) => (empty ? "default" : "pointer")};
  visibility: ${({ empty }) => (empty ? "hidden" : "visible")};

  background: ${({ isSelected }) => (isSelected ? "#4F6EF7" : "transparent")};
  color: ${({ isSelected, isToday }) =>
    isSelected ? "#fff" : isToday ? "#4F6EF7" : "#374151"};
  box-shadow: ${({ isToday, isSelected }) =>
    isToday && !isSelected ? "inset 0 0 0 1.5px #4F6EF7" : "none"};

  transition: background 150ms ease, color 150ms ease;

  &:hover {
    background: ${({ isSelected }) => (isSelected ? "#4F6EF7" : "#eef2ff")};
  }
`;

export const Footer = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
`;

export const TodayButton = styled.button`
  border: none;
  background: transparent;
  color: #4f6ef7;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;

  &:hover {
    background: #eef2ff;
  }
`;
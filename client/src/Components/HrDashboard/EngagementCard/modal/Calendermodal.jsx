import React, { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

import {
  Overlay,
  ModalCard,
  Header,
  HeaderTitle,
  NavButton,
  CloseButton,
  WeekdayRow,
  Weekday,
  DayGrid,
  Day,
  Footer,
  TodayButton,
} from "./Calendermodal.styles";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

const CalendarModal = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(selectedDate || today);

  if (!isOpen) return null;

  const cells = buildMonthGrid(viewDate);

  const goToPrevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalCard role="dialog" aria-modal="true" aria-label="Calendar">
        <Header>
          <NavButton onClick={goToPrevMonth} aria-label="Previous month">
            <FiChevronLeft />
          </NavButton>

          <HeaderTitle>
            {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
          </HeaderTitle>

          <NavButton onClick={goToNextMonth} aria-label="Next month">
            <FiChevronRight />
          </NavButton>

          <CloseButton onClick={onClose} aria-label="Close calendar">
            <FiX />
          </CloseButton>
        </Header>

        <WeekdayRow>
          {WEEKDAYS.map((w, i) => (
            <Weekday key={`${w}-${i}`}>{w}</Weekday>
          ))}
        </WeekdayRow>

        <DayGrid>
          {cells.map((date, i) =>
            date ? (
              <Day
                key={i}
                isToday={isSameDay(date, today)}
                isSelected={isSameDay(date, selectedDate)}
                onClick={() => onSelectDate?.(date)}
              >
                {date.getDate()}
              </Day>
            ) : (
              <Day key={i} empty />
            )
          )}
        </DayGrid>

        <Footer>
          <TodayButton
            onClick={() => {
              setViewDate(today);
              onSelectDate?.(today);
            }}
          >
            Today
          </TodayButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CalendarModal;
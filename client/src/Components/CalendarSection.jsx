import React, { useState } from "react";
import {
  Container,
  CalendarContainer,
  CalendarHeader,
  CalendarGrid,
  DayCell,
  HolidayMark,
  UpcomingWrapper,
  HolidayItem,
  HolidayIcon,
} from "./CalendarSection.Styles";


const CalendarSection = () => {
  const [selected, setSelected] = useState(16);

  const holidays = [5, 12, 19, 26, 2, 9]; // red highlighted numbers
  const upcoming = [
    { title: "Dummy holiday", date: "24 October" },
    { title: "Dummy holiday", date: "24 October" },
    { title: "Dummy holiday", date: "24 October" },
  ];

  const days = [
    29, 30, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 1, 2,
    3, 4, 5, 6, 7, 8, 9,
  ];

  return (
    <>
  <Container>
      <CalendarContainer>
        <CalendarHeader>
          <h3>
            October <span>2025</span>
          </h3>
          <div className="nav">
            <button>{"<"}</button>
            <button>{">"}</button>
          </div>
        </CalendarHeader>

        <CalendarGrid>
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="week">{d}</div>
          ))}

          {days.map((day, idx) => (
            <DayCell
              key={idx}
              isSelected={day === selected}
              isHoliday={holidays.includes(day)}
              onClick={() => setSelected(day)}
            >
              {day}
              {holidays.includes(day) && <HolidayMark />}
            </DayCell>
          ))}
        </CalendarGrid>
      </CalendarContainer>

      {/* Upcoming Holidays */}
      <UpcomingWrapper>
        <div className="titleRow">
          <h3>Upcoming Holidays</h3>
          <span className="arrow">↗</span>
        </div>

        {upcoming.map((item, i) => (
          <HolidayItem key={i}>
            <HolidayIcon>📅</HolidayIcon>

            <div className="info">
              <h4>{item.title}</h4>
              <p>{item.title}</p>
            </div>

            <span className="date">{item.date}</span>
          </HolidayItem>
        ))}
      </UpcomingWrapper>
      </Container>
    </>
  );
};

export default CalendarSection;

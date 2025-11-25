import React, { useState } from "react";
import {
  CalendarWrapper,
  Header,
  NavButtons,
  MonthName,
  Grid,
  Day,
  Weekday,
} from "./SingleHolidayCalendar.styles";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SingleHolidayCalendar = ({ holidays = [] }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const holidayMap = {};
  holidays.forEach((h) => (holidayMap[h.date] = h.name));

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

const renderDays = () => {
  const list = [];

  // Empty spaces before starting
  for (let i = 0; i < firstDay; i++) list.push(<Day key={"e" + i} />);

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;

    const isHoliday = holidayMap[dateStr];

    // Check if today
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    let className = "";
    if (isHoliday) className = "holiday";
    if (isToday) className += " today";

    list.push(
      <Day key={d} className={className} title={isHoliday || ""}>
        {d}
      </Day>
    );
  }

  return list;
};


  return (
    <CalendarWrapper>
      <Header>
        <NavButtons onClick={prevMonth}>‹</NavButtons>

        <MonthName>
          {monthNames[month]} {year}
        </MonthName>

        <NavButtons onClick={nextMonth}>›</NavButtons>
      </Header>

      <Grid>
        {weekdays.map((w) => (
          <Weekday key={w}>{w}</Weekday>
        ))}

        {renderDays()}
      </Grid>
    </CalendarWrapper>
  );
};

export default SingleHolidayCalendar;

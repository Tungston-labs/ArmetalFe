import React from "react";
import { useNavigate } from "react-router-dom"; // import this
import {
  Wrapper,
  Header,
  Title,
  SmallMeta,
  CalendarIcon,
  List,
  ListItem,
  DayBox,
  Info,
  Name,
  Type,
  ViewAll,
  NoData
} from "./UpcomingHolidays.styles";

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function daysFromToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  const diff = d - today;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const UpcomingHolidays = ({ holidays = [], showCount = 5, onCalendarClick }) => {
  const navigate = useNavigate(); // initialize navigate

  const sorted = [...holidays].sort((a,b) => new Date(a.date) - new Date(b.date));
  const list = sorted.slice(0, showCount);

  // Today's date
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "short" }).toUpperCase();

  const handleViewAll = () => {
    navigate("/holiday"); // set the route you want
  };

  return (
    <Wrapper>
      <Header>
        <Title>Upcoming Holidays</Title>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CalendarIcon onClick={onCalendarClick}>
            <img src="/images/calendar.png" alt="calendar" className="cal-img" />
            <span className="cal-month">{month}</span>
            <span className="cal-day">{day}</span>
          </CalendarIcon>
        </div>
      </Header>

      <List>
        {list.length === 0 && <NoData>No upcoming holidays</NoData>}

        {list.map((h, idx) => {
          const days = daysFromToday(h.date);
          const isSoon = days >= 0 && days <= 30;
          return (
            <ListItem key={idx}>
              <DayBox highlight={isSoon}>
                <div className="date">{formatDateShort(h.date)}</div>
                <div className="days">
                  {days === 0 ? "Today" : days > 0 ? `${days}d` : `${Math.abs(days)}d ago`}
                </div>
              </DayBox>

              <Info>
                <Name>{h.name}</Name>
                <Type>{h.type || "Holiday"}</Type>
              </Info>
            </ListItem>
          );
        })}
      </List>

      <ViewAll onClick={handleViewAll}>View all holidays</ViewAll>
    </Wrapper>
  );
};

export default UpcomingHolidays;

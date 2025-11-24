// UpcomingHolidays.jsx
import React from "react";
import {
  Wrapper,
  Header,
  Title,
  SmallMeta,
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

const UpcomingHolidays = ({ holidays = [], showCount = 5, onViewAll }) => {

  const sorted = [...holidays].sort((a,b) => new Date(a.date) - new Date(b.date));
  const list = sorted.slice(0, showCount);

  return (
    <Wrapper>
      <Header>
        <Title>Upcoming Holidays</Title>
        <SmallMeta>{holidays.length} total</SmallMeta>
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

      {onViewAll && <ViewAll onClick={onViewAll}>View all holidays</ViewAll>}
    </Wrapper>
  );
};

export default UpcomingHolidays;

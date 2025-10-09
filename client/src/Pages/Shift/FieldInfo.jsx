
import React, { useState, useMemo } from "react";
import {
  PageWrapper,
  Header,
  BackButton,
  TitleGroup,
  ProfileRow,
  Avatar,
  ProfileDetails,
  InputRow,
  InfoInput,
  SummaryRow,
  SummaryCol,
  DateNav,
  DayTabs,
  DayTab,
  TableWrapper,
  TableHeaderRow,
  TableHeaderCell,
  TimesRow,
  TimeCell,
  TimeBtn,
  LocationCell,
  ContainerGrid,
  Small,
  IconBtn
} from "./FieldInfo.Styles";
import { LuArrowLeft } from "react-icons/lu";
import FieldShiftIcon from "../../assets/shifttopper.svg"; 
import { GoInfo } from "react-icons/go";
import TimeTable from "./TimeTable";

const days = [
  { label: "Mon", date: "12 ", month:"oct" },
  { label: "Tue", date: "13 ",month:"oct" },
  { label: "Wed", date: "14 ",month:"oct" },
  { label: "Thu", date: "15 ",month:"oct" },
  { label: "Fri", date: "16 ",month:"oct" },
  { label: "Sat", date: "17 ",month:"oct" },
];

const initialTimes = [
  // sample times mapped to day index (0..5)
  { id: 1, dayIndex: 0, timeIn: "08:30 AM", timeOut: "11:30 AM", location: "Office - Block A" },
  { id: 2, dayIndex: 0, timeIn: "09:15 AM", timeOut: "11:45 AM", location: "Client Site" },
  { id: 3, dayIndex: 0, timeIn: "10:00 AM", timeOut: "12:30 PM", location: "Remote" },
  { id: 4, dayIndex: 1, timeIn: "08:45 AM", timeOut: "11:30 AM", location: "Office - Block A" },
  { id: 5, dayIndex: 2, timeIn: "08:15 AM", timeOut: "11:00 AM", location: "Branch Office" },
  { id: 6, dayIndex: 3, timeIn: "08:30 AM", timeOut: "11:30 AM", location: "Office - Block A" },
  { id: 7, dayIndex: 4, timeIn: "08:30 AM", timeOut: "11:30 AM", location: "Training Room" },
];

const FieldInfo = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [times, setTimes] = useState(initialTimes);

  // Profile & form mock data (editable if you want)
  const [profile] = useState({
    name: "DummyDummy",
    phone: "1254841521",
    email: "dummy@gmail.com",
    dob: "12-12-2000",
    gender: "Female",
    note:
      "Lorem ipsum dolor sit amet consectetur. At odio fermentum in faucibus ac odio nunc. Quam pulvinar placerat ac vel amet urna.",
    photo: "https://i.pravatar.cc/150?img=32",
  });

  const timesForDay = useMemo(
    () => times.filter((t) => t.dayIndex === selectedDay),
    [times, selectedDay]
  );

  const removeRow = (id) => {
    setTimes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <PageWrapper>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BackButton onClick={() => window.history.back()}>
            <LuArrowLeft />
          </BackButton>
          <img src={FieldShiftIcon} alt="FieldShift" style={{ width: 36, height: 36 }} />
          <TitleGroup>
            <h2>FieldShift</h2>
            <Small>Manage all departments within the organization.</Small>
          </TitleGroup>
        </div>
      </Header>

      <ContainerGrid>

      <ProfileRow>
  <Avatar>
    <img src={profile.photo} alt="avatar" />
  </Avatar>

  <ProfileDetails>
    <InputRow>
      <div className="left-column">
        <InfoInput value={profile.name} readOnly />
        <InfoInput value={profile.phone} readOnly />
          <InfoInput value={profile.email} readOnly />
   
      </div>

      <div className="right-column">
           <InfoInput value={profile.note} readOnly />
        <div className="dual-inputs">
          <InfoInput value={profile.dob} readOnly />
          <InfoInput value={profile.gender} readOnly />
        </div>
      </div>
    </InputRow>
  </ProfileDetails>
</ProfileRow>


  
<SummaryRow>
  <SummaryCol>
  <Row><span>Monthly working hour</span><strong>145 Hrs</strong></Row>
  <SmallRow><span>Total Monthly working hour</span><strong>145 Hrs</strong></SmallRow>
  <SmallRow><span>Weekly working hour</span><strong>45 Hrs</strong></SmallRow>
</SummaryCol>

  <DateNav>
    <div className="date-container">
      <div className="day-number">16</div>
      <div className="month-day">
        <div>November</div>
        <div>Monday</div>
      </div>
    </div>
    <div className="nav-buttons">
      <IconBtn>{"<"}</IconBtn>
      <IconBtn>{">"}</IconBtn>
    </div>
  </DateNav>
</SummaryRow>

       <DayTabs>
  {days.map((d, i) => (
    <DayTab
      key={i}
      active={i === selectedDay}
      onClick={() => setSelectedDay(i)}
      aria-pressed={i === selectedDay}
    >
      <div style={{ fontWeight: 700 }}>{d.label}</div>
      <div style={{ fontSize: 12 }}>{d.date}</div>
      <div style={{ fontSize: 12 }}>{d.month}</div> 
    </DayTab>
  ))}
</DayTabs>

        {/* Times table */}
        {/* <TableWrapper>
          <TableHeaderRow>
            <TableHeaderCell style={{ width: "25%" }}>Time in</TableHeaderCell>
            <TableHeaderCell style={{ width: "25%" }}>To / Duration</TableHeaderCell>
            <TableHeaderCell style={{ width: "20%" }}>Time out</TableHeaderCell>
            <TableHeaderCell style={{ width: "30%" }}>Location</TableHeaderCell>
          </TableHeaderRow>

          {timesForDay.length === 0 ? (
            <div style={{ padding: 24 }}>No entries for this day.</div>
          ) : (
            timesForDay.map((row, idx) => (
              <TimesRow key={row.id} even={idx % 2 === 0}>
                <TimeCell>
                  <TimeBtn>{row.timeIn}</TimeBtn>
                </TimeCell>

                <TimeCell>
                  <div style={{ height: 8, background: "#eee", borderRadius: 4 }} />
                </TimeCell>

                <TimeCell>
                  <TimeBtn variant="out">{row.timeOut}</TimeBtn>
                </TimeCell>

                <LocationCell>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <GoInfo />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>location</div>
                        <div style={{ fontSize: 12, color: "#666" }}>{row.location}</div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => removeRow(row.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#d43f3f",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                        aria-label={`Remove ${row.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </LocationCell>
              </TimesRow>
            ))
          )}
        </TableWrapper> */}
        <TimeTable/>
      </ContainerGrid>
    </PageWrapper>
  );
};

export default FieldInfo;

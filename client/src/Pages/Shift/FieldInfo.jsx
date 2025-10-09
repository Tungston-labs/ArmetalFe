
import React, { useState, useMemo } from "react";
import {
  PageWrapper,
  Header,
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
  IconBtn,
  SmallRow,
  DateContainer,
  DayNumber,
  MonthDay,
  NavButtons,
  CalendarIcon,
  BackButton,
} from "./FieldInfo.Styles";
import { LuArrowLeft } from "react-icons/lu";
import FieldShiftIcon from "../../assets/shifttopper.svg"; 
import TimeTable from "./TimeTable";
import { IconWrapper, Subtitle, TextGroup, Title, TitleSection } from "./FieldShift.Styles";
import Navbar from "../../Components/Navbar";
import { FaRegCalendarAlt } from "react-icons/fa";

const days = [
  { label: "Mon", date: "12 ", month:"oct" },
  { label: "Tue", date: "13 ",month:"oct" },
  { label: "Wed", date: "14 ",month:"oct" },
  { label: "Thu", date: "15 ",month:"oct" },
  { label: "Fri", date: "16 ",month:"oct" },
  { label: "Sat", date: "17 ",month:"oct" },
];

const initialTimes = [

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
    <>
    <Navbar/>
    <PageWrapper>
     <Header>
              <BackButton onClick={() => navigate(-1)}>
                         <LuArrowLeft />
                       </BackButton>
     
               <TitleSection>
                 <IconWrapper>
                   <img src={FieldShiftIcon} alt="FieldShift" />
                 </IconWrapper>
                 <TextGroup>
                   <Title>FieldShift</Title>
                   <Subtitle>Manage all departments within the organization.</Subtitle>
                 </TextGroup>
               </TitleSection>
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
  <SmallRow><span>Monthly working hour</span><strong>145 Hrs</strong></SmallRow>
  <SmallRow><span>Total Monthly working hour</span><strong>145 Hrs</strong></SmallRow>
  <SmallRow><span>Weekly working hour</span><strong>45 Hrs</strong></SmallRow>
</SummaryCol>


    <DateNav>
      <DateContainer>
        <CalendarIcon />
        <DayNumber>16</DayNumber>
        <MonthDay>
          <div>November</div>
          <div>Monday</div>
        </MonthDay>
      </DateContainer>

      <NavButtons>
        <IconBtn>{"<"}</IconBtn>
        <IconBtn>{">"}</IconBtn>
      </NavButtons>
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

     
        <TimeTable/>
      </ContainerGrid>
    </PageWrapper>
    </>
  );
};

export default FieldInfo;

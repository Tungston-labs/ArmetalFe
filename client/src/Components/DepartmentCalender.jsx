import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Container,
  LeftSection,
  RightSection,
  SectionTitle,
  DepartmentWrapper,
  DepartmentCard,
  InitialCircle,
  DeptInfo,
  DeptHead,
  DeptCount,
  CalendarWrapper,
  CalendarHeader,
  NavArrow,
  CalendarGrid,
  CalendarDay,
  PresenceWrapper,
  DonutChart,
  PresenceText,
  EmployeeExpiryWrapper,
  EmployeeRow,
  Avatar,
  EmpName,
  EmpId,
  EmpEmail,
  HolidayList,
  HolidayItem,
  HolidayIcon,
  HolidayInfo,
  HolidayTitle,
  HolidayDate,
  ChartConatiner,
} from "./DepartmentCalender.Styles";
import HalfDoughnutChart from "./HalfDoughnutChart";
import {useSelector } from "react-redux";
import HolidaySvg from "../assets/holiday.svg";
const departments = [
  { initial: "D", name: "Developers", count: 12, head: "Ajay Raj" },
  { initial: "G", name: "Graphic designer", count: 12, head: "Dummy" },
  { initial: "U", name: "UI/UX Designer", count: 8, head: "Duummmee" },
];

const employees = [
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
];

const holidays = [
  { title: "Dummy holiday", desc: "Dummy holiday", date: "24 October" },
  { title: "Dummy holiday", desc: "Dummy holiday", date: "24 October" },
];

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const DepartmentCalendar = () => {
  const [month, setMonth] = useState(9); // October
  const [year, setYear] = useState(2025);
 const { summary } = useSelector((state) => state.dashboard);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
 const onLeaveToday = summary?.on_leave_today_count || 0;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeToday = summary?.active_today_count || 0;
  const dates = [];
  const startOffset = (firstDay + 6) % 7;
  for (let i = 0; i < startOffset; i++) dates.push("");
  for (let i = 1; i <= daysInMonth; i++) dates.push(i);
  while (dates.length % 7 !== 0) dates.push("");

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

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <Container>
      {/* LEFT SIDE */}
      <LeftSection>
        {/* Departments */}
        <SectionTitle>
          Department <FiArrowUpRight />
        </SectionTitle>
        <DepartmentWrapper>
          {departments.map((dept, index) => (
            <DepartmentCard key={index}>
              <InitialCircle>{dept.initial}</InitialCircle>
              <DeptInfo>
                <h3>{dept.name}</h3>
                <DeptHead>Department head: {dept.head}</DeptHead>
              </DeptInfo>
              <DeptCount>{dept.count}</DeptCount>
            </DepartmentCard>
          ))}
        </DepartmentWrapper>

        {/* Employee Presence */}
        <SectionTitle>
          Employee Presence & Upcoming Holidays <FiArrowUpRight />
        </SectionTitle>
        <PresenceWrapper>
          <ChartConatiner>
             <HalfDoughnutChart active={activeToday} onLeave={onLeaveToday} />
</ChartConatiner>
          {/* Employee Expiry */}
          <EmployeeExpiryWrapper>
            <h3>Employee Contract Expiry</h3>
            {employees.map((emp, i) => (
              <EmployeeRow key={i}>
                <Avatar src="https://via.placeholder.com/30" />
                <EmpName>{emp.name}</EmpName>
                <EmpId>{emp.id}</EmpId>
                <EmpEmail>{emp.email}</EmpEmail>
              </EmployeeRow>
            ))}
          </EmployeeExpiryWrapper>
        </PresenceWrapper>
      </LeftSection>

      {/* RIGHT SIDE */}
      <RightSection>
        {/* Calendar */}
        <CalendarWrapper>
          <CalendarHeader>
            <NavArrow onClick={prevMonth}>&lt;</NavArrow>
            <h3>
              {monthNames[month]} <span>{year}</span>
            </h3>
            <NavArrow onClick={nextMonth}>&gt;</NavArrow>
          </CalendarHeader>
          <CalendarGrid>
            {days.map((d, i) => (
              <CalendarDay key={i} isHeader>{d}</CalendarDay>
            ))}
            {dates.map((date, i) => {
              const isToday =
                date === currentDay && month === currentMonth && year === currentYear;
              const isSunday = (i + 1) % 7 === 0;

              return (
                <CalendarDay key={i} isToday={isToday} isSunday={isSunday}>
                  {date}
                </CalendarDay>
              );
            })}
          </CalendarGrid>
        </CalendarWrapper>

        {/* Upcoming Holidays */}
        <SectionTitle>
          Upcoming Holidays <FiArrowUpRight />
        </SectionTitle>
        <HolidayList>
          {holidays.map((h, i) => (
            <HolidayItem key={i}>
              <HolidayIcon>
                    <img src={HolidaySvg} alt="holiday icon" />
              </HolidayIcon>
              <HolidayInfo>
                <HolidayTitle>{h.title}</HolidayTitle>
                <p>{h.desc}</p>
              </HolidayInfo>
              <HolidayDate>{h.date}</HolidayDate>
            </HolidayItem>
          ))}
        </HolidayList>
      </RightSection>
    </Container>
  );
};

export default DepartmentCalendar;

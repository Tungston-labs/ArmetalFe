import React from "react";
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
  CalendarGrid,
  CalendarDay,
} from "./DepartmentCalender.Styles";

const departments = [
  { initial: "D", name: "Developers", count: 12, head: "Ajay Raj" },
  { initial: "G", name: "Graphic designer", count: 12, head: "Dummy" },
  { initial: "U", name: "UI/UX Designer", count: 8, head: "Duummmee" },
];

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const dates = [
  "", "", 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, "", "",
];

const DepartmentCalendar = () => {
  return (
    <Container>
      {/* LEFT SIDE: Departments */}
      <LeftSection>
        <SectionTitle>Department</SectionTitle>
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

        {/* Employee presence section */}
        <SectionTitle>Employee Presence & Upcoming Holidays</SectionTitle>
      </LeftSection>

      {/* RIGHT SIDE: Calendar */}
      <RightSection>
        <CalendarWrapper>
          <CalendarHeader>
            <h3>October <span>2025</span></h3>
          </CalendarHeader>
          <CalendarGrid>
            {days.map((d, i) => (
              <CalendarDay key={i} isHeader>
                {d}
              </CalendarDay>
            ))}
            {dates.map((date, i) => (
              <CalendarDay
                key={i}
                isToday={date === 16}
                isHoliday={[5, 12, 19, 26, 2].includes(date)}
              >
                {date}
              </CalendarDay>
            ))}
          </CalendarGrid>
        </CalendarWrapper>
      </RightSection>
    </Container>
  );
};

export default DepartmentCalendar;

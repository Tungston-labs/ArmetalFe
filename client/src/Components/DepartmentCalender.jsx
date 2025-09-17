// DepartmentCalendar.jsx
import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import API from "../services/api"; // <-- use your configured axios
import { NavLink } from "react-router-dom";



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
  ChartConatiner,
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
  ArrowIcon,
} from "./DepartmentCalender.Styles";
import HalfDoughnutChart from "./HalfDoughnutChart";
import HolidaySvg from "../assets/holiday.svg";
import { Link } from "react-router-dom";
const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const DepartmentCalendar = () => {
  const [summary, setSummary] = useState(null);
  console.log({summary})
  const [loading, setLoading] = useState(true);
 const today = new Date();
const [month, setMonth] = useState(today.getMonth());
const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get("/admin/dashboard-summary/");
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>Failed to fetch data.</p>;



  const onLeaveToday = summary.on_leave_today_count || 0;
  const activeToday = summary.active_today_count || 0;

  // Prepare calendar dates
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  const startOffset = (firstDay + 6) % 7; // align with Mon-Sun start
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
const handleDateClick = (date) => {
  if (!date) return; // ignore empty cells
  setSelectedDate({ date, month, year });
};
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const departments = summary.departments || [];
  const upcomingHolidays = summary.upcoming_holidays || [];
  const contractExpiry = summary.upcoming_contract_expiry?.list || [];

  return (
    <Container>
      {/* LEFT SIDE */}
      <LeftSection>
        {/* Departments */}
        <NavLink to="/department" style={{ textDecoration: "none", color: "inherit" }}>
          <SectionTitle>
            Department <FiArrowUpRight />
          </SectionTitle>
        </NavLink>
      <DepartmentWrapper>
  {departments.map((dept) => (
    <DepartmentCard key={dept.id}>
      <InitialCircle>{dept.name.charAt(0)}</InitialCircle>

      <DeptInfo>
        <h3>{dept.name}</h3>
        <DeptHead>Department head: 
       <p>  {dept.head?.name || "N/A"}</p> 
          </DeptHead>
      </DeptInfo>

      <DeptCount>{dept.employee_count}
       <ArrowIcon>
       <Link to={`/departments/${dept.id}`}>
            <FiArrowUpRight size={20} style={{ cursor: "pointer",color:"#304EB0" }} />
          </Link>
      </ArrowIcon>
      </DeptCount>
    </DepartmentCard>
  ))}
</DepartmentWrapper>


        {/* Employee Presence */}
        <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: "none", color: "inherit" }}>
        <SectionTitle>
          Employee Presence & Upcoming Holidays <FiArrowUpRight />
        </SectionTitle>
        </NavLink>
       

        <PresenceWrapper>
          <ChartConatiner>
            <HalfDoughnutChart active={activeToday} onLeave={onLeaveToday} />
          </ChartConatiner>

          {/* Employee Contract Expiry */}
         <EmployeeExpiryWrapper>
            <h3>Employee Contract Expiry</h3>
            {contractExpiry.slice(0, 5).map((emp) => (
              <EmployeeRow key={emp.id}>
                <Avatar src="https://via.placeholder.com/30" />
                <EmpName>{emp.name}</EmpName>
                <EmpId>{emp.employee_id}</EmpId>
                <EmpEmail>{emp.department}</EmpEmail>
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
      <CalendarDay key={i} isHeader>
        {d}
      </CalendarDay>
    ))}

    {dates.map((date, i) => {
      const isToday =
        date === currentDay &&
        month === currentMonth &&
        year === currentYear;

      const isSunday = (i + 1) % 7 === 0;

      const isSelected =
        selectedDate &&
        selectedDate.date === date &&
        selectedDate.month === month &&
        selectedDate.year === year;

      return (
        <CalendarDay
          key={i}
          isToday={isToday}
          isSunday={isSunday}
          isSelected={isSelected}
          onClick={() => handleDateClick(date)}
        >
          {date}
        </CalendarDay>
      );
    })}
  </CalendarGrid>
</CalendarWrapper>


        {/* Upcoming Holidays */}
       
        <NavLink to="/holiday" style={{ textDecoration: "none", color: "inherit" }}>
        <SectionTitle>
        Upcoming Holidays <FiArrowUpRight />
        </SectionTitle>
        </NavLink>
        <HolidayList>
          {upcomingHolidays.map((h, i) => (
            <HolidayItem key={i}>
              <HolidayIcon>
                <img src={HolidaySvg} alt="holiday icon" />
              </HolidayIcon>
              <HolidayInfo>
                <HolidayTitle>{h.description}</HolidayTitle>
                <p>{h.holiday_type}</p>
              </HolidayInfo>
              <HolidayDate>{new Date(h.date).toLocaleDateString()}</HolidayDate>
            </HolidayItem>
          ))}
        </HolidayList>
      </RightSection>
    </Container>
  );
};

export default DepartmentCalendar;

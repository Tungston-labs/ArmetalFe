import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { NavLink, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../Components/Loader";
import HalfDoughnutChart from "./HalfDoughnutChart";
import HolidaySvg from "../assets/holiday.svg";
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
  UpcomingHolidaySection,
} from "./DepartmentCalender.Styles";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// ✅ Helper to parse YYYY-MM-DD as local date (avoids timezone shift)
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// ✅ Map day name to number (0 = Sunday, 6 = Saturday)
const dayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const DepartmentCalendar = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [sliceCount, setSliceCount] = useState(3);
  const [holidaySliceCount, setHolidaySliceCount] = useState(3);

  // Fetch dashboard summary
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

  // Adjust slice counts for responsiveness
  useEffect(() => {
    const updateSliceCount = () => {
      const width = window.innerWidth;
      if (width < 768) setSliceCount(3), setHolidaySliceCount(2);
      else if (width < 1024) setSliceCount(6), setHolidaySliceCount(9);
      else if (width < 1440) setSliceCount(3), setHolidaySliceCount(5);
      else if (width < 1920) setSliceCount(5), setHolidaySliceCount(3);
      else if (width < 2560) setSliceCount(6), setHolidaySliceCount(3);
      else setSliceCount(8), setHolidaySliceCount(4);
    };
    updateSliceCount();
    window.addEventListener("resize", updateSliceCount);
    return () => window.removeEventListener("resize", updateSliceCount);
  }, []);

  if (!summary) return <Loader />;

  const onLeaveToday = summary.on_leave_today_count || 0;
  const activeToday = summary.active_today_count || 0;
  const departments = summary.departments || [];
  const upcomingHolidays = summary.upcoming_holidays || [];
  const contractExpiry = summary.upcoming_contract_expiry?.list || [];
  const companyHolidays = summary.all_company_holidays?.list || [];

  // Generate array of dates for calendar
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7;
  const dates = Array.from({ length: startOffset + daysInMonth }, (_, i) =>
    i < startOffset ? "" : i - startOffset + 1
  );

  const prevMonth = () =>
    month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1);
  const nextMonth = () =>
    month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1);

  const handleDateClick = (date) => {
    if (date) setSelectedDate({ date, month, year });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ✅ Get holiday for a specific date (recurring company off-days included)
  const getHolidayForDate = (date) => {
    if (!companyHolidays) return null;

    // Check recurring company_off_day (e.g., every Saturday)
    const recurringHoliday = companyHolidays.find((h) => {
      if (h.holiday_type !== "company_off_day" || !h.day) return false;
      const dayNum = dayNameToNumber[h.day];
      return new Date(year, month, date).getDay() === dayNum;
    });
    if (recurringHoliday) return recurringHoliday;

    // Check normal holidays
    const normalHoliday = companyHolidays.find((h) => {
      const hDate = parseDate(h.date);
      return (
        hDate &&
        hDate.getDate() === date &&
        hDate.getMonth() === month &&
        hDate.getFullYear() === year
      );
    });

    return normalHoliday || null;
  };

  return (
    <Container>
      {loading && <Loader />}

      {/* LEFT SIDE */}
      <LeftSection>
        {/* Departments */}
        <NavLink
          to="/department"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <SectionTitle>
            Department <FiArrowUpRight style={{ color: "#3352ba" }} />
          </SectionTitle>
        </NavLink>

        <DepartmentWrapper>
          {departments.map((dept) => (
            <DepartmentCard key={dept.id}>
              <InitialCircle>{dept.name.charAt(0)}</InitialCircle>
              <DeptInfo>
                <h3>{dept.name}</h3>
                <DeptHead>
                  Department head: <p>{dept.head?.name || "N/A"}</p>
                </DeptHead>
              </DeptInfo>
              <DeptCount>
                {dept.employee_count}
                <ArrowIcon>
                  <Link to={`/departments/${dept.id}`}>
                    <FiArrowUpRight
                      size={20}
                      style={{ cursor: "pointer", color: "#304EB0" }}
                    />
                  </Link>
                </ArrowIcon>
              </DeptCount>
            </DepartmentCard>
          ))}
        </DepartmentWrapper>

        {/* Employee Presence */}
        <NavLink
          to="/employee-Contract-Visa-Expiry"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <SectionTitle>
            Employee Presence & Upcoming Holidays{" "}
            <FiArrowUpRight style={{ color: "#3352ba" }} />
          </SectionTitle>
        </NavLink>

        <PresenceWrapper>
          <ChartConatiner>
            <HalfDoughnutChart active={activeToday} onLeave={onLeaveToday} />
          </ChartConatiner>

          <EmployeeExpiryWrapper>
            <h3>Employee Contract Expiry</h3>
            {contractExpiry.slice(0, sliceCount).map((emp) => (
              <EmployeeRow key={emp.id}>
                <Avatar
                  src={emp.profile_pic || "https://via.placeholder.com/30"}
                  alt={emp.name}
                />
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
              if (date === "") return <CalendarDay key={i} />;

              const isToday =
                date === currentDay &&
                month === currentMonth &&
                year === currentYear;

              const dateObj = new Date(year, month, date);
              const isSunday = dateObj.getDay() === 0;

              const isSelected =
                selectedDate &&
                selectedDate.date === date &&
                selectedDate.month === month &&
                selectedDate.year === year;

              const holiday = getHolidayForDate(date);

             return (
  <CalendarDay
    key={i}
    isToday={isToday}
    isSunday={isSunday}
    isSelected={isSelected}
    onClick={() => handleDateClick(date)}
    title={holiday ? holiday.description : ""}
    style={{
      position: "relative",
      backgroundColor: holiday ? "#FFECEC" : undefined, // highlight holiday
      border: holiday ? "0.7px solid red" : "1px solid #ddd", // ✅ red border for holidays
      borderRadius: "4px", // optional: rounded corners
      cursor: holiday ? "pointer" : "default",
    }}
  >
    {date}

    {/* Holiday icon */}
    {holiday && (
      <img
        src={HolidaySvg}
        alt={holiday.description}
        title={holiday.description}
        style={{
          width: "10px",
          height: "10px",
          position: "absolute",
          bottom: "2px",
          right: "2px",
        }}
      />
    )}
  </CalendarDay>
);

            })}
          </CalendarGrid>
        </CalendarWrapper>

        {/* Upcoming Holidays */}
        <UpcomingHolidaySection>
          <NavLink
            to="/holiday"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SectionTitle>
              Upcoming Holidays <FiArrowUpRight style={{ color: "#3352ba" }} />
            </SectionTitle>
          </NavLink>

          <HolidayList>
            {upcomingHolidays.slice(0, holidaySliceCount).map((h, i) => (
              <HolidayItem key={i}>
                <HolidayIcon>
                  <img src={HolidaySvg} alt="holiday icon" />
                </HolidayIcon>
                <HolidayInfo>
                  <HolidayTitle title={h.description}>
                    {h.description.length > 20
                      ? h.description.slice(0, 20) + "..."
                      : h.description}
                  </HolidayTitle>
                  <p>{h.holiday_type}</p>
                </HolidayInfo>
                <HolidayDate>
                  {parseDate(h.date)?.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </HolidayDate>
              </HolidayItem>
            ))}
          </HolidayList>
        </UpcomingHolidaySection>
      </RightSection>
    </Container>
  );
};

export default DepartmentCalendar;

import React, { useEffect, useState } from "react";
import {
  Container,
  Icon,
  DepartmentGrid,
  Label,
  DepartmentCard,
  Heading,
  DepartmentCalendarWrapper,
  CalendarWrapper,
  Flex,
  SubText,
  PresenceContainer,
  ChartContainer,
  ContractList,
  ContractItem,
  Avatar,
  HolidayCard,
  HolidayItem,
  LeftSection,
  SvgIcon,
  ResponsiveHr,
  LineWithIcon,
} from "./DashboardNew.Styles";
import { FiArrowUpRight } from "react-icons/fi";
import { Calendar, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { FaUserCircle } from "react-icons/fa";
import HalfDoughnutChart from "../../Components/HalfDoughnutChart";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummary } from "../../Redux/dashboardSlice";
import { useLogout } from "../../services/logout";
import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader";
import Cards from "../../Components/Cards";
import { Link } from "react-router-dom";
import HolidaySvg from "../../assets/holiday.svg";
// import EmployeeContract from "../../Components/EmployeeContract"
import DepartmentCalendar from "../../Components/DepartmentCalender";
const CardsOnly = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [hover, setHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hovers, setHovers] = useState(false);
  const handleLogout = useLogout();

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  // Extract data from API response
  const employeesList = summary?.total_employees?.list || [];
  const departmentsList = summary?.departments || [];
  const upcomingHolidays = summary?.upcoming_holidays || [];
  const contractExpiryList = summary?.upcoming_contract_expiry?.list || [];
  const visaExpiryList = summary?.upcoming_visa_expiry?.list || [];
  const leaveRequest = summary?.pending_leaves?.list || [];
  const activeToday = summary?.active_today_count || 0;
  const onLeaveToday = summary?.on_leave_today_count || 0;

  // Public holidays API (external)
  useEffect(() => {
    async function fetchPublicHolidays() {
      try {
        const res = await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/2025/IN`
        );
        const data = await res.json();
        const publicHolidays = data.map((holiday) => ({
          date: holiday.date,
          name: holiday.localName,
          type: "Public Holiday",
        }));
        setHolidays(publicHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    }
    fetchPublicHolidays();
  }, []);

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayHolidays = holidays.filter((holiday) => holiday.date === dateStr);
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {dayHolidays.map((item, index) => (
          <li key={index}>
            <Badge status="success" text={item.name} />
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full screen center
          width: "100%",
        }}
      >
        <Loader size="large" />
      </div>
    );
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar />

      <Container>
        <Cards />
        <DepartmentCalendar />
      </Container>
    </>
  );
};

export default CardsOnly;

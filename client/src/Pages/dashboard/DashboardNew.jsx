import React, { useEffect, useState } from "react";
import {
  Container,
  LeftIcon,
  CardGrid,
  VerticalBar,
  CardContent,
  Card,
  CardHeader,
  CardList,
  Icon,
  DepartmentGrid,
  Label,
  DepartmentCard,
  Heading,
  DepartmentCalendarWrapper,
  CalendarWrapper,
  Flex,
  UserMenuWrapper,
  DropdownIcon,
  DropdownMenu,
  SubText,
  PresenceContainer,
  ChartContainer,
  ContractList,
  ContractItem,
  Avatar,
  HolidayCard,
  HolidayItem,
} from "./DashboardNew.Styles";
import { FiArrowUpRight } from "react-icons/fi";
import { Calendar, Badge } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import "antd/dist/reset.css";
import { FaUserCircle } from "react-icons/fa";
import HalfDoughnutChart from "../../Components/HalfDoughnutChart";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummary } from "../../Redux/dashboardSlice";
import { useLogout } from "../../services/logout";
import Navbar from "../../Components/Navbar"
import { Spin } from "antd";
import Cards from "../../Components/Cards"
import { Link } from "react-router-dom";
import colors from "react-multi-date-picker/plugins/colors";
const CardsOnly = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);

  const [menuOpen, setMenuOpen] = useState(false);
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
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2025/IN`);
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
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
    <Navbar />
    
    <Container>
  <Cards/>

      {/* Cards Row */}
      {/* <CardGrid>
        <Card>
          <LeftIcon>
            <img src={`../assets/total.svg`} alt="User Icon" width={40} height={40} />
          </LeftIcon>
          <VerticalBar />
          <CardContent>
            <CardHeader>
              <h3>Total Employees</h3>
              <span>{summary?.total_employees?.count || 0}</span>
            </CardHeader>
            <CardList>
  {employeesList.slice(0, 3).map((emp) => (
    <li key={emp.id}>
      <span>{emp.name}</span>
      <span>{emp.department}</span>
      <span>{emp.designation}</span>
    </li>
  ))}
</CardList>

          </CardContent>
          <Icon>
          <Link to="/employee">
  <FiArrowUpRight size={20} style={{ cursor: "pointer" }} />
</Link>
          </Icon>
        </Card>
        <Card>
          <LeftIcon>
            <img src={`../assets/total2.svg`} alt="User Icon" width={40} height={40} />
          </LeftIcon>
          <VerticalBar />
          <CardContent>
            <CardHeader>
              <h3>Employee Leave Request</h3>
              <span>{summary?.pending_leaves?.count || 0}</span>
            </CardHeader>
           <CardList>
  {leaveRequest.slice(0, 3).map((emp) => (
    <li key={emp.id}>
      <span>{emp.employee}</span>
      <span>{emp.department}</span>
      <span>
        {emp.from_date} – {emp.to_date}
      </span>
    </li>
  ))}
</CardList>
          </CardContent>
          <Icon>
          <Link to="/leave-request">
  <FiArrowUpRight size={20} style={{ cursor: "pointer" }} />
</Link>
          </Icon>
        </Card>
        <Card>
          <LeftIcon>
            <img src={`../assets/total3.svg`} alt="User Icon" width={40} height={40} />
          </LeftIcon>
          <VerticalBar />
          <CardContent>
            <CardHeader>
              <h3>Employee Visa Expiry</h3>

              <span>{summary?.upcoming_visa_expiry?.count || 0}</span>
            </CardHeader>
           <CardList>
  {visaExpiryList.slice(0, 3).map((emp) => (
    <li key={emp.id}>
      <span>{emp.name}</span>
      <span>{emp.department}</span>
      <span>{emp.visa_expiry_date}</span>
    </li>
  ))}
</CardList>


          </CardContent>
          <Icon>
          <Link to="/employee-Contract-Visa-Expiry">
  <FiArrowUpRight size={20} style={{ cursor: "pointer" }} />
</Link>
          </Icon>
        </Card>
      </CardGrid> */}

      {/* Department + Calendar Row */}
      <Heading>Department</Heading>
  <hr
  style={{
    border: "none",
    borderTop: "2px solid #3352BA",
    margin: "1rem 0",
  }}
/>

      <DepartmentCalendarWrapper>
        <DepartmentGrid>
          {departmentsList.map((dept) => (
            <DepartmentCard key={dept.id}>
              <Label>{dept.name.charAt(0)}</Label>
              <div>
                <h4>{dept.name}</h4>
                <p>Department Head</p>
                <strong>{dept.head?.name}</strong>
                </div>
              <Icon>
              <Link to="/department">
  <FiArrowUpRight size={20} style={{ cursor: "pointer" }} />
</Link>
              </Icon>
            </DepartmentCard>
          ))}
        </DepartmentGrid>
        <CalendarWrapper>
          <Calendar fullscreen={false} dateCellRender={dateCellRender} />
        </CalendarWrapper>
      </DepartmentCalendarWrapper>

      {/* Presence + Contract Expiry */}
      <Flex justify="space-between" align="center">
     <Heading
  mb={0}
  // style={{
  //   borderBottom: "2px solid #3352BA",
  //   display: "inline-block",
  //   paddingBottom: "8px",
  // }}
>
  Employee Presence & Upcoming Holidays
</Heading>

      </Flex>
    <hr
  style={{
    border: "none",
    borderTop: "2px solid #3352BA",
    margin: "1rem 0",
  }}
/>
      <PresenceContainer>
        <ChartContainer>
          <HalfDoughnutChart active={activeToday} onLeave={onLeaveToday} />
          <SubText>
            <span style={{ color: "#2f4ded" }}>■ Active Employees</span> &nbsp;
            <span style={{ color: "#ff6b5f" }}>■ On Leave Today</span>
          </SubText>
        </ChartContainer>

        <ContractList>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "satoshi",
              fontSize: "1.3rem",
            }}
          >
            <h4>Employee Contract Expiry</h4>
            <Link to="/employee-Contract-Visa-Expiry" style={{ textDecoration: "none" }}>
  <FiArrowUpRight
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
      color: isHovered ? "#1a2a7a" : "#3352BA",
      fontSize: "25px",
      cursor: "pointer",
      transform: isHovered ? "scale(1.2)" : "scale(1)",
      transition: "all 0.3s ease",
    }}
  />
</Link>
          </div>
          {contractExpiryList.map((emp) => (
          <ContractItem key={emp.id}>
  <Avatar>
    <FaUserCircle />
  </Avatar>
  <p>{emp.name}</p>
  <small>{emp.employee_id}</small>
  <span>{emp.contract_expiry_date}</span>
</ContractItem>
          ))}
        </ContractList>

        {/* Upcoming Holidays */}
        <HolidayCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "satoshi",
              fontSize: "1.2rem",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "10px" }}>Upcoming Holidays</h3>
            <Link to="/holiday">
  <FiArrowUpRight
    onMouseEnter={() => setHovers(true)}
    onMouseLeave={() => setHovers(false)}
    style={{
      color: hovers ? "#1a2a7a" : "blue",
      fontSize: "25px",
      cursor: "pointer",
      transform: hovers ? "scale(1.2)" : "scale(1)",
      transition: "all 0.3s ease",
    }}
  />
</Link>
          </div>
          {upcomingHolidays.map((holiday, i) => (
            <HolidayItem key={i}>
              <div>
                <h4>{holiday.description}</h4>
                <p>{holiday.holiday_type}</p>
              </div>
              <span>{holiday.date}</span>
            </HolidayItem>
          ))}
        </HolidayCard>
      </PresenceContainer>
    </Container>
    </>
  );
};

export default CardsOnly;

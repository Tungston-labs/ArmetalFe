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

const CardsOnly = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);

  const [menuOpen, setMenuOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [hover, setHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hovers, setHovers] = useState(false);

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  // Extract data from API response
  const employeesList = summary?.total_employees?.list || [];
  const departmentsList = summary?.departments || [];
  const upcomingHolidays = summary?.upcoming_holidays || [];
  const contractExpiryList = summary?.upcoming_contract_expiry?.list || [];
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

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      {/* Top Right User Menu */}
      <div
        style={{
          position: "absolute",
          top: "1px",
          right: "20px",
          cursor: "pointer",
          fontSize: "28px",
          color: "#14141fff",
        }}
      >
        <UserMenuWrapper onClick={() => setMenuOpen(!menuOpen)}>
          <FaUserCircle size={28} />
          <DropdownIcon>
            <IoIosArrowDown />
          </DropdownIcon>
        </UserMenuWrapper>
        {menuOpen && (
          <DropdownMenu>
            <div>Logout</div>
            <div>Change Password</div>
          </DropdownMenu>
        )}
      </div>

      {/* Cards Row */}
      <CardGrid>
        <Card>
          <LeftIcon>
            <img src={`/src/assets/total.svg`} alt="User Icon" width={40} height={40} />
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
                  {emp.name} - {emp.department} - {emp.designation}
                </li>
              ))}
            </CardList>
          </CardContent>
          <Icon>
            <FiArrowUpRight />
          </Icon>
        </Card>
        <Card>
          <LeftIcon>
            <img src={`/src/assets/total.svg`} alt="User Icon" width={40} height={40} />
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
                  {emp.name} - {emp.department} - {emp.designation}
                </li>
              ))}
            </CardList>
          </CardContent>
          <Icon>
            <FiArrowUpRight />
          </Icon>
        </Card>
        <Card>
          <LeftIcon>
            <img src={`/src/assets/total.svg`} alt="User Icon" width={40} height={40} />
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
                  {emp.name} - {emp.department} - {emp.designation}
                </li>
              ))}
            </CardList>
          </CardContent>
          <Icon>
            <FiArrowUpRight />
          </Icon>
        </Card>
      </CardGrid>

      {/* Department + Calendar Row */}
      <Heading>Department</Heading>
      <DepartmentCalendarWrapper>
        <DepartmentGrid>
          {departmentsList.map((dept) => (
            <DepartmentCard key={dept.id}>
              <Label>{dept.name.charAt(0)}</Label>
              <div>
                <h4>{dept.name}</h4>
                <p>Department Head</p>
                <strong>{dept.department_head}</strong>
              </div>
              <Icon>
                <FiArrowUpRight />
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
        <Heading mb={0}>Employee Presence & Upcoming Holidays</Heading>
      </Flex>

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
          </div>
          {contractExpiryList.map((emp) => (
            <ContractItem key={emp.id}>
              <Avatar>
                <FaUserCircle />
              </Avatar>
              <div>
                <p>{emp.name}</p>
                <small>{emp.department}</small>
              </div>
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
              fontSize: "1.3rem",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "20px" }}>Upcoming Holidays</h3>
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
  );
};

export default CardsOnly;

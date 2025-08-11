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
UserMenuWrapper, DropdownIcon, DropdownMenu,
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
const employees = [
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
{ name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
];

const departments = [
  { name: "Human Resources", head: "John Doe", members: 12 },
  { name: "Finance", head: "Jane Smith", members: 8 },
  { name: "Engineering", head: "Michael Johnson", members: 15 },
  { name: "Engineering", head: "Michael Johnson", members: 15 },
];

const CardsOnly = () => {
      const [menuOpen, setMenuOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
const [hover, setHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hovers, setHovers] = useState(false);
  useEffect(() => {
    async function fetchPublicHolidays() {
      try {
        const res = await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/2025/IN` // Change country code as needed
        );
        const data = await res.json();

        const publicHolidays = data.map((holiday) => ({
          date: holiday.date,
          name: holiday.localName,
          type: "Public Holiday",
        }));

        // Your company holidays
        const customHolidays = [
          { date: "2025-05-15", name: "Company Foundation Day", type: "Company Holiday" },
          { date: "2025-09-01", name: "Team Retreat", type: "Company Event" },
        ];

        setHolidays([...publicHolidays, ...customHolidays]);
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

  return (
    <Container>
          <div style={{
    position: "absolute",
    top: "1px",
    right: "20px",
    cursor: "pointer",
    fontSize: "28px",
    color: "#14141fff"
  }}>
      <UserMenuWrapper onClick={() => setMenuOpen(!menuOpen)}>
        <FaUserCircle size={28} />
        <DropdownIcon>
          <IoIosArrowDown />
        </DropdownIcon>
      </UserMenuWrapper>

      {/* Dropdown Menu */}
      {menuOpen && (
        <DropdownMenu>
          <div>Logout</div>
        <div>Change Password</div>
          {/* <div>Settings</div> */}
        </DropdownMenu>
      )}
  </div>
      {/* Cards Row */}
      <CardGrid>
        {Array(3)
          .fill("")
          .map((_, idx) => (
            <Card key={idx}>
              <LeftIcon>
                <img
                  src={`/src/assets/total${idx === 0 ? "" : "2"}.svg`}
                  alt="User Icon"
                  width={40}
                  height={40}
                />
              </LeftIcon>

              <VerticalBar />

              <CardContent>
                <CardHeader>
                  <h3>Total Employees</h3>
                  <span>12</span>
                </CardHeader>

                <CardList>
                  {employees.slice(0, 3).map((emp, i) => (
                    <li key={i}>
                      {emp.name} - {emp.id} - Department
                    </li>
                  ))}
                </CardList>
              </CardContent>

              <Icon>
                <FiArrowUpRight />
              </Icon>
            </Card>
          ))}
      </CardGrid>

      {/* Department + Calendar Row */}
      <Heading>Department</Heading>
      <DepartmentCalendarWrapper>
        {/* Left: Departments */}
        <DepartmentGrid>
          {departments.map((dept, index) => (
            <DepartmentCard key={index}>
              <Label>{dept.name.charAt(0)}</Label>
              <div>
                <h4>{dept.name}</h4>
                <p>Department Head</p>
                <strong>{dept.head}</strong>
              </div>
              <Icon>
                <FiArrowUpRight />
              </Icon>
            </DepartmentCard>
          ))}
        </DepartmentGrid>

        {/* Right: Calendar */}
        <CalendarWrapper>
          <Calendar fullscreen={false} dateCellRender={dateCellRender} />
        </CalendarWrapper>

      
      </DepartmentCalendarWrapper>
      
            <Flex justify="space-between" align="center">
        <Heading mb={0}>Employee Presence & Upcoming Holidays</Heading>

        {/* <FiArrowUpRight
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            color: hover ? "darkblue" : "blue",
            fontSize: "25px",
            cursor: "pointer",
            transform: hover ? "scale(1.2)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        /> */}
     {/* <hr />   */}
      </Flex>
      {/* <hr /> */}

      {/* Presence Chart + Contract Expiry */}
      <PresenceContainer>
        <ChartContainer>
          <HalfDoughnutChart active={180} onLeave={71} />
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

          {employees.map((emp, i) => (
            <ContractItem key={i}>
              <Avatar>
                <FaUserCircle />
              </Avatar>
              <div>
                <p>{emp.name}</p>
              </div>
              <span>{emp.id}</span>
              <span>{emp.email}</span>
            </ContractItem>
          ))}
        </ContractList>
     

      {/* Upcoming Holidays */}
      {/* <HolidayCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "-10px",
            fontFamily: "satoshi",
            fontSize: "1.3rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Upcoming Holidays</h3>
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

        {[1, 2, 3].map((_, i) => (
          <HolidayItem key={i}>
            <div>
              <h4>Dummy Holiday</h4>
              <p>Dummy holiday description</p>
            </div>
            <span>24 October</span>
          </HolidayItem>
        ))}
      </HolidayCard> */}
         <HolidayCard>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",fontFamily:"satoshi",fontSize:"1.3rem" }}>
          <h3 style={{ margin: 0,marginBottom:"20px" }}>Upcoming Holidays</h3>
            <FiArrowUpRight
                onMouseEnter={() => setHovers(true)}
                onMouseLeave={() => setHovers(false)}
                style={{
                  color: hovers ? '#1a2a7a' : 'blue',
                  fontSize: '25px',
                  cursor: 'pointer',
                  transform: hovers ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              />
          
        </div>
        
              
              {[1, 2, 3,4].map((_, i) => (
                <HolidayItem key={i}>
                  <div>
                    <h4>Dummy Holiday</h4>
                    <p>Dummy holiday</p>
                  </div>
                  <span>24 October</span>
                </HolidayItem>
              ))}
            </HolidayCard>
             </PresenceContainer>
    </Container>
  );
};

export default CardsOnly;

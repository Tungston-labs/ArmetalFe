import React,{useState} from "react";
import {
  Container,LeftIcon,
  CardGrid,VerticalBar,CardContent,
  Card,Flex,
  CardHeader,
  CardList,
  DepartmentGrid,
  DepartmentCard,
  PresenceContainer,
  ChartContainer,
  ContractList,
  ContractItem,
  Avatar,
  Label,
  Heading,
  SubText,
  Icon,
  MainContent,
  LeftContent,
  RightPanel,
  VisaCard,
  CalendarCard,
  HolidayCard,
  HolidayItem,
  StyledCalendar,
} from "./NewDashboard.Styles"; // remove StyledCalendar from here
import { Calendar as HijriCalendar } from 'react-multi-date-picker';
import 'react-calendar/dist/Calendar.css'; // ⬅️ make sure this CSS is imported
import { CalendarWrapper } from './NewDashboard.Styles'; // ⬅️ we’ll define this in styles
import { FaUserCircle } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import HalfDoughnutChart from "../../Components/HalfDoughnutChart";
import arabic from 'react-date-object/calendars/arabic';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import DateObject from "react-date-object";
// import { ReactComponent as UserSVG } from '../../assets/total.svg'; // adjust path

import hijri from "react-date-object/calendars/arabic";
import 'react-multi-date-picker/styles/layouts/mobile.css'; 
// import HijriDate from 'hijri-date/lib/safe';

const employees = [
  { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
   { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
    { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
  // Repeat more dummy data if needed
];
const departments = [
  { name: "Developers", head: "Ajay Raj" },
  { name: "Graphic Designer", head: "Dummy" },
  { name: "UI/UX Designer", head: "Duummeee" },
  // add more departments if needed
];
const currentHijri = new DateObject({ calendar: hijri, locale: arabic_ar });

const monthName = currentHijri.month.name;
const year = currentHijri.year;

const Dashboard = () => {
    const [hover, setHover] = useState(false);
      const [isHovered, setIsHovered] = useState(false);
        const [hovers, setHovers] = useState(false);
  return (
    <Container>
<MainContent>
          <LeftContent>
      {/* Top Cards */}
      <CardGrid>
       <Card>
<LeftIcon>
  <img src="/src/assets/total.svg" alt="User Icon" width={40} height={40} />
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


 <Card>
<LeftIcon>
  <img src="/src/assets/total2.svg" alt="User Icon" width={40} height={40} />
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
      </CardGrid>

      {/* Department Section */}
      <Heading>Department</Heading>
    <DepartmentGrid>
  {departments.map((dept, index) => (
    <DepartmentCard key={index}>
      <Label>{dept.name.charAt(0)}</Label>   {/* 👈 Dynamically get first letter */}
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


      {/* Presence & Expiry Section */}

   
     <Flex justify="space-between" align="center">
  <Heading mb={0}>Employee Presence & Upcoming Holidays</Heading>
  {/* <FiArrowUpRight  style={{color:"#3352BA",fontSize:"30px"}} />
   */}
    <FiArrowUpRight
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? 'darkblue' : 'blue',
        fontSize: '25px',
        cursor: 'pointer',
        transform: hover ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 0.3s ease',
      }}
    />
</Flex>
      <hr></hr>
      <PresenceContainer>
       <ChartContainer>
  <HalfDoughnutChart active={180} onLeave={71} />

  <SubText>
    <span style={{ color: "#2f4ded" }}>■ Active Employees</span> &nbsp;
    <span style={{ color: "#ff6b5f" }}>■ On Leave Today</span>
  </SubText>
</ChartContainer>

        <ContractList>
          <div style={{ display: "flex", justifyContent: "space-between",fontFamily:"satoshi",fontSize:"1.3rem" }}>
            <h4>Employee Contract Expiry</h4>
   {/* <FiArrowUpRight style={{color:"#3352BA",fontSize:"25px"}} /> */}
 <FiArrowUpRight
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          color: isHovered ? '#1a2a7a' : '#3352BA',
          fontSize: '25px',
          cursor: 'pointer',
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 0.3s ease',
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
      </PresenceContainer>
      </LeftContent>
       <RightPanel>
    {/* Employee Visa Expiry Card */}
  <VisaCard>
<LeftIcon>
  <img src="/src/assets/total3.svg" alt="User Icon" width={40} height={40} />
</LeftIcon>

  <VerticalBar />

  <CardContent>
    <CardHeader>
      <h3>Visa Employees</h3>
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
</VisaCard>




    {/* Calendar */}
<CalendarCard>
{/* <h3 style={{ textAlign: "center", marginBottom: "8px" }}>
  {monthName} {year}
</h3> */}
  <CalendarWrapper style={{ direction: 'rtl' }}>
    <HijriCalendar
      calendar={arabic}
      locale={arabic_ar}
      value={new Date()}
      onChange={() => {}}
    />
  </CalendarWrapper>
</CalendarCard>
    {/* Upcoming Holidays */}
    <HolidayCard>
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-10px",fontFamily:"satoshi",fontSize:"1.3rem" }}>
  <h3 style={{ margin: 0 }}>Upcoming Holidays</h3>
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

      
      {[1, 2, 3,].map((_, i) => (
        <HolidayItem key={i}>
          <div>
            <h4>Dummy Holiday</h4>
            <p>Dummy holiday</p>
          </div>
          <span>24 October</span>
        </HolidayItem>
      ))}
    </HolidayCard>
  </RightPanel>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
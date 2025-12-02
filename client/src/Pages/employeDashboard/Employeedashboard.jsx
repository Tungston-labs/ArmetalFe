import React, { useEffect } from "react";
import {
  Container,
  CardGrid,
  MainWrapper,
  InfoCard,
  ScrollableTableWrapper,
  CardTitle,
  CardSubtitle,
  CardLink,
  DepartmentBox,
  Department,
  DepartmentTitleRow,
  DepartmentTitle,
  DepartmentCount,
  SubLabel,
  DepartmentHead,
  MemberList,
  Member,
  Avatar,
  SvgIcon,
  MemberName,
  ArrowIcon,
  TimeLogContainer,
  DateHeading,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Icon,
  ArrowButton,
} from "./Employeedashboard.Styles";
import InCompanyIcon from "../../assets/clock.svg";
import { FaRegClock, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { BiTimeFive } from "react-icons/bi";
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import LeaveIcon from "../../assets/leave.svg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeDash } from "../../Redux/authSlice";
import punchTime from "../../assets/puchtime.svg";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
const TimeLogDashboard = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employeeDashData, loadingEmployeeDash, employeeDashError } =
    useSelector((state) => state.auth);

    console.log({employeeDashData});
    

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeDash(employeeId));
    }
  }, [employeeId, dispatch]);

  const baseUrl = "http://178.248.112.16:8001";

  if (loadingEmployeeDash) {
 
  }
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;
  const getPreviousMonthName = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleString('default', { month: 'long' });
};

const infoCards = [
  {
    title: employeeDashData?.contract_expiry_date || "N/A",
    subtitle: "Days",
    label: "Contract Expiry",
    icon: InCompanyIcon,
  },
  {
    title: employeeDashData?.visa_expiry_date || "N/A",
    subtitle: "Date",
    label: "Visa Expiry",
    icon: InCompanyIcon,
  },
  {
    title: getPreviousMonthName(), 
    subtitle: "Month",
    label: "Pay slip",
    icon: InCompanyIcon,
  },
  {
    title: employeeDashData?.attendance_summary?.monthly_working_hours,
    subtitle: " Logged Hours",
    label: "Monthly  ",
    icon: LeaveIcon,
  },
];
  const members = employeeDashData?.department_employees?.employees || [];
const formatTime = (timeStr) => {
  if (!timeStr) return "--";
  const today = new Date().toISOString().split("T")[0]; 
  return new Date(`${today}T${timeStr}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatUTCToLocal = (utcTimeStr) => {
  if (!utcTimeStr) return "--";

  // Get today's date in UTC (YYYY-MM-DD)
  const nowUTC = new Date();
  const utcYear = nowUTC.getUTCFullYear();
  const utcMonth = String(nowUTC.getUTCMonth() + 1).padStart(2, "0");
  const utcDay = String(nowUTC.getUTCDate()).padStart(2, "0");

  // Build full UTC datetime string
  const utcDateTimeStr = `${utcYear}-${utcMonth}-${utcDay}T${utcTimeStr}Z`;

  // Parse and convert to local time
  return new Date(utcDateTimeStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


  return (
    <Container>
    <MainWrapper>
        <CardGrid>
          {infoCards.map((card, index) => (
            <InfoCard key={index}>
              <CardTitle>{card.title}</CardTitle>
              <CardSubtitle>{card.subtitle}</CardSubtitle>
              <CardLink>
                <SvgIcon src={card.icon} alt="icon" />
                {card.label}
              </CardLink>
            </InfoCard>
          ))}
        </CardGrid>
        <DepartmentBox>
         
          <Department>
            <DepartmentTitleRow>
              <DepartmentTitle>
                {employeeDashData?.bank_details?.employee?.department}
              </DepartmentTitle>
              <ArrowIcon onClick={() => navigate("/department")} style={{ cursor: "pointer" }}>
      <BiSolidRightTopArrowCircle style={{color:"#2f49d1"}} />
    </ArrowIcon>
    
            </DepartmentTitleRow>

            <hr></hr>
            <SubLabel>Department head</SubLabel>
            <DepartmentHead>{employeeDashData?.department_head?.name}</DepartmentHead>
          </Department>
          <MemberList>
            {members.map((member, index) => (
              <Member key={index}>
                <Avatar
                  src={
                    member.profile_pic
                      ? `${baseUrl}${member?.profile_pic}`
                      : "/default-avatar.png"
                  }
                  alt={member.name}
                />

                <MemberName>{member.name}</MemberName>
              </Member>
            ))}
          </MemberList>
        </DepartmentBox>

        {/* Time Log Table */}
        {/* <DateHeading>
  {new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}

</DateHeading> */}

     {/* <TimeLogContainer>
  <ScrollableTableWrapper>
    {employeeDashData?.today_sessions?.length > 0 ? (
      <Table>
        <thead>
          <TableRow>
            <TableHeader green style={{ textAlign: "left" }}>
              Time In
            </TableHeader>
            <TableHeader style={{ textAlign: "center" }}>To</TableHeader>
            <TableHeader red style={{ textAlign: "right" }}>
              Time Out
            </TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {employeeDashData.today_sessions.map((session, index) => (
            <TableRow key={index}>
           <TableCell align="left">
  <Icon>
    <BiTimeFive />
  </Icon>
  {formatUTCToLocal(session.time_in)}
</TableCell>

<TableCell align="center" className="separator">To</TableCell>

<TableCell align="right">
  <Icon>
    <BiTimeFive />
  </Icon>
  {formatUTCToLocal(session.time_out)}
</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    ) : (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <img
          src={punchTime}
          alt="No logs"
          style={{ width: "430px", height: "auto", opacity: 0.8 }}
        />
        <p style={{ marginTop: "10px", color: "#666" }}>No time logs found</p>
      </div>
    )}
  </ScrollableTableWrapper>
</TimeLogContainer> */}

    </MainWrapper>
    </Container>
  );
};

export default TimeLogDashboard;

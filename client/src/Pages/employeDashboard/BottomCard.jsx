import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Section,
  Header,
  Title,
  TaskList,
  TaskCard,
  TaskLeft,
  TaskDate,
  TaskTime,
  TaskContent,
  TaskRole,
  TaskDescription,
  RightArrow,
  AttendanceHeader,
  Table,
  TableRow,
  TableCell,
  TimeIn,
  TimeOut,
  Divider,
  Wrapper,
  Image,
  Message,
  AttendanceSection,
  AttendanceImage,
  Text,
  TimeWrapper,
  ClockIcon,
  TimeText,
  RightArrows
} from "./BottomCard.Styles";
import NoTasks from "../../assets/daliy.svg"; // for empty tasks
import NoAttendance from "../../assets/puchtime.svg"; 
import { fetchEmployeeDash } from "../../Redux/authSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
const formatTime = (timeStr) => {
 

  if (!timeStr) return "-";
  try {
    // Convert "05:35:10.246872" → "05:35 PM"
    const date = new Date(`1970-01-01T${timeStr}Z`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch (e) {
    return timeStr; // fallback if parsing fails
  }
};
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  } catch (e) {
    return dateStr; // fallback
  }
};
const formatHours = (hours) => {
  if (hours === null || hours === undefined || hours === "") return "-";

  let [h = "0", m = "0"] = hours.toString().split(".");

  // If minutes part is single digit like "3" → "30"
  if (m.length === 1) {
    m = m + "0";
  }

  const formattedH = h.padStart(2, "0");
  const formattedM = m.padStart(2, "0");

  return `${formattedH}:${formattedM}`;
};



const DailyTaskList = () => {
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeId } = useParams();
  const { employeeDashData, loadingEmployeeDash, employeeDashError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (employeeId) dispatch(fetchEmployeeDash(employeeId));
  }, [employeeId, dispatch]);

  if (loadingEmployeeDash) return <p>Loading...</p>;
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;

  const tasks = Array.isArray(employeeDashData?.daily_tasks) ? employeeDashData.daily_tasks : [];
  const attendance = Array.isArray(employeeDashData?.today_sessions)
    ? employeeDashData.today_sessions
    : [];

  const BASE_URL = "http://178.248.112.16:8001";

  return (
    <Container>
      {/* Left Section: Daily Tasks */}
      <Section>
       <Header>
  <Title>Daily Task List</Title>
  <RightArrow onClick={() => navigate(`/daily-task`)} title="Go to Tasks">
    <FiArrowUpRight />
  </RightArrow>
</Header>


        <TaskList>
  {tasks.length > 0 ? (
    tasks.map((task, index) => (
     <TaskCard key={index}>
  <TaskLeft>
    <TaskDate>{formatDate(task.date)}</TaskDate>
    <TaskTime>{formatHours(task.time_taken)}</TaskTime>
  </TaskLeft>
  <Divider />
  <TaskContent>
    <TaskRole>{task.project || "N/A"}</TaskRole>
    <TaskDescription>{task.task || "No task"}</TaskDescription>
  </TaskContent>

  <RightArrows
    onClick={() => navigate(`/daily-task`)} 
    title="View Task Details"
  >
<FiArrowUpRight />
  </RightArrows>
</TaskCard>

    ))
  ) : (
    <Wrapper>
      <Image src={NoTasks} alt="No tasks" />
      <Message>Today's task list is empty</Message>
    </Wrapper>
  )}
</TaskList>

      </Section>

      <Section>
     <AttendanceHeader>
  <Title>{new Date().toLocaleDateString()}</Title>
  <RightArrow
onClick={() => navigate(`/employee-on-present`)}

    title="View Attendance Details"
  >
    <FiArrowUpRight />
  </RightArrow>
</AttendanceHeader>

        <Table>
          <thead>
            <TableRow>
              <TableCell>
                <TimeIn>Time in</TimeIn>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <TimeOut>Time out</TimeOut>
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
  {attendance.length > 0 ? (
    attendance.map((row, index) => (
     <TableRow key={index}>
  <TableCell>
    <TimeWrapper>
      <TimeText>{formatTime(row.time_in)}</TimeText>
      <ClockIcon src="/images/daily.png" alt="clock" />
    </TimeWrapper>
  </TableCell>

  <TableCell style={{ textAlign: "center", fontWeight: "600" }}>To</TableCell>

  <TableCell>
    <TimeWrapper >
      <ClockIcon src="/images/daily.png" alt="clock" />
      <TimeText>{formatTime(row.time_out)}</TimeText>
    </TimeWrapper>
  </TableCell>
</TableRow>

    
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} style={{ textAlign: "center" }}>
     <AttendanceSection>
      <AttendanceImage src={NoAttendance} alt="No attendance" />
      <Text>No attendance recorded today</Text>
    </AttendanceSection>
      </TableCell>
    </TableRow>
  )}
</tbody>

        </Table>
      </Section>
    </Container>
  );
};

export default DailyTaskList;

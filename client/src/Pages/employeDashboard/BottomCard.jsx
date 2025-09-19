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
} from "./BottomCard.Styles";
import NoTasks from "../../assets/daliy.svg"; // for empty tasks
import NoAttendance from "../../assets/puchtime.svg"; 

import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";
import { fetchEmployeeDash } from "../../Redux/authSlice";
import { useParams } from "react-router-dom";

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
          {/* <RightArrow>
            <BiSolidRightTopArrowCircle size={28} />
          </RightArrow> */}
        </Header>

        <TaskList>
  {tasks.length > 0 ? (
    tasks.map((task, index) => (
      <TaskCard key={index}>
        <TaskLeft>
        <TaskDate>{formatDate(task.date)}</TaskDate>
        <TaskTime>{formatHours(task.time_taken)}</TaskTime>        </TaskLeft>
        <Divider />
        <TaskContent>
          <TaskRole>{task.project || "N/A"}</TaskRole>
          <TaskDescription>{task.task || "No description"}</TaskDescription>
        </TaskContent>
        {/* <RightArrow>
          <FiArrowUpRight size={16} />
        </RightArrow> */}
      </TaskCard>
    ))
  ) : (
    <div style={{ textAlign: "center", padding: "20px", background: "white" }}>
      <img src={NoTasks} alt="No tasks" style={{ width: "200px", height: "auto" }} />
      <p style={{ marginTop: "10px", color: "#3352BA", fontSize: "16px" }}>
        Today's task list is empty
      </p>
    </div>
  )}
</TaskList>

      </Section>

      {/* Right Section: Attendance */}
      <Section>
        <AttendanceHeader>
          <Title>{new Date().toLocaleDateString()}</Title>
          {/* <RightArrow>
            <BiSolidRightTopArrowCircle size={28} />
          </RightArrow> */}
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
        <span style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
          {formatTime(row.time_in)}
          <img src="/images/daily.png" alt="clock" style={{ width: "14px", height: "14px" }} />
        </span>
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "600" }}>To</TableCell>
      <TableCell>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
          <img src="/images/daily.png" alt="clock" style={{ width: "14px", height: "14px" }} />
          {formatTime(row.time_out)}
        </span>
      </TableCell>
    </TableRow>
    
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} style={{ textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <img src={NoAttendance} alt="No attendance" style={{ width: "290px", height: "auto" }} />
          <span style={{ color: "#3352BA", fontSize: "16px" }}>No attendance recorded today</span>
        </div>
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

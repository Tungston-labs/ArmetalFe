import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  DateSelector,
  Calendar,
  Day,
  EmployeesPanel,
  EmployeeCard,
  TaskPanel,
  TaskCard,
  TaskHeader,
  Hr,
  Description,
  TimeBox,
  SearchInput,
  DepartmentDropdown,
  Heading,
  Head,
  NoTaskWrapper,
  TaskLayout,
  TopSelector,
} from "./Daily.styles";
import { getEmployees, getTasks } from "../../Redux/dailyTaskSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import TaskIcon from "../../assets/task.svg";
import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DailyTask() {
  const dispatch = useDispatch();
  const { employees = [], tasks = [], loading: taskLoading } = useSelector(
    (state) => state.dailyTask
  );
  const { list: departments = [], loading: deptLoading } = useSelector(
    (state) => state.departments
  );

  const dateInputRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Helper to format Date -> YYYY-MM-DD in local time (no UTC conversion)
  const toYMD = (d) => {
    const date =
      d instanceof Date
        ? new Date(d.getFullYear(), d.getMonth(), d.getDate())
        : (() => {
            const parsed = new Date(d);
            return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
          })();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Parse YYYY-MM-DD string into a local Date (midnight local)
  const parseYMD = (ymd) => {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // Initialize selectedDate using local formatting
  const todayLocal = new Date();
  const initialYMD = toYMD(todayLocal);
  const [selectedDate, setSelectedDate] = useState(initialYMD); // "YYYY-MM-DD"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fixed weekday labels (Mon -> Sun)
  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fetch departments on mount
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // Fetch employees when department changes
  useEffect(() => {
    const params = {};
    if (selectedDepartment) params.department_id = selectedDepartment;
    dispatch(getEmployees(params));
  }, [dispatch, selectedDepartment]);

  // Set default employee when employees list updates
  useEffect(() => {
    if (employees.length > 0) setSelectedEmployee(employees[0]);
    else setSelectedEmployee(null);
  }, [employees]);

  // Fetch tasks when employee or date changes
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      dispatch(getTasks({ employeeId: selectedEmployee.id, date: selectedDate }));
    }
  }, [dispatch, selectedEmployee, selectedDate]);

  // Filter employees by search term
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get Monday of the week containing the selected date (local)
  const getStartOfWeekMonday = (ymd) => {
    const d = parseYMD(ymd);
    const day = d.getDay(); // 0 Sunday
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Build weekDates (Mon -> Sun) from selectedDate (local)
  const weekStart = getStartOfWeekMonday(selectedDate);
  const weekDates = weekdayOrder.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d; // Date objects in local timezone midnight
  });

  // Unified loader
  const loading = deptLoading || !departments.length || !employees.length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="large" tip="Loading..." />
      </div>
    );
  }

  const handleCalendarClick = () => setShowDatePicker(true);
  const handleEmployeeSelect = (emp) => setSelectedEmployee(emp);

  // Prev day (local)
  const handlePrevDay = () => {
    const curr = parseYMD(selectedDate);
    curr.setDate(curr.getDate() - 1);
    setSelectedDate(toYMD(curr));
  };

  // Next day (local) — only up to today
  const handleNextDay = () => {
    const curr = parseYMD(selectedDate);
    curr.setDate(curr.getDate() + 1);
    const today = parseYMD(toYMD(new Date()));
    if (curr <= today) {
      setSelectedDate(toYMD(curr));
    }
  };

  // Helpers for task UI (unchanged from your logic)
  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "-";
    try {
      const d = new Date(datetimeStr);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  const getEarliestTimeIn = (sessions) => {
    if (!sessions?.length) return "-";
    const validSessions = sessions.filter((s) => s.time_in);
    if (!validSessions.length) return "-";
    const earliest = validSessions.reduce((a, b) => (a.time_in < b.time_in ? a : b));
    return formatTime(earliest.time_in);
  };

  const getConditionalTimeOut = (sessions) => {
    if (!sessions?.length) return "-";
    const sorted = [...sessions].sort((a, b) => (a.time_in > b.time_in ? 1 : -1));
    const lastSession = sorted[sorted.length - 1];
    if (lastSession.time_in && !lastSession.time_out) {
      return "---";
    }
    const validOutSessions = sorted.filter((s) => s.time_out);
    if (!validOutSessions.length) return "-";
    const latest = validOutSessions.reduce((a, b) => (a.time_out > b.time_out ? a : b));
    return formatTime(latest.time_out);
  };

  const todayYMD = toYMD(new Date());

  return (
    <>
      <Navbar />
      <Container>
        <EmployeeTitle
          iconSrc={TaskIcon}
          title="Daily Task"
          subtitle="Check daily task details for each employee"
          showAddButton={false}
          showDropdown={false}
          showBackArrow={false}
          showTabs={false}
          showSearch={false}
        />

        {/* DatePicker modal (centered) */}
        {showDatePicker && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
            onClick={() => setShowDatePicker(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <DatePicker
                selected={parseYMD(selectedDate)}
                onChange={(date) => {
                  setSelectedDate(toYMD(date));
                  setShowDatePicker(false);
                }}
                inline
                maxDate={parseYMD(todayYMD)}
              />
            </div>
          </div>
        )}

        <DateSelector>
          <TopSelector>
            <SearchInput
              placeholder="Search employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <DepartmentDropdown
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </DepartmentDropdown>
        
  </TopSelector>
          <div className="calendar-header">
            <div className="left">
              <button className="left-lesser" onClick={handlePrevDay}>
                {"<"}
              </button>

              <FaRegCalendarAlt className="calendar-icon" onClick={handleCalendarClick} />

              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                max={todayYMD}
                style={{ display: "none" }}
              />

              <div className="date-info">
                <div className="day">{parseYMD(selectedDate).getDate()}</div>
                <div>
                  <div className="month">
                    {parseYMD(selectedDate).toLocaleString("default", { month: "long" })}
                  </div>
                  <div className="weekday">
                    {parseYMD(selectedDate).toLocaleString("default", { weekday: "long" })}
                  </div>
                </div>
              </div>
            </div>

            <div className="nav">
              <button
                className="right-greater"
                onClick={handleNextDay}
                disabled={selectedDate === todayYMD}
                style={{
                  opacity: selectedDate === todayYMD ? 0.4 : 1,
                  cursor: selectedDate === todayYMD ? "not-allowed" : "pointer",
                }}
              >
                {">"}
              </button>
            </div>
          </div>
        </DateSelector>

        {/* Calendar: fixed weekday labels, only date/month change */}
        <Calendar>
          {weekDates.map((day, i) => {
            const dayYMD = toYMD(day);
            const isActive = dayYMD === selectedDate;
            const isFuture = dayYMD > todayYMD;

            return (
              <Day
                key={i}
                active={isActive}
                onClick={() => {
                  if (!isFuture) setSelectedDate(dayYMD);
                }}
                style={{
                  opacity: isFuture ? 0.4 : 1,
                  cursor: isFuture ? "not-allowed" : "pointer",
                }}
              >
                {/* FIXED weekday label */}
                <strong>{weekdayOrder[i]}</strong>
                <Hr />
                {/* only date + month update */}
                <span>
                  {day.getDate()} {day.toLocaleString("default", { month: "short" })}
                </span>
              </Day>
            );
          })}
        </Calendar>

        <TaskLayout>
          <EmployeesPanel>
            <Heading>Employees</Heading>
            <div className="employee-list">
              {filteredEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  onClick={() => handleEmployeeSelect(emp)}
                  active={emp.id === selectedEmployee?.id}
                >
                  {emp.profile_pic ? (
                    <img src={emp.profile_pic} alt={emp.name} />
                  ) : (
                    <PiUserCirclePlusThin size={40} color="#999" />
                  )}
                  <span>{emp.name}</span>
                </EmployeeCard>
              ))}
            </div>
          </EmployeesPanel>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Head>Daily Task</Head>
            <TaskPanel>
              {selectedEmployee && (
                <TaskHeader>
                  <img
                    src={selectedEmployee.profile_pic || "/images/default.png"}
                    alt={selectedEmployee.name}
                  />
                  <h3>{selectedEmployee.name}</h3>
                </TaskHeader>
              )}

              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <TaskCard key={idx}>
                    <strong>Project: {task.project}</strong>
                    <p>
                      Task: <Description>{task.task}</Description>
                    </p>
                    <p>
                      Description: <Description>{task.description}</Description>
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <TimeBox>{task.time_taken} Hrs</TimeBox>
                      <small>{new Date(task.updated_at).toLocaleString()}</small>
                    </div>
                  </TaskCard>
                ))
              ) : (
                <NoTaskWrapper>
                  <img src="/images/dailytask.png" alt="No tasks" />
                </NoTaskWrapper>
              )}
            </TaskPanel>
          </div>
        </TaskLayout>
      </Container>
    </>
  );
}

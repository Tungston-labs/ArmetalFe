import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Header,
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
  Title,
  Subtitle,
  TitleSection,
  TextBlock,
  DepartmentDropdown,
  Heading,
  Head,
  EmployeeImage,
  NoTaskWrapper,
  TaskLayout,
} from "./Daily.styles";
import { getEmployees, getTasks } from "../../Redux/dailyTaskSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import TaskIcon from "../../assets/task.svg";
import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";

export default function DailyTask() {
  const dispatch = useDispatch();
  const { employees = [], tasks = [], loading: taskLoading } = useSelector(
    (state) => state.dailyTask
  );
  const { list: departments = [], loading: deptLoading } = useSelector(
    (state) => state.departments
  );

  // State
  const dateInputRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  // Generate week dates
  const weekDates = [...Array(7)].map((_, i) => {
    const baseDate = new Date(selectedDate);
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - 3 + i);
    return d;
  });

  // Unified loader (only departments and employees loading)
  const loading = deptLoading || !departments.length  || !employees.length;

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

  const handleCalendarClick = () => dateInputRef.current?.showPicker();
  const handleEmployeeSelect = (emp) => setSelectedEmployee(emp);

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

        <DateSelector>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
          </div>

          <div className="calendar-header">
            <div className="left">
              <button className="left-lesser">{"<"}</button>
              <FaRegCalendarAlt className="calendar-icon" onClick={handleCalendarClick} />
              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                style={{ display: "none" }}
              />
              <div className="date-info">
                <div className="day">{new Date(selectedDate).getDate()}</div>
                <div>
                  <div className="month">
                    {new Date(selectedDate).toLocaleString("default", { month: "long" })}
                  </div>
                  <div className="weekday">
                    {new Date(selectedDate).toLocaleString("default", { weekday: "long" })}
                  </div>
                </div>
              </div>
            </div>
            <div className="nav">
              <button className="right-greater">{">"}</button>
            </div>
          </div>
        </DateSelector>

        <Calendar>
          {weekDates.map((day, i) => {
            const isActive = day.toDateString() === new Date(selectedDate).toDateString();
            return (
              <Day
                key={i}
                active={isActive}
                onClick={() => setSelectedDate(day.toISOString().split("T")[0])}
              >
                <strong>{day.toLocaleString("default", { weekday: "short" })}</strong>
                <Hr />
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
                    <strong>
                      Project: <strong>{task.project}</strong>
                    </strong>
                    <strong>
                      Task: <p>{task.task}</p>
                    </strong>
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

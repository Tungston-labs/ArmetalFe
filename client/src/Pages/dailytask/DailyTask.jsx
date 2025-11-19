// Scheduler.jsx
import React, { useState, useEffect, useRef } from "react";
import * as S from "./DailyTask.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import TaskIcon from "../../assets/task.svg";
import Navbar from "../../Components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendarDate } from "react-icons/ci";
import NoTaskImg from "../../../public/images/dailytask.png";

import { getDepartments } from "../../Redux/departmentSlice";
import { getEmployees, getTasks } from "../../Redux/dailyTaskSlice";

import { useSelector, useDispatch } from "react-redux";

const Scheduler = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const calendarRef = useRef(null);

  const { employees = [], tasks = [], loading: taskLoading } = useSelector(
    (state) => state.dailyTask
  );

  const { list: departments = [], loading: deptLoading } = useSelector(
    (state) => state.departments
  );

  // -------------------------------------
  // Fetch Departments Initially
  // -------------------------------------
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // -------------------------------------
  // Fetch Employees when department changes
  // -------------------------------------
  useEffect(() => {
    const params = {};
    if (selectedDepartment) params.department_id = selectedDepartment;

    dispatch(getEmployees(params));
  }, [dispatch, selectedDepartment]);

  // -------------------------------------
  // Auto-select first employee
  // -------------------------------------
  useEffect(() => {
    if (employees.length > 0) setSelectedEmployee(employees[0]);
    else setSelectedEmployee(null);
  }, [employees]);

  // -------------------------------------
  // Fetch Tasks when employee or date changes
  // -------------------------------------
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      dispatch(
        getTasks({
          employeeId: selectedEmployee.id,
          date: selectedDate.toISOString().split("T")[0],
        })
      );
    }
  }, [dispatch, selectedEmployee, selectedDate]);

 
  useEffect(() => {
    const onDocClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);


const filteredEmployees = employees
  .filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.name.localeCompare(b.name));

 const generateDates = (baseDate) => {
  const arr = [];
const today = new Date();
  const monday = new Date(baseDate);
  const day = monday.getDay(); 
  const mondayOffset = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + mondayOffset);


  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    arr.push({
      full: d,
      day: d.toLocaleString("default", { weekday: "short" }), 
      date: d.getDate(),
      month: d.toLocaleString("default", { month: "short" }), 
    });
  }

  return arr;
};


  const actualDates = generateDates(selectedDate);


  const todayIndex = actualDates.findIndex(
  (d) => d.full.toDateString() === new Date().toDateString()
);
useEffect(() => {
  if (todayIndex !== -1) setSelectedDateIndex(todayIndex);
}, [actualDates]);

  const getInitials = (name) => {
    const parts = String(name).trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0] ? parts[0][0].toUpperCase() : "";
  };

  const handlePickDate = (picked) => {
    setSelectedDate(picked);
    setSelectedDateIndex(
      generateDates(picked).findIndex(
        (d) => d.full.toDateString() === picked.toDateString()
      )
    );
    setShowCalendar(false);
  };

 const handleClickDateTile = (index) => {
  const chosen = actualDates[index].full;
  setSelectedDate(chosen);
  setSelectedDateIndex(index);
};


  return (
    <>
      <Navbar />

      <S.SchedulerContainer>
        <EmployeeTitle
          iconSrc={TaskIcon}
          title="Daily Task"
          subtitle="Check daily task details for each employee"
          showAddButton={false}
          showBackArrow={false}
          showDropdown={false}
          showTabs={false}
          showSearch={false}
        />


        <S.Header>
         <S.Input
            type="text"
            placeholder="Search employee name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <S.Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </S.Select>
        </S.Header>
        <S.DateHeaderRow>
          <S.Arrow
           
          >
            &lt;
          </S.Arrow>

          <S.DateContent>
            <div className="calendar-wrapper" ref={calendarRef}>
              <div
                className="calendar-icon"
                onClick={() => setShowCalendar((s) => !s)}
              >
                <CiCalendarDate size={26} />
              </div>

              {showCalendar && (
                <div className="calendar-popup">
                <DatePicker
  selected={selectedDate}
  onChange={handlePickDate}
  inline
  maxDate={new Date()} 
/>

                </div>
              )}
            </div>

            <div className="left-date">{selectedDate.getDate()}</div>

            <div className="right-block">
              <div className="month">
                {selectedDate.toLocaleString("default", { month: "long" })}
              </div>
              <div className="day">
                {selectedDate.toLocaleString("default", { weekday: "long" })}
              </div>
            </div>
          </S.DateContent>

          <S.Arrow
>
  &gt;
</S.Arrow>

        </S.DateHeaderRow>
        <S.DateGrid>
  {actualDates.map((dateItem, index) => {
    const isFuture = dateItem.full > new Date(); 
    return (
      <S.DateItem
        key={index}
        isSelected={index === selectedDateIndex}
        isDisabled={isFuture} 
        onClick={() => {
          if (!isFuture) handleClickDateTile(index);
        }}
      >
        <div className="day">{dateItem.day}</div>
        <div className="right">
          <div className="date">{dateItem.date}</div>
          <div className="month">{dateItem.month}</div>
        </div>
      </S.DateItem>
    );
  })}
</S.DateGrid>
        <S.MainPanel>
          <S.EmployeeSidebar>
            <h2>Employees</h2>

            {filteredEmployees.map((employee) => (
              <S.EmployeeItem
                key={employee.id}
                isSelected={employee.id === selectedEmployee?.id}
                onClick={() => setSelectedEmployee(employee)}
              >
                <S.EmployeeDetails>
                  <S.EmployeeAvatar>
                    {getInitials(employee.name)}
                  </S.EmployeeAvatar>
                  {employee.name}
                </S.EmployeeDetails>
                <S.TaskIcon>☰</S.TaskIcon>
              </S.EmployeeItem>
            ))}
          </S.EmployeeSidebar>
          <S.TaskArea>
            <h2>Daily Task</h2>

            {!selectedEmployee && (
              <S.EmptyState>
                <S.EmptyStateText>
                  Please select an employee to view daily tasks.
                </S.EmptyStateText>
              </S.EmptyState>
            )}

           {selectedEmployee && tasks.length === 0 && !taskLoading && (
  <S.EmptyState>
           <img src="/images/dailytask.png" alt="No tasks" />
    <S.EmptyStateTitle>No Tasks Found</S.EmptyStateTitle>
  </S.EmptyState>
)}


            {selectedEmployee && tasks.length > 0 && (
              <>
                {tasks.map((task, index) => (
                  <S.TaskCard key={index}>
                    <div className="left">
                      <div className="project">
                        <strong>Project</strong> {task.project}
                      </div>
                      <div className="task">
                        <strong>Task</strong> {task.task}
                      </div>
                      <div className="description">{task.description}</div>
                    </div>

                    <div className="right">
                      <div className="hours">
                        {task.time_taken} <span>Hrs</span>
                      </div>
                    </div>

                    <div className="time">{new Date(task.updated_at).toLocaleString()}</div>
                  </S.TaskCard>
                ))}
              </>
            )}
          </S.TaskArea>
        </S.MainPanel>
      </S.SchedulerContainer>
    </>
  );
};

export default Scheduler;
